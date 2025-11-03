// keep auth disabled in tests (app reads ENABLE_AUTH === '1')
process.env.ENABLE_AUTH = '0';

const request = require("supertest");

let mockPoolQuery = jest.fn();

jest.mock("mysql2/promise", () => {
  return {
    createPool: () => ({
      query: (...args) => mockPoolQuery(...args),
      getConnection: async () => ({ release: () => {} }),
      end: async () => {},
    }),
  };
});

const app = require("../app");

describe("User Story US11: Global analytics + events default image", () => {
  beforeEach(() => {
    // set up pool.query behavior for each SQL we expect
    mockPoolQuery = jest.fn((sql, params = []) => {
      const s = String(sql).toLowerCase();

      // --- analytics: counts ---
      if (s.includes("select count(*) c from events")) {
        return Promise.resolve([[{ c: 15 }]]);
      }
      if (s.includes("select count(*) c from tickets")) {
        return Promise.resolve([[{ c: 11 }]]);
      }

      // --- analytics: issued/checked aggregates ---
      if (s.includes("from tickets") && s.includes("sum(")) {
        return Promise.resolve([[{ issued: 11, checked: 2 }]]);
      }

      // --- analytics: participation trend (events ⟷ tickets) ---
      if (s.includes("from events") && s.includes("left join") && s.includes("tickets") && s.includes("group by")) {
        return Promise.resolve([[
          { date: "2025-11-04", eventTitle: "Campus Concert", issued: 2, checkedIn: 1 },
          { date: "2025-11-05", eventTitle: "Tech Workshop",  issued: 4, checkedIn: 1 },
        ]]);
      }

      // --- events list ---
      if (s.includes(" from events") && s.includes(" join ") && s.includes(" users")) {
        const defaultUrl =
          params[0] ||
          "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80";
        const rows = [{
          id: 1,
          organizer_id: 9,
          title: "Hello",
          description: "world",
          category: "Tech",
          imageUrl: defaultUrl,
          event_date: "2025-11-05 20:00:00",
          location: "Montreal QC",
          ticket_capacity: 100,
          remaining_tickets: 100,
          ticket_type: "free",
          organizer_name: "Org",
          organizer_email: "o@example.com",
        }];
        return Promise.resolve([rows]);
      }

      return Promise.resolve([[]]);
    });
  });

  test("GET /api/v1/analytics/summary returns counts & participation", async () => {
    const res = await request(app).get("/api/v1/analytics/summary");
    if (res.status !== 200) console.error("summary body:", res.text);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ events: 15, tickets: 11, participationRate: 2 / 11 });
  });

  test("GET /api/v1/analytics/participation returns dated rows with event titles", async () => {
    const res = await request(app).get("/api/v1/analytics/participation");
    if (res.status !== 200) console.error("participation body:", res.text);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toMatchObject({
      date: "2025-11-04",
      eventTitle: "Campus Concert",
      issued: 2,
      checkedIn: 1,
    });
  });

  test("GET /api/v1/events applies default image when imageUrl is null (COALESCE)", async () => {
    const res = await request(app).get("/api/v1/events");
    if (res.status !== 200) console.error("events body:", res.text);
    expect(res.status).toBe(200);
    expect(res.body[0].imageUrl).toMatch(/^https:\/\/images\.unsplash\.com\//);
  });
});
