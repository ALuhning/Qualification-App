import React, { Component } from 'react'
import './assign-training-establishments.styles.css'
import { Container, Card } from 'react-bootstrap'
import QualificationCreationNew from '../../utils/QualificationCreationNew'
import AssignTrainingEstablishmentForm  from '../../components/assign-trg-establishment-form/assign-trg-establishment-form.component'
import Portis from '@portis/web3'
import Web3 from 'web3'

class AuthorizeTrainingEstablishment extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
          loading: false,
          contract: null,
          currentUser: '',
          contractLoading: true,
          errorMessage: ''
        }
        
        this.assignTrgEstablishment = this.assignTrgEstablishment.bind(this)
      }
    
      componentDidMount() {
        
        const portis = new Portis('da7efc94-6cb2-4701-8878-60939fca9878', 'mainnet')
        //await portis.showPortis()
        this.web3js = new Web3(portis.provider)
               
        const contract = new QualificationCreationNew()
        contract.loadContract(this.web3js)
        .then((result)=> {
            this.setState({contract: result.contract, contractLoading: false })
            console.log(this.state.contract)
            console.log(this.state.contractLoading)
            this.web3js.eth.getAccounts()
            .then((account)=> {
                this.setState({currentUser: account[0]})
                console.log(this.state.currentUser)        
            })
            
        })
      }  
    
      async assignTrgEstablishment(establishment) {
          try {
            this.setState({ loading: true })
            await this.state.contract.methods.identifyTrainingEstablishment(establishment).send({ from: this.state.currentUser })
            this.setState({ loading: false })
          } catch (e) {
              console.log('error' + e)
              this.setState({errorMessage: 'This address has already been identified as a Trg Establishment'})
              this.setState({ loading: false })
          }
      }
    
    render() {
      
      const { contractLoading } = this.state
      if(contractLoading) {
          return <div>Loading...please wait.</div>
      }
      
      //const _this = this
      
      return (
            <div className='authorizeTrgEstablishment'>
            
                <Container>
                    <Card>
                    <Card.Title>
                        <img
                            src={`https://challengecoin.azurewebsites.net/images/${this.state.currentUser}.png`}
                            style={{maxWidth:'95%', textAlign:'center', padding: '5px'}}
                            className="d-inline-block align-top"
                            alt="Training Establishment Logo"
                        />
                    </Card.Title>
                    <AssignTrainingEstablishmentForm 
                        assignTrgEstablishment={this.assignTrgEstablishment}
                        loading={this.state.loading}
                        errorMessage={this.state.errorMessage}
                    />
                    </Card>
                </Container>
            </div>
        )
    }
}

export default AuthorizeTrainingEstablishment