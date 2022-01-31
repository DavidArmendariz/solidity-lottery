# Solidity Lottery

Very simple project: a smart contract for a lottery. It uses Infura API to connect to the Rinkeby test network to deploy the contract.

# Deploy the contract

Make sure you have the correct environment variables (seed phrase of deployer and Infura URL to deploy to Rinkeby). Then run these commands:

```shell
nvm use
npm install
npx babel-node deploy.js
```

## Tests

```shell
npm test
```

## React Project

In `lottery.js`, make sure to include your contract address and ABI. Then start the project by running these commands:

```shell
cd lottery-react
yarn start
```

## Troubleshooting

If you encounter this error while starting the React app:

```
There might be a problem with the project dependency tree.
It is likely not a bug in Create React App, but something you need to fix locally.

The react-scripts package provided by Create React App requires a dependency:

  "babel-jest": "^26.6.0"
```

That's because React complains about using `babel-jest` in the parent directory (which is the root directory in our case). Remove `node_modules` from root directory and the problem should go away or add `SKIP_PREFLIGHT_CHECK=true` to an `.env` file or start the app with `SKIP_PREFLIGHT_CHECK=true yarn start`.
