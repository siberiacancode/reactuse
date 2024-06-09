import React, { useEffect } from 'react';
import { useInterval } from './useInterval';
import './useInterval.demo.css'

const greetings = ['Hello', 'Hi', 'Yo!', 'Hey', 'Hola', 'こんにちは', 'Bonjour', 'Salut!', '你好', 'Привет']

const PlainDemo = () => {
  const [word, setWord] = React.useState(greetings[0])
  const [intervalTime, setIntervalTime] = React.useState(500)
  
  const { isActive, resume, pause } =
    useInterval(
      () => setWord(greetings[Math.floor(Math.random() * greetings.length)]),
      intervalTime
    );

  return (
    <div>
      <h2>Plain Demo</h2>
      <p>{ word }</p>
      <p>
        interval: {intervalTime}
        <input value={intervalTime} onChange={e => setIntervalTime(e.target.value)} type="number" placeholder="interval" />
      </p>
      {isActive
        ? <button onClick={pause}>Pause</button>
        : <button onClick={resume}>Resume</button>
      }
    </div>
  );
}

const ImmediateDemo = () => {
  const [word, setWord] = React.useState(greetings[0])
  const [intervalTime, setIntervalTime] = React.useState(500)
  
  const { isActive, resume, pause } =
    useInterval(
      () => setWord(greetings[Math.floor(Math.random() * greetings.length)]),
      intervalTime,
      { immediate: false }
    );

  return (
    <div>
      <h2 className="yellow-color">Immediate Demo</h2>
      <p>Interval shouldn't start at initial render, but after pressing <code>Resume</code> button</p>
      <p>{ word }</p>
      <p>
        interval: {intervalTime}
        <input value={intervalTime} onChange={e => setIntervalTime(e.target.value)} type="number" placeholder="interval" />
      </p>
      {isActive
        ? <button className="yellow-background" onClick={pause}>Pause</button>
        : <button className="yellow-background" onClick={resume}>Resume</button>
      }
    </div>
  );
}

const ImmediateCallbackDemo = () => {
  const [word, setWord] = React.useState(greetings[0])
  const [intervalTime, setIntervalTime] = React.useState(50000)
  
  const { isActive, resume, pause } =
    useInterval(
      () => setWord(greetings[Math.floor(Math.random() * greetings.length)]),
      intervalTime,
      { immediateCallback: true }
    );

  return (
    <div>
      <h2 className="green-color">Immediate Callback Demo</h2>
      <p>By clicking <code>Resume</code> button callback will be called immediately</p>
      <p>{ word }</p>
      <p>
        interval: {intervalTime}
        <input value={intervalTime} onChange={e => setIntervalTime(e.target.value)} type="number" placeholder="interval" />
      </p>
      {isActive
        ? <button className="green-background" onClick={pause}>Pause</button>
        : <button className="green-background" onClick={resume}>Resume</button>
      }
    </div>
  );
}

const Demo = () => {
  return (
    <>
      <PlainDemo />
      <ImmediateDemo />
      <ImmediateCallbackDemo />
    </>
  )
};

export default Demo;
