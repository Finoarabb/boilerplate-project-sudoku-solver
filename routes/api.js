"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;
    // #Validator
    if (!puzzle || !coordinate || !value)
      return res.send({ error: "Required field(s) missing" });
    if (/^[a-iA-I][1-9]$/.test(coordinate) === false)
      return res.send({ error: "Invalid coordinate" });
    if(/^[1-9]$/.test(value) === false)
      return res.send({ error: "Invalid value" });
    if (value < 1 || value > 9) return res.send({ error: "Invalid value" });
    const stringValidator = solver.validate(puzzle);
    if (stringValidator !== true) return res.send({ error: stringValidator });

    // Prepare Value
    const row = coordinate.toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
    const col = coordinate.charCodeAt(1)-'1'.charCodeAt(0);
    const stringValue = value.toString();
    // Check
    let conflict = [];
    const rowCheck = solver.checkRowPlacement(puzzle, row, col, stringValue);
    const colCheck = solver.checkColPlacement(puzzle, row, col, stringValue);
    const regionCheck = solver.checkRegionPlacement(
      puzzle,
      row,
      col,
      stringValue
    );
    if (!rowCheck) conflict.push("row");
    if (!colCheck) conflict.push("column");
    if (!regionCheck) conflict.push("region");
    if (rowCheck && colCheck && regionCheck) return res.send({ valid: true });
    else return res.send({ valid: false, conflict });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    // #Validator
    if (!puzzle) return res.send({ error: "Required field missing" });
    const stringValidator = solver.validate(puzzle);
    if (stringValidator !== true) return res.send({ error: stringValidator });
    res.json({ solution: solver.solve(puzzle) });
  });
};
