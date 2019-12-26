import React, { Component } from 'react'
import { Form, Card, Col, Row } from 'react-bootstrap'
import "./qualification-card.styles.css"

class QualificationCard extends Component {

    constructor(props) {
        super(props)

        this.state = {
            contract: this.props.contract
        }
    }

    componentDidMount() {
        console.log(this.state.contract)
    }

    async changeQualStatus() {
        await this.state.contract.changeQualificationStatus(this.props.qualification.id).send({ from: this.contract1.currentUserAddress })
    }

    render() {
        return (
            <Card>
            <Card.Header as="h5" className="align-items-center" style={{ backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center'}}>
                <Row>
                    <Col>
                        <img src={`https://vitalpoint.ai/images/quals/${this.props.qualification.qualCode.toLowerCase()}.jpg`}/>
                    </Col>
                    <Col>
                        {this.props.qualification.name}<br/><p>({this.props.qualification.qualCode})</p>
                    </Col>
                    <Col>
                    <Form>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check 
                                type="checkbox" 
                                label={ this.props.qualification.qualStatus ? 'Active' : 'Inactive' } 
                                onChange={this.changeQualStatus} 
                                />
                        </Form.Group>
                    </Form>
                    </Col>
                </Row>
            </Card.Header>
                <Card.Title>
                    
                </Card.Title>
                <Card.Body>
                    <p>Created: {Date(this.props.qualification.created*1000)}</p>
                </Card.Body>
                <Card.Footer>
                    <img style={{ width: '75%' }} src={`https://vitalpoint.ai/images/${this.props.qualification.trgEstablishment.toLowerCase()}.png`}/>
                </Card.Footer>
                
            </Card>
        )
    }
}

export default QualificationCard