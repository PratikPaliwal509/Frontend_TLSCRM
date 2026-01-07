
import React from 'react'

const TabProjectBudget = ({ formData, setFormData, error }) => {
  return (
    <section className="space-y-3 ">
      {/* Budget Amount */}
      <label htmlFor="budgetAmount" className="form-label">
        Budget Amount <span className="text-danger">*</span>
      </label>
      <input
        type="number"
        className="form-control mb-4"
        placeholder="Budget Amount"
        value={formData.budget_amount || ''}
        onChange={(e) =>
          setFormData({
            ...formData,
            budget_amount: Number(e.target.value),
          })
        }
      />

      {/* Billing Type */}
      <label htmlFor="billingType" className="form-label">
        Billing Type <span className="text-danger">*</span>
      </label>
      <select
        className="form-control "
        value={formData.billing_type || ''}
        onChange={(e) =>
          setFormData({
            ...formData,
            billing_type: e.target.value,
          })
        }
      >
        <option value="">Select Billing Type</option>
        <option value="FIXED">Fixed Price</option>
        <option value="HOURLY">Hourly</option>
        <option value="MONTHLY">Monthly</option>
        <option value="RETAINER">Retainer</option>
      </select>

      {/* Error */}
      {error && <p className="text-danger">Budget and billing type are required</p>}
    </section>
  )
}

export default TabProjectBudget
