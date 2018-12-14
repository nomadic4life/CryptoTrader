import React, { Component } from 'react';
import Form from './Components/Form'
import './App.css';

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

class App extends Component {

  state = {
    dogePrice: '',
    btcPrice: null,
    dogeQuantity: null,
    amount: '', // doge
    price: '',  // btc
    sum: '',  // btc
    fee: null,  // btc
    total: null,  // btc
  }

  handleOnSubmit = ({dogePrice, dogeAmount, btcSum}) => {

    console.log(dogePrice, dogeAmount, btcSum)

    console.log( dogePrice + '0'.repeat(8 - dogePrice.split('.')[1].length))

    

    this.setState({
      price:  dogePrice.split('.').length > 1 ? dogePrice + '0'.repeat(8 - dogePrice.split('.')[1].length) + ' BTC' : dogePrice + '.00000000 BTC' ,
      amount: dogeAmount.split('.').length > 1 ? dogeAmount + '0'.repeat(8 - dogeAmount.split('.')[1].length) + ' DOGE' : dogeAmount + '.00000000 DOGE' ,
      sum: btcSum.split('.').length > 1 ? btcSum + '0'.repeat(8 - btcSum.split('.')[1].length)  + ' BTC' : btcSum + '.00000000 BTC' ,
    })
  }

  render() {

    return (
      <div className="App">

        <Form 
          handleOnSubmit = {this.handleOnSubmit} 
        />

        <h1>{String(this.state.price)}</h1>
        <h1>{String(this.state.amount)}</h1>
        <h1>{String(this.state.sum)}</h1>

      </div>
    );
  }
}

export default App;
