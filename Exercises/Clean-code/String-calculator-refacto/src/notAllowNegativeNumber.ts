export function notAllowNegativeNumber(numbernegatives: number[]) {
    if (numbernegatives.length > 0) {
        throw new Error('negatives not allowed: ' + numbernegatives.join(', '));
    }
}
