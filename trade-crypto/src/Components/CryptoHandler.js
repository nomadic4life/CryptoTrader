export const toCryptoValue = function () {

  let stringNum = this.toString();
  if(typeof stringNum !== 'string') return `${stringNum} is not a string`;

  stringNum = stringNum.split('.');

  let value = stringNum[0] !== '0'
    ? `${stringNum[0]}${stringNum[1]}` + '0'.repeat(8 - stringNum[1].length )
    : `${stringNum[0]}${stringNum[1]}` + '0'.repeat(8 - stringNum[1].length );

  return Number(value);
};

export const toCryptoString = function () {
  let num = Number(this);
  if(typeof num !== 'number') return `${num} is not a number`;

  let value;
  num = Math.round(num);

  if(num >= 0) {

    num = num.toString();

    value = num.length < 8 
      ? '0.' + '0'.repeat(8 - num.length) + num 
      : `${num.slice(0,-8)}.${num.slice(-8)}`;

  } else {

    num = Math.abs(num).toString();
    
    value = num.length < 8 
      ? '-0.' + '0'.repeat(8 - num.length) + num 
      : `-${num.slice(0,-8)}.${num.slice(-8)}`;
  }

  return value;
};