import Toml from '@iarna/toml';

import {
  isOffsetDateTime,
  isLocalDateTime,
  isLocalDate,
  isLocalTime,
  OffsetDateTime,
  LocalDateTime,
  LocalDate,
  LocalTime,
} from '../types';
import { Cell, SheetData } from '../types';


type ParsedCell =
  | boolean
  | string
  | number
  | OffsetDateTime
  | LocalDateTime
  | LocalDate
  | LocalTime;

export const convertCell = (cell: ParsedCell): Cell => {
  if (cell === '') {
    return { kind: 'none' }

  } else if (cell instanceof Date && isLocalTime(cell)) {
    return { kind: 'time', value: cell };

  } else if (cell instanceof Date && isLocalDate(cell)) {
    return { kind: 'date', value: cell };

  } else if (cell instanceof Date && isLocalDateTime(cell)) {
    return { kind: 'date-time', value: cell };

  } else if (cell instanceof Date && isOffsetDateTime(cell)) {
    return { kind: 'offset-date-time', value: cell };
  }

  switch (typeof cell) {
    case 'boolean':
      return { kind: 'boolean', value: cell };

    case 'string':
      return { kind: 'string', value: cell };

    case 'number':
      return { kind: 'float', value: cell };
  }
}

export const parse = (dsString: string): SheetData => {
  const asJson = Toml.parse(dsString);
  const data = asJson.data as ParsedCell[][]; // FIXME io-ts or something

  const sheetWidth = Math.max(...data.map(row => row.length));

  const sheetData = data.map(row => {
    while (row.length < sheetWidth) {
      row.push('');
    }
    return row.map(c => convertCell(c));
  });

  return sheetData;
}
