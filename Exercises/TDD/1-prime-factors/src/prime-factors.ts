export function primeFactors(number: number): number[] {
    const factors: number[] = []
    if (number ===1){
        return []
    }
   
    while (number % 2 === 0){
        factors.push(2)
        number = number/2
    }
    while(number % 3 === 0){
        factors.push(3)
        number = number/3
    }
    if (number > 1) {
       factors.push(number)
    }
    return factors
    
}