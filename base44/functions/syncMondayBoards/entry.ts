import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BOARDS = [
  { id: '18413113348', name: 'Bug Tracker' },
  { id: '18413113346', name: 'Engineering Sprint' },
  { id: '18413113347', name: 'Marketing Campaigns' },
];

const GQL_QUERY = (boardId) => `{ boards(ids: [${boardId}]) { id name items_count items_page(limit: 100) { items { id name updated_at column_values { id text column { title type } } } } } }`;

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (user.role !== 'admin') {
    return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const results = [];
  const errors = [];

  for (const board of BOARDS) {
    // Call queryMonday for this board
    let qRes;
    try {
      qRes = await base44.functions.invoke('queryMonday', {
        query: GQL_QUERY(board.id),
        variables: {},
      });
    } catch (err) {
      errors.push({ board_id: board.id, error: `Network error: ${err.message}` });
      continue;
    }

    const payload = qRes.data;
    if (!payload?.success || !payload?.data?.boards?.[0]) {
      errors.push({ board_id: board.id, error: 'No board data returned', details: payload });
      continue;
    }

    const boardData = payload.data.boards[0];
    const items = boardData.items_page?.items || [];
    const fetchedAt = new Date().toISOString();

    // Find existing snapshot for this board_id
    const existing = await base44.asServiceRole.entities.BoardSnapshot.filter({ board_id: board.id });

    const snapshotData = {
      board_id: board.id,
      board_name: boardData.name || board.name,
      items_count: boardData.items_count || items.length,
      fetched_at: fetchedAt,
      raw_items_json: JSON.stringify(items),
    };

    if (existing && existing.length > 0) {
      await base44.asServiceRole.entities.BoardSnapshot.update(existing[0].id, snapshotData);
    } else {
      await base44.asServiceRole.entities.BoardSnapshot.create(snapshotData);
    }

    results.push({ board_id: board.id, board_name: snapshotData.board_name, items_count: snapshotData.items_count });
  }

  return Response.json({ success: true, synced: results, errors });
});