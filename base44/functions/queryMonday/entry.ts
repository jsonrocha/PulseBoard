import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  // Auth gate
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse and validate body
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { query, variables } = body;
  if (!query || typeof query !== 'string' || !query.trim()) {
    return Response.json({ error: 'query must be a non-empty string' }, { status: 400 });
  }

  // Check secret
  const token = Deno.env.get('MONDAY_API_TOKEN');
  if (!token) {
    return Response.json({ error: 'MONDAY_API_TOKEN is not configured' }, { status: 500 });
  }

  // Proxy to monday.com GraphQL
  let res;
  try {
    res = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'API-Version': '2024-10',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: variables || {} }),
    });
  } catch (err) {
    return Response.json({ error: 'Network error reaching monday.com', details: err.message }, { status: 502 });
  }

  const data = await res.json();

  // GraphQL-level errors
  if (data.errors && data.errors.length > 0) {
    return Response.json({ error: 'monday.com GraphQL error', details: data.errors }, { status: 502 });
  }

  return Response.json({ success: true, data: data.data });
});