
export const updateState = cryptoData => {
  console.log(cryptoData)

  return { type: 'UPDATE_DATA', payload: cryptoData };
}

