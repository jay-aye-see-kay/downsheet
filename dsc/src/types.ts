// more accurate types for working with @iarna/toml results
export type OffsetDateTime = Date;
export interface LocalDateTime extends Date { isFloating: true }
export interface LocalDate extends Date { isDate: true }
export interface LocalTime extends Date { isTime: true }

export const isOffsetDateTime = (date: Date): date is OffsetDateTime =>
  !(date as LocalDateTime).isFloating &&
  !(date as LocalDate).isDate &&
  !(date as LocalTime).isTime;

export const isLocalDateTime = (date: Date): date is LocalDateTime =>
  !!(date as LocalDateTime).isFloating;

export const isLocalDate = (date: Date): date is LocalDate =>
  !!(date as LocalDate).isDate;

export const isLocalTime = (date: Date): date is LocalTime =>
  !!(date as LocalTime).isTime;


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
// the parsed file data
export type SheetFile = {
  formula?: Record<string, string>;
  labels?: Record<string, string>;
  data: SheetMatrix;
};

export type RangeIO = Cell | SheetArray | SheetMatrix;

export const isCell = (r: RangeIO): r is Cell =>
  !Array.isArray(r);

export const isSheetArray = (r: RangeIO): r is SheetArray =>
  Array.isArray(r) && !Array.isArray(r[0]);

export const isSheetMatrix = (r: RangeIO): r is SheetMatrix =>
  Array.isArray(r) && Array.isArray(r[0]);
