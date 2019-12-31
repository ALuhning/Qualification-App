import React from 'react'
import { ListGroup } from 'react-bootstrap'
import QualificationCard from '../qualification-card/qualification-card.component'

export const CardList = ({ qualifications, contract, currentUser }) => {
    
        return (
            <ListGroup>
                <ListGroup.Item>
                    {qualifications.map(qualification => (
                        <QualificationCard key={qualification.id} contract={contract} qualification={qualification} currentUser={currentUser}/>
                    ))}
                </ListGroup.Item>
            </ListGroup>
        )
    
}