// const TOML = require('@iarna/toml')
import Toml from '@iarna/toml';
import * as fs from 'fs';

const f = fs.readFileSync('./tests/indentity.toml', 'utf8');
const fileAsJson = Toml.parse(f);
// let's just assume I've validated the input for now...
const data = fileAsJson.data as Cell[][];

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

const makeOutString = (data: Data): string => {
  const columnCount = getColumnCount(data);
  console.log('columnCount', columnCount);
  const columnWidths = getColumnWidths(data);
  console.log('columnWidths', columnWidths);

  let outString = "data = [\n";

  data.forEach((row, rowIdx) => {
    const rowAsString = row.map(cell => cellToString(cell)).join(", ");
    outString += `  [${rowAsString}]\n`;
  });

  outString += "]";

  return outString;
}
const outString = makeOutString(data);
console.log('outString', outString);
