function getNegativeArray(numbers: string) {
  return numbers.match(/[\-]\d/g);
}

function getNumberAbove1000(numbers: string) {
  return numbers.match(/\b(?!1000\b)[0-9]{4,}\b/g);
}

function getArrayOfNumbers(numbers: string) {
  return numbers.match(/-?\d+/g);
}

function getCleanedArray(numbers: string) {
  if (null !== getNegativeArray(numbers)) {
    throw new Error('negatives not allowed: ' + getNegativeArray(numbers)?.join(', '));
  }

  if (null !== getNumberAbove1000(numbers)) {
    return getArrayOfNumbers(numbers)?.filter((el) => !getNumberAbove1000(numbers)?.includes(el));
  }

  return getArrayOfNumbers(numbers);
}

function getResult(numbers: string):number | undefined {
  return getCleanedArray(numbers)?.reduce((accumulator: any, currentValue: any) => Number(accumulator) + Number(currentValue),
      0,)
}

export function summedNumberInString(numbers: string): number|undefined {
  if (numbers === '') return 0;

  return getResult(numbers);
}
