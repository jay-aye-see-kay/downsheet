import { strict as a } from "assert"

import { cellEqual } from '../testHelpers';
import { evalFormula } from './parser';
import { Cell, SheetMatrix } from '../types';

const cell2: Cell = { kind: 'float', value: 2 }
const cell6: Cell = { kind: 'float', value: 6 }
const cell9: Cell = { kind: 'float', value: 9 }
const cell10: Cell = { kind: 'float', value: 10 };
const cell25: Cell = { kind: 'float', value: 25 }
const cell42: Cell = { kind: 'float', value: 42 };
const cell52: Cell = { kind: 'float', value: 52 };
const cell99: Cell = { kind: 'float', value: 99 };
const cell100: Cell = { kind: 'float', value: 100 };
const cell420: Cell = { kind: 'float', value: 420 };
const cell1000: Cell = { kind: 'float', value: 1000 };
const cellWoop: Cell = { kind: 'string', value: 'woop' };
const cellWoopWoop: Cell = { kind: 'string', value: 'woopwoop' };


describe('calc parser standalone', () => {
  // basic operators
  it('should calc 1+1', () => cellEqual(evalFormula('1+1', []), cell2));
  it('should calc 10-1', () => cellEqual(evalFormula('10-1', []), cell9));
  it('should calc 5*5', () => cellEqual(evalFormula('5*5', []), cell25));
  it('should calc 125/5', () => cellEqual(evalFormula('125/5', []), cell25));
  // operator prec
  it('should calc 1+1*5', () => cellEqual(evalFormula('1+1*5', []), cell6));
  it('should calc (1+1)*5', () => cellEqual(evalFormula('(1+1)*5', []), cell10));
  // basic functions
  it('should calc power(5, 2)', () => cellEqual(evalFormula('power(5, 2)', []), cell25));
  it('should calc min(5, 2)', () => cellEqual(evalFormula('min(5, 2)', []), cell2));
  it('should calc min(5, 20, 2, 100)', () => cellEqual(evalFormula('min(5, 20, 2, 100)', []), cell2));
  it('should calc max(5, 20, 2, 100)', () => cellEqual(evalFormula('max(5, 20, 2, 100)', []), cell100));
  it('should calc max(2)', () => cellEqual(evalFormula('max(2)', []), cell2));
});

const sheet: SheetMatrix = [
  [cell42, cellWoop],
  [cell10, cellWoop],
]

describe('calc parser with sheet and references', () => {
  // basic resolution
  it('resolve a number', () => cellEqual(evalFormula('A1', sheet), cell42));
  it('resolve a string', () => cellEqual(evalFormula('B1', sheet), cellWoop));
  // basic math operators
  it('resolve and add two numbers', () => cellEqual(evalFormula('A1+A2', sheet), cell52));
  it('resolve one number and add to it', () => cellEqual(evalFormula('A1+57', sheet), cell99));
  it('multiply two numbers', () => cellEqual(evalFormula('A1*10', sheet), cell420));
  it('subtract a number', () => cellEqual(evalFormula('52-A1', sheet), cell10));
  it('square a number', () => cellEqual(evalFormula('power(A2, 2)', sheet), cell100));
  it('cube a number', () => cellEqual(evalFormula('power(A2, 3)', sheet), cell1000));
  // concat a string (TODO maybe use a concat fn instead of +)
  it('concat two strings', () => cellEqual(evalFormula('B1+"woop"', sheet), cellWoopWoop));
});
