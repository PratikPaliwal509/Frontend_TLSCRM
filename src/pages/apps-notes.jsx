import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NotesContent from '@/components/notes/NotesContent'
import { verifyPagePermission } from '@/utils/verifyPagePermission'
// import AddsNote from '@/components/notes/AddsNote'
const AppsNotes = () => {
  const navigate = useNavigate()

//   useEffect(() => {
//   const checkPermission = async () => {
//     const allowed = await verifyPagePermission('notes', 'view', navigate)
//   }
//   checkPermission()
// }, [navigate])


  return <>
<NotesContent />
 {/* Add Notes Modal */}
</>
}

export default AppsNotes
