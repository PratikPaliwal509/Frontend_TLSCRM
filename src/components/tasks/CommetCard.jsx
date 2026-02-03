import React, { useState, useMemo, useEffect } from 'react'
import {
    FiBellOff,
    FiEyeOff,
    FiFlag,
    FiSlash,
} from 'react-icons/fi'
import Dropdown from '../shared/Dropdown'
import Comments from '../Comments'
import { toast } from 'react-toastify'

const CommentCard = ({
    comment_id,
    comment_text,
    created_at,
    user,
    like_count = 0,
    replies = [],
    task_id,
    setComments,
    portal_user_id
}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(comment_text)

    /* =========================
       DROPDOWN OPTIONS
    ========================== */
    const commentOptions = [
        { label: 'Edit', onClick: () => handleEdit() },
        { label: 'Delete', onClick: () => handleDelete() },
        // { label: 'Mute', icon: <FiBellOff /> },
        // { label: 'Hide', icon: <FiEyeOff /> },
        // { label: 'Block', icon: <FiSlash /> },
        // { label: 'Report', icon: <FiFlag /> },
    ]


    /* =========================
       STATE
    ========================== */
    const [replyingToUser, setReplyingToUser] = useState(null)

    const [showReplyBox, setShowReplyBox] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [loading, setLoading] = useState(false)

    // Mention system
    const [showMentions, setShowMentions] = useState(false)
    const [mentionQuery, setMentionQuery] = useState('')
    const [cursorPosition, setCursorPosition] = useState(0)

    const token = localStorage.getItem('token')
    useEffect(() => {
        setEditText(comment_text)
    }, [comment_text])

    /* =========================
       USERS FOR @MENTION
    ========================== */
    const mentionUsers = useMemo(() => {
        if (!replyingToUser) return []
        return [replyingToUser]
    }, [replyingToUser])

    const stripMentionsFromText = (text) => {
        return text.replace(/@\w+/g, '').replace(/\s+/g, ' ').trim()
    }

    /* =========================
   HELPERS
========================== */
    const extractMentionsWithIds = (text, users = []) => {
        const matches = text.match(/@(\w+)/g) || []
        const usernames = matches.map(m => m.replace('@', ''))

        const userMap = new Map(
            users.map(u => [
                u.full_name.replace(/\s+/g, '').toLowerCase(),
                u.user_id,
            ])
        )

        const mention_user_ids = usernames
            .map(name => userMap.get(name.toLowerCase()))
            .filter(Boolean)

        return {
            mentioned_usernames: usernames,
            mention_user_ids,
        }
    }

    /* =========================
       SUBMIT REPLY
    ========================== */
    const submitReply = async () => {
        if (!replyText.trim()) return

        setLoading(true)
        try {
            const { mentioned_usernames, mention_user_ids } =
                extractMentionsWithIds(replyText, mentionUsers)

            const cleanText = stripMentionsFromText(replyText)
            const res = await fetch(
                `http://localhost:5000/api/tasksComments/${task_id}/comments/${comment_id}/replies`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        comment_text: cleanText,           // ✅ NO @username
                        // mentions: mentioned_usernames,     // ✅ usernames
                        mentioned_users: mention_user_ids,                  // ✅ IDs
                    }),


                }
            )

            if (!res.ok) throw new Error('Failed to add reply')

            const result = await res.json()

            setComments(prev =>
                prev.map(c =>
                    c.comment_id === comment_id
                        ? { ...c, replies: [...(c.replies || []), result.data] }
                        : c
                )
            )

            setReplyText('')
            setShowReplyBox(false)
            setShowMentions(false)
            setReplyingToUser(null)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // const renderCommentText = (text, mentionedUsers = []) => {
    //     return (
    //         <>
    //             {mentionedUsers.map(u => (
    //                 <span
    //                     key={u.user_id}
    //                     className="text-primary fw-semibold me-1"
    //                 >
    //                     @{u.full_name.replace(/\s+/g, '')}
    //                 </span>
    //             ))}
    //             <span>{text}</span>
    //         </>
    //     )
    // }
    const handleEdit = () => {
        setIsEditing(true)
        setEditText(comment_text)
    }
    const submitEdit = async () => {
        if (!editText.trim()) return

        try {
            const res = await fetch(
                `http://localhost:5000/api/tasksComments/comments/${comment_id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ comment_text: editText }),
                }
            )
            if (!res.ok) throw new Error('Failed to update comment')

            const result = await res.json()

            // Recursive function to find and update comment at any nesting level
            const updateCommentRecursive = (comments) => {
                return comments.map(c => {
                    if (c.comment_id === comment_id) {
                        return { ...c, comment_text: editText }
                    }
                    // Check nested replies
                    if (c.replies && c.replies.length > 0) {
                        return { ...c, replies: updateCommentRecursive(c.replies) }
                    }
                    return c
                })
            }
            toast.success("Comment updated successfully");
            setComments(prev => updateCommentRecursive(prev))

            setIsEditing(false)
        } catch (err) {
            console.error(err)
            toast.error(err.message);
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Delete this comment?')) return

        try {
            const res = await fetch(
                `http://localhost:5000/api/tasksComments/comments/${comment_id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            if (!res.ok) throw new Error('Failed to delete comment')

            // Recursive function to find and delete comment at any nesting level
            const deleteCommentRecursive = (comments) => {
                return comments
                    .filter(c => c.comment_id !== comment_id)
                    .map(c => {
                        if (c.replies && c.replies.length > 0) {
                            return { ...c, replies: deleteCommentRecursive(c.replies) }
                        }
                        return c
                    })
            }

            setComments(prev => deleteCommentRecursive(prev))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="d-flex mb-4">
            {/* Avatar */}
            <div className="avatar-image me-3">
                <img
                    src={user?.avatar_url || '/images/avatar/1.png'}
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

                {/* Comment */}
                <div className="d-flex align-items-start">
                    {/* <p className="fs-12 text-dark p-3 bg-gray-200 rounded-3 mb-0">
                        { comment_text} */}
                    {/* {renderCommentText(comment_text, replies?.mentioned_users || [])} */}
                    {/* {replies[1]?.mentioned_users?JSON.stringify(replies[1]?.mentioned_users[0]):""} */}
                    {/* </p>
                     */}
                    {isEditing ? (
                        <div className="w-100">
                            <textarea
                                className="form-control"
                                rows={3}
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                            />

                            <div className="mt-2 d-flex">
                                <button
                                    className="btn btn-sm btn-primary me-2"
                                    onClick={submitEdit}
                                >
                                    Save
                                </button>
                                <button
                                    className="btn btn-sm btn-secondary"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="fs-12 text-dark p-3 bg-gray-200 rounded-3 mb-0">
                            {comment_text}
                        </p>
                    )}

                    {portal_user_id === user?.user_id && (
                        <Dropdown
                            dropdownItems={commentOptions}
                            dropdownParentStyle="ms-2"
                        />
                    )}
                </div>

                {/* Actions */}
                <div className="fs-10 text-uppercase d-flex align-items-center mt-2 text-muted">
                    <button className="btn btn-link p-0 text-muted">
                        Like {like_count ? `(${like_count})` : ''}
                    </button>

                    <span className="wd-3 ht-3 bg-gray-500 rounded-circle d-flex mx-2" />

                    <button
                        className="btn btn-link p-0 text-muted"
                        onClick={() => {
                            setShowReplyBox(prev => !prev)

                            if (!showReplyBox && user) {
                                const username = user.full_name.replace(/\s+/g, '')
                                setReplyText(`@${username} `)
                                setReplyingToUser(user)
                                setShowMentions(false)
                            }
                        }}
                    >
                        Reply
                    </button>


                    {replies.length > 0 && (
                        <>
                            <span className="wd-3 ht-3 bg-gray-500 rounded-circle d-flex mx-2" />
                            <span>{replies.length} Replies</span>
                        </>
                    )}
                </div>

                {/* Reply Box */}
                {showReplyBox && (
                    <div className="mt-2 position-relative">
                        <textarea
                            rows={3}
                            className="form-control"
                            placeholder="Write a reply…"
                            value={replyText}
                            onChange={(e) => {
                                const value = e.target.value
                                const cursor = e.target.selectionStart

                                setReplyText(value)
                                setCursorPosition(cursor)

                                const beforeCursor = value.slice(0, cursor)
                                const match = beforeCursor.match(/@(\w*)$/)

                                if (match && replyingToUser) {
                                    setMentionQuery(match[1])
                                    setShowMentions(true)
                                } else {
                                    setShowMentions(false)
                                }
                            }}
                        />


                        {/* Mention dropdown */}
                        {showMentions && (
                            <ul className="list-group position-absolute w-100 shadow z-3">
                                {mentionUsers.map(u => (
                                    <li 
                                        key={u.user_id}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => {
                                            const before = replyText.slice(0, cursorPosition)
                                            const after = replyText.slice(cursorPosition)

                                            const newText = before.replace(
                                                /@\w*$/,
                                                `@${u.full_name.replace(/\s+/g, '')} `
                                            )

                                            setReplyText(newText + after)
                                            setShowMentions(false)
                                        }}
                                    >
                                        @{u.full_name}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className='d-flex flex-row'>
                            <button
                                className="btn btn-sm btn-primary mt-2"
                                onClick={submitReply}
                                disabled={loading}
                            >
                                {loading ? 'Posting...' : 'Reply'}
                            </button>
                            <button
                                className="btn btn-sm btn-secondary mt-2 ms-2"
                                onClick={() => {
                                    setShowReplyBox(prev => !prev)
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

/* =========================
   HELPERS
========================== */

export default CommentCard
