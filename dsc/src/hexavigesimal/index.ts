const mapATo0 = new Map([
  ["A", "0"],
  ["B", "1"],
  ["C", "2"],
  ["D", "3"],
  ["E", "4"],
  ["F", "5"],
  ["G", "6"],
  ["H", "7"],
  ["I", "8"],
  ["J", "9"],
  ["K", "A"],
  ["L", "B"],
  ["M", "C"],
  ["N", "D"],
  ["O", "E"],
  ["P", "F"],
  ["Q", "G"],
  ["R", "H"],
  ["S", "I"],
  ["T", "J"],
  ["U", "K"],
  ["V", "L"],
  ["W", "M"],
  ["X", "N"],
  ["Y", "O"],
  ["Z", "P"],
]);

const map0ToA = new Map([
  ["0", "a"],
  ["1", "b"],
  ["2", "c"],
  ["3", "d"],
  ["4", "e"],
  ["5", "f"],
  ["6", "g"],
  ["7", "h"],
  ["8", "i"],
  ["9", "j"],
  ["a", "k"],
  ["b", "l"],
  ["c", "m"],
  ["d", "n"],
  ["e", "o"],
  ["f", "p"],
  ["g", "q"],
  ["h", "r"],
  ["i", "s"],
  ["j", "t"],
  ["k", "u"],
  ["l", "v"],
  ["m", "w"],
  ["n", "x"],
  ["o", "y"],
  ["p", "z"],
]);

const BASE = 26;

export const toSb26 = (num: number): string => {
  if (num < 0) {
    throw new Error('column positions cannot be negative');

  } else if (num < 26) { // 26
    const with0AsFirst = num.toString(BASE);
    return with0AsFirst.split('').map(char => map0ToA.get(char)).join('').toUpperCase();

  } else if (num < 702) { // (26^2)+26  [AAA]
    const missingNumbers = BASE;
    let with0AsFirst = (num - missingNumbers).toString(BASE);
    if (with0AsFirst.length < 2) {
      with0AsFirst = '0' + with0AsFirst;
    }
    return with0AsFirst.split('').map(char => map0ToA.get(char)).join('').toUpperCase();

  } else if (num < 17602) { // (26^3)+26  [AAAA]
    const missingNumbers = BASE + (BASE ** 2);
    let with0AsFirst = (num - missingNumbers).toString(BASE);
    while (with0AsFirst.length < 3) {
      with0AsFirst = '0' + with0AsFirst;
    }
    return with0AsFirst.split('').map(char => map0ToA.get(char)).join('').toUpperCase();
  }

  // TODO figure out the general formula for this
  throw new Error('column positions must be 17601 (ZZZ) or less');
};

export const fromSb26 = (sb26: string): number => {
  // calculate missing numbers because there is no 0 in spreadsheet base 26
  let sb26Digits = sb26.length;
  let missingNumbers = 0;
  while (sb26Digits > 1) {
    sb26Digits -= 1;
    missingNumbers += BASE ** sb26Digits;
  }
  // convert from A-Z to 0-9 as first (JS style hexavisigesimal)
  const with0AsFirst = sb26.split('').map(char => mapATo0.get(char)).join('');
  return parseInt(with0AsFirst, BASE) + missingNumbers;

};
