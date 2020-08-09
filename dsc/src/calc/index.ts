import { SheetFile } from '../types';

import { evalFormula } from './parser';
import { Range } from "../range";
import { toSb26 } from '../hexavigesimal';

const getInlineLabels = (sheetFile: SheetFile): SheetFile['labels'] => {
  const inlineLabels: SheetFile['labels'] = {};

  sheetFile.data.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      if (cell.kind !== "string") return;

      const { value } = cell;
      if (value.endsWith(":") && value.length > 1 && !value.includes(" ")) {
        const labelName = value.substring(0, value.length - 1);
        // label refers one to the right (but rows are 0 indexed)
        inlineLabels[labelName] = `${toSb26(colIdx + 1)}${rowIdx + 1}`;
      }
    });
  });

  return inlineLabels;
};

/**
 * Take a SheetFile and run over all formula, updating the cell data
 *
 * Note: This doesn't make a graph so can't detect circular dependancies or even calculate in the correct order, TODO
 */
export const calc = (sheetFile: SheetFile): SheetFile => {
  if (!sheetFile.formula) return sheetFile;

  const newSheetFile = { ...sheetFile, data: sheetFile.data };

  // TODO what if there's a label that's also a valid range, which gets precedence?
  // - I should probably just ignore labels that match the isRange regex
  // - and put a warning in too, one day obvs

  const labels: SheetFile['labels'] = { ...sheetFile.labels, ...getInlineLabels(sheetFile) };
  const hasLabels = !!Object.keys(labels).length;

  if (hasLabels && sheetFile.formula) {
    // dumb find and replace of labels
    const newFormula: SheetFile['formula'] = {};
    const formulaPairs = Object.entries(sheetFile.formula);
    const labelPairs = Object.entries(labels)
      // sort so longest go first and we don't replace substrings
      .sort((p0, p1) => p1[0].length - p0[0].length);

    for (const [formulaRange, formulaValue] of formulaPairs) {
      let newFormulaRange = formulaRange;
      let newFormulaValue = formulaValue;
      for (const [labelKey, labelValue] of labelPairs) {
        // ignore matches followed by an open bracket, those are functions
        // TODO write tests
        newFormulaRange = newFormulaRange.replace(new RegExp(labelKey + '(?!\\()', 'g'), labelValue);
        newFormulaValue = newFormulaValue.replace(new RegExp(labelKey + '(?!\\()', 'g'), labelValue);
      }
      newFormula[newFormulaRange] = newFormulaValue;
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
