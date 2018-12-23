

if( typePair === 'BTC-USD' ) {
  if(typeTransfer === 'DEPOSIT') { // deposit means buy

    orderType === 'BUY';
    balance.deposit['USD'] += quoteAmount; // add the amount used to purchase BTC
    balance.deposit['BTC'] += baseAmount; // add total BTC to BTC deposit

    balance.capital['USD'] += quoteAmount;  // might not need
    balance.capital['BTC'] += baseAmount;  // remaining balance of capital

    balance.valuation['USD'] = 0;  // btc valuation in USD value
    balance.valuation['BTC'] = 0;  // btc capital source +  btc holding + all crypto holding in btc value total in usd value

    // uddate valuation;
    if('sulficiant') console.log('placeholder');

    const transactionLedger = {
      order_id: 0 + 1,
      date: 0,
      price: 0, // price traded at
      quote: 0, // quote amount
      base: 0,  // base amount
      fee: 0,   // fee amount applied
      total: 0, // total of base amount fee applied

      tradeType: 'BUY', // buy || sell
      transferType: 'TRADE', // deposit || widthdraw || trade
      pair: 'BTC-USD', // base-quote string

      metadata: { // need think about what will be part of metadata
        buyRecord: 0,
        sellRecord: 0,
        high: 0, // highest sell
        low: 0, // lowest buy
        totalValue: 0,
        direction: 'increment', // incremnt price going up, decrement price going down
      },

    }
  }
  varifyInput
  -checkPairType
  -checkTransferType
  -checkOrderType
  -previewOrderCalculations
  -checkSulficiantFunds

  fillOrderIfConditionsMeet
  -updateBalance
  -updateAccountStats
  -updateValuation
  -updateLedger
  -clearInputs

} else if(typePair !== 'BTC-USD') {

  // base-quote
  'DOGE-BTC'
  typeTransfer === 'TRADE';
  orderType === 'BUY';


  
  if(quote === 'BTC' && balance.capital['quote'] > baseAmount) balance.capital['quote'] -= baseAmount;
  else if(balance.holding['quote'] > baseAmount) balance.holding['quote'] -= baseAmount;
  else 'insulficiant' 
  // subtract from btc capital balance if enough to fill order or from btc holding if enough to fill or other crypto holding balance if enough to fill or don't fill order if insulficiant funds
  
  if('sulficiant') balance.holding['base'] += quoteAmount; 
  // add to base holding if sulficant funds

  
  // add transaction to ledger
  if('sulficiant') {
    const transactionLedger = {
      order_id: 0 + 1,
      date: Date.now(),
      price: price, // price traded at
      quote: quote, // quote amount
      base: base,  // base amount
      fee: fee,   // fee amount applied
      total: total, // total of base amount fee applied
      
      tradeType: 'BUY', // buy || sell
      transferType: 'TRADE', // deposit || widthdraw || trade
      pair: 'BTC-USD', // base-quote string
      
      metadata: { // need think about what will be part of metadata
        buyRecord: 0,
        sellRecord: 0,
        high: 0, // highest sell
        low: 0, // lowest buy
        totalValue: 0,
        direction: 'increment', // incremnt price going up, decrement price going down
      },
    };
    
  };

  // uddate valuation;
  if('sulficiant') console.log('placeholder');
  
  // balance.valuation['USD'] = 0;  // btc valuation in USD value
  // balance.valuation['BTC'] = 0;  // btc capital source +  btc holding + all crypto holding in btc value total in usd value
}

'BTC-USD'
  buy = deposit
  sell = widthdraw

'DOGE-BTC'
  trade = buy || sell


  if(buyOrderFilled){
    totalBuys = totalBuys + 1;
  }

const sellAlgorithm = () => {
  let isInsulficiant = false;

  if(sellOrderFilled) {

    totalSells = totalSells + 1;

    if(totalBuys - totalSells <= 2 && totalBuys - totalSells >= 0) {
      let sellHalf = ( lastBuy[totalBuys - totalSells].quote / minimumQuote >= 2 && lastBuy[totalBuys - totalSells].quote <= 4 ); // need rename

      // different kind of algorithm for selling
      if(totalBuys - totalSells === 2) {

        if( sellHalf && totalSells === 1 ) {

          // sell half quote@lastBuyOrder[totalBuys - totalSells]
          quoteAmount = ( minimumQuote * lastBuy[totalBuys - totalSells].quote / minimumQuote );
          baseAmount = ( 1 / currentPrice * quoteAmount );
        } 

      } else if(totalBuys - totalSells === 1) {

        if( sellHalf && totalSells === 1 ) {

          // sell half quote@lastBuyOrder[totalBuys - totalSells]
          quoteAmount = ( minimumQuote * lastBuy[totalBuys - totalSells].quote / minimumQuote );
          baseAmount = ( 1 / currentPrice * quoteAmount );
        }else  if( sellHalf && totalSells === 2 ) {

          quoteAmount = ( minimumQuote * lastBuy[totalBuys - totalSells].quote / minimumQuote ) + ( minimumQuote * lastBuy[totalBuys - totalSells + 1].quote / minimumQuote ) / 2;
          baseAmount = ( 1 / currentPrice * quoteAmount );
        }

      } else  if(totalBuys - totalSells === 0) {

        if( sellHalf && totalSells === 1 ) {

          // sell half quote@lastBuyOrder[totalBuys - totalSells]
          quoteAmount = ( minimumQuote * lastBuy[totalBuys - totalSells].quote / minimumQuote );
          baseAmount = ( 1 / currentPrice * baseAmount );
        }else if( sellHalf && totalSells === 2 ) {

          quoteAmount = ( minimumQuote * lastBuy[totalBuys - totalSells].quote / minimumQuote ) + ( minimumQuote * lastBuy[totalBuys - totalSells + 1].quote / minimumQuote ) / 2;
          baseAmount = ( 1 / currentPrice * quoteAmount );
        }else if( sellHalf && totalSells === 3 ) {

          quoteAmount = ( minimumQuote * lastBuy[totalBuys - totalSells].quote / minimumQuote ) + (( minimumQuote * lastBuy[totalBuys - totalSells + 1].quote / minimumQuote ) / 2) + (( minimumQuote * lastBuy[totalBuys - totalSells + 2].quote / minimumQuote ) / 2);
          baseAmount = ( 1 / currentPrice * quoteAmount );
        }

      }

    }else if(totalBuys - totalSells > 2) {

      // different kind of algorithm for selling
      if( lastBuy[totalBuys - totalSells].quote / minimumQuote <= 2 && lastBuy[totalBuys - totalSells].quote >= 1 ) {

        // sell minimumQuote
        baseAmount = (1 / currentPrice * minimumQuote);
        quoteAmount = minimumQuote;
      } else if( lastBuy[totalBuys - totalSells].quote / minimumQuote >= 2 && lastBuy[totalBuys - totalSells].quote <= 4 ) {

        // sell half quote@lastBuyOrder[totalBuys - totalSells]
        baseAmount = ( 1 / currentPrice * ( minimumQuote * lastBuy[totalBuys - totalSells].quote / minimumQuote ) );
        quoteAmount = ( minimumQuote *  2 );
      }
    }

    return { baseAmount, quoteAmount, isInsulficiant }    
  } else return { isInsulficiant: true };

}

let { baseAmount, quoteAmount, isInsulficiant } = sellAlgorithm();
if(isInsulficiant) {

  // something here
} else {

  // update last sell
  lastSell[totalSells] = {
    quote: quoteAmount,
    base: baseAmount,
  }

  // updating balance
  balance[base] = balance[base] - baseAmount;
  balance[quote] = balance[quote] + quoteAmount;
}


