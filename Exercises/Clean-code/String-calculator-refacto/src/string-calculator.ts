function calcul (numbers :string[]):number{
    let total = 0;
    const max = 1000;
    const negatives:number[] = [];
    for (const part of numbers) {
      const value = Number(part)
      if (value < 0) {
        negatives.push(value);
      }
      if (value <= max) {
        total += value ;
      }
    }
     if (negatives.length > 0) {
      throw new Error('negatives not allowed: ' + negatives.join(', '));
    }
    return total;
  }



export function add(numbers: string): number {
  if (numbers === ''){
    return 0;
  }

  if (numbers.startsWith('//')) {
    let delimiter = numbers.charAt(2);
    let body = numbers.substring(4);
    if (numbers.charAt(2) === '[') {
      delimiter = numbers.substring(3, numbers.indexOf(']'));
      body = numbers.substring(numbers.indexOf(']') + 2);
    }

    if (numbers.charAt(2) === '[' && numbers.indexOf('][') !== -1) {
      const h = numbers.substring(2, numbers.indexOf(']\n') + 1);
      body = numbers.substring(numbers.indexOf(']\n') + 2);
      const declared = h.substring(1, h.length - 1).split('][');

      for (const one of declared) {
        body = body.split(one).join(',');
      }
      delimiter = ',';
    }
    const parts = body.split(delimiter);
    return calcul(parts);
  
    
   
  }

    if (numbers.includes(',') || numbers.includes('\n')) {
   const parts = numbers.split(/[,\n]/);

   return calcul(parts);
  }
  
  return Number(numbers);
}
