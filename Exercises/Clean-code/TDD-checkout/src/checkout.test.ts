import { describe, expect, it } from 'vitest'
import { addPanier, getPanier, search } from './checkout';

describe('checkout kata', () => {
  it('runs the test suite', () => {
    expect(addPanier(
      {
        "name": "Oeuf",
        "offre": "",
        "prix": 20
      }
    )).toBe(true);
  });

  it('List du panier', () => {
    expect(getPanier()).toBe(true);
  });

  it('test search', () => {
    expect(search("Paumme")).toBe(true);
  });
})
