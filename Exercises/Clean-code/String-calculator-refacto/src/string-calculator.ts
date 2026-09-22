function getNegativeArray(numbers: string) {
  return numbers.match(/[\-]\d/g);
}

function getNumberAboveThan(limit:number, numbers: string) {
  return numbers.match(/\b(?!"+limit+"\b)[0-9]{4,}\b/g);
}

function getArrayOfNumbers(numbers: string) {
  return numbers.match(/-?\d+/g);
}

function getCleanedArray(numbers: string) {
  if (null !== getNegativeArray(numbers)) {
    throw new Error('negatives not allowed: ' + getNegativeArray(numbers)?.join(', '));
  }

  if (null !== getNumberAboveThan(1002, numbers)) {
    return getArrayOfNumbers(numbers)?.filter((el) => !getNumberAboveThan(1002,numbers)?.includes(el));
  }
  
  return getArrayOfNumbers(numbers);
}

function summedNumberFromArray(){

}

function getResult(numbers: string):number | undefined {

  const numbersArray:number[] = getCleanedArray(numbers).slice(0,3);


  return numbersArray?.reduce((accumulator: any, currentValue: any) => 
    Number(accumulator) + 
    Number( currentValue%10==0 ? currentValue*2 : currentValue), 
    0,)
}

export function summedNumberInString(numbers: string): number|undefined {
  if (numbers === '') return 0;

  return getResult(numbers);
}
