import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { toast } from 'react-toastify'
const CheckList = ({ checklist = [], taskID }) => {
  const [data, setData] = useState([])
  const [inputValue, setInputValue] = useState("")
  const token = localStorage.getItem("token")
  const [isAdding, setIsAdding] = useState(false);
  /* Sync checklist from backend */
  useEffect(() => {
    setData(checklist)
  }, [checklist])

  /* Persist checklist to backend */
  const persistChecklist = async (updatedData, rollbackData) => {
    try {
      const response = await fetch(`https://api-0ggv.onrender.com/api/tasks/${taskID}/checklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ checklist: updatedData })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update checklist");
      }

      return true; // success

    } catch (err) {
      console.error('Checklist update failed', err);

      // rollback UI
      setData(rollbackData);

      toast.error(err.message || "Checklist update failed");

      return false;
    }
  };

  /* Toggle checklist */
  const handleCheckList = async (id) => {
    const prevData = data;

    const updatedData = data.map(item =>
      item.id === id
        ? { ...item, checked: !item.checked }
        : item
    );

    setData(updatedData);

    const success = await persistChecklist(updatedData, prevData);

    if (success) {
      toast.success("Checklist updated");
    }
  };

  /* Delete checklist item */
  const handleDeleteItem = async (id) => {
    const prevData = data;
    const updatedData = data.filter(item => item.id !== id);

    setData(updatedData);

    const success = await persistChecklist(updatedData, prevData);

    if (success) {
      toast.success("Checklist item deleted!");
    }
  };

  /* Add new checklist item */
  const handleValueSubmit = async () => {
    try {
      if (!inputValue.trim()) {
        toast.warning("Please enter a checklist item");
        return;
      }
      if (isAdding) return; // extra safety

      setIsAdding(true);

      const prevData = data;

      const newItem = {
        id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        title: inputValue.trim(),
        checked: false
      };

      const updatedData = [...data, newItem];

      // Optimistic UI update
      setData(updatedData);

      // 🔥 Await API
      await persistChecklist(updatedData, prevData);

      toast.success("Checklist item added successfully");
      setInputValue("");

    } catch (error) {
      console.error("Checklist add error:", error);

      // ❌ rollback UI
      setData(data);

      toast.error(
        error?.message || "Failed to add checklist. Please try again"
      );
    } finally {
      setIsAdding(false);
    }
  };

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
          disabled={isAdding}
          style={{
            backgroundColor: isAdding ? "#f5f5f5" : "",
            cursor: isAdding ? "not-allowed" : "text",
            opacity: isAdding ? 0.8 : 1
          }}
        />

        <button
          type="button"
          className="input-group-text addCheckList"
          onClick={handleValueSubmit}
          disabled={isAdding}
        >
          <FiPlus size={16} className="me-2" />
          {isAdding ? "Adding..." : "Add Checklist"}
        </button>
      </div>
    </>
  )
}

export default CheckList
