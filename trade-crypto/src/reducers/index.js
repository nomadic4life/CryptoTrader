
// initial state
// needed Inputs
// total trades or days to trade
// trade cycle
// daily trade rate
// randomize true or false // trade cycle // daily trade rate

// presistent data
// btc capital balance
// usd value capital balance

// Initial state
const initialState = {
  balance: {
    deposits: {     // Might go in account stats
      USD: 0,       // total accumulated deposits
      BTC: 0,       // value of usd deposits in btc at time of deposit
    },
    capital: {
      BTC: 0,       // btc capital source from deposits
      DOGE: 0,      // might not need
    },
    holding: {
      USD: 0,       // current USD holding in balance
      BTC: 10000000,     // btc balance from sells - trades
      DOGE: 0,      // doge balance from buys - trades
    },
    valuation: {
      USD: 0,       // btc valuation in USD value
      BTC: 0,       // btc capital source +  btc holding + all crypto holding in btc value total in usd value
    },
    pairValuation: {
      'BTC-USD': 0, // BTC holding + DOGE holding in btc value
    },
    proceeds: {
      earnings: 0,  //  btc valuation - btc deposit
      earningsRatio: 0,
      yeild: 0,     //  earnings / btc deposit * 100
    },

    accountStats: {
      current_order_id: 0,
      totalInvested: {  // in btc value, investement are buy orders from capital btc
        doge: 0,        // total invested in btc value from capital to holding
      }
    }, // will add info
    // btcCaptialBalance: 0, // btc capital source from deposits
    // usdValueCapitalBalance: 0, // btc capital source in usd value
    // btcBalance: 10000000, // btc balance from sells
    // dogeBalance: 0, // doge balance from buys
    // usdBalance: 0, // usd balance not needed here for testing might remove
    // btcTotalValueBalance: 0, // btc capital source + btc balance total
    // usdTotalValueBalance: 0, // btc capital source + btc balance total in usde value
  },
  price: {
    BTC: 0, // btc-usd
    DOGE: 0, // doge-btc
  },
  inputs: {
    price: '',
    quote: '',  // order amount
    base: '',   // quantity amount
    //computed Inputs
    fee: '',
    total: '',
    totalQuoteBalance: '', // qBalance
    totalBaseBalance: '',
    // selection choices
    orderType: '', // buy || sell
    transactionType: '', // trade || deposit || widthdraw
    pair: '', 
    // isSelling: false, // might not need this property if have orderType
  },
  mensurativeComputation: {
    feeRate: {
      gdxFee: 0.01,
      cryptopiaFee: 0.002,
    },
    minimumTradeRate: 50000,
    tradeMultiplier: 2,
    sellRate: 0.5,  // might change
    buyRate: [],    // might change
    recuringCapital: 0,
    termPeriod: 0,  // term rate
  },
  tradingPairs: [
    {
      id: 0,
      pair: 'DOGE-BTC', // base-quote
      quote: 'BTC', // amount
      base: 'DOGE', // quantity
      metadata: {
        totalInvested: 0,
      },
    },
    {
      id: 1,
      pair: 'BTC-USD',
      quote: 'USD', // amount
      base: 'BTC',  // quantity
      metadata: {},
    },
  ],
  error: null,
  transactionLedger: [ // might just call ledger
    {
      order_id: 0,
      date: 0,
      price: 0,
      quote: 0,
      base: 0,
      fee: 0,
      total: 0,
      tradeType: 'buy', // buy || sell
      transactionType: 'deposit', // deposit || widthdraw || trade
      pair: 'BTC-USD', // base-quote string
      metadata: { // need think about what will be part of metadata
        buyRecord: 0,
        sellRecord: 0,
        high: 0, // highest sell
        low: 0, // lowest buy
        totalValue: 0,
        direction: 'increment', // incremnt price going up, decrement price going down
      },
    },
  ],

  // for testing purposes. trying to think what these are for. 
  // thinking about just using balance and holding
  quote: {
    BTC: 10,
    DOGE: 10,
  },
  base: {
    BTC: 10,
    DOGE: 10,
  },
  total: 0,  // btc
}

export const cryptoReducer = (state = initialState, action) => {

  switch (action.type) {
    
    case 'FETCH_PRICE_BTC_SUCCESS':
      return ({
        ...state,
        price: {
          ...state.price,
          BTC: action.payload,
        },
        error: null,
      })

    case 'FETCH_PRICE_DOGE_SUCCESS':
      return ({
        ...state,
        price: {
          ...state.price,
          DOGE: action.payload,
        },
        error: null,
      })

    case 'FETCH_PRICE_FAILURE':
      return ({
        ...state,
        error: action.payload,
      })

    case 'UPDATE_DEPOSIT_BALANCE':
      return ({
        ...state,
        balance: {
          ...state.balance,
          deposits: {
            ...state.balance.deposits,
            [action.payload.quoteLabel]: action.payload.depositQuote,
            [action.payload.baseLabel]: action.payload.depositBase,
          },
          capital: {
            ...state.balance.holding,
            [action.payload.quoteLabel]: action.payload.capitalQuote,
            [action.payload.baseLabel]: action.payload.capitalBase,
          }
        }
      })
    case 'UPDATE_WIDTHDRAW_BALANCE':
      return ({
        ...state,
        balance: {
          ...state.balance,
          holding: {
            ...state.balance.holding,
            [action.payload.baseLabel]: action.payload.holdingBase,
          }
        }
      })

    case 'UPDATE_TRADE_BALANCE':
      return ({
        ...state,
        balance: {
          ...state.balance,
          holding: {
            ...state.balance.holding,
            [action.payload.quoteLabel]: action.payload.holdingQuote,
            [action.payload.baseLabel]: action.payload.holdingBase,
          }
        }
      })

    case 'UPDATE_DOGE':
      return ({
        ...state,
        balance: {
          ...state.balance,
          holding: {
            ...state.balance.holding,
            BTC:  action.payload.totalQuoteBalance,
            DOGE: action.payload.totalBaseBalance,
          },
        },
        // price: {
        //   ...state.price,
        //   DOGE: action.payload.price,
        // },
        // base: {
        //   ...state.quantity,
        //   DOGE: action.payload.base,
        // },
        // quote: {
        //   ...state.amount,
        //   BTC: action.payload.quote,
        // },
      })

      // case 'UPDATE_transaction_TYPE':
      //   return ({
      //     ...state,
      //     inputs: {
      //       ...state.inputs,
      //       transactionType: action.payload.transactionType,
      //     }
      //   })

      // case 'UPDATE_ORDER_TYPE':
      //   return ({
      //     ...state,
      //     inputs: {
      //       ...state.inputs,
      //       orderType: action.payload.orderType,
      //     }
      //   })

      case 'UPDATE_INPUTS':

        return ({
          ...state,
          inputs: {
            ...state.inputs,
            price: action.payload.price,
            quote: action.payload.quote,
            base: action.payload.base,
            fee: action.payload.fee,
            total: action.payload.total,
            totalQuoteBalance: action.payload.totalQuoteBalance,
            totalBaseBalance: action.payload.totalBaseBalance,
            orderType: action.payload.orderType,
            transactionType: action.payload.transactionType,
            pair: action.payload.pair, 
          }
        })
    default:
      return state
  }
}