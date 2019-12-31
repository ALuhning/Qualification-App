import React, { Component } from 'react'
import './award-qualifications.styles.css'
import { Container, Card } from 'react-bootstrap'
import QualificationCreationNew from '../../utils/QualificationCreationNew'
import CreateQualificationForm  from '../../components/create-qualification-form/create-qualification-form.component'
import { SearchBox } from '../../components/search-box/search-box.component'
import { CardList } from '../../components/card-list/card-list.component'
import Portis from '@portis/web3'
import Web3 from 'web3'

class AwardQualifications extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
          recipient: '',
          tokenId: 0,
          error: null,
          loading: false,
          qualName: '',
          qualCode: '',
          qualCategory: 0,
          qualExpiry: 0,
          qualTrgEstablishment: '',
          qualCreated: 0,
          qualifications: [],
          searchField: '',
          qualificationDetail: [],
          contract: null,
          currentUser: '',
          creationError: '',
          contractLoading: true,
          errorMessage: '',
          createQualErrorMessage: '',
          loomAddress: '',
          ownerUser: ''
        }

        this.createQualification = this.createQualification.bind(this)
        this.getQualificationsByTrgEstablishment = this.getQualificationsByTrgEstablishment.bind(this)
        
      }
    
      componentDidMount() {
        
        const portis = new Portis('da7efc94-6cb2-4701-8878-60939fca9878', 'mainnet')
        //await portis.showPortis()
        this.web3js = new Web3(portis.provider)
               
        const contract = new QualificationCreationNew()
        contract.loadContract(this.web3js)
        .then((result)=> {
            const formattedLoomAddress = Web3.utils.toChecksumAddress(result.loomaddress.slice(18))
            const formattedOwnerUser = Web3.utils.toChecksumAddress(result.ownerUser)
            this.setState({contract: result.contract, loomAddress: formattedLoomAddress, ownerUser: formattedOwnerUser, contractLoading: false })
            console.log(this.state.contract)
            console.log(this.state.loomAddress)
            console.log(this.state.ownerUser)
            console.log(this.state.contractLoading)
            this.web3js.eth.getAccounts()
            .then((account)=> {
                this.setState({currentUser: account[0]})
                console.log(this.state.currentUser)
                this.getQualificationsByTrgEstablishment(this.state.loomAddress)       
            })
            
        
        })
      }  
    
      handleChange = (e) => {
        this.setState({ searchField: e.target.value })
      }
    
      async getOwner(id) {
        await this.state.contract.methods.owner(id).call( { from: this.state.currentUser } )
      }
    
      async createQualification(name, code, recipient) {
        if( this.state.contract && this.state.currentUser) {
          try {
            this.setState({ loading: true })
            const result = await this.state.contract.methods.createQualification(name, code).send({ from: this.state.currentUser })
            console.log(Web3.utils.isAddress(recipient))
            console.log(result)
            await this.state.contract.methods.mint(recipient, result.events.NewQualificationCreated.returnValues.qualificationId).send({ from: this.state.currentUser })
            this.setState({ loading: false })
          } catch (e) {
            this.setState({createQualErrorMessage: 'Failure: likely because you do not have correct permissions.'})
          }
          try {
            console.log(this.state.currentUser)
            console.log(this.state.loomAddress)
           // this.state.contract.methods.getQualificationsByTrgEstablishment(this.state.loomAddress).call({ from: this.state.currentUser }).then((result) => {
            this.getQualificationsByTrgEstablishment(this.state.loomAddress)  
           // })
            
          } catch (error) {
            this.setState({createQualErrorMessage: 'This training establishment has not issued any qualifications'})
          }
        } else {
          this.setState({
              createQualErrorMessage: new Error('qualification ownership instance not loaded')
          })
        }
      }
    
      getQualificationDetails(id) {
        return this.state.contract.methods.qualifications(id).call({ from: this.state.currentUser })
      }
    
      qualificationToTrgEstablishment(id) {
        return this.state.contract.methods.qualificationToTrgEstablishment(id).call({ from: this.state.currentUser })
      }
    
     async getQualificationsByTrgEstablishment(establishment) {
        this.setState({qualifications: [] })
        console.log(this.state.qualifications)
        try {
          let result = await this.state.contract.methods.getQualificationsByTrgEstablishment(establishment).call({from: this.state.currentUser})
          console.log(result)
          if(result.length===0) {
            this.setState({errorMessage: 'No qualifications issued by this training establishment yet.'})
          } else {
            this.setState({errorMessage: ''})
          }
          let qualification
          this.setState({qualificationDetail: []})
          for(qualification of result) {
            let details = await this.getQualificationDetails(qualification)
            this.setState({qualificationDetail: [...this.state.qualificationDetail, details]})
            
          }
        } catch (error) {
          this.setState({errorMessage: 'No qualifications issued by this trg establishment'})
        }
      }
    
    render() {
      
      const { contractLoading } = this.state
      if(contractLoading) {
          return <div>Loading...please wait.</div>
      }
      const { qualificationDetail, searchField } = this.state
      const filteredQualifications = qualificationDetail.filter(qualification =>
        qualification.name.toLowerCase().includes(searchField.toLowerCase())
        )
      
     const _this = this
      
      return (
        <div className='awardQualifications'>
        
            <Container>
                <Card>
                <Card.Title>
                    <img
                        src={`https://challengecoin.azurewebsites.net/images/${this.state.currentUser}.jpg`}
                        style={{maxWidth:'95%', textAlign:'center', padding: '5px'}}
                        className="d-inline-block align-top"
                        alt="Issuing Authority Logo"
                    />
                </Card.Title>
                <CreateQualificationForm  
                    createQual={_this.createQualification}
                    loading={this.state.loading} 
                    errorMessage={this.state.errorMessage}
                />
                </Card>
            
                <Container >
                <SearchBox 
                    placeholder='Search Issuances'
                    handleChange={this.handleChange}
                />
                </Container>
            
                <CardList 
                qualifications={filteredQualifications} 
                contract={this.state.contract} 
                currentUser={this.state.currentUser}
                />
            </Container>
        </div>
)
      }
    }

export default AwardQualifications