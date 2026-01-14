import React from 'react'

const UsersEmptyCard = ({ title, description }) => {
    return (
        <div className="card">
            <div className="card-body text-center py-5">
                <h5 className="mb-2">{title}</h5>
                <p className="text-muted mb-0">{description}</p>
            </div>
        </div>
    )
}

export default UsersEmptyCard
