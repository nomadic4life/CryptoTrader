import React from 'react';
import styled from 'styled-components';

const Price = styled.div`
  text-align: left;
  font-size: 20px;
  font-family: 'Lato', sans-serif;

  .padding-zero {
    color: lightgrey;
  }

  .trailing-zero {
    color: lightgrey;
  }
`;

const Display = props => {

  function numberFormating(num){
    
    if(num[0] === '0' && num[1] === '.') {
      let split = num.split('.')[1];
      let paddingZero = `${num.split('.')[0]}.`;
      let value = '';

      for(let i = 0; i < 8; i++){
        if(split[i] === '0' && value === '') {
          paddingZero += split[i];
        } else {
          value += split[i];
        };
      }

      return (
        <React.Fragment>
          <span className='padding-zero'>{paddingZero}</span>
          <span className='value'>{value}</span>
        </React.Fragment>
      )

      // for(let i = 0; i < 10 - paddingZero.length; i++){
      //   console.log('here', num[num.length - 1 - i], num.length - 1-i, i)
      //   if(num[num.length - 1 - i] === '0') {
      //     trailingZero = num[num.length - 1 - i] + trailingZero;
      //   } else {
      //     console.log('here value')
      //     value = num[num.length - 1 - i] + value;
      //   }
      // }
      
    } else {

      let split = num.split('.')[1];
      let trailingZero = '';
      let value = num.split('.')[0];

      for(let i = 0; i < split.length; i++) {
        if(i === 0 && split[i] === '0') {
          trailingZero = '.0';
        } else if(i === 0) {
          value += '.' + split[0];
        }

        if(i > 0 && split[i] === '0'){
          trailingZero += '0';
        } else if(i > 0) {
          value += split[i];
        }
      }

      return (
        <React.Fragment>
          <span className='value'>{value}</span>
          <span className='trailing-zero'>{trailingZero}</span>
        </React.Fragment>
      )

    }

  }

  let display = numberFormating('1.23450000');

  return (
    <Price>
      {display}
      <div>{props.btcPrice} USD last trade price</div>
      <div>{props.dogePrice} DOGE last trade price</div>
    </Price>
  )
  
}

export default Display