import { equal, deepStrictEqual } from "assert";

import { Range, SheetData, Cell } from "./index";


describe('Range module', () => {
  describe('getKind()', () => {
    it('should return invalid with no input', () => {
      equal(Range.getKind(''), 'invalid');
    });
    it('should return true for a cell', () => {
      equal(Range.getKind('A1'), 'cell');
    });
    it('should return array for an array', () => {
      equal(Range.getKind('A1:A3'), 'array');
    });
    it('should return row for a row', () => {
      equal(Range.getKind('1:1'), 'row');
    });
    it('should return column for a column', () => {
      equal(Range.getKind('A:A'), 'column');
    });
  });

  describe('columnStringToIndex()', () => {
    it('should convert A to 0', () => {
      equal(Range.columnStringToIndex('A'), 0);
    });
    it('should convert Z to 25', () => {
      equal(Range.columnStringToIndex('Z'), 25);
    });
    it('should convert AA to 26', () => {
      equal(Range.columnStringToIndex('AA'), 26);
    });
    it('should convert AZ to 51', () => {
      equal(Range.columnStringToIndex('AZ'), 51);
    });
    it('should convert ZZ to 701', () => {
      equal(Range.columnStringToIndex('ZZ'), 701);
    });
    it('should also handle lower case', () => {
      equal(Range.columnStringToIndex('a'), 0);
      equal(Range.columnStringToIndex('zz'), 701);
    });
  });

  describe('positionToCoord()', () => {
    it('should handle a simple position a A1', () => {
      deepStrictEqual(Range.positionToCoord('A1'), { col: 0, row: 0 });
    });
    it('should handle a position at Z99', () => {
      deepStrictEqual(Range.positionToCoord('Z99'), { col: 25, row: 98 });
    });
    it('should handle a position at BA1000', () => {
      deepStrictEqual(Range.positionToCoord('BA1000'), { col: 52, row: 999 });
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
      deepStrictEqual(Range.resolve('A1', sheetData), cell1);
    });
    it('should resolve a horizontal 1D array A1:C1', () => {
      deepStrictEqual(Range.resolve('A1:C1', sheetData), [cell1, cell2, cell3]);
    });
    it('should resolve a vertical 1D array B1:B3', () => {
      deepStrictEqual(Range.resolve('B1:B3', sheetData), [cell2, cell1, cell2]);
    });
    it('should resolve a matrix A1:B2', () => {
      deepStrictEqual(Range.resolve('A1:B2', sheetData), [[cell1, cell2],[cell2, cell1]]);
    });
  });
});
