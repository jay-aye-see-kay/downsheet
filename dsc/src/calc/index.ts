import { SheetFile } from '../types';

import { evalFormula } from './parser';
import { Range } from "../range";

// Take a SheetFile and run over all formula, updating the cell data
// Note: This doesn't make a graph so can't detect circular dependancies or even calculate in the correct order, TODO
export const calc = (sheetFile: SheetFile): SheetFile => {
  if (!sheetFile.formula) return sheetFile;

  const newSheetFile = { ...sheetFile, data: sheetFile.data };

  // TODO what if there's a label that's also a valid range, which gets precedence?
  // TODO maybe I should make labels uppercase only to avoid collisions with fn names?

  if (sheetFile.labels && sheetFile.formula) {
    // dumb find and replace of labels
    const newFormula: SheetFile['formula'] = {};
    const oldFormula = Object.entries(sheetFile.formula);
    const oldLabels = Object.entries(sheetFile.labels);

    for (const [formulaRange, formulaValue] of oldFormula) {
      for (const [labelKey, labelValue] of oldLabels) {
        const newFormulaRange = formulaRange.replace(new RegExp(labelKey, 'g'), labelValue);
        const newFormulaValue = formulaValue.replace(new RegExp(labelKey, 'g'), labelValue);
        newFormula[newFormulaRange] = newFormulaValue;
      }
    }
    // put the substituted formula into the new file
    newSheetFile.formula = newFormula;
  }

  if (newSheetFile.formula) {
    Object.entries(newSheetFile.formula).forEach(([formulaRange, formulaValue]) => {
      // range to position, error if not cell range
      const pos = Range.positionToCoord(formulaRange);

      // calc value and put in new sheetFile.data
      const outputValue = evalFormula(formulaValue, newSheetFile.data);
      newSheetFile.data[pos.row][pos.col] = outputValue;
    });
  }

  // put the un-substituted formula back so that gets written to file
  newSheetFile.formula = sheetFile.formula;

  return newSheetFile;
};
