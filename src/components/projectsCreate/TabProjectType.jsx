
import React, { useEffect, useState } from 'react'

const TabProjectType = ({ formData, setFormData, error }) => {
  const [agencies, setAgencies] = useState([])
  const [clients, setClients] = useState([])

  const token = localStorage.getItem('token')

  // 🔹 Fetch agencies (only once)
  useEffect(() => {
    fetch('http://localhost:5000/api/agencies', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        const list = Array.isArray(res) ? res : res.data || res.agencies || []
        setAgencies(list)
      })
      .catch(() => setAgencies([]))
  }, [])

  // 🔹 Fetch clients when agency changes
  useEffect(() => {
    if (formData.agency_id === null || formData.agency_id === undefined) {
      setClients([])
      return
    }


    fetch(
      `http://localhost:5000/api/clients/clientsAll?agency_id=${formData.agency_id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(res => res.json())
      .then(res => {
        const list = Array.isArray(res) ? res : res.data || res.clients || []
        setClients(list)
      })
      .catch(err => {
        console.error(err)
        setClients([])
      })
  }, [formData.agency_id])

  return (
    <section>
      <h4>Agency</h4>
      <select
        className="form-control"
        value={formData.agency_id ?? ''}
        onChange={e => {
          const value = e.target.value
          setFormData({
            ...formData,
            agency_id: value ? Number(value) : null,
            client_id: null // reset client when agency changes
          })
        }}

      >

        <option value="">Select Agency</option>
        {agencies.map(a => (
          <option key={a.agency_id} value={a.agency_id}>
            {a.agency_name}
          </option>
        ))}
      </select>
      {error && formData.agency_id === null && <p className="text-danger mt-2">Agency is required</p>}
      <h4 className="mt-4">Client</h4>
      <select
        className="form-control text-black"
        value={formData.client_id ?? ''}
        disabled={formData.agency_id === null}
        onChange={e => {
          const value = e.target.value
          setFormData({
            ...formData,
            client_id: value ? Number(value) : null
          })
        }}

      >

        <option value="">Select Client</option>
        {clients.map(c => (
          <option key={c.client_id} value={c.client_id}>
            {c.company_name}
          </option>
        ))}
      </select>

      {error && formData.client_id === null && <p className="text-danger mt-2">Client is required</p>}
    </section>
  )
}

export default TabProjectType
