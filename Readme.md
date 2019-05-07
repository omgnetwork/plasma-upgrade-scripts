# Plasma Upgrade Scripts

This is an example demonstration of performing network upgrade on OMG network's plasma chain and not ideal for production usage. For brevity, the scripts will make certain set of assumptions:

1. you have only one wallet to migrate your funds from 
2. the chain you are upgrading from has not gone byzantine, and making transactions is still possible
3. you are only migrating ETH
4. you have acccess to your raw private key

## Installing

Make sure you have _node.js_ and _npm_ install on your local machine

First, clone the upgrade scripts repo: https://github.com/omisego/plasma-upgrade-scripts

Second, install all needed dependencies by running `npm install` inside the project root directory


## Getting Started

First you must set the variables of the config file. Navigate to `config.js` and change these values:

```
let variables = {
  ADDRESS: "<WALLET_ADDRESS>",
  PRIVATEKEY: "<WALLET_PRIVATE_KEY>",
  ETH_CLIENT: "<ETHEREUM_NODE>",
  WATCHER: "<WATCHER_URL>",
  OLD_CONTRACT: "<OLD_ROOTCHAIN_PLASMA_CONTRACT>",
  NEW_CONTRACT: "<NEW_ROOTCHAIN_PLASMA_CONTRACT>",
  DEPOSIT_AMOUNT: <AMOUNT_TO_REDEPOSIT_IN_WEI>
}
```

### Consolidating Exits

As the gas cost of calling exits on your UTXOs will grow linearly, before calling exits you should consolidate all your UTXOs into one. So, run the following command to merge :

`npm run consolidate`

IMPORTANT: the current implementation of UTXO consolidation is done through a convenience library that allows for a user to [chain transactions together](https://github.com/omisego/omg-js-utxo-merge). This is NOT a recommended way to make transactions in as it assumes trust in the operator.

### Starting Exits

Now that we only have a single UTXO to deal with. Let's call an exit on the smart contract

`npm run exit`


this will call `startStandardExit()` on the rootchain contract. Depending on the network, you will have to wait until the challenge period is finished before that transaction can be finalized. You can find out more details about the challenge period on Ari here: https://github.com/omisego/dev-portal/blob/master/guides/network_endpoints.md. 


### Processing Exit

After the challenge period is finally over, call `processExit` on the rootchain to move your funds back to to your account. Run the following command:

`npm run process`

This will return a transaction hash. Now you can check on an Ethereum block explorer whether your funds have moved from the Plasma contract to your wallet

IMPORTANT: this script is processing only a single UTXO. Due to the nature of exit queue, you may have to process more than one to get your funds back if there are a couple of UTXOs inside the queue.


### Re-Deposit  

Now that funds are back safely on your account in Ethereum. Simply perform a deposit by running

`npm run deposit`

After Rootchain confirmations. You are now ready to make transaction again on the new chain.

