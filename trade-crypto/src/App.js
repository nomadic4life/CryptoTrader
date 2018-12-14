import React, { Component } from 'react';
import Form from './Components/Form'
import './App.css';

class App extends Component {

  state = {
    dogePrice: '',
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
      price: dogePrice,
    })
  }

  render() {

    return (
      <div className="App">

        <Form 
          handleOnSubmit = {this.handleOnSubmit} 
        />

        <h1>{String(this.state.price)}</h1>

      </div>
    );
  }
}

export default App;
