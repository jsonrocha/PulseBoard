// ── Bug Tracker Board ──
export const bugTrackerKpis = [
  { label: "Open Bugs", value: "47", change: -12, changeLabel: "vs last week" },
  { label: "Critical / P0", value: "5", change: 25, changeLabel: "vs last week" },
  { label: "Avg Resolution", value: "3.2d", change: -8, changeLabel: "vs last month" },
];

export const bugsBySeverity = [
  { name: "Critical", count: 5, fill: "hsl(0, 72%, 55%)" },
  { name: "Major", count: 14, fill: "hsl(30, 80%, 55%)" },
  { name: "Minor", count: 19, fill: "hsl(43, 74%, 66%)" },
  { name: "Trivial", count: 9, fill: "hsl(215, 14%, 50%)" },
];

export const bugsOverTime = [
  { week: "W18", opened: 12, resolved: 8 },
  { week: "W19", opened: 9, resolved: 14 },
  { week: "W20", opened: 15, resolved: 11 },
  { week: "W21", opened: 7, resolved: 13 },
  { week: "W22", opened: 11, resolved: 10 },
  { week: "W23", opened: 8, resolved: 12 },
];

export const bugItems = [
  { id: "BUG-401", name: "API timeout on large datasets", severity: "Critical", status: "Open", assignee: "Lena K.", age: "4d" },
  { id: "BUG-398", name: "Dashboard chart flickers on resize", severity: "Major", status: "In Progress", assignee: "Raj P.", age: "6d" },
  { id: "BUG-395", name: "CSV export truncates unicode fields", severity: "Major", status: "Open", assignee: "Unassigned", age: "8d" },
  { id: "BUG-392", name: "Login redirect loop on Safari 17", severity: "Critical", status: "In Progress", assignee: "Maria S.", age: "3d" },
  { id: "BUG-390", name: "Notification badge count off by one", severity: "Minor", status: "Open", assignee: "Jake T.", age: "10d" },
];

// ── Engineering Sprint Board ──
export const sprintKpis = [
  { label: "Sprint Velocity", value: "42 pts", change: 5, changeLabel: "vs Sprint 23" },
  { label: "Completion Rate", value: "78%", change: 3, changeLabel: "vs Sprint 23" },
  { label: "Carry-over", value: "6 items", change: -15, changeLabel: "vs Sprint 23" },
];

export const sprintByStatus = [
  { name: "Done", count: 18, fill: "hsl(160, 60%, 45%)" },
  { name: "In Progress", count: 8, fill: "hsl(217, 91%, 60%)" },
  { name: "To Do", count: 5, fill: "hsl(215, 14%, 50%)" },
  { name: "Blocked", count: 2, fill: "hsl(0, 72%, 55%)" },
];

export const sprintBurndown = [
  { day: "Mon", ideal: 42, actual: 42 },
  { day: "Tue", ideal: 36, actual: 38 },
  { day: "Wed", ideal: 30, actual: 33 },
  { day: "Thu", ideal: 24, actual: 28 },
  { day: "Fri", ideal: 18, actual: 22 },
  { day: "Mon2", ideal: 12, actual: 16 },
  { day: "Tue2", ideal: 6, actual: 11 },
  { day: "Wed2", ideal: 0, actual: 8 },
];

export const sprintItems = [
  { id: "ENG-220", name: "Implement SSO with Okta", points: 5, status: "In Progress", assignee: "Lena K.", type: "Feature" },
  { id: "ENG-219", name: "Migrate user table to new schema", points: 8, status: "Done", assignee: "Raj P.", type: "Tech Debt" },
  { id: "ENG-218", name: "Add rate limiting to public API", points: 3, status: "In Progress", assignee: "Jake T.", type: "Feature" },
  { id: "ENG-217", name: "Fix N+1 query in reports endpoint", points: 2, status: "Done", assignee: "Maria S.", type: "Bug" },
  { id: "ENG-216", name: "Spike: evaluate vector DB options", points: 3, status: "To Do", assignee: "Lena K.", type: "Spike" },
];

// ── Marketing Campaigns Board ──
export const marketingKpis = [
  { label: "Active Campaigns", value: "8", change: 0, changeLabel: "vs last month" },
  { label: "Total Spend", value: "$24.8K", change: 12, changeLabel: "vs last month" },
  { label: "Avg CAC", value: "$142", change: -6, changeLabel: "vs last month" },
];

export const campaignsByChannel = [
  { name: "Google Ads", spend: 8200, leads: 58, fill: "hsl(217, 91%, 60%)" },
  { name: "LinkedIn", spend: 6400, leads: 32, fill: "hsl(210, 50%, 45%)" },
  { name: "Content/SEO", spend: 4100, leads: 45, fill: "hsl(160, 60%, 45%)" },
  { name: "Email", spend: 3200, leads: 28, fill: "hsl(280, 65%, 60%)" },
  { name: "Events", spend: 2900, leads: 12, fill: "hsl(43, 74%, 66%)" },
];

export const leadsOverTime = [
  { week: "W18", leads: 22, spend: 5200 },
  { week: "W19", leads: 30, spend: 6100 },
  { week: "W20", leads: 28, spend: 5800 },
  { week: "W21", leads: 35, spend: 6400 },
  { week: "W22", leads: 32, spend: 6200 },
  { week: "W23", leads: 38, spend: 6800 },
];

export const campaignItems = [
  { id: "MKT-45", name: "Q2 Product Launch – Google Ads", channel: "Google Ads", status: "Active", spend: "$4,200", leads: 32 },
  { id: "MKT-44", name: "Developer Blog Series", channel: "Content/SEO", status: "Active", spend: "$1,800", leads: 28 },
  { id: "MKT-43", name: "LinkedIn ABM – Enterprise", channel: "LinkedIn", status: "Active", spend: "$3,100", leads: 15 },
  { id: "MKT-42", name: "Re-engagement Email Drip", channel: "Email", status: "Paused", spend: "$900", leads: 8 },
  { id: "MKT-41", name: "SaaStr Conference Booth", channel: "Events", status: "Planned", spend: "$2,900", leads: 0 },
];

// ── Mock AI Responses ──
export const mockAiResponses = [
  "Based on the current sprint data, **Engineering Sprint 24** is at **78% completion** with 2 days remaining. There are 2 blocked items — ENG-216 is waiting on a vendor decision, and there's a dependency on the SSO work for the API rate limiter.",
  "The Bug Tracker shows **5 critical bugs** currently open. The oldest is BUG-401 (API timeout on large datasets) at 4 days old, assigned to Lena K. Average resolution time has improved to **3.2 days**, down 8% from last month.",
  "Marketing spend this month is **$24.8K across 8 campaigns**. Google Ads is driving the most leads (58) but at a higher CAC ($141). Content/SEO has the best CAC at $91 per lead. The Q2 Product Launch campaign is the top performer.",
  "Looking at cross-board signals: the engineering team has 2 sprint items blocked, which may impact the Q2 product launch timeline. I'd recommend syncing with Lena K. on the SSO spike — it's a dependency for 3 marketing deliverables.",
  "Sprint velocity has been trending up — **42 points this sprint** vs 40 last sprint (+5%). Carry-over decreased by 15%, suggesting better estimation. The team's throughput is healthy for current capacity.",
];