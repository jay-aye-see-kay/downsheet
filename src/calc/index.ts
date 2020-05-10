import {
  Cell,
  RangeIO,
  SheetArray,
  SheetMatrix,
  isCell,
  isSheetArray,
  isSheetMatrix,
} from '../types';

const plusCell = (r1: Cell, r2: Cell): Cell => {
  if (r1.kind === 'float' && r2.kind === 'float') {
    return { kind: 'float', value: r1.value + r2.value };
  } else if (r1.kind === 'string' && r2.kind === 'string') {
    return { kind: 'string', value: r1.value + r2.value };
  }
  // TODO helpful errors
  throw new Error(`Cannot add type ${r1.kind} to type ${r2.kind}`);
}

export const plus = (r1: RangeIO, r2: RangeIO): RangeIO => {
  if (isCell(r1) && isCell(r2)) {
    return plusCell(r1, r2);
  }
  // errors to throw:
  // input sizes don't match (unless one is a cell, then adding const to all)
  // types don't match

  throw new Error('no implemented');
}
