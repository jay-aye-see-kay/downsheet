import { strict as a } from "assert"

import { Cell, SheetData } from "../types";
import { stringify } from "./index";

const cn: Cell = { kind: 'none' };
const c0: Cell = { kind: 'float', value: 0 };
const c1: Cell = { kind: 'float', value: 1 };
const cs: Cell = { kind: 'string', value: 'FooBar' };

const sheets: Record<string, SheetData> = {
  oneSquare: [ [cn] ],
  identity: [ [c1,c0], [c0,c1] ],
  mixedWidths: [ [cs,cn,cn], [c0,cs,c0], [c1,c1,cs] ],
};

const expected = {
  oneSquare: `data = [
  # A
  [ "" ], # 1
]
`,
  identity: `data = [
  # A  B
  [ 1, 0 ], # 1
  [ 0, 1 ], # 2
]
`,
  mixedWidths: `data = [
  # A         B         C
  [ "FooBar", "",       ""       ], # 1
  [ 0,        "FooBar", 0        ], # 2
  [ 1,        1,        "FooBar" ], # 3
]
`,
};

describe('stringify module', () => {
  describe('stringify()', () => {
    it('can stringify a 1x1 matrix', () => {
      a.deepEqual(stringify(sheets.oneSquare), expected.oneSquare);
    });
    it('can stringify an identity matrix', () => {
      a.deepEqual(stringify(sheets.identity), expected.identity);
    });
    it('can stringify a matrix with mixed with columns', () => {
      a.deepEqual(stringify(sheets.identity), expected.identity);
    });
  });
});
