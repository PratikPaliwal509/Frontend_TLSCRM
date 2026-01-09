import React, { useState, useEffect } from 'react'
import {
    FiBellOff,
    FiEyeOff,
    FiFlag,
    FiSlash,
} from 'react-icons/fi'
import Dropdown from '../shared/Dropdown'

const CommentCard = ({
    comment_id,
    comment_text,
    created_at,
    user,
    like_count = 0,
    replies = [],
    onReply,
    task_id,
    setComments
}) => {
    const commentOptions = [
        { label: 'Mute', icon: <FiBellOff /> },
        { label: 'Hide', icon: <FiEyeOff /> },
        { label: 'Block', icon: <FiSlash /> },
        { label: 'Report', icon: <FiFlag /> },
    ]

    const [showReplyBox, setShowReplyBox] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [loading, setLoading] = useState(false)

    const token = localStorage.getItem('token')


    const submitReply = async () => {
        if (!replyText.trim()) return

        setLoading(true)
        try {
            const res = await fetch(
                `http://localhost:5000/api/tasksComments/${task_id}/comments/${comment_id}/replies`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        comment_text: replyText,
                    }),
                }
            )

            if (!res.ok) throw new Error('Failed to add reply')

            const result = await res.json()

            // ✅ Optimistic update (add reply under correct comment)
            setComments(prev =>
                prev.map(c =>
                    c.comment_id === comment_id
                        ? { ...c, replies: [...(c.replies || []), result.data] }
                        : c
                )
            )

            setReplyText('')
            setShowReplyBox(false)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="d-flex mb-4">
            {/* Avatar */}
            <div className="avatar-image me-3">
                <img
                    src={user?.avatar || '/images/avatar/1.png'}
                    // src={user?.avatar || '/images/avatar/1.png'}
                    className="img-fluid rounded-circle"
                    alt={user?.full_name}
                />
            </div>

            {/* Content */}
            <div className="flex-grow-1">
                {/* Header */}
                <div className="d-flex align-items-center mb-1">
                    <strong className="me-2">{user?.full_name || 'Anonymous'}</strong>
                    <span className="fs-10 text-uppercase text-muted">
                        {created_at ? new Date(created_at).toLocaleString() : ''}
                    </span>
                </div>

                {/* Comment Text */}
                <div className="d-flex align-items-start">
                    <p className="fs-12 text-dark p-3 bg-gray-200 rounded-3 mb-0 ">
                        {comment_text}
                    </p>
                    <Dropdown
                        dropdownItems={commentOptions}
                        dropdownParentStyle="ms-2"
                    />
                </div>

                {/* Actions */}
                <div className="fs-10 text-uppercase d-flex align-items-center mt-2 text-muted">
                    <button className="btn btn-link p-0 text-muted">
                        Like {like_count ? `(${like_count})` : ''}
                    </button>

                    <span className="wd-3 ht-3 bg-gray-500 rounded-circle d-flex mx-2" />

                    {/* <button
            className="btn btn-link p-0 text-muted"
            onClick={() => onReply?.(comment_id)}
          >
            Reply
          </button> */}
                    <button
                        className="btn btn-link p-0 text-muted"
                        onClick={() => setShowReplyBox(prev => !prev)}
                    >
                        Reply
                    </button>

                    {showReplyBox && (
                        <div className="mt-2">
                            <textarea
                                rows={3}
                                className="form-control"
                                placeholder="Write a reply..."
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                            />

                            <button
                                className="btn btn-sm btn-primary mt-2"
                                onClick={submitReply}
                                disabled={loading}
                            >
                                {loading ? 'Posting...' : 'Reply'}
                            </button>
                        </div>
                    )}


                    {replies.length > 0 && (
                        <>
                            <span className="wd-3 ht-3 bg-gray-500 rounded-circle d-flex mx-2" />
                            <span>{replies.length} Replies</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CommentCard
