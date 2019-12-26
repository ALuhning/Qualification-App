import React from 'react'
import { ListGroup } from 'react-bootstrap'
import QualificationCard from '../qualification-card/qualification-card.component'

export const CardList = (props) => {
    
        return (
            <ListGroup>
                <ListGroup.Item>
                    {props.qualifications.map(qualification => (
                        <QualificationCard key={qualification.id} qualification={qualification} />
                    ))}
                </ListGroup.Item>
            </ListGroup>
        )
    
}