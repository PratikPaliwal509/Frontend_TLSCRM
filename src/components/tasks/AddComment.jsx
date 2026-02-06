import React, { useState } from 'react'
import { toast } from 'react-toastify'

const AddComment = ({ taskID, setComments }) => {
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    setLoading(true)
    try {
      const res = await fetch(
        `https://api-0ggv.onrender.com/api/tasksComments/${taskID}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            comment_text: comment,
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

      <textarea
        rows={5}
        className="form-control"
        placeholder="Your comment...."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

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
