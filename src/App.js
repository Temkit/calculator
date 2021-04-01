import React, { useState, useEffect } from 'react';
import './App.css';

const ADD_SYMBOL = '+';
const SUB_SYMBOL = '-';
const DIV_SYMBOL = '/';
const MUL_SYMBOL = '*';

const CLEAR_SYMBOL = 'C';
const EQ_SYMBOL = '=';

const DIGITS = new Array(10)
  .fill(null)
  .map((_, i) => ({ value: `${i}`, className: `digit-${i}` }));
const OPERATIONS = [
  { value: ADD_SYMBOL, className: 'op-add', operation: (a, b) => a + b },
  { value: SUB_SYMBOL, className: 'op-sub', operation: (a, b) => a - b },
  { value: MUL_SYMBOL, className: 'op-mul', operation: (a, b) => a * b },
  {
    value: DIV_SYMBOL,
    className: 'op-div',
    operation: (a, b) => Math.ceil(a / b),
  },
];
const CONTROLS = [
  { value: EQ_SYMBOL, className: 'eq' },
  { value: CLEAR_SYMBOL, className: 'clear' },
];

const INITIAL_STATE = {
  result: 0,
  output: '',
  leftPart: '',
  rightPart: '',
  lastOperation: null,
};

const Calculator = () => {
  const [state, setState] = useState(INITIAL_STATE);

  const checkDigit = (userInput) => {
    const { leftPart, rightPart, lastOperation, output } = state;
    let newState;

    const lastUserInput = output.split('').slice(-1).pop();
    console.log(leftPart[0], lastUserInput);

    if (!rightPart && parseInt(leftPart) === 0 && !isNaN(lastUserInput)) {
      newState = {
        leftPart: userInput,
        output: output.replace(/.$/, userInput),
      };
    } else if (parseInt(rightPart) === 0 && !isNaN(lastUserInput)) {
      newState = {
        rightPart: userInput,
        output: output.replace(/.$/, userInput),
      };
    } else if (
      !leftPart &&
      lastOperation &&
      lastOperation.value === SUB_SYMBOL
    ) {
      newState = {
        leftPart: `-${userInput}`,
        output: `-${userInput}`,
        lastOperation: null,
      };
    } else if (!leftPart) {
      newState = { leftPart: userInput, output: userInput };
    } else if (!lastOperation) {
      newState = { leftPart: leftPart + userInput, output: output + userInput };
    } else if (lastOperation.value === DIV_SYMBOL && rightPart === SUB_SYMBOL) {
      newState = {
        rightPart: rightPart + userInput,
        output: output + userInput,
      };
    } else if (lastOperation) {
      newState = {
        rightPart: rightPart + userInput,
        output: output + userInput,
      };
    }

    console.log(newState);
    setState({ ...state, ...newState });
  };

  const checkOperation = (userTapedOperation) => {
    const { leftPart, rightPart, lastOperation, output } = state;
    let newState;

    const lastUserInput = output.split('').slice(-1).pop();

    if (!leftPart && userTapedOperation.value !== SUB_SYMBOL) {
      return;
    } else if (
      !rightPart &&
      lastOperation &&
      (lastUserInput === ADD_SYMBOL || lastUserInput === SUB_SYMBOL)
    ) {
      newState = {
        lastOperation: userTapedOperation,
        output: output.replace(/.$/, userTapedOperation.value),
      };
    } else if (
      !rightPart &&
      lastOperation &&
      lastUserInput === DIV_SYMBOL &&
      userTapedOperation.value === SUB_SYMBOL
    ) {
      newState = {
        rightPart: SUB_SYMBOL,
        output: output + userTapedOperation.value,
      };
    } else if (rightPart && isNaN(lastUserInput)) {
      console.log('HERE', lastUserInput);
      const result = calculate();
      newState = {
        result,
        leftPart: `${result}`,
        rightPart: '',
        lastOperation: userTapedOperation,
        output: output + userTapedOperation.value,
      };
    } else {
      newState = {
        lastOperation: userTapedOperation,
        output: output + userTapedOperation.value,
      };
    }

    setState({ ...state, ...newState });
  };

  useEffect(() => {
    console.log(state);
  }, [state]);

  const checkControl = (userTapedControl) => {
    let newState;

    if (userTapedControl.value === CLEAR_SYMBOL) {
      newState = INITIAL_STATE;
    } else if (userTapedControl.value === EQ_SYMBOL) {
      const result = calculate();
      newState = { ...INITIAL_STATE, leftPart: result, output: `${result}` };
    }

    setState({ ...state, ...newState });
  };

  const calculate = () => {
    const { result, leftPart, rightPart, lastOperation } = state;
    if (leftPart && rightPart) {
      return lastOperation.operation(
        parseInt(result || leftPart),
        parseInt(rightPart),
      );
    }
  };

  /*  const initStatesAndDisplay=(newresult="",newleftPart,newrightPart="",newlastOperation="")=>{
    console.log(newresult,newleftPart,newrightPart,newlastOperation)
    setLeftPart(newleftPart || newresult)
    setRightPart(newrightPart)
    setLastOperation(newlastOperation)
    setOutput(newresult)
  }
  
  
 useEffect(() => {
     setOutput(`${output}${leftPart || ""}`)
  },[leftPart])
  
  
  useEffect(() => {
     setOutput(`${output}${(lastOperation && lastOperation.value) || ""}`)
  },[lastOperation])
  
  
  useEffect(() => {
     setOutput(`${output}${rightPart || ""}`)
  },[rightPart])
  
  useEffect(() => {
     result && setOutput(result)
  },[result])*/

  return (
    <div className="calculator font">
      <div className="output">{state.output}</div>
      {DIGITS.map(({ value, className }) => (
        <input
          type="button"
          value={value}
          className={`${className} digit`}
          key={value}
          onClick={() => checkDigit(value)}
        />
      ))}

      {OPERATIONS.map(({ value, className, operation }) => (
        <input
          type="button"
          value={value}
          className={`${className} operation`}
          key={value}
          onClick={() => checkOperation({ value, className, operation })}
        />
      ))}

      {CONTROLS.map(({ value, className }) => (
        <input
          type="button"
          value={value}
          className={`${className} control`}
          key={value}
          onClick={() => checkControl({ value, className })}
        />
      ))}
    </div>
  );
};

export default Calculator;
