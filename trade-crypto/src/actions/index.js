
export const updateState = cryptoData => {
  console.log(cryptoData)

  return { type: 'UPDATE_DATA', payload: cryptoData };
}

export const updateInputs = cryptoInputs => {
  console.log(cryptoInputs)

  return { type: 'UPDATE_INPUTS', payload: cryptoInputs };
}

