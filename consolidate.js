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

const ChildChain = require('@omisego/omg-js-childchain')
const merge = require('@omisego/omg-js-utxo-merge')
const config = require('./config')

const ADDRESS = config.ADDRESS
const PRIVATE_KEY = config.PRIVATEKEY
console.log(ADDRESS, PRIVATE_KEY)

const childChain = new ChildChain(config.WATCHER)


function signTransaction (unsignedTx, numUtxos, address) {
  const privateKeys = new Array(numUtxos).fill(PRIVATE_KEY)
  const signatures = childChain.signTransaction(unsignedTx, privateKeys)
  return childChain.buildSignedTransaction(unsignedTx, signatures)
}

function submitTransaction (signedTx) {
  return childChain.submitTransaction(signedTx)
}

childChain.getUtxos(ADDRESS)
  .then(utxos => merge(utxos, ADDRESS, signTransaction, submitTransaction))

