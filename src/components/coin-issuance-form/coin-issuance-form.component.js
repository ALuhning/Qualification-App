import React from 'react'
import { useFormik } from 'formik'
import { Card, Button, Form, Row, Col } from 'react-bootstrap'
import Web3 from 'web3'

const CoinIssuanceForm = ({createQual, loading, errorMessage}) => {
    
    const validate = values => {
      const errors = {}
      if(!values.coinName) {
        errors.coinName = 'Required'
      } else if (values.coinName.length > 30) {
        errors.coinName = 'Must be 30 characters or less'
      }

      if(!values.coinCode) {
        errors.coinCode = 'Required'
      } else if (values.coinCode.length > 4) {
        errors.coinCode = 'Must be 4 characters or less'
      }

      if(!values.recipient) {
        errors.recipient = 'Required'
      }

      return errors      
    }
    
    const formik = useFormik({
        initialValues: {
            coinName: '',
            coinCode: '',
            recipient: ''
        },
        validate,
        onSubmit: values=> {
            createQual(values.coinName, values.coinCode, Web3.utils.toChecksumAddress(values.recipient));
            formik.resetForm({});
        },
    })

    return (
        <Card>
        <Card.Header as="h3">
          Issue Challenge Coin
        </Card.Header>
        <Card.Body>            
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col>
                    <Form.Label>
                      Type of Challenge Coin
                    </Form.Label>
                  </Col>
                  <Col>
                    {formik.errors.coinName ? <div>{formik.errors.coinName}</div> : null}
                    <Form.Control
                        id="coinName"
                        name="coinName"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.coinName}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>
                      Challenge Coin Code
                    </Form.Label>
                  </Col>
                  <Col>
                    {formik.errors.coinCode ? <div>{formik.errors.coinCode}</div> : null}
                    <Form.Control
                        id="coinCode"
                        name="coinCode"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.coinCode}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>
                      Issued To:
                    </Form.Label>
                  </Col>
                  <Col>
                    {formik.errors.recipient ? <div>{formik.errors.recipient}</div> : null}
                    <Form.Control
                        id="recipient"
                        name="recipient"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.recipient}
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
                    >{!loading? 'Award Qualification' : 'Creating Qualification'}
                    </Button>
                  </Col>
                </Row>
                <p>{errorMessage}</p>
            </Form>
          </Card.Body>
      </Card>
    )
}

export default CreateQualificationForm