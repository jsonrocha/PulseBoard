// Helpers to derive chart/KPI data from raw monday items arrays

function getColText(item, colId) {
  const col = item.column_values?.find(c => c.id === colId);
  return col?.text?.trim() || '';
}

function countBy(items, colId, values) {
  const counts = {};
  values.forEach(v => { counts[v] = 0; });
  items.forEach(item => {
    const val = getColText(item, colId);
    if (val in counts) counts[val]++;
  });
  return counts;
}

// ── Bug Tracker (board 18413113348) ──
// severity col: color_mm3bhdp3  status col: color_mm3bw08b
export function parseBugTracker(items) {
  const severityValues = ['Critical', 'Major', 'Minor'];
  const statusValues = ['Open', 'In Progress', 'Resolved', 'Closed'];

  const bySeverity = countBy(items, 'color_mm3bhdp3', severityValues);
  const byStatus = countBy(items, 'color_mm3bw08b', statusValues);

  const severityColors = {
    Critical: 'hsl(0, 72%, 55%)',
    Major: 'hsl(30, 80%, 55%)',
    Minor: 'hsl(43, 74%, 66%)',
  };

  const statusColors = {
    Open: 'hsl(43, 74%, 66%)',
    'In Progress': 'hsl(217, 91%, 60%)',
    Resolved: 'hsl(160, 60%, 45%)',
    Closed: 'hsl(215, 14%, 50%)',
  };

  const open = byStatus['Open'] || 0;
  const critical = bySeverity['Critical'] || 0;
  const resolved = byStatus['Resolved'] || 0;
  const closed = byStatus['Closed'] || 0;

  const kpis = [
    { label: 'Open Bugs', value: String(open) },
    { label: 'Critical / P0', value: String(critical) },
    { label: 'Resolved', value: String(resolved + closed) },
  ];

  const severityChart = severityValues
    .filter(v => bySeverity[v] > 0)
    .map(v => ({ name: v, count: bySeverity[v], fill: severityColors[v] }));

  const statusChart = statusValues
    .filter(v => byStatus[v] > 0)
    .map(v => ({ name: v, count: byStatus[v], fill: statusColors[v] }));

  const tableRows = items.slice(0, 8).map(item => ({
    id: item.id,
    name: item.name,
    severity: getColText(item, 'color_mm3bhdp3') || '—',
    status: getColText(item, 'color_mm3bw08b') || '—',
    reportedBy: getColText(item, 'multiple_person_mm3b9q0m') || 'Unassigned',
    updated: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '—',
  }));

  return { kpis, severityChart, statusChart, tableRows };
}

// ── Engineering Sprint (board 18413113346) ──
// status col: color_mm3byazv  priority col: color_mm3b71dw
export function parseSprint(items) {
  const statusValues = ['Working on it', 'Done', 'Stuck'];
  const priorityValues = ['High', 'Medium', 'Low'];

  const byStatus = countBy(items, 'color_mm3byazv', statusValues);
  const byPriority = countBy(items, 'color_mm3b71dw', priorityValues);

  const statusColors = {
    'Working on it': 'hsl(217, 91%, 60%)',
    Done: 'hsl(160, 60%, 45%)',
    Stuck: 'hsl(0, 72%, 55%)',
  };

  const priorityColors = {
    High: 'hsl(0, 72%, 55%)',
    Medium: 'hsl(43, 74%, 66%)',
    Low: 'hsl(160, 60%, 45%)',
  };

  const done = byStatus['Done'] || 0;
  const inProgress = byStatus['Working on it'] || 0;
  const stuck = byStatus['Stuck'] || 0;
  const total = items.length || 1;
  const completionRate = Math.round((done / total) * 100);

  const kpis = [
    { label: 'Total Items', value: String(items.length) },
    { label: 'Completion Rate', value: `${completionRate}%` },
    { label: 'Stuck / Blocked', value: String(stuck) },
  ];

  const statusChart = statusValues
    .filter(v => byStatus[v] > 0)
    .map(v => ({ name: v, count: byStatus[v], fill: statusColors[v] }));

  const priorityChart = priorityValues
    .filter(v => byPriority[v] > 0)
    .map(v => ({ name: v, count: byPriority[v], fill: priorityColors[v] }));

  const tableRows = items.slice(0, 8).map(item => ({
    id: item.id,
    name: item.name,
    status: getColText(item, 'color_mm3byazv') || '—',
    priority: getColText(item, 'color_mm3b71dw') || '—',
    assignee: getColText(item, 'multiple_person_mm3b5y5p') || 'Unassigned',
    updated: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '—',
  }));

  return { kpis, statusChart, priorityChart, tableRows };
}

// ── Marketing Campaigns (board 18413113347) ──
// status col: color_mm3bg2k7  channel col: dropdown_mm3bt5m9
export function parseMarketing(items) {
  const statusValues = ['Planned', 'Live', 'Completed'];

  const byStatus = countBy(items, 'color_mm3bg2k7', statusValues);

  // Tally channels dynamically
  const channelCounts = {};
  items.forEach(item => {
    const ch = getColText(item, 'dropdown_mm3bt5m9') || 'Other';
    channelCounts[ch] = (channelCounts[ch] || 0) + 1;
  });

  const channelPalette = [
    'hsl(217, 91%, 60%)',
    'hsl(160, 60%, 45%)',
    'hsl(280, 65%, 60%)',
    'hsl(43, 74%, 66%)',
    'hsl(30, 80%, 55%)',
    'hsl(0, 72%, 55%)',
  ];

  const statusColors = {
    Planned: 'hsl(217, 91%, 60%)',
    Live: 'hsl(160, 60%, 45%)',
    Completed: 'hsl(215, 14%, 50%)',
  };

  const live = byStatus['Live'] || 0;
  const planned = byStatus['Planned'] || 0;

  const kpis = [
    { label: 'Total Campaigns', value: String(items.length) },
    { label: 'Live', value: String(live) },
    { label: 'Planned', value: String(planned) },
  ];

  const statusChart = statusValues
    .filter(v => byStatus[v] > 0)
    .map(v => ({ name: v, count: byStatus[v], fill: statusColors[v] }));

  const channelChart = Object.entries(channelCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count], i) => ({ name, count, fill: channelPalette[i] }));

  const tableRows = items.slice(0, 8).map(item => ({
    id: item.id,
    name: item.name,
    channel: getColText(item, 'dropdown_mm3bt5m9') || '—',
    status: getColText(item, 'color_mm3bg2k7') || '—',
    owner: getColText(item, 'multiple_person_mm3bkdw7') || 'Unassigned',
    updated: item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '—',
  }));

  return { kpis, statusChart, channelChart, tableRows };
}