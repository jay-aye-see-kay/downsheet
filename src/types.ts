import { OffsetDateTime, LocalDateTime, LocalDate, LocalTime } from './dates';


type NoneCell = {
  kind: 'none';
};
type StringCell = {
  kind: 'string';
  value: string;
};
// No IntCell for now as not supported by @iarna/toml and maybe not needed
type FloatCell = {
  kind: 'float';
  value: number;
};
type BooleanCell = {
  kind: 'boolean';
  value: boolean;
};
type OffsetDateTimeCell = {
  kind: 'offset-date-time';
  value: OffsetDateTime;
};
type DateTimeCell = {
  kind: 'date-time';
  value: LocalDateTime;
};
type DateCell = {
  kind: 'date';
  value: LocalDate;
};
type TimeCell = {
  kind: 'time';
  value: LocalTime;
};

export type Cell = 
  | NoneCell
  | StringCell
  | FloatCell
  | BooleanCell
  | OffsetDateTimeCell
  | DateTimeCell
  | DateCell
  | TimeCell;

export type CellKind = Cell['kind'];

// Position is a A1 syntax string by users (no colon)
export type Position = string;

// Coord is [0, 0] syntax, 0 indexed
export type Coord = {
  row: number;
  col: number;
}

// 1d array of cells
export type SheetArray = Cell[];
// 2d array/grid of cells
export type SheetMatrix = Cell[][];
// same as matrix but represents all the data
export type SheetData = SheetMatrix;
