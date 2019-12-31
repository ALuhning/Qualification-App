import {
    Client, LocalAddress, CryptoUtils, LoomProvider, NonceTxMiddleware, SignedTxMiddleware
  } from 'loom-js'
  import BN from 'bn.js'
  import Web3 from 'web3'
  import QualificationOwnership from '../abis/QualificationOwnership.json'
  
  export default class QualificationCreation {
    
    async loadContract() {
      this.onEvent = null
      this._createClient()
      this._createCurrentUserAddress()
      this._createWebInstance()
      await this._createContractInstance()
      
    }
  
    _createClient() {
      this.privateKey = CryptoUtils.B64ToUint8Array(process.env.REACT_APP_PRIVATE_KEY)
      this.publicKey = CryptoUtils.publicKeyFromPrivateKey(this.privateKey)
      let writeUrl = 'wss://extdev-plasma-us1.dappchains.com/websocket'
      let readUrl = 'wss://extdev-plasma-us1.dappchains.com/queryws'
      let networkId = 'extdev-plasma-us1'
      
      this.client = new Client(networkId, writeUrl, readUrl)
      this.client.txMiddleware = [
          new NonceTxMiddleware(this.publicKey, this.client),
          new SignedTxMiddleware(this.privateKey)
      ]
      this.client.on('error', msg => {
        console.error('Error on connect to client', msg)
        console.warn('Please verify if loom command is running')
      })
      
    }
  
    async _createCurrentUserAddress() {
      this.currentUserAddress = LocalAddress.fromPublicKey(this.publicKey).toString()
    }
  
    _createWebInstance() {
      this.web3 = new Web3(new LoomProvider(this.client, this.privateKey))
    }
  
    async _createContractInstance() {
     // const networkId = await this._getCurrentNetwork()
     const networkId = '9545242630824' 
     this.currentNetwork = QualificationOwnership.networks[networkId]
      if (!this.currentNetwork) {
        throw Error('Contract not deployed on DAppChain')
      }
  
      const ABI = QualificationOwnership.abi
      this.QualificationOwnershipInstance = new this.web3.eth.Contract(ABI, this.currentNetwork.address, {
        from: this.currentUserAddress
      })
  
      this.QualificationOwnershipInstance.events.Transfer({ }, (err, event) => {
        if (err) console.error('Error on event', err)
        else {
          if (this.onEvent) {
            this.onEvent(event.returnValues)
          }
        }
      })
  
     
    }
  
    addEventListener(fn) {
      this.onEvent = fn
    }
  
    _getCurrentNetwork() {
  
      if (process.env.REACT_APP_NETWORK === 'extdev') {
        return '9545242630824'
      }
      else {
        const web3 = new Web3()
        const chainIdHash = web3.utils.soliditySha3(this.client.chainId)
          .slice(2) // Removes 0x
          .slice(0, 13) // Produces safe Number less than 9007199254740991
          const chainId =  new BN(chainIdHash).toString()
        return chainId
      }
    }

}