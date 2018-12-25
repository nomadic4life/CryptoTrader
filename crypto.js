const cryptoCache = () => { // crypto asset markets

  const crypto = {
    minimumCapital: null, // don't think I need this

    actionType: '',

    price: 50,
    btcPrice: 3547.65,

    capitalBalance: 100200,
    usdValueAccountBalance: 0,

    baseBalance: 0,
    quoteBalance: 0,
    baseValuation: 0,
    totalValue: 0, // account valuation of trading pair, not using atm

    totalInvested: 0,
    earnings: 0, // quoteValue
    yeildToDate: 0,

    recurringCapital: 0,
    minimumQuote: 50000,
    factor: 2,
    feeRate: 0.002,

    sellRate: 0.5, // for selling algorithm will not need, not using atm
    buyRate: [], // for buying algorithm will not need, not using atm

    status: {
      market: '', // trading pair, base-quote, DOGE-BTC
      maxDays: 0,
      orderStatus: '',
      tradeCount: 0,
      buyTotal: 0,
      sellTotal: 0,
      insufficientCount: 0,
      consecutiveBuyCount: 0,
      consecutiveSellCount: 0,
      totalBuyAmount: 0,
      totalSellAmount: 0,
      totalAmount: 0,
      lastBuyPrice: 0,
      dayCount: 0, // going to be used to update trading algorithm every 30 days
      last_buy: [],
      last_sell: [],
      init: {},
    },

    ledger: [],

    toCryptoString(num) {

      if(num === undefined) return "undefined";
      
  
      // if(typeof num === 'string' && num === '') num = this.toCryptoValue(num || '0.00000000');
  
      // if(typeof num !== 'number') return `${num} is not a number`;
    
      let value;
      num = Math.round(num);
    
      if(num >= 0) {
    
        num = num.toString();
    
        value = num.length <= 8 
          ? '0.' + '0'.repeat(8 - num.length) + num 
          : `${num.slice(0,-8)}.${num.slice(-8)}`;
    
      } else {
    
        num = Math.abs(num).toString();
        
        value = num.length <= 8 
          ? '-0.' + '0'.repeat(8 - num.length) + num 
          : `-${num.slice(0,-8)}.${num.slice(-8)}`;
      }
    
      return value;
    },

    displayAccount({ price, capitalBalance, baseBalance, quoteBalance, totalInvested, earnings, yeildToDate, ledger, status, actionType, toCryptoString }) {

      let base = status.market.split('-')[0], quote = status.market.split('-')[1],
      lastTrade = ledger.length > 0 ? ledger[ledger.length-1] : 0;
      
      // will add formating to dollar values
      return {
        'Price Action': actionType.toLowerCase(), // thinking of giving better property name
        'Last Price': toCryptoString(price),
        [`Capital Balance`]: toCryptoString(capitalBalance),
        [`${base} Balance`]: toCryptoString(baseBalance),
        [`${quote} Balance`]: toCryptoString(quoteBalance),
        'Total Invested': toCryptoString(totalInvested),
        'Total Earnings': toCryptoString(earnings),
        'Yield To Date': `${yeildToDate}%`,
        'Last Trade': {
          ...lastTrade,
          price: toCryptoString(lastTrade.price),
          quote: toCryptoString(lastTrade.quote),
          base: toCryptoString(lastTrade.base),
          fee: toCryptoString(lastTrade.fee),
          total: toCryptoString(lastTrade.total),
        },
        'Account Stats': {
          ...status,
          init: {
            price: toCryptoString(status.init.price),
            btcPrice: status.init.btcPrice,
            startingCapital: toCryptoString(status.init.startingCapital),
            quoteAmount: toCryptoString(status.init.quoteAmount),
            baseAmount: toCryptoString(status.init.baseAmount),
            fee: toCryptoString(status.init.fee),
            total: toCryptoString(status.init.total),
          }
        },
      };

    },

    retrive() {
      return this.displayAccount(this);
    },

    buy({price, minimumQuote, factor, feeRate, baseBalance, capitalBalance, quoteBalance}) {
      let quote, base, fee, total, baseValue, insufficient = false;

      // calculate quote
      quote = Math.round(minimumQuote * factor);

      // calculate base
      base = Math.round(1 / price * quote) * Math.pow(10,8);

      // calculate fee
      fee = Math.ceil(quote * feeRate);

      // fee applied to quote
      total = Math.round(quote + fee);

      // baseBalance in quote value with fee applied
      baseValue = ( Math.round(baseBalance * price / Math.pow(10,8)) - Math.round(baseBalance * price * feeRate / Math.pow(10,8)) );

      // check capitalBalance first then quoteBalance for suficiant funds
      // && current price = last buy price then no trade is executed
      insufficient = ( capitalBalance >= total || quoteBalance >= total ) &&  price !== this.status.lastBuyPrice ? false : true;

      // for testing
      // console.log(quote, base, fee , total, insufficient, price - this.status.lastBuyPrice, this.status.last_buy);

      return { quote, base, fee, total, insufficient };
    },

    sell({price, minimumQuote, factor, baseBalance, feeRate}) {
      let quote, base, fee, total, baseValue, insufficient = false;

      function algorithmSell({ price, minimumQuote, factor, feeRate }) {
        let quote, base, fee, total, baseValue, insufficient = false;

        // calculate quote
        quote = Math.round( minimumQuote * factor );

        // fee = quote * feeRate
        
        // total = quote + fee

        // calculate base // working on algorithm
        base = Math.round(1 / (price - 2) * (quote * Math.pow(10,8)) * 0.5) ;

        // quote amount to sell
        quote = Math.round((base * (price)) / Math.pow(10,8))

        return quote
      }

      // calculate quote amount will use last trade base amount, total cost of sell
      quote =  algorithmSell(this);
      // console.log( quote )

      // calculate base amount, total amount to remove from baseBalance
      base = Math.round( 1 / price * quote ) * Math.pow(10,8);

      // calcualte fee the amount to remove from quote for total
      fee = Math.round(quote * feeRate);

      // fee applied to quote, total amount to add to quoteBalance
      total = Math.round(quote - fee);

      // baseBalance in quote value with fee applied
      baseValue = ( Math.round(baseBalance * price / Math.pow(10,8)) - Math.round(baseBalance * price * feeRate / Math.pow(10,8)) );

      // if funds insufficient will not sell
      insufficient = minimumQuote >= total && baseValue >= total ? true : false;

      // meet condition to sell price >= last buy price + 2
      insufficient = price >= this.status.lastBuyPrice + 2 ? false : true;

      // for testing
      // console.log(quote, total, base,fee);

      return { quote, base, fee, total, baseValue, insufficient }
    },

    antedate() {

      // increase day count
      this.status.dayCount++

      // check to make new deposit
      if(this.status.dayCount % 30 === 0 ) {

        // price action to deposit
        this.actionType = 'deposit';

        // deposit into capital balance
        this.captialBalance += this.status.recurringCapital;

        // update trading algorthim base on current factors
        this.updateTradeAlgorithm(this);

        // return results, I don't think I need this
        // return this.displayAccount(this);
      }

    },

    initialize(init, test = false) {

      this.price = init.price;
      this.btcPrice = init.btcPrice;
      this.capitalBalance = init.capitalBalance;
      this.recurringCapital = init.recurringCapital || 0;
      this.status.market = init.market || 'BTC-USD';
      this.status.maxDays = init.maxDays;

      return this.tradeOrder('buy', test);
    },

    tradeOrder(order, test) {

      let { quote, base, fee, total, insufficient } = this[order](this);

      // update ledger
      this.updateLedger({ 
        order,
        pair: this.status.market, 
        price: this.price,
        quote, 
        base,
        fee,
        total
      }, insufficient)

      // update status
      this.updateStatus(order, this.price, quote, base, fee, total, insufficient);

      // update balance
      this.updateBalance(order, base, total, insufficient);

      // update valuation
      this.updateValuation(this, insufficient);

      // for testing and debugging
      this.testingLogs(test, insufficient);

      return insufficient ? false : true;

    },

    updateLedger(ledger, insufficient) {
      if(!insufficient) this.ledger = [ledger] //this.ledger.push(ledger);
    },

    updateStatus(order, price, quote, base, fee, total, insufficient) {

      // thinking of changing insufficient to isTradeExecuted or something similar
      if(insufficient) {

        this.status.insufficientCount++;
        this.status.orderStatus = `unfilled ${order} order`;
        this.actionType = 'trade';

      } else {

        this.status.tradeCount++;
        this.status[order + 'Total']++
        this.status.orderStatus = order;
        this.actionType = 'trade';

        if(order === 'buy') {

          // set last buy price
          this.status.lastBuyPrice = price;

          // initiate first buy
          if(this.status.tradeCount === 1) this.actionType = 'INIT';

          // record of init buy
          if(this.actionType === 'INIT') {
            this.status.init = {
              price,
              btcPrice: this.btcPrice,
              startingCapital: this.capitalBalance,
              quoteAmount: quote,
              baseAmount: base,
              fee,
              total,
            }
          }

          // updates total invested if invested from capitalBalance
          this.capitalBalance >= total 
          ? this.totalInvested += total
          : this.totalInvested += 0;


          // consective buy count of session buy record to keep track of consective buys 
          if(this.status.consecutiveSellCount > 0) {

            // session record of consective buys
            this.status.last_buy = [{
              price,
              quoteAmount: quote,
              baseAmount: base,
              fee,
              total,
            }];

            // consective sell set to 0
            this.status.consecutiveSellCount = 0;

            // consective buy set to 1
            this.status.consecutiveBuyCount = 1;

            // consective sell amount set to 0;
            this.status.totalAmount = 0;

            // consecutive trade buy amount set total
            this.status.totalBuyAmount = total;

          } else{

            // session record of consective buys
            this.status.last_buy.push({
              price,
              quoteAmount: quote,
              baseAmount: base,
              fee,
              total,
            });

            // add 1 to consective buy
            this.status.consecutiveBuyCount++;

            // consecutive trade buy amount total added 
            this.status.totalBuyAmount += total;
          } 

        }

        if(order === 'sell') {

          // session record of consective sells
          this.status.last_sell.push({
            price,
            quoteAmount: quote,
            baseAmount: base,
            fee,
            total,
          })

           if(this.status.consecutiveSellCount === 0) {

             this.status.last_sell = [{
              price,
              quoteAmount: quote,
              baseAmount: base,
              fee,
              total,
            }];
              
          }  else {

            this.status.last_sell.push({
              price,
              quoteAmount: quote,
              baseAmount: base,
              fee,
              total,
            });

          }

          // consective sell count of session sell record to keep track of consective sells 
          this.status.consecutiveSellCount++;

          // consective sell amount quote added;
          this.status.totalAmount = quote;
        }
      }

    },

    updateBalance(order, base, total, insufficient) {
      if(insufficient) return;

      if(order === 'buy') {
        
        this.capitalBalance >= total 
        ? this.capitalBalance -= total 
        : this.quoteBalance -= total;
        this.baseBalance += base;

      };

      if(order === 'sell') {
        
        this.baseBalance -= base;
        this.quoteBalance += total;

      };

    },

    updateValuation({price, baseBalance, quoteBalance, totalInvested}, insufficient) {
      if(insufficient) return;

      let baseValue, totalValue;

      // base value of baseBalance
      baseValue = Math.round(baseBalance * price) / Math.pow(10, 8);

      // base value with fee applied if sold all
      baseValue = baseValue - Math.round(baseValue * this.feeRate);

      // total value holding quote and base balances
      totalValue = quoteBalance + baseValue;

      // profit and earnings from total invested in trading pair
      this.earnings = totalValue - totalInvested;

      // precentage of profit and earnings of total invested in trading pair
      this.yeildToDate = this.totalInvested === 0 ? 0 : Math.round(this.earnings / this.totalInvested * 10000) / 100;

    },

    updateTradeAlgorithm() {

      console.log('update to the trading algorthim will be placed here')
    },

    priceAction(action, test) {

      if(action === 'INCREMENT') this.price++;
      if(action === 'DECREMENT') this.price--;

      this.actionType = action;

      // update Valuation
      this.updateValuation(this);

      // for testing and debugging
      // this.testingLogs(test);

    },

    testingLogs(test) {
      if(test) console.log(this.displayAccount(this));
    },

  };

  return (action, init) => {
    
    switch (action) {

      case 'INCREMENT':
        crypto.priceAction('INCREMENT', true);
        break;

      case 'DECREMENT':
        crypto.priceAction('DECREMENT', true);
        break;

      case 'UP-TO-DATE':
        crypto.antedate();
        break;

      case 'INIT':
        crypto.initialize(init, true);
        break;

      case 'MAX':
        return crypto.status.maxDays;

      case 'RETRIVE':
        return crypto.retrive();

      case 'DATE':
        return crypto.status.dayCount;

      case 'BUY':
        return crypto.tradeOrder('buy', true);

      case 'SELL':
        return crypto.tradeOrder('sell', true);

      default:
        return;
    }

  };

}

const handleExchange = () => { // handle exchange

  
  let termSequence = 7; // weekly
  let ledger = [];
  let updated = false;
  let dailyTradeRate = 3;
  let tradesPerAction = 10;
  let action = 'DECREMENT';
  let maxDays = trade('MAX');

  let randomize = false;

  const randomTradeAction = () => {
    const num = [
      Math.ceil(Math.random() * 3), 
      Math.ceil(Math.random() * 5), 
      Math.ceil(Math.random() * 7), 
      Math.ceil(Math.random() * 10)
    ];

    return num[Math.floor(Math.random() * 4)];
  }

  const randomDailyTradeRate = () => {
    const num = [1,1,2,
      Math.ceil(Math.random() * 2), 
      Math.ceil(Math.random() * 3), 
      Math.ceil(Math.random() * 4),
      Math.ceil(Math.random() * 8),
    ];

    return num[Math.floor(Math.random() * 7)] + Math.ceil(Math.random() * 2);
  }

  const executeOrder = action => {
    
    trade(action);

    return action === 'DECREMENT' ? trade('BUY') : trade('SELL');
  }

  const executeTrade = (action) => { // trade sequence

  let tradeCount = 0;

    do {

      if( executeOrder(action) ) {
        
        // current date
        let date = trade('DATE');

        // increase tradeCount
        tradeCount++;

          // change Price Action
        if(tradeCount % tradesPerAction === 0) {

          // switch action
          action = action === 'INCREMENT' ? 'DECREMENT' : 'INCREMENT';

          // randomize trades per action or default @ 10
          tradesPerAction = randomize ? randomTradeAction() : 10;

        }

        if( tradeCount % dailyTradeRate === 0 ) {

          // update dayCount and check to deposit new amount
          trade('UP-TO-DATE');

          // current date
          date = trade('DATE');

          // reset dailyTradeRate with random num or default @ 3
          dailyTradeRate = randomize ? randomDailyTradeRate() : 3;
        }

        if(date % termSequence === 0 && !updated) {

          // set to true when updated ledger
          updated = true;

          // push current trade information to ledger
          ledger.push(trade('RETRIVE'));

        }
        
        if(date % termSequence !== 0 && updated){

          // sets to false when date changes
          updated = false;
        }

      }
      
    } while ( trade('DATE') <= maxDays );
    
  }

  executeTrade(action);

}

const trade = cryptoCache();

const ledger = [];
trade('INIT', { 
  price: 30, 
  btcPrice: 4200, 
  capitalBalance: 100000000, 
  recurringCapital: 100000000, 
  market: 'DOGE-BTC', 
  maxDays: 140, 
});

ledger.push(trade('RETRIVE'));


handleExchange();