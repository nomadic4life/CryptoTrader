import React from 'react';
import styled from 'styled-components';

const FormContent = styled.div`
  
  .trade-pair form {
    display: flex;
    flex-direction: column;
  }
`;

const TradeComponent = props => {

  return (
    <FormContent>
      
      <div className='trade-pair'>

        <form 
            autoComplete="off"
            onSubmit = { e => {
            e.preventDefault();
            props.handleOnSubmit(props.input, props.tradeType);
          } }>

          <label> {props.label.price} Price: </label>
          <input
            name = {'price'}
            value = {props.price}
            placeholder = {'0.00000000'}
            type = "text"
            onChange = {props.handleOnChange}
          />

          <label> {props.label.quote} Amount: </label>
          <input
            name = {'quote'}
            value = {props.quote}
            placeholder = {'0.00000000'}
            type = "text"
            onChange = {props.handleOnChange}
          />

          <label> {props.label.base} Quantity: </label>
          <input
            name = {'base'}
            value = {props.base}
            placeholder = {'0.00000000'}
            type = "text"
            onChange = {props.handleOnChange}
          />

          <label> Fee Total: </label>
          <input
            name = {'fee'}
            value = {props.fee}
            placeholder = {'0.00000000'}
            type = "text"
            readOnly
          />

          <label> {props.label.total} Total: </label>
          <input
            name = {'total'}
            value = {props.total}
            placeholder = {'0.00000000'}
            type = "text"
            readOnly
          />

          <button type = {'submit'}>submit</button>
        </form>

      </div>
    </FormContent>
  )
}

export default TradeComponent