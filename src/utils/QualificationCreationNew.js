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
import Web3 from 'web3'
import QualificationOwnership from '../abis/QualificationOwnership.json'
  
  export default class QualificationCreationNew {
    
    async loadContract(web3js) {
      this.onEvent = null
      this.extdevConfig = networkConfigs.networks['extdev']
      const client = this._createClient()
      client.on('error', console.error)

      const ethProvider = web3js.currentProvider
      ethProvider.isMetaMask = true

      const callerAddress = await this._setupSigner(client, ethProvider)
      console.log('callerAddress: ' + callerAddress)
      const loomProvider = await this._createLoomProvider(client, callerAddress)
      let accountMapping = await this._loadMapping(callerAddress, client)
      if(accountMapping === null) {
        console.log('Create a new mapping')
        const signer = getMetamaskSigner(ethProvider)
        await this._createNewMapping(signer)
        accountMapping = await this._loadMapping(callerAddress, client)
        console.log(accountMapping)
      
      } else {
        console.log('mapping already exists')
      }
      console.log('mapping.ethereum: ' + accountMapping.ethereum.toString())
      console.log('mapping.basechain: ' + accountMapping.plasma.toString())
     
      this.accountMapping = accountMapping      
      this.web3js = web3js
      this.web3loom = new Web3(loomProvider)
     
     // this._createCurrentUserAddress()
     // this._createWebInstance()
     let ownerUser = await this._createCurrentUserAddress()
     let loadedContract = await this._createContractInstance()
     return {
       contract: loadedContract,
       loomaddress: accountMapping.plasma.toString(),
       ownerUser: ownerUser
     }
    }

    async _loadMapping(ethereumAccount, client) {
      const mapper = await AddressMapper.createAsync(client, ethereumAccount)
      let accountMapping = { ethereum: null, plasma: null }
      try {
        const mapping = await mapper.getMappingAsync(ethereumAccount)
        accountMapping = {
          ethereum: mapping.from,
          plasma: mapping.to
        }
      } catch (error) {
        console.log(error)
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
      //remove dummy account
      loomProvider.accounts.delete(dummyAccount)
      loomProvider._accountMiddlewares.delete(dummyAccount)
      return loomProvider
    }

    async _setupSigner(plasmaClient, provider) {
      const signer = getMetamaskSigner(provider)
      const ethAddress = await signer.getAddress()
      const callerAddress = new Address('eth', LocalAddress.fromHexString(ethAddress))

      plasmaClient.txMiddleware = [
        new NonceTxMiddleware(callerAddress, plasmaClient),
        new SignedEthTxMiddleware(signer)
      ]
      return callerAddress
    }


    _createClient() {
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
  
    async _createCurrentUserAddress() {
      this.privateKey = CryptoUtils.B64ToUint8Array(process.env.REACT_APP_PRIVATE_KEY)
      this.publicKey = CryptoUtils.publicKeyFromPrivateKey(this.privateKey)
      return this.currentUserAddress = LocalAddress.fromPublicKey(this.publicKey).toString()
    }
  
    //_createWebInstance() {
    //  this.web3 = new Web3(new LoomProvider(this.client, this.privateKey))
    //}
  
    async _createContractInstance() {
     
     const networkId = this.extdevConfig['networkId'] 
     this.currentNetwork = QualificationOwnership.networks[networkId]
      if (!this.currentNetwork) {
        throw Error('Contract not deployed on DAppChain')
      }
  
      const ABI = QualificationOwnership.abi
      this.QualificationOwnershipInstance = new this.web3loom.eth.Contract(ABI, this.currentNetwork.address)
      console.log(this.QualificationOwnershipInstance)
      this.QualificationOwnershipInstance.events.Transfer({ }, (err, event) => {
        if (err) console.error('Error on event', err)
        else {
          if (this.onEvent) {
            this.onEvent(event.returnValues)
          }
        }
      })
      return this.QualificationOwnershipInstance
     
    }
  
    addEventListener(fn) {
      this.onEvent = fn
    }

}