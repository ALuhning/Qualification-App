import React from 'react'
import { useFormik } from 'formik'
import { Card, Button, Form, Row, Col } from 'react-bootstrap'
import Web3 from 'web3'

const AssignTrainingEstablishmentForm = ({assignTrgEstablishment, loading, errorMessage}) => {
    
    const validate = values => {
      const errors = {}

      if(!values.establishmentAddress) {
        errors.establishmentAddress = 'Required'
      }

      return errors      
    }
    
    const formik = useFormik({
        initialValues: {
            establishmentAddress: ''
        },
        validate,
        onSubmit: values=> {
            assignTrgEstablishment(Web3.utils.toChecksumAddress(values.establishmentAddress));
            formik.resetForm({});
        },
    })

    return (
        <Card>
        <Card.Header as="h3">
          Assign Training Establishment
        </Card.Header>
        <Card.Body>            
            <Form onSubmit={formik.handleSubmit}>
               
                <Row>
                  <Col>
                    <Form.Label>
                      Training Establishment Address:
                    </Form.Label>
                  </Col>
                  <Col>
                    {formik.errors.establishmentAddress ? <div>{formik.errors.establishmentAddress}</div> : null}
                    <Form.Control
                        id="establishmentAddress"
                        name="establishmentAddress"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.establishmentAddress}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col></Col>
                  <Col>
                    <Button
                      variant="primary"
                      style={{ marginTop: '15px' }}
                      type="submit"
                    >{!loading? 'Assign Trg Establishment' : 'Authorizing Training Establishment'}
                    </Button>
                  </Col>
                </Row>
                <p>{errorMessage}</p>
            </Form>
          </Card.Body>
      </Card>

    )
}

export default AssignTrainingEstablishmentForm