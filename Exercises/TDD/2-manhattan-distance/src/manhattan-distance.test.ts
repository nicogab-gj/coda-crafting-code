import { describe, expect, it } from 'vitest';
type Point = [number,number]

type Trajet = [Point, Point]

describe('manhattan distance kata', () => {
  it('runs the test suite', () => {
    expect(true).toBe(true);
  });

  it('test with (0,0)(0,0)', () => {
    manhattanDistanceTest([[0,0],[0,0]], 0);
  });
  it('test with (0,0)(1,0)', () => {
    manhattanDistanceTest([[0,0],[1,0]], 1);
  });

  it('test with (0,0)(0,1)', () => {
    manhattanDistanceTest([[0,0],[0,1]], 1);
  });

  it('test with (0,0)(4,0)', () => {
    manhattanDistanceTest([[0,0],[4,0]], 4);
  });

  it('test with (0,0)(0,3)', () => {
    manhattanDistanceTest([[0,0],[0,3]], 3);
  });

  it('test with (0,0)(0,-3)', () => {
    manhattanDistanceTest([[0,0],[0,-3]], 3);
  });

  it('test with (0,0)(2,2)', () => {
    manhattanDistanceTest([[0,0],[2,2]], 4);
  });

  it('test with (0,0)(-2,2)', () => {
    manhattanDistanceTest([[0,0],[-2,2]], 4);
  });

  it('test with (2,0)(0,0)', () => {
    manhattanDistanceTest([[2,0],[0,0]], 2);
  });

    it('test with (2,2)(0,0)', () => {
    manhattanDistanceTest([[2,2],[0,0]], 4);
  });

  it('test with (2,2)(2,2)', () => {
    manhattanDistanceTest([[2,2],[2,2]], 0);
  });

  it('test with (2,2)(4,8)', () => {
    manhattanDistanceTest([[2,2],[4,8]], 8);
  });
  
  it('test with (-1,-2)(2,3)', () => {
    manhattanDistanceTest([[-1,-2],[2,3]], 8);
  });

});

const manhattanDistanceTest = (trajet:Trajet,dist:number) => {
    const result = manhattanDistance(trajet);
    expect(result).toEqual(dist);
}


const manhattanDistance = (trajet:Trajet)=>{
  let start:Point = trajet[0] 
  let end:Point = trajet[1]

  for (let i:number = 0; i < end.length; i++) {
    if(start[i]!=0){
      end[i] -= start[i];
      start[i] = 0;
    }
  }

  for (let i:number = 0; i < end.length; i++) {
    if(end[i]<0){
      end[i]*=-1
    }
  }

  if(end[0]!=0 || end[1]!=0 ){
    return end[0]+end[1]
  }

  return 0
}