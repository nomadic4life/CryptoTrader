const cryptoContainer = () => {

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
      orderStatus: '',
      tradeCount: 0,
      buyTotal: 0,
      sellTotal: 0,
      insulficiantCount: 0,
      consecutiveBuyCount: 0,
      consecutiveSellCount: 0,
      totalBuyAmount: 0,
      totalSellAmount: 0,
      lastBuyPrice: 0,
      last_buy: [],
      last_sell: [],
      dayCount: 0,
      init: {},
    },

    ledger: [],

    displayAccount({ price, baseBalance, quoteBalance, earnings, yeildToDate, ledger, status, actionType }) {
      
      // will add formating to crypto values and dollar values
      return {
        price,
        baseBalance,
        quoteBalance,
        earnings,
        yeildToDate,
        lastTrade: ledger[ledger.length-1],
        status,
        actionType,
      };
    },

    buy({price, minimumQuote, factor, feeRate, baseBalance, capitalBalance, quoteBalance}) {
      let quote, base, fee, total, baseValue, insulficiant = false;

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
      insulficiant = ( capitalBalance >= total || quoteBalance >= total ) &&  price !== this.status.lastBuyPrice ? false : true;

      // for testing
      console.log(quote, base, fee , total, insulficiant, price - this.status.lastBuyPrice, this.status.last_buy);

      return { quote, base, fee, total, insulficiant };
    },

    sell({price, minimumQuote, factor, baseBalance, feeRate}) {
      let quote, base, fee, total, baseValue, insulficiant = false;

      function algorithmSell({ price, minimumQuote, factor, feeRate }) {
        let quote, base, fee, total, baseValue, insulficiant = false;

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

      // if funds insulficiant will not sell
      insulficiant = minimumQuote >= total && baseValue >= total ? true : false;

      // meet condition to sell price >= last buy price + 2
      insulficiant = price >= this.status.lastBuyPrice + 2 ? false : true;

      // for testing
      console.log(quote, total, base,fee);

      return { quote, base, fee, total, baseValue, insulficiant }
    },

    tradeOrder(order, test) {

      let { quote, base, fee, total, insulficiant } = this[order](this);

      if(insulficiant) console.log('testing') // or update something that indicates insulficiant funds

      // update ledger
      this.updateLedger({ 
        order,
        pair: 'DOGE-BTC', 
        price: this.price,
        quote, 
        base,
        fee,
        total
      }, insulficiant)

      // update status
      this.updateStatus(order, this.price, quote, base, fee, total, insulficiant);

      // update balance
      this.updateBalance(order, base, total, insulficiant);

      // update valuation
      this.updateValuation(this, insulficiant);

      // for testing and debugging
      this.testingLogs(test, insulficiant);

    },

    updateLedger(ledger, insulficiant) {
      if(!insulficiant) this.ledger.push(ledger);
    },

    updateStatus(order, price, quote, base, fee, total, insulficiant) {

      // thinking of changing insulficiant to isTradeExecuted or something similar
      if(insulficiant) {

        this.status.insulficiantCount++;
        this.status.orderStatus = `unfilled ${order} order`;

      } else {

        this.status.tradeCount++;
        this.status[order + 'Total']++
        this.status.orderStatus = order;

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

    updateBalance(order, base, total, insulficiant) {
      if(insulficiant) return;

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

    updateValuation({price, baseBalance, quoteBalance, totalInvested}, insulficiant) {
      if(insulficiant) return;

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

    priceAction(action, test) {

      if(action === 'INCREMENT') this.price++;
      if(action === 'DECREMENT') this.price--;

      this.actionType = action;

      // update Valuation
      this.updateValuation(this);

      // for testing and debugging
      this.testingLogs(test);

    },

    testingLogs(test) {
      if(test) console.log(this.displayAccount(this));
    },

  }

  return action => {
    
    let {pricAction} = crypto;
    switch (action) {
       case 'INCREMENT':
        crypto.priceAction('INCREMENT', true);
        break;
      case 'DECREMENT':
        crypto.priceAction('DECREMENT', true);
        break;
      case 'BUY':
        crypto.tradeOrder('buy', true);
        break;
      case 'SELL':
        crypto.tradeOrder('sell', true);
        break;
      default:
        return;
    }

  }

}