
// this function calculates the minimum capital needed to invested into doge according to the price of doge/btc and btc/usd and factor those numbers with the minimum trade rate for doge, includes the fee rate for both coinbase and trade for exchange rate, includes premimum markup rate for buying btc on coinbase.
const calcMinCapital = (dogePrice, btcPrice) => {
  const minTradeRate = 50000;
  const feeRate = 0.002;
  const coinbaseFee = 0.015;
  let counter = 0;

  for(let i = dogePrice; i >= 1; i--) {
    counter += (minTradeRate * 2 * feeRate) + minTradeRate * 2;
  }

  let total = (btcPrice * 0.0033 * counter);
  total = (total * coinbaseFee) + total

  function cryptoFormat(num) {
        

    if(num < 0) {
      num = Math.abs(num)
      num = num.toString();
      return num.length <= 8 
        ? '-0.' + '0'.repeat(8 - num.length) + num
        : `${num.slice(0,-8)}.${num.slice(-8)}`;
    }

    num = num.toString();
    return num.length <= 8 
      ? '0.' + '0'.repeat(8 - num.length) + num 
      : `${num.slice(0,-8)}.${num.slice(-8)}`;
  }

  return {cost: Math.round(cryptoFormat(total) * 100)/100, amount: cryptoFormat(counter)};
}

console.log(calcMinCapital(100, 3594.83));