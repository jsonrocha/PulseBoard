// Fictional "Rocha LLC" test dataset — used exclusively in test/dev environment.
// Column IDs match production Monday.com board conventions so existing dashboard
// parsers (parseBoardData.js) render them without any changes.

const now = new Date().toISOString();

const makeItem = (id, name, updatedAt, columnValues) => ({
  id,
  name,
  updated_at: updatedAt,
  column_values: columnValues,
});

const col = (id, title, text) => ({
  id,
  text,
  column: { id, title },
});

// ── Bug Tracker ────────────────────────────────────────────────────────────────
const bugItems = [
  makeItem("rocha-bug-1", "Webhook signature validation fails on retry", "2026-05-14T09:12:00Z", [
    col("dropdown_mm3bey07", "Component", "Backend"),
    col("color_mm3bhdp3", "Severity", "Critical"),
    col("color_mm3bw08b", "Status", "Open"),
    col("multiple_person_mm3b9q0m", "Reported By", "Alex Rocha"),
    col("date_mm3bw0ty", "Date Reported", "2026-05-14"),
  ]),
  makeItem("rocha-bug-2", "Date picker breaks on Safari 17", "2026-05-13T14:45:00Z", [
    col("dropdown_mm3bey07", "Component", "Frontend"),
    col("color_mm3bhdp3", "Severity", "Major"),
    col("color_mm3bw08b", "Status", "In Progress"),
    col("multiple_person_mm3b9q0m", "Reported By", "Alex Rocha"),
    col("date_mm3bw0ty", "Date Reported", "2026-05-13"),
  ]),
  makeItem("rocha-bug-3", "Redis cache invalidation race condition", "2026-05-12T11:30:00Z", [
    col("dropdown_mm3bey07", "Component", "Backend"),
    col("color_mm3bhdp3", "Severity", "Critical"),
    col("color_mm3bw08b", "Status", "In Progress"),
    col("multiple_person_mm3b9q0m", "Reported By", "Alex Rocha"),
    col("date_mm3bw0ty", "Date Reported", "2026-05-12"),
  ]),
  makeItem("rocha-bug-4", "Onboarding email links to staging URL", "2026-05-10T08:00:00Z", [
    col("dropdown_mm3bey07", "Component", "Backend"),
    col("color_mm3bhdp3", "Severity", "Minor"),
    col("color_mm3bw08b", "Status", "Resolved"),
    col("multiple_person_mm3b9q0m", "Reported By", "Alex Rocha"),
    col("date_mm3bw0ty", "Date Reported", "2026-05-10"),
  ]),
  makeItem("rocha-bug-5", "Search ignores accented characters", "2026-05-09T16:20:00Z", [
    col("dropdown_mm3bey07", "Component", "Database"),
    col("color_mm3bhdp3", "Severity", "Major"),
    col("color_mm3bw08b", "Status", "Closed"),
    col("multiple_person_mm3b9q0m", "Reported By", "Alex Rocha"),
    col("date_mm3bw0ty", "Date Reported", "2026-05-09"),
  ]),
];

// ── Engineering Sprint ─────────────────────────────────────────────────────────
const sprintItems = [
  makeItem("rocha-sprint-1", "Migrate from Heroku to Fly.io", "2026-05-15T10:00:00Z", [
    col("numeric_mm3bq6sz", "Story Points", "13"),
    col("multiple_person_mm3b5y5p", "Assignee", "Alex Rocha"),
    col("color_mm3b71dw", "Priority", "High"),
    col("color_mm3byazv", "Status", "Done"),
  ]),
  makeItem("rocha-sprint-2", "Add row-level security to billing tables", "2026-05-15T11:30:00Z", [
    col("numeric_mm3bq6sz", "Story Points", "8"),
    col("multiple_person_mm3b5y5p", "Assignee", "Pat Singh"),
    col("color_mm3b71dw", "Priority", "High"),
    col("color_mm3byazv", "Status", "Working on it"),
  ]),
  makeItem("rocha-sprint-3", "Replace Stripe webhooks with polling", "2026-05-14T09:00:00Z", [
    col("numeric_mm3bq6sz", "Story Points", "5"),
    col("multiple_person_mm3b5y5p", "Assignee", "Alex Rocha"),
    col("color_mm3b71dw", "Priority", "Medium"),
    col("color_mm3byazv", "Status", "Stuck"),
  ]),
  makeItem("rocha-sprint-4", "Deprecate v1 API endpoints", "2026-05-13T15:45:00Z", [
    col("numeric_mm3bq6sz", "Story Points", "3"),
    col("multiple_person_mm3b5y5p", "Assignee", "Pat Singh"),
    col("color_mm3b71dw", "Priority", "Low"),
    col("color_mm3byazv", "Status", "Done"),
  ]),
];

// ── Marketing Campaigns ────────────────────────────────────────────────────────
const marketingItems = [
  makeItem("rocha-mkt-1", "Annual user conference", "2026-05-15T08:00:00Z", [
    col("multiple_person_mm3bkdw7", "Owner", "Alex Rocha"),
    col("color_mm3bg2k7", "Status", "Live"),
    col("dropdown_mm3bt5m9", "Channel", "Events"),
    col("numeric_mm3bwfvn", "Budget", "75000"),
    col("date_mm3b85pa", "Launch Date", "2026-09-01"),
  ]),
  makeItem("rocha-mkt-2", "Q4 partner co-marketing push", "2026-05-14T12:00:00Z", [
    col("multiple_person_mm3bkdw7", "Owner", "Pat Singh"),
    col("color_mm3bg2k7", "Status", "Planned"),
    col("dropdown_mm3bt5m9", "Channel", "Content"),
    col("numeric_mm3bwfvn", "Budget", "15000"),
    col("date_mm3b85pa", "Launch Date", "2026-10-01"),
  ]),
  makeItem("rocha-mkt-3", "Customer success case study series", "2026-05-10T10:00:00Z", [
    col("multiple_person_mm3bkdw7", "Owner", "Alex Rocha"),
    col("color_mm3bg2k7", "Status", "Completed"),
    col("dropdown_mm3bt5m9", "Channel", "Content"),
    col("numeric_mm3bwfvn", "Budget", "8000"),
    col("date_mm3b85pa", "Launch Date", "2026-04-01"),
  ]),
];

export const ROCHA_FIXTURES = [
  {
    board_id: "18413113348",
    board_name: "Bug Tracker",
    items_count: bugItems.length,
    fetched_at: now,
    raw_items_json: JSON.stringify(bugItems),
  },
  {
    board_id: "18413113346",
    board_name: "Engineering Sprint",
    items_count: sprintItems.length,
    fetched_at: now,
    raw_items_json: JSON.stringify(sprintItems),
  },
  {
    board_id: "18413113347",
    board_name: "Marketing Campaigns",
    items_count: marketingItems.length,
    fetched_at: now,
    raw_items_json: JSON.stringify(marketingItems),
  },
];