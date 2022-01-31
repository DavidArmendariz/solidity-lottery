import React, { useEffect, useState } from 'react';
import lottery from './lottery';
import web3 from './web3';

const App = () => {
  const [manager, setManager] = useState('');
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getData = async () => {
      const manager = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address);
      setManager(manager);
      setPlayers(players);
      setBalance(balance);
    };

    getData();
  }, []);

  const enterLottery = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction to be successful...');
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei(value, 'ether') });
    setMessage('You entered the lottery!');
  };

  const pickWinner = async () => {
    const accounts = await web3.eth.getAccounts();
    setMessage('Waiting on transaction to be successful...');
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    setMessage('A winner has been picked!');
  };

  const etherBalance = web3.utils.fromWei(balance, 'ether');

  return (
    <div>
      <h1>Lottery Contract</h1>
      <p>This contract is managed by: {manager}</p>
      <p>
        There are currently {players.length} people competing to win{' '}
        {etherBalance} ether!
      </p>
      <hr />
      <form onSubmit={enterLottery}>
        <h4>Try your luck!</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={pickWinner}>Pick a winner</button>
      <hr />
      <p>{message}</p>
    </div>
  );
};

export default App;
