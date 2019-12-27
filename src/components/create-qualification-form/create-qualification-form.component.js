import React from 'react'
import { useFormik } from 'formik'
import { Card, Button, Form, Row, Col } from 'react-bootstrap'

const CreateQualificationForm = ({contract, createQual, loading}) => {
    
    const validate = values => {
      const errors = {}
      if(!values.qualName) {
        errors.qualName = 'Required'
      } else if (values.qualName.length > 30) {
        errors.qualName = 'Must be 30 characters or less'
      }

      if(!values.qualCode) {
        errors.qualCode = 'Required'
      } else if (values.qualCode.length > 4) {
        errors.qualCode = 'Must be 4 characters or less'
      }

      if(!values.recipient) {
        errors.recipient = 'Required'
      }

      return errors      
    }
    
    const formik = useFormik({
        initialValues: {
            qualName: '',
            qualCode: '',
            recipient: ''
        },
        validate,
        onSubmit: values=> {
            loading = true;
            createQual(values.qualName, values.qualCode, values.recipient);
            formik.resetForm({});
            loading = false;
        },
    })

    return (
        <Card contract={contract}>
        <Card.Header as="h3">
          Award Qualification
        </Card.Header>
        <Card.Body>            
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col>
                    <Form.Label>
                      Name of Qualification
                    </Form.Label>
                  </Col>
                  <Col>
                    {formik.errors.qualName ? <div>{formik.errors.qualName}</div> : null}
                    <Form.Control
                        id="qualName"
                        name="qualName"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.qualName}
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
                    {formik.errors.qualCode ? <div>{formik.errors.qualCode}</div> : null}
                    <Form.Control
                        id="qualCode"
                        name="qualCode"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.qualCode}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>
                      Awarded To:
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
            </Form>
          </Card.Body>
      </Card>



       
    )
}

export default CreateQualificationForm