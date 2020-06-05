import { strict as a } from "assert"

import { cellEqual } from '../testHelpers';
import { process } from './parser';
import { Cell, SheetMatrix } from '../types';

const cell10: Cell = { kind: 'float', value: 10 };
const cell42: Cell = { kind: 'float', value: 42 };
const cell52: Cell = { kind: 'float', value: 52 };
const cell99: Cell = { kind: 'float', value: 99 };
const cell100: Cell = { kind: 'float', value: 100 };
const cell420: Cell = { kind: 'float', value: 420 };
const cell1000: Cell = { kind: 'float', value: 1000 };
const cellWoop: Cell = { kind: 'string', value: 'woop' };
const cellWoopWoop: Cell = { kind: 'string', value: 'woopwoop' };

const sheet: SheetMatrix = [
  [cell42, cellWoop],
  [cell10, cellWoop],
]

describe('resolve and interpret', () => {
  // basic resolution
  it('resolve a number', () => cellEqual(process('A1', sheet), cell42));
  it('resolve a string', () => cellEqual(process('B1', sheet), cellWoop));
  // basic math operators
  it('resolve and add two numbers', () => cellEqual(process('A1+A2', sheet), cell52));
  it('resolve one number and add to it', () => cellEqual(process('A1+57', sheet), cell99));
  it('multiply two numbers', () => cellEqual(process('A1*10', sheet), cell420));
  it('subtract a number', () => cellEqual(process('52-A1', sheet), cell10));
  it('square a number', () => cellEqual(process('power(A2, 2)', sheet), cell100));
  it('cube a number', () => cellEqual(process('power(A2, 3)', sheet), cell1000));
  // concat a string (TODO maybe use a concat fn instead of +)
  it('concat two strings', () => cellEqual(process('B1+"woop"', sheet), cellWoopWoop));
});
