import React, { forwardRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Forward ref to avoid findDOMNode
const ReactQuillSafe = forwardRef(({ value, onChange, ...props }, ref) => {
  return <ReactQuill ref={ref} value={value} onChange={onChange} {...props} />
})

export default ReactQuillSafe
