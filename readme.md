Specification

# minimumCapital: 0, 
  - USD amount
  - just for display to have a messure of unit of lowest amount of capital needed to invest with
  - is determine by price of doge decrementing 1 unit until doge is at the lowest posible price.

# startingCapital: 0, 
  - USD amount
  - just for display of initial capital
  - default to minimum capital unless specify

----###000---    ----###000---    ----###000---    ----###000---    ----###000---    ----###000---   

# usdCapitalBalance: 0, 
  - USD amount
  - total current capital balance deposited
  - this is for new money

# recurringCapital: 0,
  - USD amount
  - monthly rate of deposited capital added to current capital balance
  - monthly rate is 30 days
  - deposit amount is consistenly the same, can have teiring system base on timeline

# btcCapitalBalance: 0,
  - btc amount 
  - capital used in calculation for buying and selling. 
  - calculate first, then calculate btc balance or doge balance.

----###000---    ----###000---    

# btcPrice: 3547.65,
  - btc price, usd amount, btc-usd
  - current price of btc
  - will consistently stay the same during calculation for simplicity
  - considering to have random dynamicness base on some algorithmic conditions.

# price: 50,
  - doge price, btc amount, doge-btc
  - current price of doge
  - will increment and decrement by 1 unit

# minimumTradeRate: 50000,
  - lowest amout of btc to buy doge with
  - will use tradeMultiplier to determine the invest rate

# tradeMultiplier: 2, 
  - starting at 2, 
  - can increase base on total capital and PNE and other factors with in an algorithm
  - used to determine what the trade amount for doge should be
  - does more I will include later what else it factors in

# sellRate: 0.5, 
  - 50% is the starting rate, 
  - can be changed base on the algoritm. 50% to 100% is the starting range. below 50% will be base on algoritm.
  - determins how much doge to sell

# feeRate: 0.002,
  - fee to be added on to btc to determine total transaction cost
  - fee rate is 0.2% on one exchange will change depending if using other exchanges which will in the future if capital and btc balance is large enough

# dogeBalance: 0,
  - total doge currently holding

# btcBalance: 0,
  - total btc currently holding from selling doge
  - doesn't include btc balance capital
  - this is for profit and earnings

# totalInvested: 0,
  - total btc invested used to buy doge from btc capital balance (or other crypto if implemented)

# totalValue: 0, 
  - total valuation of holdings of both btc and doge balance in BTC amount

# usdValue: 0,
  - total valuation of holdings of both btc and doge balance in USD amount
 
# profitEarnings: 0,
  - unsure if it is working or necessary. but I think it is
  - BTC amount, shows positive or negative amount of total btc earn

# yields: 0,
  - total earnings in % format

# bottomBase: 50,
  - lowest trade of buying cycle
  - used in algorthim condition to calculate when to buy and how much to buy

# tradeCounter: 0,
  - tracks the amount of buys and sells made

# considering to add more properties to keep track of that is important for tracking and evaluation and calculations

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