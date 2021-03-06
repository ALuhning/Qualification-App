import {
  NonceTxMiddleware,
  SignedEthTxMiddleware,
  CryptoUtils,
  Client,
  LoomProvider,
  Address,
  LocalAddress,
  EthersSigner,
  createDefaultTxMiddleware,
  getMetamaskSigner
} from 'loom-js'
import { AddressMapper } from 'loom-js/dist/contracts'
import networkConfigs from './network-configs.json'
import BN from 'bn.js'
import Web3 from 'web3'
import QualificationOwnershipJSON from '../abis/QualificationOwnership.json'
  
  export default class EthSigning {
    
    async load (web3js) {
      this.counter = 0
      this.extdevConfig = networkConfigs.networks['extdev']
      const client = this._createClient()
      client.on('error', console.error)
      const ethProvider = web3js.currentProvider
      ethProvider.isMetaMask = true
      const callerAddress = await this._setupSigner(client, ethProvider)
      console.log('callerAddress: ' + callerAddress)
      const loomProvider = await this._createLoomProvider(client, callerAddress)
      let accountMapping = await this._loadMapping(callerAddress, client)
      if (accountMapping === null) {
        console.log('Create a new mapping')
        const signer = getMetamaskSigner(ethProvider)
        await this._createNewMapping(signer)
        accountMapping = await this._loadMapping(callerAddress, client)
        console.log(accountMapping)
      } else {
        console.log('mapping already exists')
      }
      console.log('mapping.ethereum: ' + accountMapping.ethereum.toString())
      console.log('mapping.plasma: ' + accountMapping.plasma.toString())
      this.accountMapping = accountMapping
      this.web3js = web3js
      this.web3loom = new Web3(loomProvider)
      await this._getContract()
    }
  
    async _loadMapping (ethereumAccount, client) {
      const mapper = await AddressMapper.createAsync(client, ethereumAccount)
      let accountMapping = { ethereum: null, plasma: null }
      try {
        const mapping = await mapper.getMappingAsync(ethereumAccount)
        accountMapping = {
          ethereum: mapping.from,
          plasma: mapping.to
        }
      } catch (error) {
        console.error(error)
        accountMapping = null
      } finally {
        mapper.removeAllListeners()
      }
      return accountMapping
    }
  
    async _createLoomProvider (client, callerAddress) {
      const dummyKey = CryptoUtils.generatePrivateKey()
      const publicKey = CryptoUtils.publicKeyFromPrivateKey(dummyKey)
      const dummyAccount = LocalAddress.fromPublicKey(publicKey).toString()
      const loomProvider = new LoomProvider(
        client,
        dummyKey,
        () => client.txMiddleware
      )
      loomProvider.setMiddlewaresForAddress(callerAddress.local.toString(), client.txMiddleware)
      loomProvider.callerChainId = callerAddress.chainId
      // remove dummy account
      loomProvider.accounts.delete(dummyAccount)
      loomProvider._accountMiddlewares.delete(dummyAccount)
      return loomProvider
    }
  
    async _setupSigner (plasmaClient, provider) {
      const signer = getMetamaskSigner(provider)
      const ethAddress = await signer.getAddress()
      const callerAddress = new Address('eth', LocalAddress.fromHexString(ethAddress))
  
      plasmaClient.txMiddleware = [
        new NonceTxMiddleware(callerAddress, plasmaClient),
        new SignedEthTxMiddleware(signer)
      ]
  
      return callerAddress
    }
  
    _createClient () {
      const chainId = this.extdevConfig['chainId']
      const writeUrl = this.extdevConfig['writeUrl']
      const readUrl = this.extdevConfig['readUrl']
      const client = new Client(chainId, writeUrl, readUrl)
      return client
    }
  
    async _createNewMapping (signer) {
      const ethereumAccount = await signer.getAddress()
      const ethereumAddress = Address.fromString(`eth:${ethereumAccount}`)
      const plasmaEthSigner = new EthersSigner(signer)
      const privateKey = CryptoUtils.generatePrivateKey()
      const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
      const client = this._createClient()
      client.txMiddleware = createDefaultTxMiddleware(client, privateKey)
      const loomAddress = new Address(client.chainId, LocalAddress.fromPublicKey(publicKey))
  
      const mapper = await AddressMapper.createAsync(client, loomAddress)
      try {
        await mapper.addIdentityMappingAsync(
          ethereumAddress,
          loomAddress,
          plasmaEthSigner
        )
        client.disconnect()
      } catch (e) {
        if (e.message.includes('identity mapping already exists')) {
        } else {
          console.error(e)
        }
        client.disconnect()
        return false
      }
    }
  
    async _getContract () {
      this.contract = new this.web3loom.eth.Contract(QualificationOwnershipJSON.abi, QualificationOwnershipJSON.networks[this.extdevConfig['networkId']].address)
    }
  
    async _setValue () {
      const ethAddress = this.accountMapping.ethereum.local.toString()
      const value = parseInt(this.counter, 10)
      await this.contract.methods
        .set(value)
        .send({
          from: ethAddress
        })
    }
  
  
    
  }