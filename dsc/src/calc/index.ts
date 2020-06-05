import {
  Cell,
  RangeIO,
  SheetArray,
  SheetMatrix,
  SheetFile,
  isCell,
  isSheetArray,
  isSheetMatrix,
} from '../types';

import { evalFormula } from './parser';
import { Range } from "../range";

// Take a SheetFile and run over all formula, updating the cell data
// Note: This doesn't make a graph so can't detect circular dependancies or even calculate in the correct order, TODO
export const calc = (sheetFile: SheetFile): SheetFile => {
  if (!sheetFile.formula) return sheetFile;

  const newSheetFile = { ...sheetFile, data: sheetFile.data };
  Object.entries(sheetFile.formula).forEach(([formulaRange, formulaValue]) => {
    // range to position, error if not cell range
    const pos = Range.positionToCoord(formulaRange);

    // calc value and put in new sheetFile.data
    const outputValue = evalFormula(formulaValue, newSheetFile.data);
    newSheetFile.data[pos.row][pos.col] = outputValue;
  });

  return newSheetFile;
};
