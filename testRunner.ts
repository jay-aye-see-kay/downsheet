import * as fs from 'fs';
import * as path from 'path';

import { formatDownsheet } from './src/index';

const testsPath = path.join(__dirname, 'tests');
const tests = fs.readdirSync(testsPath);

tests.forEach(testName => {
  console.log(`running test: ${testName}...`);
  const testInputPath = path.join(testsPath, testName, 'in.toml');
  const testOutputPath = path.join(testsPath, testName, 'out.dsh');
  try {
    fs.accessSync(testInputPath);
    fs.accessSync(testOutputPath);
  } catch (e) {
    console.log(`Could not access in.toml and out.ds for test ${testName}`);
    throw e;
  }
  const inputString = fs.readFileSync(testInputPath, 'utf8');
  const expectedString = fs.readFileSync(testOutputPath, 'utf8');
  const result = formatDownsheet(inputString);

  if (result === expectedString) {
    console.log('pass');
  } else {
    console.error(`### Test failed, expected:
${expectedString}

### But recieved:
${result} `);
  }
});

