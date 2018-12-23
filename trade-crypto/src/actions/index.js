import axios from 'axios';


export const updateState = cryptoData => {
  
  if(cryptoData.type === 'doge-btc'){
    return { type: 'UPDATE_DOGE', payload: cryptoData };
  }
}

export const updateBalance = cryptoData => {
  console.log(cryptoData)
  if(cryptoData.transactionType === 'DEPOSIT') {

    return { type: 'UPDATE_DEPOSIT_BALANCE', payload: cryptoData };
  } else if(cryptoData.transactionType === 'WIDTHDRAW') {

    return { type: 'UPDATE_WIDTHDRAW_BALANCE', payload: cryptoData };
  } else if(cryptoData.transactionType === 'TRADE') {

    return { type: 'UPDATE_TRADE_BALANCE', payload: cryptoData };
  }
}

export const initiateInputs = cryptoInputs => {
  return { type: 'INIT_INPUTS', payload: cryptoInputs };
}

export const updateInputs = cryptoInputs => {

  // if(cryptoInputs.selection === 'orderType'){
  //   return { type: 'UPDATE_ORDER_TYPE', payload: cryptoInputs };
  // }

  // if(cryptoInputs.selection === 'transferType'){
  //   return { type: 'UPDATE_TRANSFER_TYPE', payload: cryptoInputs };
  // }

  return { type: 'UPDATE_INPUTS', payload: cryptoInputs };
}

export const fetchPrice = () => (dispatch) => {
  axios
    .get('https://api.pro.coinbase.com/products/BTC-USD/ticker')
    .then( response => { 
      console.log(response.data.price)
      dispatch({
        type: 'FETCH_PRICE_BTC_SUCCESS', 
        payload:  Number(response.data.price)
      })
    })
    .catch( err => { 
      dispatch({
        type: 'FETCH_PRICE_FAILURE', 
        payload:  err,
    })
  })
  
  axios
    .get('https://www.cryptopia.co.nz/api/GetMarket/DOGE_BTC')
    .then( response => { 
      dispatch({
        type: 'FETCH_PRICE_DOGE_SUCCESS', 
        payload:  response.data.Data.LastPrice * Math.pow(10, 8),
      })
    })
    .catch( err => { 
      dispatch({
        type: 'FETCH_PRICE_FAILURE', 
        payload:  err,
    })
  })
}

