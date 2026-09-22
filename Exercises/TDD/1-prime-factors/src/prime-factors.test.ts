import { describe, expect, it } from 'vitest'

describe('prime factors kata', () => {

  it('runs the test suite', () => {
    expect(true).toBe(true)
  })

  it('test with 0', () =>{
    primeFactorTest(0, [])
  })

  it('test with 1', () =>{
    primeFactorTest(1, [])
  })

  it('test with 2', () =>{
    primeFactorTest(2, [2])
  })

  it('test with 3', () =>{
    primeFactorTest(3, [3])
  })

  it('test with 4', () =>{
    primeFactorTest(4, [2,2])
  })

  it('test with 8', () =>{
    primeFactorTest(8, [2,2,2])
  })

  it('test with 6', () =>{
    primeFactorTest(6, [2,3])
  })

  it('test with 27', () =>{
    primeFactorTest(27, [3,3,3])
  })

  it('test with 5', () =>{
    primeFactorTest(5, [5])
  })

  it('test with 25', () =>{
    primeFactorTest(25, [5,5])
  })

  it('test with 15', () =>{
    primeFactorTest(15, [3,5])
  })

  it('test with 7', () =>{
    primeFactorTest(7, [7])
  })

  it('test with 14', () =>{
    primeFactorTest(14, [2,7])
  })

  it('test with 70', () =>{
    primeFactorTest(70, [2, 5, 7])
  })

})

const primeFactorTest = (input:number,output:number[]) => {
    const result = primeFactor(input);
    expect(result).toEqual(output);
}

const primeFactor = (input:number) =>{
  const prime_list:number[] = [2,3,5,7]
  let output:number[] = []
  let current_intput:number = input
  if (input === 0){return []}
  for(let i in prime_list) {
    while (current_intput%prime_list[i]==0) {
      output.push(prime_list[i])
      current_intput = current_intput/prime_list[i]
    }
  }

  return output
}