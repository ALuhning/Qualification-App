import React, { Component } from 'react';
import './App.css';
import { Container, Navbar, Card } from 'react-bootstrap'
import QualificationCreation from './utils/QualificationCreation'
import { SearchBox } from './components/search-box/search-box.component'
import { CardList } from './components/card-list/card-list.component'
import CreateQualificationForm  from './components/create-qualification-form/create-qualification-form.component'

class App extends Component {
  constructor(props) {
    super(props)
    this.createQualification = this.createQualification.bind(this)
    this.contract = new QualificationCreation()
    
    
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
      creationError: ''
    }

    
  }

 

  componentDidMount() {
    this.contract.loadContract()
    this.getQualificationsByTrgEstablishment()
    let currentUser = this.contract.currentUserAddress
    this.setState({ currentUser })
  }  

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleChange = (e) => {
    this.setState({ searchField: e.target.value })
  }

  

  async getOwner(id) {
    await this.contract.QualificationOwnershipInstance.methods.owner(id).call()
  }

  async createQualification(name, code, recipient) {
    if( this.contract.QualificationOwnershipInstance && this.contract.currentUserAddress) {
      try {
      this.setState({ loading: true })
      const result = await this.contract.QualificationOwnershipInstance.methods.createQualification(name, code).send({ from: this.contract.currentUserAddress })
      await this.contract.QualificationOwnershipInstance.methods.mint(recipient, result.events.NewQualificationCreated.returnValues.qualificationId).send({ from: this.contract.currentUserAddress })
      this.setState({ loading: false })
      await this.contract.QualificationOwnershipInstance.methods.getQualificationsByTrgEstablishment(this.contract.currentUserAddress).call()
      this.getQualificationsByTrgEstablishment(this.contract.currentUserAddress)  
    } catch (error) {
        this.setState({creationError: error})
        this.getQualificationsByTrgEstablishment(this.contract.currentUserAddress)
      }
    } else {
      this.setState({
          error: new Error('qualification ownership instance not loaded')
      })
    }
  }

  getQualificationDetails(id) {
    return this.contract.QualificationOwnershipInstance.methods.qualifications(id).call()
  }

  qualificationToTrgEstablishment(id) {
    return this.contract.QualificationOwnershipInstance.methods.qualificationToTrgEstablishment(id).call()
  }

  async getQualificationsByTrgEstablishment() {
    this.setState({qualifications: [] })
    let result = await this.contract.QualificationOwnershipInstance.methods.getQualificationsByTrgEstablishment(this.contract.currentUserAddress).call()
    console.log(result)
    let qualification
    this.setState({qualificationDetail: []})
    for(qualification of result) {
    let details = await this.getQualificationDetails(qualification)
    this.setState({qualificationDetail: [...this.state.qualificationDetail, details]})
    }
  }

render() {

  
  
  const { qualificationDetail, searchField } = this.state
  const filteredQualifications = qualificationDetail.filter(qualification =>
    qualification.name.toLowerCase().includes(searchField.toLowerCase())
    )
  
  const _this = this
  console.log(_this.contract.QualificationOwnershipInstance)
  

  return (
    <div className="App">
    <Navbar bg="light">
    <Navbar.Brand href="#home">
      <img
        src={`https://vitalpoint.ai/images/${this.state.currentUser.toLowerCase()}.png`}
        className="d-inline-block align-top justify-content-between"
        alt="Training Establishment Logo"
      />
    </Navbar.Brand>
  </Navbar>
      <Container>
      <Card>
      <CreateQualificationForm contract={_this.contract.QualificationOwnershipInstance} createQual={_this.createQualification} loading={this.state.loading} />
      </Card>
      
      </Container>
      <SearchBox 
        placeholder='Search Qualifications'
        handleChange={this.handleChange}
      />
      <Container>
        <CardList qualifications={filteredQualifications} contract={_this.contract} getQualifications={_this.getQualificationsByTrgEstablishment}/>
      </Container>
    </div>
  );
}
}

export default App;
