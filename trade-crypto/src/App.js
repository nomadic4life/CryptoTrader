import React, { Component } from 'react';
import Form from './Components/Form'
import './App.css';

class App extends Component {

  state = {
    dogePrice: '',
  }

  handleOnSubmit = ({dogePrice}) => {
    console.log(dogePrice)
    this.setState({
      dogePrice: dogePrice
    })
  }

  render() {
    return (
      <div className="App">
        <Form 
          handleOnSubmit = {this.handleOnSubmit} 
        />
        <h1>{this.state.dogePrice}</h1>
      </div>
    );
  }
}

export default App;
