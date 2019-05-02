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
const ChildChain = require('@omisego/omg-js-childchain')
const merge = require('@omisego/omg-js-utxo-merge')
const Web3 = require('web3')
const config = require('./config')

const web3 = new Web3(new Web3.providers.HttpProvider(config.ETH_CLIENT))
const rootChain = new RootChain(web3, config.OLD_CONTRACT)
const childChain = new ChildChain(config.WATCHER)

async function getUtxos(forAddr) {
  const utxos = await childChain.getUtxos(config.ADDRESS)
  return utxos
}

async function exit(addr, privKey) {
  try {
    const utxo = await getUtxos(addr)
    if(utxo.length > 1){
      throw("More than 1 UTXO found, need to consolidate first")
    }
    const exitData = await childChain.getExitData(utxo[0])
    //console.log(exitData.utxo_pos.toString())
    let receipt = await rootChain.startStandardExit(
      exitData.utxo_pos.toString(),
      exitData.txbytes,
      exitData.proof,
      {
        from: addr,
        privateKey: privKey
      }
    )
    console.log(`Exit started, txhash = ${receipt.transactionHash}`) 
  } catch(e) {
    console.log("error: ", e)
  }   
}

exit(config.ADDRESS, config.PRIVATEKEY)