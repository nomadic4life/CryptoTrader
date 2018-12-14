import React from 'react';

class Form extends React.Component {

  state = {
    dogePrice: '',
  }

  handleOnChange = e => {

    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  render() {

    return (
      <div>
        <h1>is working in Form.js</h1>
        <form onSubmit = { e => {
          e.preventDefault();
          this.props.handleOnSubmit(this.state);
        } }>
          <label>Doge Price: </label>
          <input
            name = {'dogePrice'}
            value = {this.state.dogePrice}
            placeholder = {'DOGE price'}
            onChange = {this.handleOnChange}
          />
          <button type = {'submit'}>submit</button>
        </form>
      </div>
    ) 
  }
}

export default Form;