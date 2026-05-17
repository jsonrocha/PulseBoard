import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BOARDS = [
  { id: '18413113348', name: 'Bug Tracker' },
  { id: '18413113346', name: 'Engineering Sprint' },
  { id: '18413113347', name: 'Marketing Campaigns' },
];

const GQL_QUERY = (boardId) =>
  `{ boards(ids: [${boardId}]) { id name items_count items_page(limit: 100) { items { id name updated_at column_values { id text column { title type } } } } } }`;

async function fetchBoard(boardId) {
  const res = await fetch('https://api.monday.com/v2', {
    method: 'POST',
    headers: {
      'Authorization': Deno.env.get('MONDAY_API_TOKEN'),
      'API-Version': '2024-10',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: GQL_QUERY(boardId) }),
  });

  if (!res.ok) {
    throw new Error(`monday.com API returned ${res.status}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors.map(e => e.message).join('; '));
  }

  return json.data;
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // For user-initiated calls, enforce admin-only access.
  // Scheduled automations run without a user session — allow them through.
  const user = await base44.auth.me().catch(() => null);
  if (user !== null && user.role !== 'admin') {
    return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const synced = [];
  const errors = [];

  for (const board of BOARDS) {
    let data;
    try {
      data = await fetchBoard(board.id);
    } catch (err) {
      errors.push({ board_id: board.id, error: err.message });
      continue;
    }

    const boardData = data?.boards?.[0];
    if (!boardData) {
      errors.push({ board_id: board.id, error: 'No board data returned' });
      continue;
    }

    const items = boardData.items_page?.items || [];
    const fetchedAt = new Date().toISOString();

    const snapshotData = {
      board_id: board.id,
      board_name: boardData.name || board.name,
      items_count: boardData.items_count || items.length,
      fetched_at: fetchedAt,
      raw_items_json: JSON.stringify(items),
    };

    const existing = await base44.asServiceRole.entities.BoardSnapshot.filter({ board_id: board.id });
    if (existing?.length > 0) {
      await base44.asServiceRole.entities.BoardSnapshot.update(existing[0].id, snapshotData);
    } else {
      await base44.asServiceRole.entities.BoardSnapshot.create(snapshotData);
    }

    synced.push({ board_id: board.id, board_name: snapshotData.board_name, items_count: snapshotData.items_count });
  }

  return Response.json({ success: true, synced, errors });
});