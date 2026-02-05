// components/shared/Loader.jsx
import React from "react"

const Loader = ({ height = "300px", size = 36 }) => {
  const primary = "#3B5BFF" // matches CREATE CLIENTS button

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

export default Loader
