import { strict as a } from "assert"

import { process } from './parser';

describe('calc parser', () => {
  // basic operators
  it('should calc 1+1', () => a.equal(process('1+1', []), 2));
  it('should calc 10-1', () => a.equal(process('10-1', []), 9));
  it('should calc 5*5', () => a.equal(process('5*5', []), 25));
  it('should calc 125/5', () => a.equal(process('125/5', []), 25));
  // operator precedence
  it('should calc 1+1*5', () => a.equal(process('1+1*5', []), 6));
  it('should calc (1+1)*5', () => a.equal(process('(1+1)*5', []), 10));
});
