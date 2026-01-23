import React, { useEffect, useState } from 'react'
import Input from '@/components/shared/Input'
import Select from 'react-select'

const ClientsCreateContent = ({ formData, agencies = [], onChange }) => {
    const [sameEmail, setSameEmail] = useState(false)
    const [sameAddress, setSameAddress] = useState(false)

    const brandColorOptions = [
        { value: '#FF5733', label: 'Red Orange' },
        { value: '#1E90FF', label: 'Dodger Blue' },
        { value: '#28A745', label: 'Green' },
        { value: '#6F42C1', label: 'Purple' },
        { value: '#FFC107', label: 'Yellow' },
        { value: '#000000', label: 'Black' },
        { value: '#FFFFFF', label: 'White' },
    ]

    /* =========================
       SYNC CHECKBOX LOGIC
    ========================= */
    useEffect(() => {
        if (sameEmail) {
            onChange('billing_email', formData.primary_contact_email || '')
        }
    }, [sameEmail, formData.primary_contact_email])

    useEffect(() => {
        if (sameAddress) {
            onChange('billing_address', formData.address || '')
        }
    }, [sameAddress, formData.address])

    /* =========================
       HELPERS
    ========================= */
    const brandColors = formData.brand_colors || {}

    return (
        <div className="col-lg-12">
            <div className="card stretch stretch-full">
                <div className="card-body">

                    {/* ================= AGENCY ================= */}
                    <div className="mb-4">
                        <label className="form-label">Agency</label>
                        <select
                            className="form-select"
                            value={formData.agency_id || ''}
                            onChange={(e) =>
                                onChange('agency_id', Number(e.target.value) || null)
                            }
                        >
                            <option value="">Select Agency</option>
                            {agencies.map((agency) => (
                                <option
                                    key={agency.agency_id}
                                    value={agency.agency_id}
                                >
                                    {agency.agency_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input label="Tax ID" value={formData.tax_id} onChange={e => onChange('tax_id', e.target.value)} />
                    <Input label="Company Name" value={formData.company_name} onChange={e => onChange('company_name', e.target.value)} />
                    <Input label="Industry" value={formData.industry} onChange={e => onChange('industry', e.target.value)} />
                    <Input label="Company Size" value={formData.company_size} onChange={e => onChange('company_size', e.target.value)} />
                    <Input label="Website" value={formData.website} onChange={e => onChange('website', e.target.value)} />

                    <Input label="Primary Contact Name" value={formData.primary_contact_name} onChange={e => onChange('primary_contact_name', e.target.value)} />
                    <Input label="Primary Contact Email" type="email" value={formData.primary_contact_email} onChange={e => onChange('primary_contact_email', e.target.value)} />

                    <div className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={sameEmail}
                            onChange={(e) => setSameEmail(e.target.checked)}
                        />
                        <label className="form-check-label">
                            Billing email same as primary email
                        </label>
                    </div>

                    <Input
                        label="Billing Email"
                        type="email"
                        value={formData.billing_email}
                        disabled={sameEmail}
                        onChange={e => onChange('billing_email', e.target.value)}
                    />

                    <Input label="Primary Contact Phone" value={formData.primary_contact_phone} onChange={e => onChange('primary_contact_phone', e.target.value)} />
                    <Input label="Country" value={formData.country} onChange={e => onChange('country', e.target.value)} />
                    <Input label="State" value={formData.state} onChange={e => onChange('state', e.target.value)} />
                    <Input label="City" value={formData.city} onChange={e => onChange('city', e.target.value)} />
                    <Input label="Postal Code" value={formData.postal_code} onChange={e => onChange('postal_code', e.target.value)} />

                    <Input label="Address" value={formData.address} onChange={e => onChange('address', e.target.value)} />

                    <div className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={sameAddress}
                            onChange={(e) => setSameAddress(e.target.checked)}
                        />
                        <label className="form-check-label">
                            Billing address same as primary address
                        </label>
                    </div>

                    <Input
                        label="Billing Address"
                        value={formData.billing_address}
                        disabled={sameAddress}
                        onChange={e => onChange('billing_address', e.target.value)}
                    />

                    <Input label="Notes" value={formData.notes} onChange={e => onChange('notes', e.target.value)} />
                    <Input label="Brand Guidelines Url" value={formData.brand_guidelines_url} onChange={e => onChange('brand_guidelines_url', e.target.value)} />

                    {/* ================= BRAND COLORS ================= */}
                    <div className="mb-4">
                        <label className="form-label">Brand Colors</label>

                        {Object.entries(brandColors).map(([key, color], index) => (
                            <div key={index} className="d-flex gap-2 mb-2 align-items-center">

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Key"
                                    value={key}
                                    onChange={(e) => {
                                        const newKey = e.target.value.trim()
                                        const updated = { ...brandColors }

                                        delete updated[key]
                                        if (newKey) updated[newKey] = color

                                        onChange('brand_colors', updated)
                                    }}
                                    style={{ maxWidth: 180 }}
                                />

                                <Select
                                    options={brandColorOptions}
                                    value={brandColorOptions.find(opt => opt.value === color) || null}
                                    onChange={(opt) => {
                                        if (!key) return
                                        onChange('brand_colors', {
                                            ...brandColors,
                                            [key]: opt?.value || '',
                                        })
                                    }}
                                    styles={{ container: base => ({ ...base, width: 180 }) }}
                                />

                                {color && (
                                    <span
                                        style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: '50%',
                                            backgroundColor: color,
                                            border: '1px solid #ccc',
                                        }}
                                    />
                                )}

                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => {
                                        const updated = { ...brandColors }
                                        delete updated[key]
                                        onChange('brand_colors', updated)
                                    }}
                                >
                                    ❌
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                                onChange('brand_colors', {
                                    ...brandColors,
                                    '': '',
                                })
                            }
                        >
                            ➕ Add Color
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ClientsCreateContent
