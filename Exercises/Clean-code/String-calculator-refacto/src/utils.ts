import { checkExigence } from "./check/checkExigence";
import { notAllowNegativeNumber } from "./notAllowNegativeNumber";
import { Somme_Total } from "./Operation/Somme_Total";
import { SommeParts } from "./Operation/SommeParts";

export function SommeTotal(input: string) {
    let deli = input.charAt(2);
    let body = input.substring(4);

    let total = 0;
    const negatives: number[] = [];

    ({ deli, body } = checkExigence(deli, input, body));

    total = SommeParts(body, deli, negatives, total);
    notAllowNegativeNumber(negatives);
    return total;
}

export function SommeTotal_EntreDeuxVariable(input: string) {
    const MIN_MUMBER = 0;
    const MAX_NUMBER = 1000

    let total = 0;
    const negatives: number[] = [];

    const pList = input.split(',');

    total = Somme_Total(pList, MIN_MUMBER, MAX_NUMBER, total, negatives,);

    notAllowNegativeNumber(negatives);
    return total;
}