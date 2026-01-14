import React from 'react'
import { FiX } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const NotificationCard = ({ notification, onRead, onRemove }) => {
    const { id, src, title, message, time, read } = notification

    return (
        <div className={`notifications-item ${read ? 'opacity-75' : ''}`}>
            <img src={src} alt="" className="rounded me-3 border" />

            <div className="notifications-desc">
                <Link
                    to="#"
                    className="font-body text-truncate-2-line"
                    onClick={() => onRead(id)}
                >
                    <span className="fw-semibold text-dark">{title}</span> {message}
                </Link>

                <div className="d-flex justify-content-between align-items-center">
                    <div className="notifications-date text-muted">
                        {time} minutes ago
                    </div>

                    <div className="d-flex gap-2">
                        {!read && (
                            <span
                                className="wd-8 ht-8 rounded-circle bg-primary"
                                title="Unread"
                                onClick={() => onRead(id)}
                            />
                        )}
                        <FiX
                            className="text-danger cursor-pointer"
                            onClick={() => onRemove(id)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationCard
