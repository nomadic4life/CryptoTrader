
const cryptoTrading = () => {

  const crypto = {
    minimumCapital: 0, //  --  usd // might need to refactor the math
    minimumInvest: 0,
    totalStartingCapital: 0, //   --  usd // might need to refactor the math
    btcPrice: 3547.65, //  --  btc price, usd, btc-usd
    price: 50, //  --  doge price, btc, doge-btc
    minimumTradeRate: 50000, // btc // 50000 * 2
    investRate: 250000, // btc
    sellRate: 0.5, // 50% is the starting rate, can be changed base on the algoritm. 50% to 100% is the starting range. below 50% will be base on algoritm.
    feeRate: 0.002,
    dogeBalance: 0,
    btcBalance: 0,
    totalInvested: 0,
    totalValue: 0,
    profitEarnings: 0,
    bottomBase: 50,
    yields: 0,
    tradeCounter: 0,

    calcMinCapital: function() {

      // this function calculates the minimum capital needed to invested into doge according to the price of doge/btc and btc/usd and factor those numbers with the minimum trade rate for doge, includes the fee rate for both coinbase and trade for exchange rate, includes premimum markup rate for buying btc on coinbase.

      const coinbaseFee = 0.015; //1.155% - 1.135%
      let counter = 0;

      for(let i = this.price; i >= 1; i--) {
        counter += (this.minimumTradeRate * 2 * this.feeRate) + this.minimumTradeRate * 2;
      }
    
      let total = ((this.btcPrice * 0.0033 + this.btcPrice) * counter);
      total = Math.round(((total * coinbaseFee) + total)/1000000)/100;

      this.minimumCapital = total;
      this.minimumInvest = counter;
    },

    format: function(type  = 'DISPLAY') {

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
      
      return {
        'Minimum Capital': `$${this.minimumCapital}`,
        'Minimum Capital BTC': 'in BTC',
        'Minimum Invest': cryptoFormat(this.minimumInvest),
        'Total Starting Capital': `$${this.minimumCapital}`,
        'DOGE Price': cryptoFormat(this.price) + ' BTC',
        'transaction type': type,
        'Invest Rate': cryptoFormat(this.investRate) + ' BTC',
        'Sell Rate': `${this.sellRate * 100}%`,
        'DOGE Balance': cryptoFormat(this.dogeBalance) + ' DOGE',
        'BTC Balance': cryptoFormat(this.btcBalance) + ' BTC',
        'Total Invested': cryptoFormat(this.totalInvested) + ' BTC',
        'Total Value': cryptoFormat(this.totalValue) + ' BTC',
        'Profit Earnings': cryptoFormat(this.profitEarnings) + ' BTC',
        'Bottom Base': this.bottomBase,
        'Current Price': this.price,
        'Total Yield': `${this.yields}%`,
        'Trade Counter': this.tradeCounter,
      }
    }

  }

  { // Grouping of functions
  
    function calcValue( {price : a, dogeBalance : b, btcBalance : c}) {
      return Math.round( a * b / Math.pow(10, 8) + c );
    }

    function pne( { totalInvested : b } ) {
      crypto.profitEarnings = Math.round(calcValue(crypto) - b)
      return Math.round(calcValue(crypto) - b);
    }

    function yields() {
      if(!pne(crypto)) return 0;
      return Math.round(pne(crypto) / crypto.totalInvested * 10000) / 100;
    }

    function calcTransaction( a, b, c = 1) {
      return Math.round((1 / a) * Math.pow(10, 8) * b * c);
    }

    function buy({ dogeBalance : d, btcBalance : e, totalInvested : f, price : p, investRate : b, sellRate : c }) {
      crypto.tradeCounter++;
      d = d + calcTransaction(p, b);
      crypto.dogeBalance = d;
      crypto.btcBalance = e > b ? e - b : e;
      crypto.totalInvested = e > b ? f : f + b;
      crypto.totalValue = calcValue(crypto);
      crypto.yields = yields();
      crypto.bottomBase = p;
    }

    function sell({ dogeBalance : d, btcBalance : e, price : p, investRate : b, sellRate : c }) {
      crypto.tradeCounter++;
      if(d < calcTransaction(p - 2, b, c)) return 'INSUFFICIENT';
      d = d - calcTransaction(p - 2, b, c);
      crypto.dogeBalance = d;
      crypto.btcBalance += Math.round((p * calcTransaction(p - 2, b, c)) / Math.pow(10, 8));
      crypto.totalValue = calcValue(crypto);
      crypto.yields = yields();
      return 'SELL'
    }

  }

  crypto.calcMinCapital()

  return action => {

    if( action === 'INCREMENT' ) crypto.price++
    if( action === 'DECREMENT' ) crypto.price--;
    if( action === 'BUY' ) buy(crypto);
    if( action === 'SELL' ) action = sell(crypto);

    crypto.totalValue = calcValue(crypto);
    crypto.yields = yields();

    return crypto.format( action );
  }

}




function record() {
  let trades = 300;
  let isIncrement = false;
  //let test; // need to rename to something symatical
  let cycles = 2;/// might not needs this
  let tradesPerDay = 3; // need randomize trades per day
  let tradeCount = 0;
  let dayCounter = 0 // counts days per a cycle and resets when push or just use modulo if necessary
  // console.log('here', count)

  function cycle(task, count = 10) {// might places out side of instead of task, might not need day
    //console.log(tradeCrypto('DISPLAY'), task)
  
    for(let i = 0; i < count; i++) {
  
      if(cryptoTracker.length === 0) { // initialize first buy
        let item = tradeCrypto('BUY');
        week = 'Week'
        item[week] = 0;
        cryptoTracker.push(item);
        tradeCount++;
      }
      
      if(task === 'DECREMENT') {
        // cryptoTracker.push(tradeCrypto('DECREMENT'));
        // cryptoTracker.push(tradeCrypto('BUY'));
        tradeCrypto('DECREMENT');
        tradeCrypto('BUY')
        tradeCount++;
      }
  
      if(task === 'INCREMENT') {
        let increment = tradeCrypto('INCREMENT');
  
        // cryptoTracker.push(increment);
        if(increment['Current Price'] - increment['Bottom Base'] >= 2) tradeCrypto('SELL');//cryptoTracker.push(tradeCrypto('SELL'));
        // if(increment['Current Price'] - increment['Bottom Base'] >= 4) cryptoTracker.push(tradeCrypto('SELL')); don't want counter to go up when invoke these calls
        // if(increment['Current Price'] - increment['Bottom Base'] >= 6) cryptoTracker.push(tradeCrypto('SELL')); // might change additional condition so only one sell is called and a multiplier is added to the arg to increase the sell price or rate
  
        // if(increment.currentPrice - increment.bottomBase >= 10) cryptoTracker.push(tradeCrypto('SELL'));
  
        tradeCount++;
      }
  
      if(tradeCount >= tradesPerDay) {
        tradeCount = 0;
        dayCounter++;
        if(dayCounter % 7 === 0) { // seven needs be more dynamic
          let item = tradeCrypto('DISPLAY');
          week = 'Week'
          item[week] = dayCounter / 7; // need make this more dynamic
          cryptoTracker.push(item);
        }
      }

      // let test = tradeCrypto('DISPLAY');
      // if(test['Trade Counter'] % day === 0) cryptoTracker.push(test)
  
      // testing how this works but I want it to push on buys and sells maybe on increment and decrement and insulficent, or a counter for each of properties
      // current push is maping days to trades. I need have set trade amount per a day maybe at least 3 to 5 up to 10 could have random amount with 3 most frequent
      // push on different arrary for increment reaches top trade to messure max yield
      // organize object data that displays data with more sense when looking at it.
    }
  
  }

  let test;
  do {
    
    if(isIncrement) {
      isIncrement = false
      cycle('INCREMENT');
    } else {
      isIncrement = true
      cycle('DECREMENT');
    }
    test = tradeCrypto('DISPLAY');
    
  }
  while (test['Trade Counter'] < trades);
  // while (cryptoTracker[ cryptoTracker.length && cryptoTracker.length -1]['Trade Counter'] < day);

  console.log(cryptoTracker)
  console.log(cryptoTracker[cryptoTracker.length -1])
  console.log(tradeCrypto());
}


//   --  --- Execution of app ---  --   //

const tradeCrypto = cryptoTrading();
const cryptoTracker = [];
record();

// need a transaction counter
// trade counter by sell and buy
// sell amount and buy amount props per each trade
// track history of highest trade and lowest trade
// keep history of trade for maybe 1 year. considering
// need a condition to increase investRate according the amount of capital in btcBalance, and a base condition
// or/and I can increase the amount to sell base on how much I have holding in dogeBalance
// need logic for day count and push into arr 
// implement random increment and decrement
// sell and buy logic base on mooning price 
// must include to calculate fee on sell and buy 
// implement a daily buy quota in the logic
// increase quota base on total btc capital
// current iteration of program does not have effective algorithm
// implement a monthly quota of capital investment
// calculate base on that quota, increase investment rate according to combination of total capital investment and btcBalance
// min rate is 0.0005 btc to trade with, will need to trade with 0.001 to sell at half rate,
// sell rate will with algorithm can be adjusted to according to buy rate
// maybe implement open orders system
// implement some inputs to calculate some values, capital, 30 day increments or other increments, starting price, btc price, and some other values
// implement in node.js or python backend with a database or file to keep record and handle request and a front end to handle inputs and display results
// might implement a botting system
// implement system buy from capital amount first and then buy from btc balance
// implement system to hold more doge according to the amount of yeild. maybe every 100% increase doge holdings, and I can figure out what type of algorithm toi implement
// 52 week high and low, 7 day high and low and other high and low
// if have a database record every price movement and trade
// for testing purposes record every price movement and trade
// for working iterations record trades base on cycle of days, 1,3,5,7,10,15,30, 365