import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  
  .balance {
    display: flex;
    flex-direction: column;
  }
`;

const BalanceContainer = props => {

  return (
    <Container>
      
      <div className='balance'>
        
        <label> USD balance: </label>
        <input
          name = {'usdBalance'}
          value = { props.toDollarString(props.balance.USD) }
          placeholder = {'$0.00'}
          type = "text"
          readOnly
        />

        <label> BTC balance: </label>
        <input
          name = {'btcBalance'}
          value = { props.toCryptoString(props.balance.BTC)}
          placeholder = {'0.00000000'}
          type = "text"
          readOnly
        />

        <label> DOGE Balance: </label>
        <input
          name = {'dogeBalance'}
          value = { 
          props.toCryptoString(props.balance.DOGE)}
          placeholder = {'0.00000000'}
          type = "text"
          readOnly
        />

      </div>

    </Container>
  )
}

export default BalanceContainer