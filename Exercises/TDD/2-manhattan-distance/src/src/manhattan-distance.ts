/*
 * Copyright (c) Axe. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export function manhattan(Lists: [number, number], Lists2: [number, number]) {
    if (Lists[0] === 0 && Lists[1] === 0 && Lists2[0] === 0 && Lists2[1] === 0) {
        return [0, 0]
    }
    let List_DistanceParAxe: [number, number]
    List_DistanceParAxe = [Lists2[1] - Lists[1], Lists2[0] - Lists[0]]
    let somme = [List_DistanceParAxe[0] + List_DistanceParAxe[1]]
    return somme
}