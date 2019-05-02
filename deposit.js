/*
Copyright 2018 OmiseGO Pte Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

const RootChain = require('@omisego/omg-js-rootchain')
const { transaction } = require('@omisego/omg-js-util')
const Web3 = require('web3')
const config = require('./config')
const web3 = new Web3(new Web3.providers.HttpProvider(config.ETH_CLIENT))

const rootChain = new RootChain(web3, config.NEW_CONTRACT)
async function deposit() {
  console.log(`depositing ${config.DEPOSIT_AMOUNT} wei`)
  const depositTx = transaction.encodeDeposit(config.ADDRESS, config.DEPOSIT_AMOUNT, transaction.ETH_CURRENCY)
  try {
    const receipt = await rootChain.depositEth(depositTx, config.DEPOSIT_AMOUNT, { from: config.ADDRESS, privateKey: config.PRIVATEKEY })
    console.log(`successful deposit: ${receipt.transactionHash}`)
  } catch (e) {
    console.log(e)
  }  
}

deposit()
