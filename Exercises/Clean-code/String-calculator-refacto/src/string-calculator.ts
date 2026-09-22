const maxNumber = 1000

export function add(input: string): number {

    if (input === '') {
        return 0;
    }

    if (input.startsWith('//')) {
        let delimiter = getStartDelimiter(input);
        let content = getContent(input);
        if (input.charAt(2) === '[') {
            delimiter = getEndDelimiter(input);
            content = getFullContent(input);
        }

        if (input.charAt(2) === '[' && input.indexOf('][') !== -1) {
            const delimiterDeclaration  = input.substring(2, input.indexOf(']\n') + 1);
            content = input.substring(input.indexOf(']\n') + 2);
            const delimiters  = delimiterDeclaration .substring(1, delimiterDeclaration .length - 1).split('][');
            for (const one of delimiters ) {
                content = content.split(one).join(',');
            }
            delimiter = ',';
        }
        const parts = content.split(delimiter);

        return calculateTotal(parts, maxNumber);
    }

    if (input.includes(',') || input.includes('\n')) {
        const commaSeparatedParts = input.split(',');
        const parts = [];

        for (const p of commaSeparatedParts) {
            const subParts = p.split('\n');

            for (const subPart of subParts) {
                parts.push(subPart);
            }
        }

        return calculateTotal(parts, maxNumber);
    }
    return Number(input);
}


function getStartDelimiter(input: string) {
    return input.charAt(2);
}

function getContent(input: string) {
    return input.substring(4);
}

function getEndDelimiter(input: string) {
    return input.substring(3, input.indexOf(']'));
}

function getFullContent(input: string) {
    return input.substring(input.indexOf(']') + 2);
}

function calculateTotal(parts: string[], maxNumber: number): number {
    let total = 0;
    const negatives: number[] = [];

    for (const part of parts) {
        const number = Number(part);

        if (number < 0) {
            negatives.push(number);
        }

        if (number <= maxNumber) {
            total += number;
        }
    }

    if (negatives.length > 0) {
        throw new Error(
            'negatives not allowed: ' + negatives.join(', ')
        );
    }

    return total;
}