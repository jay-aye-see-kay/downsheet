import { strict as a } from "assert"

import { fromSb26, toSb26 } from './index';

// found imperically (counting cells in libre office)
const knownValues = {
  A: 0,
  B: 1,
  J: 9,
  Z: 25,
  AA: 26,
  AZ: 51,
  IV: 255,
  RG: 474,
  ZZ: 701,
  AAA: 702,
  AMJ: 1023,
  XFD: 16383, // looked up max size of .xlsx file
};

describe('hexavisigesimal conversion', () => {
  describe('toSb26()', () => {
    Object.entries(knownValues).forEach(([sb26, decimal]) => {
      it(`should convert ${decimal} to ${sb26}`, () => {
        a.equal(toSb26(decimal), sb26)
      });
    });
  });

  describe('fromSb26()', () => {
    Object.entries(knownValues).forEach(([sb26, decimal]) => {
      it(`should convert ${sb26} to ${decimal}`, () => {
        a.equal(fromSb26(sb26), decimal)
      });
    });
  });
});
