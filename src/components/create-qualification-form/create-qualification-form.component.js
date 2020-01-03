import React from 'react'
import { useFormik } from 'formik'
import { Card, Button, Form, Row, Col } from 'react-bootstrap'
import Web3 from 'web3'
import axios from 'axios'
import * as firebase from "firebase/app"
import "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_WEB_API_KEY,
  authDomain: "qualification-coin.firebaseapp.com",
  databaseURL: "https://qualification-coin.firebaseio.com",
  projectId: "qualification-coin",
  storageBucket: "qualification-coin.appspot.com",
  messagingSenderId: "357835692605",
  appId: "1:357835692605:web:b2a7450dfd43e352ffa854",
  measurementId: "G-7V6P48MVWH"
};


firebase.initializeApp(firebaseConfig)

const CreateQualificationForm = ({createQual, loading, errorMessage}) => {
    
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
            recipient: '',
            qualBadge: null,
            file: null
        },
        validate,
        onSubmit: values=> {
         
          const fd = new FormData()

          fd.append('image', values.file, values.file.name)
          axios.post('https://us-central1-qualification-coin.cloudfunctions.net/uploadFile', fd).then((res) => {
            console.log(res);
            console.log(res.data.filename);
            const storage = firebase.storage()
            //console.log(storage)
            const storageRef = storage.ref()
            return storageRef.child(res.data.filename).getDownloadURL()
          }).then((downloadURL) => {
            console.log(downloadURL)
              createQual(values.qualName, values.qualCode, Web3.utils.toChecksumAddress(values.recipient), downloadURL)
              formik.resetForm({})
              formik.setFieldValue("qualBadge", '')
          })
        },
      })

    return (
        <Card>
        <Card.Header as="h3">
          Issue Qualification
        </Card.Header>
        <Card.Body>            
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col>
                    <p>Type of Qualification</p>
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
                    <p>Qualification Code</p>
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
                  <p>Qualification Badge or Pin</p>
                </Col>
                <Col>
                  <Form.Control
                    id="qualBadge"
                    name="qualBadge"
                    type="file"
                    onChange={(event) => {formik.setFieldValue("file", event.currentTarget.files[0])}}
                    value={formik.values.qualBadge}
                    />
                </Col>
                </Row>
                <Row>
                  <Col>
                    <p>Recipient</p>
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
                <Row>
                <p>{errorMessage}</p>
                </Row>
               
            </Form>
           
          </Card.Body>
      </Card> 
    )
}

export default CreateQualificationForm