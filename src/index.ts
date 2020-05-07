// const TOML = require('@iarna/toml')
import Toml from '@iarna/toml';

type Cell = string | number;
type Data = Cell[][];

const getColumnCount = (data: Data): number => {
  let max = 0;
  for (const row of data) {
    if (row.length > max) max = row.length;
  }
  return max + 1; // counts are not 0 indexed
}

const cellToString = (cell: Cell): string => {
  switch(typeof cell) {
    case 'string':
      return cell;
    case 'number':
      return cell.toString();
    default:
      throw new Error();
  }
}

const getColumnWidths = (data: Data) =>
  data.map(row =>
    Math.max(...row.map(cell => cellToString(cell).length))
  )

const formatDataAttribute = (data: Data): string => {
  const columnCount = getColumnCount(data);
  const columnWidths = getColumnWidths(data);

  let outString = "data = [\n";

  data.forEach((row, rowIdx) => {
    const rowAsString = row.map(cell => cellToString(cell)).join(", ");
    outString += `  [ ${rowAsString} ],\n`;
  });

  outString += "]\n";

  return outString;
}

export const formatDownsheet = (file: string): string => {
  const fileAsJson = Toml.parse(file);
  // let's just assume I've validated the input for now...
  const data = fileAsJson.data as Cell[][];
  return formatDataAttribute(data);
}
