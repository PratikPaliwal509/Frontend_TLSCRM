import React, { Fragment, useState } from 'react'
import { FiMoreHorizontal } from 'react-icons/fi'
import CommentCard from './tasks/CommetCard'

const COMMENTS_PER_LOAD = 5
const REPLIES_PER_LOAD = 2

const Comments = ({ comments, loading, setComments, portal_user_id }) => {
  const [visibleComments, setVisibleComments] = useState(COMMENTS_PER_LOAD)
  const [visibleReplies, setVisibleReplies] = useState({})
  const [expandedReplies, setExpandedReplies] = useState({})

  /* ---------------- COMMENTS ---------------- */
  const loadMoreComments = () =>
    setVisibleComments(prev => prev + COMMENTS_PER_LOAD)

  const hideComments = () =>
    setVisibleComments(COMMENTS_PER_LOAD)

  /* ---------------- REPLIES ---------------- */
  const loadMoreReplies = (commentId) => {
    setVisibleReplies(prev => ({
      ...prev,
      [commentId]: (prev[commentId] || REPLIES_PER_LOAD) + REPLIES_PER_LOAD
    }))
  }

  const hideReplies = (commentId) => {
    setVisibleReplies(prev => ({
      ...prev,
      [commentId]: REPLIES_PER_LOAD
    }))
  }

  const toggleNestedReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }

  /* ---------------- RENDER ---------------- */
  const renderCommentWithReplies = (comment, level = 0) => {
    const totalReplies = comment.replies?.length || 0
    const repliesVisible = visibleReplies[comment.comment_id] || REPLIES_PER_LOAD

    const hasMoreReplies = totalReplies > repliesVisible
    const canHideReplies = repliesVisible > REPLIES_PER_LOAD

    return (
      <Fragment key={comment.comment_id}>
        {/* Main Comment */}
        <div style={{ marginLeft: level * 20 }}>
          <CommentCard {...comment} setComments={setComments} portal_user_id={portal_user_id} />
        </div>

        {/* Replies */}
        {totalReplies > 0 && (
          <div style={{ marginLeft: (level + 1) * 20 }} className="mt-1">

            {/* Render Replies */}
            {comment.replies.slice(0, repliesVisible).map(reply => {
              const hasNestedReplies = reply.replies?.length > 0
              const isExpanded = expandedReplies[reply.comment_id]

              return (
                <div key={reply.comment_id} className="mb-1">
                  <CommentCard {...reply} setComments={setComments} portal_user_id={portal_user_id}/>

                  {/* Show nested replies */}
                  {hasNestedReplies && !isExpanded && (
                    <button
                      className="btn btn-link p-0 fs-10 text-muted ms-3"
                      onClick={() => toggleNestedReplies(reply.comment_id)}
                    >
                      Show replies ({reply.replies.length})
                    </button>
                  )}

                  {/* Nested replies */}
                  {hasNestedReplies && isExpanded && (
                    <div className="ms-3 mt-1">
                      {reply.replies.map(child =>
                        renderCommentWithReplies(child, level + 2)
                      )}

                      {/* Hide nested replies – ALWAYS AT END */}
                      <button
                        className="btn btn-link p-0 fs-10 text-muted mt-1"
                        onClick={() => toggleNestedReplies(reply.comment_id)}
                      >
                        Hide replies
                      </button>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Load more replies */}
            {hasMoreReplies && (
              <div className="ms-3 mt-1">
                <button
                  className="btn btn-link p-0 fs-10 text-muted"
                  onClick={() => loadMoreReplies(comment.comment_id)}
                >
                  <FiMoreHorizontal className="fs-12 me-1" />
                  Load more replies
                </button>
              </div>
            )}

            {/* Hide replies – AFTER loaded replies */}
            {canHideReplies && (
              <div className="ms-3 mt-1">
                <button
                  className="btn btn-link p-0 fs-10 text-muted"
                  onClick={() => hideReplies(comment.comment_id)}
                >
                  Hide replies
                </button>
              </div>
            )}
          </div>
        )}
      </Fragment>
    )
  }

  if (loading) return <p>Loading comments...</p>
  if (!comments.length) return <p>No comments yet</p>

  const commentsToShow = comments.slice(0, visibleComments)
  const hasMoreComments = comments.length > visibleComments
  const canHideComments = visibleComments > COMMENTS_PER_LOAD

  return (
    <>
      {commentsToShow.map(comment =>
        renderCommentWithReplies(comment)
      )}

      {/* Comment controls */}
      <div className="text-center my-3">
        {hasMoreComments && (
          <button
            className="btn btn-link fs-10 text-muted me-3"
            onClick={loadMoreComments}
          >
            <FiMoreHorizontal className="fs-12 me-1" />
            See more comments
          </button>
        )}

        {canHideComments && (
          <button
            className="btn btn-link fs-10 text-muted"
            onClick={hideComments}
          >
            Hide comments
          </button>
        )}
      </div>
    </>
  )
}

export default Comments
