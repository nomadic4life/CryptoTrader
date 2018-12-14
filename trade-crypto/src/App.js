import React, { Component } from 'react';
import Form from './Components/Form'
import './App.css';

class App extends Component {

  state = {
    dogePrice: null,
    btcPrice: null,
    dogeQuantity: null,
    amount: null,  // doge
    price: null,  // btc
    sum: null,  // btc
    fee: null,  // btc
    total: null,  // btc
  }

  handleOnSubmit = ({dogePrice, dogeAmount, btcSum}) => {
    console.log(dogePrice, dogeAmount, btcSum)
    this.setState({
      price: dogePrice * Math.pow( 10, 8),
    })
  }

  render() {

    return (
      <div className="App">

        <Form 
          handleOnSubmit = {this.handleOnSubmit} 
        />

        <h1>{this.state.dogePrice / Math.pow(10,8)}</h1>

      </div>
    );
  }
}

export default App;
