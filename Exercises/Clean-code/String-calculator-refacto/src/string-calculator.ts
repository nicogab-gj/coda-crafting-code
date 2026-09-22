export function stringCalculator(input: string): number {
  if (input === "") return 0;

  if (hasDelimiters(input)) {
    let expression = { Delimiters: input.charAt(2), Body: input.substring(4) };

    if (hasSeveralCustomDelimiters(input)) {
      const extractedDelimiters = extractCustomDelimiters(input);
      expression.Delimiters = extractedDelimiters.inputDelimiters;
      expression.Body = extractedDelimiters.inputBody;
    } else if (hasOneCustomDelimiters(input)) {
      expression.Delimiters = input.substring(3, input.indexOf("]"));
      expression.Body = input.substring(input.indexOf("]") + 2);
    }
    const bodyTable = expression.Body.split(expression.Delimiters);
    return respectRules(bodyTable);
  }

  if (input.includes(",") || input.includes("\n")) {
    const bodyTable = input.split(/[,\n]/);
    return respectRules(bodyTable);
  }
  return Number(input);
}

function hasDelimiters(input: string) {
  return input.startsWith("//");
}

function respectRules(subParts: string[]) {
  let sommeNumber = 0;
  const negativesTable = [];

  for (const subPart of subParts) {
    if (Number(subPart) < 0) {
      negativesTable.push(Number(subPart));
    }
    if (Number(subPart) <= 1000) {
      sommeNumber += Number(subPart);
    }
  }
  if (negativesTable.length > 0) {
    throw new Error("negatives not allowed: " + negativesTable.join(", "));
  }
  return sommeNumber;
}

function extractCustomDelimiters(input: string) {
  const delimitersExpression = input.substring(2, input.indexOf("]\n") + 1);
  let inputBody = input.substring(input.indexOf("]\n") + 2);
  const delimitersTable = delimitersExpression
    .substring(1, delimitersExpression.length - 1)
    .split("][");
  for (const delimiter of delimitersTable) {
    inputBody = inputBody.split(delimiter).join(",");
  }
  return { inputDelimiters: ",", inputBody };
}

function hasSeveralCustomDelimiters(input: string) {
  return hasOneCustomDelimiters(input) && input.includes("][");
}

function hasOneCustomDelimiters(input: string) {
  return input.charAt(2) === "[";
}
