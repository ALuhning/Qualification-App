import React, { Component } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import "./qualification-card.styles.css"

class QualificationCard extends Component {
    
    constructor(props) {
        super(props)

        this.state = {
            owner: '',
            status: this.props.qualification.qualStatus,
            currentUser: this.props.currentUser
        }
    }

    componentDidMount() {
       this.props.contract.methods.ownerOf(this.props.qualification.id).call({from: this.state.currentUser }).then((result)=> {
            this.setState({ owner: result })
       })
       
    }

    render() {
        return (
            <Card style={{ marginBottom: '15px' }}>
            <Card.Header as="h5" className="align-items-center" style={{ backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center'}}>
                <Row>
                    <Col>
                        <img alt="qualification code" style={{width:'150px'}} src={this.props.qualification.imageFileName}/>
                    </Col>
                    <Col>
                        {this.props.qualification.name}<br/><p>({this.props.qualification.qualCode})</p>
                    </Col>
                    <Col>
                    <p>{ this.state.status ? 'Active' : 'Inactive' } </p>
                    </Col>
                </Row>
            </Card.Header>
                <Card.Title>
                    
                    Owner: {this.state.owner}
                </Card.Title>
                <Card.Body>
                    
                </Card.Body>
                <Card.Footer>
                    <p>Created: {Date(this.props.qualification.created*1000)}</p>
                </Card.Footer>
                
            </Card>
        )
    }
}

export default QualificationCard