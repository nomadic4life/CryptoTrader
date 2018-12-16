

// Initial state
const initialState = {
  balance: {
    btcCaptialBalance: 0, // btc capital source from deposits
    usdValueCapitalBalance: 0, // btc capital source in usd value
    btcBalance: 0, // btc balance from sells
    dogeBalance: 0, // doge balance from buys
    usdBalance: 0, // usd balance not needed here for testing might remove
    btcTotalValueBalance: 0, // btc capital source + btc balance total
    usdTotalValueBalance: 0, // btc capital source + btc balance total in usde value
  },
  price: {
    dogePrice: 0, // doge-btc
    btcPrice: 0, // btc-usd
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
}

export const cryptoReducer = (state = initialState, action) => {
  console.log(state)
  switch (action.type) {
    case 'UPDATE_DATA':
      return ({
        ...state,
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
    default:
      return state
  }
}