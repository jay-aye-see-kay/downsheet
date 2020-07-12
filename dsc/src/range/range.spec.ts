import { strict as a } from "assert";

import { Range } from "./index";
import { Cell, SheetData, } from "../types";


describe('Range module', () => {
  describe('getKind()', () => {
    it('should return invalid with no input', () => {
      a.equal(Range.getKind(''), 'invalid');
    });
    it('should return true for a cell', () => {
      a.equal(Range.getKind('A1'), 'cell');
    });
    it('should return matrix for an array', () => {
      a.equal(Range.getKind('A1:A3'), 'matrix');
      a.equal(Range.getKind('A1:C1'), 'matrix');
    });
    it('should return row for a row', () => {
      a.equal(Range.getKind('1:1'), 'row');
    });
    it('should return column for a column', () => {
      a.equal(Range.getKind('A:A'), 'column');
    });
  });

  describe('positionToCoord()', () => {
    it('should handle a simple position a A1', () => {
      a.deepEqual(Range.positionToCoord('A1'), { col: 0, row: 0 });
    });
    it('should handle a position at Z99', () => {
      a.deepEqual(Range.positionToCoord('Z99'), { col: 25, row: 98 });
    });
    it('should handle a position at BA1000', () => {
      a.deepEqual(Range.positionToCoord('BA1000'), { col: 52, row: 999 });
    });
  });

  describe('resolve()', () => {
    const cell1: Cell = { kind: 'float', value: 1 };
    const cell2: Cell = { kind: 'string', value: "foo" };
    const cell3: Cell = { kind: 'string', value: "bar" };
    const sheetData: SheetData = [
    // A      B      C
      [cell1, cell2, cell3], // 1
      [cell2, cell1, cell2], // 2
      [cell3, cell2, cell1], // 3
    ];

    it('should resolve a simple position a A1', () => {
      a.deepEqual(Range.resolve('A1', sheetData), cell1);
    });
    it('should resolve a horizontal 1D array A1:C1', () => {
      a.deepEqual(Range.resolve('A1:C1', sheetData), [cell1, cell2, cell3]);
    });
    it('should resolve a vertical 1D array B1:B3', () => {
      a.deepEqual(Range.resolve('B1:B3', sheetData), [cell2, cell1, cell2]);
    });
    it('should resolve a matrix A1:B2', () => {
      a.deepEqual(Range.resolve('A1:B2', sheetData), [
        [cell1, cell2],
        [cell2, cell1],
      ]);
    });
    it('should resolve a row 1:1', () => {
      a.deepEqual(Range.resolve('1:1', sheetData), [cell1, cell2, cell3]);
    });
    it('should resolve an multiple rows 1:2', () => {
      a.deepEqual(Range.resolve('1:2', sheetData), [
        [cell1, cell2, cell3],
        [cell2, cell1, cell2],
      ]);
    });
    it('should resolve a column B:B', () => {
      a.deepEqual(Range.resolve('B:B', sheetData), [cell2, cell1, cell2]);
    });
    it('should resolve an multiple columns A:B', () => {
      a.deepEqual(Range.resolve('A:B', sheetData), [
        [cell1, cell2],
        [cell2, cell1],
        [cell3, cell2],
      ]);
    });
  });
});
