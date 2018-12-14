
const cryptoTrading = () => {

  const crypto = {

    minimumCapital: null,
    startingCapital: 0,

    usdCapitalBalance: 0,
    btcBalanceCapital: 0,
    recurringCapital: 0,

    btcPrice: 3547.65,
    price: 50,

    minimumTradeRate: 50000,
    tradeMultiplier: 2,
    sellRate: 0.5,
    buyRate: [],
    feeRate: 0.002,

    dogeBalance: 0,
    btcBalance: 0,

    totalInvested: 0,
    totalValue: 0,

    totalYield: 0,
    usdValue: 0,
    profitEarnings: 0,

    low: 50,
    tradeCounter: 0,
    //add date to track date

    initialize: function({price, btcPrice, startingCapital, recurringCapital = 0, updateRate, period, tradeLimit, randomize = false, tradesPerDay = 0, count = 0}) {
      this.price = price;
      this.high = price;
      this.low = price;
      this.btcPrice = btcPrice;
      this.calcMinCapital();
      this.startingCapital = startingCapital;
      this.usdCapitalBalance = startingCapital;
      this.btcBalanceCapital = Math.round(1 / btcPrice * startingCapital * Math.pow(10, 8));
      this.recurringCapital = recurringCapital && this.btcBalanceCapital;
      this.totalYield = 0;
      this.tradeLimit = tradeLimit;
      this.updateRate = updateRate;
      this.randomize = randomize;
      this.tradesPerDay = tradesPerDay,
      this.count = count,
      this.period = period;

      this.calcBuyRate();
      // not for debugging
      console.log(this.format());
      
    },

    updateProcess: function() {
      
      return {
        trades: this.tradeLimit,
        update: this.updateRate,
        randomize: this.randomize,
        tradesPerDay: this.tradesPerDay,
        count: this.count
      }
    },

    updateDepositCapital: function() {
      this.btcBalanceCapital += this.recurringCapital;
      this.usdCalcBalance();
    },

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
      this.startingCapital = total;
      this.usdCapitalBalance = total;
      this.btcBalanceCapital = counter;
    },

    // need to refacter format object being returned
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
        'transaction type': type,
        'Minimum Capital': `$${this.minimumCapital}`,
        'Starting Capital': `$${this.startingCapital}`,
        
        'USD Capital Balance': `$${this.usdCapitalBalance}`,
        'BTC balance Capital': cryptoFormat(this.btcBalanceCapital),
        'Recurring Capital': cryptoFormat(this.recurringCapital),

        'BTC Price': `$${this.btcPrice}`,
        'DOGE Price': cryptoFormat(this.price) + ' BTC',

        // 'Minimum Trade Rate': `${this. minimumTradeRate}`,
        // 'Trade Multiplier': `${this.tradeMultiplier}`,
        // 'Amount Traded': `${this. minimumTradeRate * this.tradeMultiplier}`,
        // 'Fee Rate': `${this.feeRate * 100}%`,
        // 'Sell Rate': `${this.sellRate * 100}%`,

        'DOGE Balance': cryptoFormat(this.dogeBalance) + ' DOGE',
        'BTC Balance': cryptoFormat(this.btcBalance) + ' BTC',

        'Total Invested': cryptoFormat(this.totalInvested) + ' BTC',
        'Total Value': cryptoFormat(this.totalValue) + ' BTC',
        
        'Profit Earnings': cryptoFormat(this.profitEarnings) + ' BTC',
        // 'Rate of update by days': this.updateRate,
        'Total Yield': `${this.totalYield}%`,
        'USD valueation': Math.round(this.btcPrice * this.totalValue/1000000)/100, // need some logic to get value in USD
        'Current Price': this.price,
        'Bottom Base': this.low,

        'Trade Counter': this.tradeCounter,
        'Buy Rate': this.buyRate,
      };
    },

    calcValue: function({ price : p, dogeBalance : d, btcBalance : b } = this ) {
      return this.totalValue = Math.round( p * d / Math.pow(10, 8) + b );
    },

    pne: function({ totalInvested : i } = this ) {
      return this.profitEarnings = Math.round(this.calcValue() - i)
    },

    calcYield: function({ totalInvested : i } = this) {
      if(!this.pne()) this.totalYield = 0;
      this.totalYield = Math.round(this.pne() / i * 10000) / 100;
    },

    calcTransaction: function( isBuy = true, { price : p, minimumTradeRate : t, sellRate : s, tradeMultiplier : m } = this) {
      let a;
      

      if(isBuy) {
        let index = this.high - p - 1  >= 0 ? this.high - p - 1 : 0;
        m = this.buyRate[ index ];
        a = t * m;
      } 
      else {
        // p = p - 2;
        // let index = p - this.low - 1  >= 0 ? p - this.low - 1 : 0;
        // m = this.buyRate[ index ];
        a = s * (t * m);
        p = p - 2;
      };
      return Math.round((1 / p) * Math.pow(10, 8) * a);
    },

    usdCalcBalance() {
      this.usdCapitalBalance = Math.round(this.btcBalanceCapital * this.btcPrice / 1000000) / 100;
    },

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

        if(this.high - this.price < 2 && this.isBuy) return;

        let index = this.high - p - 1  >= 0 ? this.high - p - 1 : 0;

        let buyy = this.calcTransaction();

        // might place at the bottom
        this.tradeCounter++;
  
        if(j > b * m ) {
          this.isbuy = true;

          m = this.buyRate[ index ];


          // remove from btc capital balance
          this.btcBalanceCapital = j - ((b * m * x) + (b * m)); 

          // add to doge balance
          this.dogeBalance = d + buyy;
          
          // add to total invested
          this.totalInvested = f + (b * m);

          // update last buy price
          this.low = p;

          console.log('buy', this.high - this.low, this.high, this.low, p);

          this.usdCalcBalance();

          return 'BUY';
        
        } else if(e > (b * m)) {
          this.isbuy = true;

          m = this.buyRate[ index] ;

          // remove from btc capital balance
          this.btcBalance = e - ((b * m * x) + (b * m));

          // add to doge balance
          this.dogeBalance = d + buyy;

          // update last buy price
          this.low = p;

          console.log('buy', this.high - this.low - 2, this.high, this.low, p);

          this.usdCalcBalance();

          return 'BUY';

        } else return 'INSUFFICIENT';
    },

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
        this.high = p;
        this.isbuy = false;

        console.log('sell', this.buyRate[10 - (this.high - this.low - 1)] * b, (this.high - this.low - 1), this.high, this.low, p);

        // used for debugging 
        // console.log(d - sells); 

        // remove from doge balance
        this.dogeBalance = d - sells;

        // add to btc balance
        this.btcBalance += Math.round((p * sells - (p * sells * f)) / Math.pow(10, 8));

        return 'SELL'
    },

    calcBuyRate: function() {
      let btcDailyTotal = Math.round((this.btcBalanceCapital + this.btcBalance)/30),
      base = Math.round((this.btcBalanceCapital + this.btcBalance)/30/10),
      backArr = [], topThree = null, frontArr = [], avg = 0, total7;

      base = Math.floor(base / 50000 * 10);
      base = (base - (base % 2 || 2)) / 10;

      for(let i = 0; i < 7; i++){

        if(base > 1) {

          backArr.unshift(base)
          base = Math.round((base * 10) - 2) / 10;
        } else {

          backArr.unshift(base)
        }
        
      }

      total7 = backArr.reduce((a,b) => a + b) * 50000

      topThree = Math.round(Math.round((btcDailyTotal - total7) / 3) / 50000 * 10);
      topThree = (topThree - (topThree % 2 || 2)) / 10;
      avg = Math.floor((topThree - 2) / 3* 10)/10;

      for(let i = 0; i < 3; i++) {

        if(i === 0) {
          topThree - avg > 2 ? frontArr.push(topThree - avg) : frontArr.push(2);
        } else if( i === 1) {
          topThree > 2 ? frontArr.push(topThree) : frontArr.push(2);
        } else if( i === 2) {
          topThree + avg > 2 ? frontArr.push(topThree + avg) : frontArr.push(2);
        }

      }

      this.buyRate = [...frontArr,...backArr];
    }

  }

  return (action, init) => {

    if( action === 'INIT' ) return crypto.initialize(init);
    if( action === 'UPDATE' ) return crypto.updateProcess()
    if( action === 'DEPOSIT' ) return crypto.updateDepositCapital();
    if( action === 'INCREMENT' ) crypto.price++
    if( action === 'DECREMENT' ) crypto.price--;
    if( action === 'BUY' ) action = crypto.buy();
    if( action === 'SELL' ) action = crypto.sell();

    // update total value
    crypto.calcValue();

    // update total yield
    crypto.calcYield();

    return crypto.format( action );
  }

}


function record() {

  const { trades, update, randomize, tradesPerDay, count} = tradeCrypto('UPDATE');
  let index = [1,3,5,7,15,30,365].findIndex( index => index === update)
  let isIncrement = true;
  let term = ['daily term', '3 day term', '5 day term', 'weekly term', '15 day term', '30 day term', 'Annually Term' ][index];
  let tradeCounter = 0;
  let dayCounter = 0;

  function cycle(task) {// might places out side of instead of task
  
    for(let i = 0; i < count; i++) {

      if(tradeCounter === trades) return tradeCounter = trades;
  
      if(cryptoTracker.length === 0) { // initialize first buy
        let item = tradeCrypto('BUY');
        item[term] = 0;
        cryptoTracker.push(item);
        tradeCounter++;

        // for testing and debugging
        console.log(tradeCrypto()); 
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

        if(increment.currentPrice - increment.low >= 10) tradeCrypto('SELL', 1) // second arg will have dynamic rate to factor the sell rate, second arg not implemented yet
        else if(increment['Current Price'] - increment['Bottom Base'] >= 6) tradeCrypto('SELL', 1) // might ad some logic to push on weekly rate in this location
        else if(increment['Current Price'] - increment['Bottom Base'] >= 4) tradeCrypto('SELL', 1)
        else if(increment['Current Price'] - increment['Bottom Base'] >= 2) tradeCrypto('SELL', 1);

        tradeCounter = increment['Trade Counter'];
      }
  
      if(tradeCounter % tradesPerDay === 0) {

        dayCounter++;
        dayCounter % 30 === 0 ? tradeCrypto('DEPOSIT') : null;

        if(dayCounter % update === 0) { 

          let item = tradeCrypto('DISPLAY');
          item[term] = dayCounter / update;
          item['Current Day'] = dayCounter;
          cryptoTracker.push(item);
        }
      }

      // for testing and debugging
      // console.log(tradeCrypto()); 
  
      // testing how this works but I want it to push on buys and sells maybe on increment and decrement and insulficent, or a counter for each of properties
      // current push is maping days to trades. I need have set trade amount per a day maybe at least 3 to 5 up to 10 could have random amount with 3 most frequent
      // push on different arrary for increment reaches top trade to messure max yield
      // organize object data that displays data with more sense when looking at it.
    }
  
  }

  do {
    isIncrement = !isIncrement
    randomize ? tradesPerDay = doRandom('DAY') : tradesPerDay;
    randomize ? count = doRandom('COUNT') : count;

    if(isIncrement) { 
      cycle('INCREMENT');
    } else {
      cycle('DECREMENT');
    }
    if(tradeCounter === trades) break;
  }
  while (cryptoTracker[cryptoTracker.length -1]['Trade Counter']  < trades);


  // console.log(cryptoTracker)
  // console.log(tradeCrypto());
}




//   --  --- Execution of app ---  --   //

const tradeCrypto = cryptoTrading();
const cryptoTracker = [];

// tradeLimit: provides the max number of trades, updateRate: provides when to push base on how many days pass, 1,3,5,7,10,15,30, 365 days
tradeCrypto('INIT', {price: 50, btcPrice: 3374.09, startingCapital: 1000, tradeLimit: 150, updateRate: 7, randomize: false, tradesPerDay : 3, count: 10, recurringCapital: true});

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