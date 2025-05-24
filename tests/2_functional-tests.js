const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("Check", () => {
    const cases = [
      {
        name: "All Field",
        body: {
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          value: "3",
          coordinate: "A2",
        },
        expected: { valid: true },
      },
      {
        name: "Missing Field",
        body: {
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "A1",
        },
        expected: { error: "Required field(s) missing" },
      },
      {
        name: "Incorrect Length",
        body: {
          puzzle:
            "15..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "A1",
          value: "1",
        },
        expected: { error: "Expected puzzle to be 81 characters long" },
      },
      {
        name: "Invalid Characters",
        body: {
          puzzle:
            "1a5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "A1",
          value: "1",
        },
        expected: { error: "Invalid characters in puzzle" },
      },
      {
        name: "Invalid PlaceMent Coordinate",
        body: {
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "q1",
          value: "1",
        },
        expected: { error: "Invalid coordinate" },
      },
      {
        name: "Invalid PlaceMent Value",
        body: {
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          coordinate: "A1",
          value: "q",
        },
        expected: { error: "Invalid value" },
      },
      {
        name: "Single Placecment conflict",
        body: {
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          value: "9",
          coordinate: "B2",
        },
        expected: { valid: false, conflict: ["column"] },
      },
      {
        name: "Multiple Placecment conflict",
        body: {
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          value: "7",
          coordinate: "B7",
        },
        expected: { valid: false, conflict: ["column", "region"] },
      },
      {
        name: "All Placecment conflict",
        body: {
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
          value: "2",
          coordinate: "B1",
        },
        expected: { valid: false, conflict: ["row", "column", "region"] },
      },
    ];
    cases.forEach(({ name, body, expected }) => {
      test(name, (done) => {
        chai
          .request(server)
          .post("/api/check")
          .send(body)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.deepEqual(res.body, expected);
            done();
          });
      });
    });
  });

  suite("Solve", () => {
    const cases = [
      {
        name: "Valid Puzzle",
        body: {
          puzzle:
            "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        },
        expected: {
          solution:
            "135762984946381257728459613694517832812936745357824196473298561581673429269145378",
        },
      },
      {
        name: "Missing field",
        body: {},
        expected: { error: "Required field missing" },
      },
      {
        name: "Invalid Character",
        body: {
          puzzle:
            "1a5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        },
        expected: { error: "Invalid characters in puzzle" },
      },
      {
        name: "Invalid Length",
        body: {
          puzzle:
            "15..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        },
        expected: { error: "Expected puzzle to be 81 characters long" },
      },
      {
        name: "Unsolveable Puzzle",
        body: {
          puzzle:
            "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        },
        expected: { error: "Puzzle cannot be solved" },
      },
    ];

    cases.forEach(({ name, body, expected }) => {
      test(name, (done) => {
        chai
          .request(server)
          .post("/api/solve")
          .send(body)
          .end((err, res) => {
            assert.deepEqual(res.body, expected);
            done();
          });
      });
    });
  });
});
