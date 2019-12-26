import React from 'react'
import { useFormik } from 'formik'
import QualificationCreation from '../../utils/QualificationCreation'

const CreateQualificationForm = () => {

    const contract = new QualificationCreation()
    contract.loadContract().then((result) => {
        console.log(result)
    })
    

    const formik = useFormik({
        initialValues: {
            qualName: '',
            qualCode: '',
            category: 0,
            expiry: 0
        },
        onSubmit: values=> {
            alert(JSON.stringify(values, null, 2));
        },
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="Qualification Name">Qualification Name</label>
            <input
                id="qualName"
                name="qualName"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.qualName}
            />
            <label htmlFor="Qualification Code">Qualification Code</label>
            <input
                id="qualCode"
                name="qualCode"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.qualCode}
            />
            <label htmlFor="Category">Category</label>
            <input
                id="category"
                name="category"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.category}
            />
            <label htmlFor="Expiry">Expiry (Days)</label>
            <input
                id="expiry"
                name="expiry"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.expiry}
            />
            <button type="submit">Submit</button>
        </form>
    )
}

export default CreateQualificationForm