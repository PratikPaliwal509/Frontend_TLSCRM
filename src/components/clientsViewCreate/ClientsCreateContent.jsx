
import React from 'react'
import SelectDropdown from '@/components/shared/SelectDropdown'
import Input from '@/components/shared/Input'

const ClientsCreateContent = ({ formData, agencies, onChange }) => {
    console.log("agencyId" + JSON.stringify(agencies))
    return (
        <div className="col-lg-12">
            <div className="card stretch stretch-full">
                <div className="card-body">

                    {/* AGENCY */}
                    {/* AGENCY */}
                    <div className="mb-4">
                        <label className="form-label">Agency</label>

                        <select
                            className="form-select"
                            value={formData.agency_id || ""}   // 🔥 controlled value
                            onChange={(e) => onChange('agency_id', Number(e.target.value))}
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


                    <Input
                        label="Company Name"
                        placeholder="Company Name"
                        value={formData.company_name}
                        onChange={(e) => onChange('company_name', e.target.value)}
                    />

                    <Input
                        label="Industry"
                        placeholder="Industry"
                        value={formData.industry}
                        onChange={(e) => onChange('industry', e.target.value)}
                    />

                    <Input
                        label="Company Size"
                        placeholder="50-100"
                        value={formData.company_size}
                        onChange={(e) => onChange('company_size', e.target.value)}
                    />

                    <Input
                        label="Website"
                        placeholder="https://example.com"
                        value={formData.website}
                        onChange={(e) => onChange('website', e.target.value)}
                    />

                    <Input
                        label="Primary Contact Name"
                        placeholder="John Doe"
                        value={formData.primary_contact_name}
                        onChange={(e) => onChange('primary_contact_name', e.target.value)}
                    />

                    <Input
                        label="Primary Contact Email"
                        type="email"
                        placeholder="john@email.com"
                        value={formData.primary_contact_email}
                        onChange={(e) => onChange('primary_contact_email', e.target.value)}
                    />

                    <Input
                        label="Primary Contact Phone"
                        placeholder="+91-XXXXXXXXXX"
                        value={formData.primary_contact_phone}
                        onChange={(e) => onChange('primary_contact_phone', e.target.value)}
                    />

                    <Input
                        label="Country"
                        placeholder="India"
                        value={formData.country}
                        onChange={(e) => onChange('country', e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default ClientsCreateContent
