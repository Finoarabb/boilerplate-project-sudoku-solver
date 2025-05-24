class SudokuSolver {
  validate(puzzleString) {
    const lengthValidator = puzzleString.length === 81;
    if (!lengthValidator) return "Expected puzzle to be 81 characters long";
    const charValidator = /^[1-9.]+$/.test(puzzleString);
    if (!charValidator) return "Invalid characters in puzzle";
    let puzzleValidator = true;
    let array = puzzleString.split("");
    array.forEach((char, index) => {
      if (char === ".") return;
      let row = Math.floor(index / 9);
      let column = index % 9;
      array[index] = ".";
      if (
        !this.checkRowPlacement(array.join(""), row, char) ||
        !this.checkColPlacement(array.join(""), column, char) ||
        !this.checkRegionPlacement(array.join(""), row, column, char)
      ) {
        puzzleValidator = false;
      }
      array[index] = char; // Restore value
    });
    if (puzzleValidator) return true;
    return "Puzzle cannot be solved";
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rows = puzzleString.slice(row * 9, row * 9 + 8);
    if (rows[column] === value)
      rows = rows.slice(0, column) + "." + rows.slice(column + 1);
    return !rows.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    let cols = [];
    for (let i = 0; i < 9; i++) {
      cols.push(puzzleString.charAt(column + i * 9));
    }
    cols[row] = cols[row] === value ? "." : cols[row];
    return !cols.includes(value);
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowStart = Math.floor(row / 3) * 3;
    const colStart = Math.floor(column / 3) * 3;
    let region =
      puzzleString.slice(rowStart * 9 + colStart, rowStart * 9 + colStart + 3) +
      puzzleString.slice(
        (rowStart + 1) * 9 + colStart,
        (rowStart + 1) * 9 + colStart + 3
      ) +
      puzzleString.slice(
        (rowStart + 2) * 9 + colStart,
        (rowStart + 2) * 9 + colStart + 3
      );
    if (region[(row % 3) * 3 + (column % 3)] === value)
      region =
        region.slice(0, (row % 3) * 3 + (column % 3)) +
        "." +
        region.slice((row % 3) * 3 + (column % 3) + 1);
    return !region.includes(value);
  }

  emptySpaces(puzzleString) {
    let emptySpaces = [];
    for (let i = 0; i < puzzleString.length; i++) {
      if (puzzleString[i].match(/[1-9]/)) continue;
      let row = Math.floor(i / 9);
      let column = i % 9;
      let result;
      for (let i = 1; i <= 9; i++) {
        if (
          this.checkColPlacement(puzzleString, row, column, i.toString()) &&
          this.checkRegionPlacement(puzzleString, row, column, i.toString()) &&
          this.checkRowPlacement(puzzleString, row, column, i.toString())
        ) {
          if (result) {
            result = 0;
            break;
          }
          result = i.toString();
        }
      }
      if (result != 0) emptySpaces.push({ index: i, value: result });
    }
    return emptySpaces;
  }

  solve(puzzleString) {
    const isStringValid = this.validate(puzzleString);
    if (isStringValid !== true) return isStringValid;
    let result = puzzleString.split("");
    if (!result.includes(".")) return result.join("");
    const array = this.emptySpaces(result.join(""));
    if (array.length === 0) return { error: "Puzzle cannot be solved" };
    array.forEach(({ index, value }) => {
      result[index] = value;
    });
    return this.solve(result.join(""));
  }
}

module.exports = SudokuSolver;
