import { strict as a } from "assert"
import Toml from '@iarna/toml';

import { parse, convertCell } from './index';
import { Cell, OffsetDateTime, LocalDateTime, LocalDate, LocalTime } from '../types';


// https://github.com/iarna/iarna-toml/blob/latest/lib/create-datetime.js
const odtString = '1979-05-27T00:32:00-07:00';
const odtObject = new Date(odtString);

// https://github.com/iarna/iarna-toml/blob/latest/lib/create-datetime-float.js
const ldtString = '1989-05-27T00:32:00.000';
const ldtObject = new Date(ldtString + 'Z');
(ldtObject as LocalDateTime).isFloating = true;

// https://github.com/iarna/iarna-toml/blob/latest/lib/create-date.js
const ldString = '1979-05-27';
const ldObject = new Date(ldString);
(ldObject as LocalDate).isDate = true;

// https://github.com/iarna/iarna-toml/blob/latest/lib/create-time.js
const ltString = '05:32:00.000';
const ltObject = new Date('0000-01-01T' + ltString);
(ltObject as LocalTime).isTime = true;

const cells = {
  none: { kind: 'none' },
  bool: { kind: 'boolean', value: true },
  str: { kind: 'string', value: 'string!' },
  float: { kind: 'float', value: 99.9 },
  odt: { kind: 'offset-date-time', value: odtObject },
  ldt: { kind: 'date-time', value: ldtObject },
  ld: { kind: 'date', value: ldObject },
  lt: { kind: 'date', value: ltObject },
};

type TestData = {
  none: string;
  bool: boolean;
  str: string;
  float: number;
  odt: OffsetDateTime;
  ldt: LocalDateTime;
  ld: LocalDate;
  lt: LocalTime;
};

const sampleToml = `
none=''
bool=${cells.bool.value}
str='${cells.str.value}'
float=${cells.float.value}
odt=${odtString}
ldt=${ldtString}
ld=${ldString}
lt=${ltString}
`;
const td = Toml.parse(sampleToml) as TestData;

describe('Parse module', () => {
  describe('convertCell()', () => {
    it('should parse an empty string as none', () => {
      a.deepEqual(convertCell(td.none), cells.none);
    });
    it('should parse a boolean', () => {
      a.deepEqual(convertCell(td.bool), cells.bool);
    });
    it('should parse a string', () => {
      a.deepEqual(convertCell(td.str), cells.str);
    });
    it('should parse a float', () => {
      a.deepEqual(convertCell(td.float), cells.float);
    });
    it('should parse an offset date time', () => {
      a.deepEqual(convertCell(td.odt), cells.odt);
    });
    it('should parse a local date time', () => {
      const parsedCell = convertCell(td.ldt);
      if (parsedCell.kind !== 'date-time') throw new Error();
      a.equal(parsedCell.value.toISOString(), ldtString);
    });
    it('should parse a local date', () => {
      const parsedCell = convertCell(td.ld);
      if (parsedCell.kind !== 'date') throw new Error();
      a.equal(parsedCell.value.toISOString(), ldString);
    });
    it('should parse a local time', () => {
      const parsedCell = convertCell(td.lt);
      if (parsedCell.kind !== 'time') throw new Error();
      a.equal(parsedCell.value.toISOString(), ltString);
    });
  });

  describe('parse()', () => {
    const c0: Cell = { kind: 'float', value: 0 };
    const c1: Cell = { kind: 'float', value: 1 };
    const cn: Cell = { kind: 'none' };
    const cs: Cell = { kind: 'string', value: 's' };

    it('should parse an identity matrix', () => {
      const sheet = `[data]\ngrid = [ [ 0, 1 ], [ 1, 0 ] ]`;
      const expected = { data: [[c0,c1],[c1,c0]] };
      a.deepEqual(parse(sheet), expected);
    });
    it('should pad out to a rectange', () => {
      const sheet = `[data]\ngrid = [ [ 's' ], [ 0, 0, 0 ] ]`;
      const expected = { data: [[cs,cn,cn],[c0,c0,c0]] };
      a.deepEqual(parse(sheet), expected);
    });
    it('should treat \'\' as none', () => {
      const sheet = `[data]\ngrid = [ [ '' ] ]`;
      const expected = { data: [[cn]] };
      a.deepEqual(parse(sheet), expected);
    });
  });
});
