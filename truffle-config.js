const { readFileSync } = require('fs')
const path = require('path')
const LoomTruffleProvider = require('loom-truffle-provider')

function getLoomProviderWithPrivateKey (privateKeyPath, chainId, writeUrl, readUrl) {
  const privateKey = readFileSync(privateKeyPath, 'utf-8')
  return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey)
}

module.exports = {
  contracts_directory: path.join(__dirname, './src/contracts'),
  contracts_build_directory: path.join(__dirname, './src/abis'),

  networks: {
    extdev_plasma_us1: {
      provider: function() {
        const chainId = 'extdev-plasma-us1'
        const writeUrl = 'wss://extdev-plasma-us1.dappchains.com/websocket'
        const readUrl = 'wss://extdev-plasma-us1.dappchains.com/queryws'
        const privateKeyPath = path.join(__dirname, 'extdev_private_key')
        const loomTruffleProvider = getLoomProviderWithPrivateKey(privateKeyPath, chainId, writeUrl, readUrl)
        loomTruffleProvider.createExtraAccounts(10)
        return loomTruffleProvider
        },
      network_id: '9545242630824'
    },
  },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },
  // Configure your compilers
  compilers: {
    solc: {
      // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}
