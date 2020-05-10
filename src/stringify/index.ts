import { Cell, SheetData } from '../types';
import { assertNever } from '../helpers';

export const cellToString = (cell: Cell): string => {
  switch(cell.kind) {
    case 'none':
      return `''`;
    case 'boolean':
      return cell.value ? "true" : "false";
    case 'string':
      return `"${cell.value}"`;
    case 'float':
      return cell.value.toString();
    case 'offset-date-time':
      return cell.value.toISOString();
    case 'date-time':
      return cell.value.toISOString();
    case 'date':
      return cell.value.toISOString();
    case 'time':
      return cell.value.toISOString();
    default:
      assertNever(cell);
      throw new Error();
  }
}

const getColumnWidths = (stringMatix: string[][]) => {
  const columnMaxWidths = [];
  for (let columnIdx = 0; columnIdx < stringMatix[0].length; columnIdx++) {
    const columnWidths = [];
    for (let rowIdx = 0; rowIdx < stringMatix.length; rowIdx++) {
      columnWidths.push(stringMatix[rowIdx][columnIdx].length);
    }
    columnMaxWidths.push(Math.max(...columnWidths));
  }
  return columnMaxWidths;
}

// TODO handle more than 26 cols
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const idxToLetter = (i: number) => alphabet[i];


const makeTopLabels = (columnWidths: number[]): string => {
  const labels = columnWidths.map((width, colIdx) => {
    const letter = idxToLetter(colIdx);
    const padding = " ".repeat(width - letter.length);
    const isLast = colIdx === columnWidths.length - 1;
    return isLast ? ` ${letter}` : ` ${letter}${padding}`;
  })
  const labelRow = "  #" + labels.join(' ');;
  return `${labelRow}\n`;
}

export const stringify = (sheetData: SheetData): string => {
  const dataAsStringGrid = sheetData.map(
    row => row.map(cell => cellToString(cell))
  );

  const columnWidths = getColumnWidths(dataAsStringGrid);
  let outString = "data = [\n";
  outString += makeTopLabels(columnWidths);
  dataAsStringGrid.forEach((row, rowIdx) => {
    const rowAsString = row.map((cellStr, cellIdx) => {
      const width = columnWidths[cellIdx];
      const padding = " ".repeat(width - cellStr.length);
      const isLast = cellIdx === row.length - 1;
      return isLast ? `${cellStr}${padding}` : `${cellStr},${padding}`;
    }).join(" ");
    outString += `  [ ${rowAsString } ], # ${rowIdx + 1}\n`;
  });

  outString += "]\n";
  return outString;
}
