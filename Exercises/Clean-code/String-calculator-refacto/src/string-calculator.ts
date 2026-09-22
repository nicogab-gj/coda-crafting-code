const MAX_ALLOWED_NUMBER = 1000;

export function add(numbers: string): number {
  if (numbers === '') return 0;
  if (numbers.startsWith('//')) {
    let delimiter = numbers.charAt(2);
    let body = numbers.substring(4);
    if (delimiter === '[') {
      delimiter = numbers.substring(3, numbers.indexOf(']'));
      body = numbers.substring(numbers.indexOf(']') + 2);
    }
    if (numbers.charAt(2) === '[' && numbers.includes('][')) {
      const h = numbers.substring(2, numbers.indexOf(']\n') + 1);
      body = numbers.substring(numbers.indexOf(']\n') + 2);
      const declared = h.substring(1, h.length - 1).split('][');
      for (const one of declared) {
        body = body.split(one).join(',');
      }
      delimiter = ',';
    }
    const parts = body.split(delimiter);
    return sumNumbers(parts);
  }
  if (numbers.includes(',') || numbers.includes('\n')) {
    const parts = numbers.replaceAll('\n', ',').split(',');
    return sumNumbers(parts);
  }
  return Number(numbers);
}

function sumNumbers(parts: string[]) : number {
  let total = 0;
  const negatives = [];
  for (const part of parts) {
    const number = Number(part)

    if (number < 0) {
      negatives.push(number);
    }

    if (number <= MAX_ALLOWED_NUMBER) {
      total += number;
    }
  }

  if (negatives.length > 0) {
    throw new Error('negatives not allowed: ' + negatives.join(', '));
  }

  return total;
}