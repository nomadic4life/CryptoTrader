
export const updateState = cryptoData => {
  console.log(cryptoData)
  if(cryptoData.type === 'doge-btc'){
    return { type: 'UPDATE_DOGE', payload: cryptoData };
  }
}

export const updateInputs = cryptoInputs => {
  console.log(cryptoInputs)

  return { type: 'UPDATE_INPUTS', payload: cryptoInputs };
}

