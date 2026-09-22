export function mvp(current: number, List: number[]) {
    let number = [2, 3, 5];

    number.forEach(element => {
        while (current % element === 0) {
            List.push(element);
            current = current / element;
        }
    });
}
