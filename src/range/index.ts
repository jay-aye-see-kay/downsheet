const char = "([a-zA-Z])+";
const num = "([0-9])+";

const valid = {
  cell: new RegExp(`^${char}${num}$`),
  array: new RegExp(`^${char}${num}:${char}${num}$`),
  row: new RegExp(`^${num}:${num}$`),
  column: new RegExp(`^${char}:${char}$`),
};

type BoundedRangeKind =
  | "cell"
  | "array"
  | "matrix"

// needs to be resolved into a bounded range
type UnboundedRangeKind =
  | "row"
  | "column"
  | "row matrix"
  | "column matrix";

type RangeKind =
  | BoundedRangeKind
  | UnboundedRangeKind
  | "invalid";

type CellKind =
  | 'none'
  | 'string'
  | 'int'
  | 'float'
  | 'boolean'
  | 'offset-date-time'
  | 'date-time'
  | 'date'
  | 'time';


// Position is a A1/ZA199 syntax string by users
type Position = string;

// Coord is [0, 0] syntax, 0 indexed
type Coord = [number, number];

export type Cell = {
  kind: CellKind;
  value: any; // TODO
};

type SheetArray = Cell[];
type SheetMatrix = Cell[][];
export type SheetData = SheetMatrix;

class RangeError extends Error {}


const kind = (rangeString: string): RangeKind => {
  if (valid.cell.test(rangeString)) return 'cell';
  if (valid.array.test(rangeString)) return 'array';
  // TODO matrix vs array
  if (valid.row.test(rangeString)) return 'row';
  if (valid.column.test(rangeString)) return 'column';
  // TODO row vs rows and column vs columns

  return 'invalid';
}

// this probably need better tests, I'm not confident it handles large numbers quite right
const columnStringToIndex = (columnString: string): number => {
  const charValue = columnString.toUpperCase().split('').reverse().map((char, index) => {
    const digitValue = char.charCodeAt(0) - "A".charCodeAt(0) + 1;
    if (digitValue < 1 && digitValue > 26) {
      throw new Error('non-ascii alphabet column provided');
    }
    return digitValue * (26 ** index);
  });
  return charValue.reduce((sum, v) => sum + v, 0) - 1;
}


const positionToCoord = (position: Position): Coord => {
  const columnMatches = position.match(/[a-zA-Z]+/);
  const columnIndex = columnMatches && columnMatches[0] ?
    columnStringToIndex(columnMatches[0])
    : 0;

  const rowMatches = position.match(/[0-9]+/);
  const rowIndex = rowMatches && rowMatches[0]
    ? parseInt(rowMatches[0], 10) - 1
    : 0;

  return [columnIndex, rowIndex];
}


const resolve = (rangeString: string, sheetData: SheetData): Cell | SheetArray | SheetMatrix => {
  const kind = Range.kind(rangeString);
  if (kind === 'invalid') throw new RangeError();
  if (kind === 'row'
   || kind === 'row matrix'
   || kind === 'column'
   || kind === 'column matrix'
   ) { /* TODO handle unbounded range */ }

   if (kind === 'cell') {
     const coord = positionToCoord(rangeString);
     return sheetData[coord[0]][coord[1]];
   }

   return sheetData;
}


export const Range = {
  kind,
  positionToCoord,
  columnStringToIndex,
  resolve
};
