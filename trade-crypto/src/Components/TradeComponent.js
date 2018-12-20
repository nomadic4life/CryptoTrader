import React from 'react';
import styled from 'styled-components';

const FormContent = styled.div`
  
  .trade-pair form {
    display: flex;
    flex-direction: column;
  }
  .order-box-buy {
    cursor: pointer;
    border: 1px solid black;
    width: 50%;
    display: inline;
    // justify-content: space-around;
    
    .order-type-buy {
      background: lightgreen;
    }
    
    .order-type-sell {
      background: lightgrey;
      color: white;
    }
  }

  .order-box-sell {
    cursor: pointer;
    border: 1px solid black;
    width: 50%;
    display: inline;
    // justify-content: space-around;
    
    .order-type-buy {
      background: lightgrey;
      color: white;
    }
    
    .order-type-sell {
      background: red;
    }
  }

  span {
    padding: 0 12px;
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
            onChange = {e => props.handleOnChange( e, props.tradeType)}
          />

          <label> {props.label.quote} Amount: </label>
          <input
            name = {'quote'}
            value = {props.quote}
            placeholder = {'0.00000000'}
            type = "text"
            onChange = {e => props.handleOnChange( e, props.tradeType)}
          />

          <label> {props.label.base} Quantity: </label>
          <input
            name = {'base'}
            value = {props.base}
            placeholder = {'0.00000000'}
            type = "text"
            onChange = {e => props.handleOnChange( e, props.tradeType)}
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

        <div 
          onClick={ () => props.handleOrderType(props.tradeType.orderType, props.tradeType)} 
          className={`order-box-${props.tradeType.orderType === 'BUY' ? `buy` : `sell`}`}>

          <span className={`order-type-buy`}>BUY</span>
          <span className={`order-type-sell`}>SELL</span>

        </div>

        <div>trade or deposit or widthdraw</div>
        {/* <div>pair btc-usd</div> */}


      </div>
    </FormContent>
  )
}

export default TradeComponent