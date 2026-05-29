import { userList } from '@/utils/fackData/userList'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const AddComment = ({ usersList, taskID, setComments }) => {
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')
  const [showMentions, setShowMentions] = useState(false)
  const [filteredUsers, setFilteredUsers] = useState([])
  const [mentionedUsers, setMentionedUsers] = useState([])
  const [cursorPosition, setCursorPosition] = useState(0)
  const handleChange = (e) => {
    const value = e.target.value
    const cursor = e.target.selectionStart

    setComment(value)
    setCursorPosition(cursor)

    const textBeforeCursor = value.slice(0, cursor)
    const match = textBeforeCursor.match(/@(\w*)$/)

    if (match) {
      const search = match[1].toLowerCase()

      const filtered = usersList.filter((u) =>
        u.full_name.toLowerCase().includes(search)
      )

      setFilteredUsers(filtered)
      setShowMentions(true)
    } else {
      setShowMentions(false)
    }
  }
  const selectUser = (user) => {
    const textBeforeCursor = comment.slice(0, cursorPosition)
    const textAfterCursor = comment.slice(cursorPosition)

    const updatedText = textBeforeCursor.replace(
      /@(\w*)$/,
      `@${user.full_name} `
    )

    setComment(updatedText + textAfterCursor)
    setShowMentions(false)

    setMentionedUsers((prev) =>
      prev.includes(user.user_id) ? prev : [...prev, user.user_id]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:5000/api/tasksComments/${taskID}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            comment_text: comment,
            mentioned_users: mentionedUsers,
          }),
        }
      )

      if (!res.ok) throw new Error('Failed to add comment')

      const result = await res.json()
      toast.success("Comment Added Successfully!")
      setComments(prev => [result.data, ...prev])

      setComment('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-4">
      <label className="mb-1">Add Comment</label>
      <div className="position-relative">
        <textarea
          rows={5}
          className="form-control"
          placeholder="Your comment...."
          value={comment}
          onChange={handleChange}
        />
        {showMentions && filteredUsers.length > 0 && (
          // <div className="mention-dropdown shadow cursor-pointer">
          <div className="list-group position-absolute w-100 shadow z-3">
            {filteredUsers.map((user) => (
              <div
                key={user.user_id}
                // className="mention-item"
                className="list-group-item list-group-item-action"
                onClick={() => selectUser(user)}
              >
                @{user.full_name}
              </div>
            ))}
          </div>
        )}</div>
      <button
        className="btn btn-primary d-inline-block mt-4"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Posting...' : 'Add Comment'}
      </button>
    </div>
  )
}

export default AddComment
