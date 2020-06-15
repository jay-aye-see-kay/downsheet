import { strict as a } from "assert"

import { cellEqual, mkc } from '../testHelpers';
import { evalFormula } from './parser';
import { Cell, SheetMatrix } from '../types';


describe('calc parser standalone', () => {
  // basic operators
  it('should calc 1+1', () => cellEqual(evalFormula('1+1', []), mkc(2)));
  it('should calc 10-1', () => cellEqual(evalFormula('10-1', []), mkc(9)));
  it('should calc 5*5', () => cellEqual(evalFormula('5*5', []), mkc(25)));
  it('should calc 125/5', () => cellEqual(evalFormula('125/5', []), mkc(25)));
  it('should calc 12*0.5', () => cellEqual(evalFormula('12*0.5', []), mkc(6)));
  it('should calc 0.5*0.5', () => cellEqual(evalFormula('0.5*0.5', []), mkc(0.25)));
  // operator prec
  it('should calc 1+1*5', () => cellEqual(evalFormula('1+1*5', []), mkc(6)));
  it('should calc (1+1)*5', () => cellEqual(evalFormula('(1+1)*5', []), mkc(10)));
  // basic functions
  it('should calc power(5, 2)', () => cellEqual(evalFormula('power(5, 2)', []), mkc(25)));
  it('should calc min(5, 2)', () => cellEqual(evalFormula('min(5, 2)', []), mkc(2)));
  it('should calc min(5, 20, 2, 100)', () => cellEqual(evalFormula('min(5, 20, 2, 100)', []), mkc(2)));
  it('should calc max(5, 20, 2, 100)', () => cellEqual(evalFormula('max(5, 20, 2, 100)', []), mkc(100)));
  it('should calc max(2)', () => cellEqual(evalFormula('max(2)', []), mkc(2)));
});

const sheet: SheetMatrix = [
// A       B
  [mkc(42), mkc("woop")], // 1
  [mkc(10), mkc("woop")], // 2
  [mkc(10), mkc(10)    ], // 3
  [mkc(10), mkc(10)    ], // 4
]

describe('calc parser with sheet and references', () => {
  // basic resolution
  it('resolve a number', () => cellEqual(evalFormula('A1', sheet), mkc(42)));
  it('resolve a string', () => cellEqual(evalFormula('B1', sheet), mkc("woop")));
  // basic math operators
  it('resolve and add two numbers', () => cellEqual(evalFormula('A1+A2', sheet), mkc(52)));
  it('resolve one number and add to it', () => cellEqual(evalFormula('A1+57', sheet), mkc(99)));
  it('multiply two numbers', () => cellEqual(evalFormula('A1*10', sheet), mkc(420)));
  it('subtract a number', () => cellEqual(evalFormula('52-A1', sheet), mkc(10)));
  it('square a number', () => cellEqual(evalFormula('power(A2, 2)', sheet), mkc(100)));
  it('cube a number', () => cellEqual(evalFormula('power(A2, 3)', sheet), mkc(1000)));
  // sum a range
  it('sum a row', () => cellEqual(evalFormula("sum(3:3)", sheet), mkc(20)));
  it('sum 2 rows', () => cellEqual(evalFormula("sum(3:4)", sheet), mkc(40)));
  it('sum a column', () => cellEqual(evalFormula("sum(A:A)", sheet), mkc(72)));
  it('sum a range', () => cellEqual(evalFormula("sum(A3:B4)", sheet), mkc(40)));
  // concat a string
  it('concat a string (no change)', () => cellEqual(evalFormula('concat(B1)', sheet), mkc("woop")));
  it('concat two strings', () => cellEqual(evalFormula("concat(B1, 'woop')", sheet), mkc("woopwoop")));
  it('concat three strings', () => cellEqual(evalFormula("concat(B1, 'woop', B2)", sheet), mkc("woopwoopwoop")));
  it('concat a range', () => cellEqual(evalFormula("concat(B1:B2)", sheet), mkc("woopwoop")));
});
