
const cryptoTrading = () => {

  const crypto = {

    minimumCapital: 0,
    startingCapital: 0,

    usdCapitalBalance: 0,
    btcBalanceCapital: 0,
    recurringCapital: 0,

    btcPrice: 3547.65,
    price: 50,

    minimumTradeRate: 50000,
    tradeMultiplier: 2,
    sellRate: 0.5,
    feeRate: 0.002,

    dogeBalance: 0,
    btcBalance: 0,

    totalInvested: 0,
    totalValue: 0,

    totalYield: 0,
    usdValue: 0,
    profitEarnings: 0,

    bottomBase: 50,
    tradeCounter: 0,
    //add date to track date

    calcMinCapital: function() {

      // this function calculates the minimum capital needed to invested into doge according to the price of doge/btc and btc/usd and factor those numbers with the minimum trade rate for doge, includes the fee rate for both coinbase and trade for exchange rate, includes premimum markup rate for buying btc on coinbase.

      const coinbaseFee = 0.015; //1.155% - 1.135%
      let counter = 0;

      for(let i = this.price; i >= 1; i--) {
        counter += (this.minimumTradeRate * this.tradeMultiplier * this.feeRate) + this.minimumTradeRate * this.tradeMultiplier;
      }
    
      let total = ((this.btcPrice * 0.0033 + this.btcPrice) * counter);
      total = Math.round(((total * coinbaseFee) + total)/1000000)/100;

      this.minimumCapital = total;
      this.btcBalanceCapital = counter;
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
        // 'Minimum Capital BTC': 'in BTC',
        'BTC balance Capital': cryptoFormat(this.btcBalanceCapital),
        // 'Total Starting Capital': `$${this.minimumCapital}`,
        'BTC Price': this.btcPrice,
        'DOGE Price': cryptoFormat(this.price) + ' BTC',
        'transaction type': type,
        // //'Invest Rate': cryptoFormat(this.investRate) + ' BTC',
        // 'Sell Rate': `${this.sellRate * 100}%`,
        'DOGE Balance': cryptoFormat(this.dogeBalance) + ' DOGE',
        'BTC Balance': cryptoFormat(this.btcBalance) + ' BTC',
        'Total Invested': cryptoFormat(this.totalInvested) + ' BTC',
        'Total Value': cryptoFormat(this.totalValue) + ' BTC',
        'Profit Earnings': cryptoFormat(this.profitEarnings) + ' BTC',
        'USD valueation': Math.round(this.btcPrice * this.totalValue/1000000)/100, // need some logic to get value in USD
        'Bottom Base': this.bottomBase,
        'Current Price': this.price,
        'Total Yield': `${this.yields}%`,
        'Trade Counter': this.tradeCounter,
      }
    },

    calcValue: function({ price : p, dogeBalance : b, btcBalance : b } = this ) {
      this.totalValue = Math.round( p * d / Math.pow(10, 8) + b );
    },

    // need to varify if working correctly
    pne: function({ totalInvested : i } = this ) {
      // need to test if this is correct
      this.profitEarnings = Math.round(this.calcValue() - i)
      return Math.round(this.calcValue() - i);
    },

     // need to varify if working correctly
    calcYield: function({ totalInvested : i } = this) {
      // need to test if this is correct
      if(!this.pne()) this.totalYield = 0;
      this.totalYield = Math.round(this.pne() / i * 10000) / 100;
    },

     // need to varify if working correctly
    calcTransaction: function( isBuy = true, { price : p, minimumTradeRate : t, sellRate : s, tradeMultiplier : m } = this) {
      let r;
      if(isBuy) r = t * m;
      else r = s * (t * m);
      return Math.round((1 / p) * Math.pow(10, 8) * r);
    },

     // need to varify if working correctly
    buy: function({ 
      dogeBalance : d, 
      totalInvested : f, 
      price : p, 
      tradeMultiplier : m,
      minimumTradeRate : b, 
      btcBalance : e,
      btcBalanceCapital : j,
      feeRate : x, 
      } = this ) {

        let buyy = this.calcTransaction();

        this.tradeCounter++;
  
        if(this.btcBalanceCapital > this.minimumTradeRate) {

          // remove from btc capital balance
          this.btcBalanceCapital = j - ((b * m * x) + (b * m)); 

          // add to doge balance
          this.dogeBalance = d + buyy;
          
          // add to total invested
          this.totalInvested = f + (b * m);

          // update last buy price
          this.bottomBase = p;

          return 'BUY';
        
        } else if(e > (b * m)) {

          // remove from btc capital balance
          this.btcBalance = e - ((b * m * x) + (b * m));

          // add to doge balance
          this.dogeBalance = d + buyy;

          // update last buy price
          this.bottomBase = p;

          return 'BUY';

        } else return 'INSUFFICIENT';
    },

     // need to varify if working correctly
    sell: function({ 
      dogeBalance : d,
      btcBalance : e, 
      price : p, 
      minimumTradeRate : b, 
      sellRate : c,
      feeRate : f,
      tradeMultiplier : m,
      } = this ) {

        let sells = this.calcTransaction(false)

        this.tradeCounter++;

        if(d < sells + (p * sells * f)) return 'INSUFFICIENT';

        // used for debugging 
        console.log(d - sells); 

        // remove from doge balance
        this.dogeBalance = d - sells;

        // add to btc balance
        this.btcBalance += Math.round((p * sells - (p * sells * f)) / Math.pow(10, 8));

        return 'SELL'
    },

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

    function buy({ 
      dogeBalance : d, 
      totalInvested : f, 
      sellRate : c, 
      price : p, 
      tradeMultiplier : m,
      minimumTradeRate : b, 
      btcBalance : e,
      btcBalanceCapital : j,
      feeRate : x, 
      }) {

      crypto.tradeCounter++;

      //b = b * m;

      if(crypto.btcBalanceCapital > crypto.minimumTradeRate) {
        //d = d + calcTransaction(p, (b * m));
        //console.log(j - ((b * m * x) + (b * m)), ((b * m * x) + (b * m)))
        crypto.btcBalanceCapital = j - ((b * m * x) + (b * m)); // remove from btc capital balance
        crypto.dogeBalance = d + calcTransaction(p, (b * m)); // add to doge balance
        crypto.totalInvested = f + (b * m);

        //crypto.btcBalance = e > b ? e - b : e;
        //crypto.totalInvested = e > b ? f : f + b;
      
      } else if(e > (b * m)) {
        crypto.btcBalance = e - ((b * m * x) + (b * m));
        crypto.dogeBalance = d + calcTransaction(p, (b * m));
        //crypto.totalInvested = f;
      }

      crypto.totalValue = calcValue(crypto);
      crypto.yields = yields();
      crypto.bottomBase = p;
      
    }

    function sell({ 
      dogeBalance : d,
      btcBalance : e, 
      price : p, 
      minimumTradeRate : b, 
      sellRate : c,
      feeRate : f,
      tradeMultiplier : m,
    }) {

      crypto.tradeCounter++;
      //console.log('entering here to sell but not selling',d,calcTransaction(p - 2, (b * m), c),calcTransaction(p - 2, b, c))
      if(d < calcTransaction(p - 2, b, c) + (p * calcTransaction(p - 2, b, c) * f)) return 'INSUFFICIENT';
      
      
      //d = d - calcTransaction(p - 2, b, c);
      console.log(d - calcTransaction(p - 2, b, c)); // debugging
      crypto.dogeBalance = d - calcTransaction(p - 2, b, c);
      crypto.btcBalance += Math.round((p * calcTransaction(p - 2, b, c) - (p * calcTransaction(p - 2, b, c) * f)) / Math.pow(10, 8));
      crypto.totalValue = calcValue(crypto);
      crypto.yields = yields();
      return 'SELL'
    }

  }

  crypto.calcMinCapital()

  return action => {

    if( action === 'INCREMENT' ) crypto.price++
    if( action === 'DECREMENT' ) crypto.price--;
    if( action === 'BUY' ) crypto.buy();
    if( action === 'SELL' ) action = crypto.sell();

    // update total value
    crypto.calcValue();

    // update total yield
    crypto.calcYield();

    return crypto.format( action );
  }

}




function record() {

  let trades = 100;
  let isIncrement = false;
  let tradesPerDay = 3; // need randomize trades per day
  let tradeCounter = 0;
  let dayCounter = 0 // counts days per a cycle and resets when push or just use modulo if necessary

  function cycle(task, count = 10) {// might places out side of instead of task
  
    for(let i = 0; i < count; i++) {
  
      if(cryptoTracker.length === 0) { // initialize first buy
        let item = tradeCrypto('BUY');
        week = 'Week'
        item[week] = 0;
        cryptoTracker.push(item);
        tradeCounter++;
        console.log(tradeCrypto()); // for testing and debugging
      }
      
      if(task === 'DECREMENT') {
        // cryptoTracker.push(tradeCrypto('DECREMENT'));
        // cryptoTracker.push(tradeCrypto('BUY'));
        tradeCrypto('DECREMENT');
        tradeCrypto('BUY')
        tradeCounter++;
      }
  
      if(task === 'INCREMENT') {
        let increment = tradeCrypto('INCREMENT');
  
        // cryptoTracker.push(increment);

        if(increment.currentPrice - increment.bottomBase >= 10) tradeCrypto('SELL', 1) // second arg will have dynamic rate to factor the sell rate, second arg not implemented yet
        else if(increment['Current Price'] - increment['Bottom Base'] >= 6) tradeCrypto('SELL', 1) // might ad some logic to push on weekly rate in this location
        else if(increment['Current Price'] - increment['Bottom Base'] >= 4) tradeCrypto('SELL', 1)
        else if(increment['Current Price'] - increment['Bottom Base'] >= 2) tradeCrypto('SELL', 1);

        tradeCounter++;
      }
  
      if(tradeCounter >= tradesPerDay) {
        tradeCounter = 0;
        dayCounter++;
        if(dayCounter % 30 === 0) { // seven needs be more dynamic
          let item = tradeCrypto('DISPLAY');
          week = 'Week'
          item[week] = dayCounter / 7; // need make this more dynamic
          cryptoTracker.push(item);
        }
      }

      console.log(tradeCrypto()); // for testing and debugging
  
      // testing how this works but I want it to push on buys and sells maybe on increment and decrement and insulficent, or a counter for each of properties
      // current push is maping days to trades. I need have set trade amount per a day maybe at least 3 to 5 up to 10 could have random amount with 3 most frequent
      // push on different arrary for increment reaches top trade to messure max yield
      // organize object data that displays data with more sense when looking at it.
    }
  
  }

  // let test;
  do {
    
    if(isIncrement) {
      isIncrement = false
      cycle('INCREMENT');
    } else {
      isIncrement = true
      cycle('DECREMENT');
    }

    // test = tradeCrypto('DISPLAY');
    
  }
  while (cryptoTracker[cryptoTracker.length -1]['Trade Counter']  < trades );


  // console.log(cryptoTracker)
  //console.log(tradeCrypto());
}




//   --  --- Execution of app ---  --   //

const tradeCrypto = cryptoTrading();
const cryptoTracker = [];
record();


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