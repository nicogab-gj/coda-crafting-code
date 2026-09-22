export function addPositifNumberFromString(numbers_to_string: string): number {

  if (numbers_to_string === '') return 0;

  if (numbers_to_string.startsWith('//')) {
    

    const numbers_strings = makeNumberStringListFromString(numbers_to_string);
    let total = 0;
    
    throwNegativeErrorFromList(numbers_strings)

    const filtered_numbers_strings = filterNumbersInRange(0, 1000, numbers_strings);
    total = addNumberFromStringsList(filtered_numbers_strings);

    return total;
  }

  if (numbers_to_string.includes(',') || numbers_to_string.includes('\n')) {
    const pList = numbers_to_string.split(',');
    let t = 0;
    const negatives = [];

    for (const p of pList) {
      const subParts = p.split('\n');

      for (const subPart of subParts) {

        if (Number(subPart) < 0) {
          negatives.push(Number(subPart));
        }

        if (Number(subPart) <= 1000) {
          t += Number(subPart);
        }

      }
    }

    if (negatives.length > 0) {
      throw new Error('negatives not allowed: ' + negatives.join(', '));
    }

    return t; 
  }
  
  return Number(numbers_to_string);
}


const filterNumbersGreaterThan = (greater_limit:number, numbers_list:string[]) => {
  return numbers_list.filter(n => n < greater_limit);
} 


const filterNumbersLowerThan = (lower_limit:number, numbers_list:string[]) => {
  return numbers_list.filter(n => n > lower_limit);
} 


const filterNumbersInRange = (lower_limit:number, greater_limit:number, numbers_list:string[]) =>{
  let filterderList:string[];
  filterderList = filterNumbersLowerThan(lower_limit, numbers_list)
  filterderList = filterNumbersGreaterThan(greater_limit, filterderList)
  return filterderList
}


const pushNegativesToList = (numbers_list:string[], warn_list:string[]) => {
  for (const number of numbers_list) {
    if (Number(number) < 0) {
      warn_list.push(Number(number));
    }
  }
}


const throwNegativeErrorFromList = (numbers_list:string[]) =>{
  const negatives = [];
  pushNegativesToList(numbers_list, negatives);
  if (negatives.length > 0) {
    throw new Error('negatives not allowed: ' + negatives.join(', '));
  }
}


const addNumberFromStringsList = (numbers_list:string[]) => {
  let total:number = 0;
  for (const number of numbers_list) {
      total += Number(number);
  }
  return total;
}


const makeNumberStringListFromString = (numbers_to_string:string) => {
  let deli:string;
  let body:string[];

  if (numbers_to_string.startsWith('//')) {
    deli = numbers_to_string.charAt(2);
    body = numbers_to_string.substring(4);

    if (numbers_to_string.charAt(2) === '[') {
      deli = numbers_to_string.substring(3, numbers_to_string.indexOf(']'));
      body = numbers_to_string.substring(numbers_to_string.indexOf(']') + 2);
    }

    if (numbers_to_string.charAt(2) === '[' && numbers_to_string.indexOf('][') !== -1) {
      const h = numbers_to_string.substring(2, numbers_to_string.indexOf(']\n') + 1);
      body = numbers_to_string.substring(numbers_to_string.indexOf(']\n') + 2);
      const declared = h.substring(1, h.length - 1).split('][');

      for (const one of declared) {
        body = body.split(one).join(',');
      }

      deli = ',';
    }
  }

  return body.split(deli);
}