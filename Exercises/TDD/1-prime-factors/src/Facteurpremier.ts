import { mvp } from "./mvp";

export const Facteurpremier = (n: number) => {
    let current = n;
    let List: number[] = []

    if (current === 1) return []
    if (current === 2) return [2]
    if (current === 3) return [3]

    mvp(current, List);

    if (current > 1) List.push(current)

    return List;
};  