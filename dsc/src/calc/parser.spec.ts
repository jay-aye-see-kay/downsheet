import { strict as a } from "assert"

import { cellEqual } from '../testHelpers';
import { evalFormula } from './parser';
import { Cell } from "../types";

const cell2: Cell = { kind: 'float', value: 2 }
const cell6: Cell = { kind: 'float', value: 6 }
const cell9: Cell = { kind: 'float', value: 9 }
const cell10: Cell = { kind: 'float', value: 10 }
const cell25: Cell = { kind: 'float', value: 25 }

describe('calc parser', () => {
  // basic operators
  it('should calc 1+1', () => cellEqual(evalFormula('1+1', []), cell2));
  it('should calc 10-1', () => cellEqual(evalFormula('10-1', []), cell9));
  it('should calc 5*5', () => cellEqual(evalFormula('5*5', []), cell25));
  it('should calc 125/5', () => cellEqual(evalFormula('125/5', []), cell25));
  // // operator precedence
  it('should calc 1+1*5', () => cellEqual(evalFormula('1+1*5', []), cell6));
  it('should calc (1+1)*5', () => cellEqual(evalFormula('(1+1)*5', []), cell10));
});
