import { strict as a } from "assert"

import { Cell } from './types';

export const cellEqual = (n0: Cell, n1: Cell): void => {
  a.equal(n0.kind, n1.kind);
  if (n0.kind === 'none' || n1.kind === 'none') return
  a.equal(n0.value, n1.value);
}

// make a cell value
export const mkc = (value: string | number): Cell => {
  if (typeof value === 'string') {
    return { kind: 'string', value };
  }
  return { kind: 'float', value };
}
