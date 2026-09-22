export function SommeParts(body: string, deli: string, negatives: number[], total: number) {
    const parts = body.split(deli);

    for (const part of parts) {
        if (Number(part) < 0) {
            negatives.push(Number(part));
        }
        if (Number(part) <= 1000) {
            total += Number(part);
        }
    }

    return total;
}
