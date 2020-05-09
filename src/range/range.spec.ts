import { equal, deepStrictEqual } from "assert";

import { Range, SheetData, Cell } from "./index";


describe('Range module', () => {
  describe('kind()', () => {
    it('should return invalid with no input', () => {
      equal(Range.kind(''), 'invalid');
    });
    it('should return true for a cell', () => {
      equal(Range.kind('A1'), 'cell');
    });
    it('should return array for an array', () => {
      equal(Range.kind('A1:A3'), 'array');
    });
    it('should return row for a row', () => {
      equal(Range.kind('1:1'), 'row');
    });
    it('should return column for a column', () => {
      equal(Range.kind('A:A'), 'column');
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
      deepStrictEqual(Range.positionToCoord('A1'), [0, 0]);
    });
    it('should handle a position at Z99', () => {
      deepStrictEqual(Range.positionToCoord('Z99'), [25, 98]);
    });
    it('should handle a position at BA1000', () => {
      deepStrictEqual(Range.positionToCoord('BA1000'), [52, 999]);
    });
  });

  describe('resolve()', () => {
    const cell1: Cell = { kind: 'float', value: 1 };
    const sheetData: SheetData = [ [cell1] ];

    it('should handle a simple position a A1', () => {
      deepStrictEqual(Range.resolve('A1', sheetData), cell1);
    });
  });
});
