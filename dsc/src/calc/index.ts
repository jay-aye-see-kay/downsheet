import {
  Cell,
  RangeIO,
  SheetArray,
  SheetMatrix,
  isCell,
  isSheetArray,
  isSheetMatrix,
} from '../types';

type CellFunction = (r1: Cell, r2: Cell) => Cell;

const plusCell: CellFunction = (r1, r2) => {
  if (r1.kind === 'float' && r2.kind === 'float') {
    return { kind: 'float', value: r1.value + r2.value };
  } else if (r1.kind === 'string' && r2.kind === 'string') {
    return { kind: 'string', value: r1.value + r2.value };
  }
  // TODO helpful errors
  throw new Error(`Cannot add type ${r1.kind} to type ${r2.kind}`);
}

const applytoCellAndArray = (r1: Cell, r2: SheetArray, fn: CellFunction): SheetArray => {
  return r2.map(cell => fn(r1, cell));
}

const applytoCellAndMatrix = (r1: Cell, r2: SheetMatrix, fn: CellFunction): SheetMatrix => {
  return r2.map(arr =>
    arr.map(cell => fn(r1, cell))
  );
}

export const plus = (r1: RangeIO, r2: RangeIO): RangeIO => {
  if (isCell(r1)) {
    if (isCell(r2)) return plusCell(r1, r2);
    if (isSheetArray(r2)) return applytoCellAndArray(r1, r2, plusCell);
    return applytoCellAndMatrix(r1, r2, plusCell);
  }

  if (isCell(r2)) {
    if (isSheetArray(r1)) return applytoCellAndArray(r2, r1, plusCell);
    return applytoCellAndMatrix(r2, r1, plusCell);
  }

  if (isSheetArray(r1) && isSheetArray(r2)) {
    if (r1.length !== r2.length)
      throw new Error("can't add ranges of different sizes");

    return r1.map((cell, i) => plusCell(cell, r2[i]));
  }

  if (isSheetMatrix(r1) && isSheetMatrix(r2)) {
    if (r1.length !== r2.length)
      throw new Error("can't add ranges of different sizes");

    return r1.map((arr, i) => {
      if (arr.length !== r2[i].length)
        throw new Error("can't add ranges of different sizes");

      return arr.map((cell, j) => plusCell(cell, r2[i][j]))
    });
  }

  // TODO helpful
  throw new Error("can't add dissimilar ranges");
}
