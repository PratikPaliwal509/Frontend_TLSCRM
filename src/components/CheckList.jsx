import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'

const CheckList = ({ checklist = [], taskID }) => {
  const [data, setData] = useState([])
  const [inputValue, setInputValue] = useState("")
  const token = localStorage.getItem("token")

  /* Sync checklist from backend */
  useEffect(() => {
    setData(checklist)
  }, [checklist])

  /* Persist checklist to backend */
  const persistChecklist = async (updatedData, rollbackData) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${taskID}/checklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ checklist: updatedData })
      })
    } catch (err) {
      console.error('Checklist update failed', err)
      setData(rollbackData)
    }
  }

  /* Toggle checklist */
  const handleCheckList = (id) => {
    const prevData = data

    const updatedData = data.map(item =>
      item.id === id
        ? { ...item, checked: !item.checked }
        : item
    )

    setData(updatedData)
    persistChecklist(updatedData, prevData)
  }

  /* Delete checklist item */
  const handleDeleteItem = (id) => {
    const prevData = data
    const updatedData = data.filter(item => item.id !== id)

    setData(updatedData)
    persistChecklist(updatedData, prevData)
  }

  /* Add new checklist item */
  const handleValueSubmit = () => {
    if (!inputValue.trim()) return

    const prevData = data

    const newItem = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      title: inputValue,
      checked: false
    }

    const updatedData = [...data, newItem]

    setData(updatedData)
    persistChecklist(updatedData, prevData)
    setInputValue("")
  }

  return (
    <>
      <div id="checklist">
        {data.map(({ checked, id, title }) => (
          <div key={id} className="d-flex align-items-center p-0">
            <div
              onClick={() => handleCheckList(id)}
              className={`mb-0 w-100 ${checked ? "checked" : ""}`}
              style={{ cursor: 'pointer' }}
            >
              {title}
            </div>

            <span
              onClick={() => handleDeleteItem(id)}
              className="close"
              style={{ cursor: 'pointer' }}
            >
              ×
            </span>
          </div>
        ))}
      </div>

      <div className="input-group mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Title..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <button
          type="button"
          className="input-group-text addCheckList"
          onClick={handleValueSubmit}
        >
          <FiPlus size={16} className="me-2" />
          Add Checklist
        </button>
      </div>
    </>
  )
}

export default CheckList
