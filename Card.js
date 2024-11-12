import React from 'react';

const Card = ({ ticket }) => {
    return (
        <div className="card">
            <h3>{ticket.title || 'No Title'}</h3>
            <p>{ticket.description || 'No Description'}</p>
            <p>Status: {ticket.status || 'No Status'}</p>
            <p>Assigned to: {ticket.user || 'Unassigned'}</p>
            <p>Priority: {ticket.priority}</p>
        </div>
    );
};

export default Card;
