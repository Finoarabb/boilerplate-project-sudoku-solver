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

  onePossibleValue(puzzleString) {
    let onePossibleSpaces = [];
    for (let i = 0; i < puzzleString.length; i++) {
      if (puzzleString[i].match(/[1-9]/)) continue;

      let row = Math.floor(i / 9);
      let col = i % 9;
      let possibleValue = null;

      for (let j = 1; j <= 9; j++) {
        let val = j.toString();
        if (
          this.checkRowPlacement(puzzleString, row, col, val) &&
          this.checkColPlacement(puzzleString, row, col, val) &&
          this.checkRegionPlacement(puzzleString, row, col, val)
        ) {
          if (possibleValue !== null) {
            // More than one possibility, skip this cell
            possibleValue = null;
            break;
          }
          possibleValue = val;
        }
      }

      if (possibleValue !== null) {
        onePossibleSpaces.push({ index: i, value: possibleValue });
      }
    }

    return onePossibleSpaces;
  }

  guessValue(puzzleString) {
    const arr = puzzleString.split("");
    const index = arr.findIndex((char) => char === ".");
    if (index === -1) return arr.join(""); // already solved

    const row = Math.floor(index / 9);
    const col = index % 9;

    for (let i = 1; i <= 9; i++) {
      const val = i.toString();
      if (
        this.checkRowPlacement(arr.join(""), row, col, val) &&
        this.checkColPlacement(arr.join(""), row, col, val) &&
        this.checkRegionPlacement(arr.join(""), row, col, val)
      ) {
        arr[index] = val;
        const result = this.solve(arr.join(""));
        if (typeof result === "string") return result; // successful path
        arr[index] = "."; // backtrack
      }
    }

    return false; // No valid guesses
  }

  solve(puzzleString) {
    const isValid = this.validate(puzzleString);
    if (isValid !== true) return isValid;

    if (!puzzleString.includes(".")) return puzzleString;

    const forcedMoves = this.onePossibleValue(puzzleString);
    if (forcedMoves.length > 0) {
      const arr = puzzleString.split("");
      forcedMoves.forEach(({ index, value }) => {
        arr[index] = value;
      });
      return this.solve(arr.join("")); // keep solving
    }

    return this.guessValue(puzzleString); // fallback to guessing
  }
}

module.exports = SudokuSolver;
