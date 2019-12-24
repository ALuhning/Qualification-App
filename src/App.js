import React, { Component } from 'react';
import './App.css';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap'
import QCoinContract from './utils/QCoinContract'

class App extends Component {
  constructor(props) {
    super(props)

    this.contract = new QCoinContract()
    console.log(this.contract)

    this.state = {
      recipient: '',
      tokenId: 0,
      error: null,
      loading: false
    }
  }

  componentDidMount() {
    this.contract.loadContract()
  }  

  async mintToken() {
    if( this.contract.QualificationCoinInstance && this.contract.currentUserAddress) {
    const value = this.recipientInput.value
    console.log(value)
      this.setState({ loading: true })
      const result = await this.contract.QualificationCoinInstance.methods.mint(value).send({ from: this.contract.currentUserAddress })
      console.log(result)
      this.setState({
            recipient: result.events.Transfer.returnValues[1],
            tokenId: result.events.Transfer.returnValues[2],
            loading: false
          })
    } else {
      this.setState({
          error: new Error('qualification coin instance not loaded')
      })
    }
  }


render() {
  return (
    <div className="App">
    <Container>
      <Card>
        <Card.Header as="h3">
          Assign Qualification Token
        </Card.Header>
        <Card.Body>
          <Card.Title>Recipient: {!this.state.loading ? this.state.recipient : 'Loading...'}, TokenId: {!this.state.loading ? this.state.tokenId : 'Loading...'} </Card.Title>
              <Form>
                <Row>
                  <Col>
                    <Form.Label>
                      Recipient address
                    </Form.Label>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Enter Recipient"
                      ref={c => {this.recipientInput = c}}
                    />
                  </Col>
                  <Col>
                    <Button
                      variant="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        this.mintToken()
                      }}
                    >
                      Assign Qualification
                    </Button>
                  </Col>
                </Row>
            </Form>
          </Card.Body>
      </Card>
     </Container>
    </div>
  );
}
}

export default App;
