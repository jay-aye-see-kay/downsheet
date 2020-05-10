const assertNever = (x: never): never => {
  throw new Error("Unexpected object: " + x);
}


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
type Coord = {
  row: number;
  col: number;
}

export type Cell = {
  kind: CellKind;
  value: any; // TODO
};

type SheetArray = Cell[];
type SheetMatrix = Cell[][];
export type SheetData = SheetMatrix;

class RangeError extends Error {}


const getKind = (rangeString: string): RangeKind => {
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

  return { row: rowIndex, col: columnIndex };
}

const getRowH = (rStart: number, rEnd: number, col: number, sheetData: SheetData): Cell[] => {
  const slice: Cell[] = [];
  for (let rIndex = rStart; rIndex <= rEnd; rIndex++) {
    slice.push(sheetData[col][rIndex]);
  }
  return slice;
}

const getRowV = (cStart: number, cEnd: number, row: number, sheetData: SheetData): Cell[] => {
  const slice: Cell[] = [];
  for (let cIndex = cStart; cIndex <= cEnd; cIndex++) {
    slice.push(sheetData[cIndex][row]);
  }
  return slice;
}

const getMatrix = (c1: Coord, c2: Coord, sheetData: SheetData): SheetMatrix => {
  const [rMin, rMax] = [c1.row, c2.row].sort();
  const [cMin, cMax] = [c1.col, c2.col].sort();
  // slice unneeded rows away
  const halfSlicedData = sheetData.slice(rMin, rMax + 1);
  // slice unneeded cols away
  const slicedData = halfSlicedData.map(row =>
    row.slice(cMin, cMax + 1)
  );
  return slicedData;
}

const resolve = (rangeString: string, sheetData: SheetData): Cell | SheetArray | SheetMatrix => {
  const kind = getKind(rangeString);
  switch (kind) {
    case 'invalid':
      throw new RangeError();
    case 'row':
    case 'row matrix':
    case 'column':
    case 'column matrix':
      throw new Error('TODO handle unbounded range');

    case 'cell':
     const coord = positionToCoord(rangeString);
     return sheetData[coord.row][coord.col];

    case 'array': {
      const [s1, s2] = rangeString.split(':');
      const c1 = positionToCoord(s1);
      const c2 = positionToCoord(s2);
      if (c1.row ===c2.row) {
        return getRowV(c1.col, c2.col, c1.row, sheetData)
      } else {
        return getRowH(c1.row, c2.row, c1.col, sheetData)
      }
    }

     case 'matrix':
       const [s1, s2] = rangeString.split(':');
       const c1 = positionToCoord(s1);
       const c2 = positionToCoord(s2);
       return getMatrix(c1, c2, sheetData);

    default:
      assertNever(kind);
      throw new Error();
  }
}

// okay what I really want of this modules is to pass in the sheet and a range string and get a resolved range object back with a kind key to id it, and a value of Cell | Cell[] | Cell[][]
// the way I've split getKind off doesn't make that much sense right now, and the concept of unbounded ranges isn't really useful, the initial regex check should just split on cell, matrix (inc 1d array), row, and col
// I also don't handle getting values from parts of the sheet that don't exist, I should probably throw and error there


export const Range = {
  getKind,
  positionToCoord,
  columnStringToIndex,
  resolve
};
