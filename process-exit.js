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
const Web3 = require('web3')
const config = require('./config')
const { transaction } = require('@omisego/omg-js-util')

const web3 = new Web3(new Web3.providers.HttpProvider(config.ETH_CLIENT))
const rootChain = new RootChain(web3, config.OLD_CONTRACT)

async function processExit(index, numberToProcess) {
  try {
    receipt = await rootChain.processExits(
      transaction.ETH_CURRENCY,
      index,
      numberToProcess,
      {
        privateKey: config.PRIVATEKEY,
        from: config.ADDRESS
      }
    )
    console.log(`Processed ${numberToProcess} Exit(s): ${receipt.transactionHash}`)
  } catch (e) {
    console.log(e)
  }
}

processExit(0, 1)