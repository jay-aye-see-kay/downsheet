import { strict as a } from "assert"

import { process } from './parser';
import { SheetMatrix } from '../types';

const sheet: SheetMatrix = [
  [{ kind: 'float', value: 42 }, { kind: 'string', value: 'woop' }],
  [{ kind: 'float', value: 10 }, { kind: 'string', value: ' woop' }],
]

describe('resolve and interpret', () => {
  // basic resolution
  it('resolve a number', () => a.equal(process('A1', sheet), 42));
  it('resolve a string', () => a.equal(process('B1', sheet), 'woop'));
  // basic math operators
  it('resolve and add two numbers', () => a.equal(process('A1+A2', sheet), 52));
  it('resolve one number and add to it', () => a.equal(process('A1+57', sheet), 99));
  it('multiply two numbers', () => a.equal(process('A1*10', sheet), 420));
  it('subtract a number', () => a.equal(process('52-A1', sheet), 10));
});
