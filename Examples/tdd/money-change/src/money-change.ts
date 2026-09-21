export const computeChange = (amount: number) => {
  let fiveCoins = 0;
  let currentAmount = amount;

  while (currentAmount >= 5) {
    fiveCoins += 1;
    currentAmount -= 5;
  }
  return [currentAmount, fiveCoins];
};
