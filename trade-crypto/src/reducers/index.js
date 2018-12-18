
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
    btcCaptialBalance: 0, // btc capital source from deposits
    usdValueCapitalBalance: 0, // btc capital source in usd value
    btcBalance: 10000000, // btc balance from sells
    dogeBalance: 0, // doge balance from buys
    usdBalance: 0, // usd balance not needed here for testing might remove
    btcTotalValueBalance: 0, // btc capital source + btc balance total
    usdTotalValueBalance: 0, // btc capital source + btc balance total in usde value
  },
  price: {
    btcPrice: 0, // btc-usd
    dogePrice: 0, // doge-btc
  },
  amount: {
    btcAmount: 0,
    dogeAmount: 0,
  },
  quantity: {
    btcQuantity: 0,
    dogeQuantity: 0,
  },
  fee: {
    buyBTC: 0.01,
    buyDOGE: 0.002,
  },
  total: 0,  // btc
  inputs: {
    price: '',
    amount: '',
    quantity: '',
    fee: '',
    total: '',
    balance: '',
    qBalance: '',
  },
  tradingPairs: [
    {
      id: 0,
      pair: 'doge-btc',
      amount: 'BTC',
      quantity: 'DOGE',
    },
    {
      id: 1,
      pair: 'btc-usd',
      amount: 'USD',
      quantity: 'BTC',
    },
  ],
  error: null,
}

export const cryptoReducer = (state = initialState, action) => {
  console.log(state)
  switch (action.type) {
    
    case 'FETCH_PRICE_BTC_SUCCESS':
      return ({
        ...state,
        price: {
          ...state.price,
          btcPrice: action.payload,
        },
        error: null,
      })

    case 'FETCH_PRICE_DOGE_SUCCESS':
      return ({
        ...state,
        price: {
          ...state.price,
          dogePrice: action.payload,
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
          ...state.price,
          btcBalance: action.payload.btcBalance,
          dogeBalance: action.payload.quantityBalance,
        },
        price: {
          ...state.price,
          dogePrice: action.payload.price,
        },
        quantity: {
          ...state.quantity,
          dogeQuantity: action.payload.quantity,
        },
        amount: {
          ...state.amount,
          btcAmount: action.payload.amount,
        },
      })

      case 'UPDATE_INPUTS':
        return ({
          ...state,
          inputs: {
            ...state.inputs,
            price: action.payload.price,
            amount: action.payload.amount,
            quantity: action.payload.quantity,
            fee: action.payload.fee,
            total: action.payload.total,
            balance: action.payload.balance,
            qBalance: action.payload.qBalance,
          }
        })
    default:
      return state
  }
}