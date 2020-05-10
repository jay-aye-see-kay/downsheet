import { ok, equal, deepStrictEqual } from "assert";
import * as fs from 'fs';
import * as path from 'path';

import { formatDownsheet } from '../index';

const testsPath = path.join(__dirname, './test-files');
const tests = fs.readdirSync(testsPath);


describe('e2e formating tests', () => {
  tests.forEach(testName => {
    it(testName, () => {
      const expectedPath = path.join(testsPath, testName, 'out.dsh');
      ok(expectedPath);
      const expected = fs.readFileSync(expectedPath, 'utf8');

      const testInputPath = path.join(testsPath, testName, 'in.toml');
      ok(testInputPath);
      const inputString = fs.readFileSync(testInputPath, 'utf8');

      const result = formatDownsheet(inputString);
      equal(result, expected);
    });
  });
})
