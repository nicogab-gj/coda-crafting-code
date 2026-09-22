export function Somme_Total(pList: string[], MIN_MUMBER: number, MAX_NUMBER: number, total: number, negatives: number[]) {

    for (const PartsList of pList) {
        const subParts = PartsList.split('\n');
        for (const subPart of subParts) {
            if (Number(subPart) < MIN_MUMBER) {
                negatives.push(Number(subPart));
            }
            if (Number(subPart) <= MAX_NUMBER) {
                total += Number(subPart);
            }
        }
    }

    return total;
}
