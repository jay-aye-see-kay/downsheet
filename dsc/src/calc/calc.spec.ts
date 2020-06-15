import { strict as a } from "assert"

import { cellEqual } from '../testHelpers';
import { evalFormula } from './parser';
import { Cell, SheetMatrix } from '../types';

const cell2: Cell = { kind: 'float', value: 2 }
const cell6: Cell = { kind: 'float', value: 6 }
const cell9: Cell = { kind: 'float', value: 9 }
const cell10: Cell = { kind: 'float', value: 10 };
const cell20: Cell = { kind: 'float', value: 20 }
const cell25: Cell = { kind: 'float', value: 25 }
const cell40: Cell = { kind: 'float', value: 40 };
const cell42: Cell = { kind: 'float', value: 42 };
const cell52: Cell = { kind: 'float', value: 52 };
const cell72: Cell = { kind: 'float', value: 72 };
const cell99: Cell = { kind: 'float', value: 99 };
const cell100: Cell = { kind: 'float', value: 100 };
const cell420: Cell = { kind: 'float', value: 420 };
const cell1000: Cell = { kind: 'float', value: 1000 };
const cellWoop: Cell = { kind: 'string', value: 'woop' };
const cellWoopWoop: Cell = { kind: 'string', value: 'woopwoop' };
const cellWoopWoopWoop: Cell = { kind: 'string', value: 'woopwoopwoop' };


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
// A       B
  [cell42, cellWoop], // 1
  [cell10, cellWoop], // 2
  [cell10, cell10  ], // 3
  [cell10, cell10  ], // 4
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
  // sum a range
  it('sum a row', () => cellEqual(evalFormula("sum(3:3)", sheet), cell20));
  it('sum 2 rows', () => cellEqual(evalFormula("sum(3:4)", sheet), cell40));
  it('sum a column', () => cellEqual(evalFormula("sum(A:A)", sheet), cell72));
  it('sum a range', () => cellEqual(evalFormula("sum(A3:B4)", sheet), cell40));
  // concat a string
  it('concat a string (no change)', () => cellEqual(evalFormula('concat(B1)', sheet), cellWoop));
  it('concat two strings', () => cellEqual(evalFormula("concat(B1, 'woop')", sheet), cellWoopWoop));
  it('concat three strings', () => cellEqual(evalFormula("concat(B1, 'woop', B2)", sheet), cellWoopWoopWoop));
  it('concat a range', () => cellEqual(evalFormula("concat(B1:B2)", sheet), cellWoopWoop));
});
