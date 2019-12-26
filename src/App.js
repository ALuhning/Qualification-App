import React, { Component } from 'react';
import './App.css';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap'
import QualificationOwnership from './utils/QualificationCreation'
import { SearchBox } from './components/search-box/search-box.component'
import { CardList } from './components/card-list/card-list.component'
import CreateQualificationForm  from './components/create-qualification-form/create-qualification-form.component'

class App extends Component {
  constructor(props) {
    super(props)

    this.contract = new QualificationOwnership()
    
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
      contract: null
    }

    
  }

  intervalId;

  async componentDidMount() {
    await this.contract.loadContract()
    this.setState({ contract: this.contract})
    console.log(this.state.contract)
    this.getQualificationsByTrgEstablishment(this.contract.currentUserAddress)

   // this.intervalId = setInterval(this.displayQualifications.bind(this), 100)
  }  

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleChange = (e) => {
    this.setState({ searchField: e.target.value })
  }

  async createQualification() {
    if( this.contract.QualificationOwnershipInstance && this.contract.currentUserAddress) {
    const name = this.qualNameInput.value
    const code = this.qualCodeInput.value
    const category = this.qualCategoryInput.value
    const expiry = this.qualExpiryInput.value
    const error = 'one or more input fields is missing'
      if(name || code || category || expiry === '') {
        console.log(error)
        return error
      } else {
      this.setState({ loading: true })
      const result = await this.contract.QualificationOwnershipInstance.methods.createQualification(name, code, category, expiry).send({ from: this.contract.currentUserAddress })
      this.setState({
            loading: false,
            tokenId: result.events.NewQualificationCreated.returnValues.qualificationId,
            qualName: result.events.NewQualificationCreated.returnValues.qualificationName,
            qualCode: result.events.NewQualificationCreated.returnValues.qualificationCode,
            qualCategory: result.events.NewQualificationCreated.returnValues.category,
            qualExpiry: result.events.NewQualificationCreated.returnValues.expiryDays,
            qualTrgEstablisment: result.events.NewQualificationCreated.returnValues.trgEstablishment
          })
      let result1 = await this.contract.QualificationOwnershipInstance.methods.getQualificationsByTrgEstablishment(this.contract.currentUserAddress).call()
      this.setState({ qualifications: result1 }) 
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

  async getQualificationsByTrgEstablishment(owner) {
    let result = await this.contract.QualificationOwnershipInstance.methods.getQualificationsByTrgEstablishment(owner).call()
    this.setState({ qualifications: result }) 
    let qualification
    for(qualification of this.state.qualifications) {
      this.setState({qualificationDetail: [...this.state.qualificationDetail, await this.getQualificationDetails(qualification)]})
    }
  }

render() {

  const { qualificationDetail, searchField } = this.state
  const filteredQualifications = qualificationDetail.filter(qualification =>
    qualification.name.toLowerCase().includes(searchField.toLowerCase())
    )

  return (
    <div className="App">
    
      <Container>
      <Card>
      <CreateQualificationForm />
      </Card>
      <Card>
        <Card.Header as="h3">
          Create Qualification
        </Card.Header>
        <Card.Body>            
            <Form>
                <Row>
                  <Col>
                    <Form.Label>
                      Name of Qualification
                    </Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Qualification Name"
                      required="true"
                      ref={c => {this.qualNameInput = c}}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>
                      Qualification Code
                    </Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Qualification Code"
                      required="true"
                      ref={c => {this.qualCodeInput = c}}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>
                      Category
                    </Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Category (0 = parachuting)"
                      required="true"
                      ref={c => {this.qualCategoryInput = c}}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>
                      Expiry (Days)
                    </Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Expiry (Days)"
                      required="true"
                      ref={c => {this.qualExpiryInput = c}}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col></Col>
                  <Col>
                    <Button
                      variant="primary"
                      style={{ marginTop: '15px' }}
                      onClick={(e) => {
                        e.preventDefault();
                        this.createQualification()
                      }}
                    >
                      Create Qualification
                    </Button>
                  </Col>
                </Row>
            </Form>
            <p>{!this.state.loading ? '' : 'Creating Qualification, please wait...'}</p>
          </Card.Body>
      </Card>
      </Container>
      <SearchBox 
        placeholder='Search Qualifications'
        handleChange={this.handleChange}
      />
      <Container>
        <CardList qualifications={filteredQualifications} />
      </Container>
    </div>
  );
}
}

export default App;
