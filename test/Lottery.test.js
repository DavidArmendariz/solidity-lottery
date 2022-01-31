import ganache from 'ganache';
import Web3 from 'web3';
import Lottery from '../lottery';

const provider = ganache.provider();
const web3 = new Web3(provider);

let accounts;
let lottery;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  lottery = await new web3.eth.Contract(Lottery.abi)
    .deploy({
      data: Lottery.evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: 1000000 });
});

describe('Lottery', () => {
  it('deploys a contract', () => {
    expect(lottery.options.address).toBeDefined();
  });

  it('allows one account to enter', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei('0.02', 'ether') });
    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });
    expect(players).toHaveLength(1);
    expect(players[0]).toEqual(accounts[0]);
  });

  it('allows multiple accounts to enter', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei('0.02', 'ether') });
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei('0.02', 'ether') });
    await lottery.methods
      .enter()
      .send({ from: accounts[2], value: web3.utils.toWei('0.02', 'ether') });
    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });
    expect(players).toHaveLength(3);
    expect(players[0]).toEqual(accounts[0]);
    expect(players[1]).toEqual(accounts[1]);
    expect(players[2]).toEqual(accounts[2]);
  });

  it('requires a minimum amount of ether to enter', async () => {
    try {
      await lottery.methods.enter().send({ from: accounts[0], value: 0 });
      fail('Lottery accepted a wrong amount of ether');
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('only manager can call pickWinner', async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[1] });
      fail('Only contract creator can call pickWinner method');
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('sends money to winner and resets the players array', async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei('2', 'ether') });
    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;
    expect(difference > web3.utils.toWei('1.8', 'ether')).toBe(true);
  });
});
