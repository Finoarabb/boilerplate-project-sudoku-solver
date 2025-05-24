const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const {
  stringValidation,
  rowCheck,
  colCheck,
  solverCases,
  regionCheck,
} = require("../controllers/puzzle-strings");
suite("Unit Tests", () => {
  const solver = new Solver();

  suite("validation", () => {
    stringValidation.forEach(({ name, string, expected }) => {
      test(name, (done) => {
        assert.strictEqual(solver.validate(string), expected);
        done();
      });
    });
  });

  suite("row", () => {
    rowCheck.forEach(({ name, string, row,column, expected, value }) => {
      test(name, (done) => {
        assert.strictEqual(
          solver.checkRowPlacement(string, row,column, value),
          expected
        );
        done();
      });
    });
  });

  suite("column", () => {
    colCheck.forEach(({ name, string, row,column, expected, value }) => {
      test(name, (done) => {
        assert.strictEqual(
          solver.checkColPlacement(string, row,column, value),
          expected
        );
        done();
      });
    });
  });

  suite("region", () => {
    regionCheck.forEach(({ name, string, row, column, value, expected }) => {
      test(name, (done) => {
        assert.strictEqual(
          solver.checkRegionPlacement(string, row, column, value),
          expected
        );
        done();
      });
    });
  });

  suite("solve", () => {
    solverCases.forEach(({ name, string, expected }) => {
      test(name, (done) => {
        assert.strictEqual(solver.solve(string), expected);
        done();
      });
    });
  });
});
