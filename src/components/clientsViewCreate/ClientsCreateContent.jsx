
import React from 'react'
import SelectDropdown from '@/components/shared/SelectDropdown'
import Input from '@/components/shared/Input'

const ClientsCreateContent = ({ formData, agencies, onChange }) => {
    return (
        <div className="col-lg-12">
            <div className="card stretch stretch-full">
                <div className="card-body">

                    {/* AGENCY */}
                    <div className="mb-4">
                        <label className="form-label">Agency</label>
                        <SelectDropdown
                            options={agencies.map(a => ({
                                label: a.agency_name || '',   // 🔥 SAFETY
                                value: a.agency_id,
                            }))}
                            selectedOption={formData.agency_id}
                            onSelectOption={(opt) => onChange('agency_id', opt.value)}
                        />

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
