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


// TODO handle more than 26 cols
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const idxToLetter = (i: number) => alphabet[i];


const makeTopLabels = (columnWidths: number[]): string => {
  const labels = columnWidths.map((width, colIdx) => {
    const letter = idxToLetter(colIdx);
    const padding = " ".repeat(width - letter.length);
    return ` ${letter}${padding}`;
  })
  const labelRow = "  #" + labels.join(' ');;
  return `${labelRow}\n`;
}


const formatDataAttribute = (data: Data): string => {
  const columnCount = getColumnCount(data);
  const columnWidths = getColumnWidths(data);

  let outString = "data = [\n";
  outString += makeTopLabels(columnWidths);
  data.forEach((row, rowIdx) => {
    const rowAsString = row.map(cell => cellToString(cell)).join(", ");
    outString += `  [ ${rowAsString} ], # ${rowIdx + 1}\n`;
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
