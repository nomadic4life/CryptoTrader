
// initial state
// needed Inputs
// btc price
// doge price
// usd capital
// total trades or days to trade
// trade cycle
// term period || term rate
// recurring capital
// daily trade rate
// randomize true or false // trade cycle // daily trade rate

// minimumTradeRate: 50000,
// tradeMultiplier: 2,
// sellRate: 0.5,
// buyRate: [],
// feeRate: 0.002,

// presistent data
// btc capital balance
// usd value capital balance
// btc balance
// doge balance
// usd balance

// Initial state
const initialState = {
  balance: {
    capital: {
      USD: 0,     // usd balance not needed here for testing might remove
      BTC: 0,     // btc capital source from deposits
      DOGE: 0,    // might not need
    },
    capitalValue: {
      USD: 0,     // btc capital source in usd value
    },
    holding: {
      USD: 45,     // btc capital source in usd value maybe... could be for something else
      BTC: 10000000,     // btc balance from sells
      DOGE: 0,    // doge balance from buys
    },
    value: {
      USD: 0,     // btc capital source + btc balance total
      BTC: 0,     // btc capital source + btc balance total in usde value
    },
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
  fee: {
    gdxFee: 0.01,
    cryptopiaFee: 0.002,
  },
  inputs: {
    price: '',
    quote: '',
    base: '',
    fee: '',
    total: '',
    totalQuoteBalance: '', // qBalance
    totalBaseBalance: '',
  },
  tradingPairs: [
    {
      id: 0,
      pair: 'doge-btc', // base-quote
      quote: 'BTC', // amount
      base: 'DOGE', // quantity
      isSelling: false,
    },
    {
      id: 1,
      pair: 'btc-usd',
      quote: 'USD', // amount
      base: 'BTC',  // quantity
      isSelling: true,
    },
  ],
  error: null,

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
        price: {
          ...state.price,
          DOGE: action.payload.price,
        },
        base: {
          ...state.quantity,
          DOGE: action.payload.base,
        },
        quote: {
          ...state.amount,
          BTC: action.payload.quote,
        },
      })

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
            totalQuoteBalance: action.payload.totalQuoteBalance, // qBalance
            totalBaseBalance: action.payload.totalBaseBalance,
          }
        })
    default:
      return state
  }
}