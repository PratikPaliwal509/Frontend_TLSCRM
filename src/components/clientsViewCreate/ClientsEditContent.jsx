import React from 'react';
import Input from '@/components/shared/Input';

const ClientsEditContent = ({ formData, agencies,  users = [], onChange }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange(name, value);
    };

    return (
        <div className="col-12">
            <div className="card p-4">
                <h5 className="mb-4">Client Information</h5>

                {/* Agency Select */}
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Agency: </label>
                    </div>
                    <div className="col-lg-8">
                        <select
                            className="form-select"
                            name="agency_id"
                            value={formData.agency_id}
                            // onChange={handleInputChange}
                            disabled
                        >
                            <option value="">Select Agency</option>
                            {agencies.map((agency) => (
                                <option key={agency.agency_id} value={agency.agency_id}>
                                    {agency.agency_name || agency.company_name || 'Unnamed Agency'}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* User Select */}
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Users: </label>
                    </div>
                    <div className="col-lg-8">
                        <select
                            className="form-select"
                            name="portal_user_id"
                            value={formData.portal_user_id}
                            onChange={handleInputChange}
                            // disabled
                        >
                            <option value="">Select User</option>
                            {users.map((user) => (
                                <option key={user.user_id} value={user.user_id}>
                                    {user.first_name} {user.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Company Name */}
                <Input
                    label="Company Name"
                    name="company_name"
                    labelId="company_name"
                    placeholder="Enter company name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                />

                {/* Industry */}
                <Input
                    label="Industry"
                    name="industry"
                    labelId="industry"
                    placeholder="Enter industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                />

                {/* Company Size */}
                <Input
                    label="Company Size"
                    name="company_size"
                    labelId="company_size"
                    placeholder="Enter company size"
                    value={formData.company_size}
                    onChange={handleInputChange}
                />

                {/* Website */}
                <Input
                    label="Website"
                    name="website"
                    labelId="website"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={handleInputChange}
                />

                {/* Primary Contact Name */}
                <Input
                    label="Primary Contact Name"
                    name="primary_contact_name"
                    labelId="primary_contact_name"
                    placeholder="Enter contact name"
                    value={formData.primary_contact_name}
                    onChange={handleInputChange}
                />

                {/* Primary Contact Email */}
                <Input
                    label="Primary Contact Email"
                    type="email"
                    name="primary_contact_email"
                    labelId="primary_contact_email"
                    placeholder="Enter email"
                    value={formData.primary_contact_email}
                    onChange={handleInputChange}
                />

                {/* Primary Contact Phone */}
                <Input
                    label="Primary Contact Phone"
                    type="tel"
                    name="primary_contact_phone"
                    labelId="primary_contact_phone"
                    placeholder="Enter phone number"
                    value={formData.primary_contact_phone}
                    onChange={handleInputChange}
                />

                {/* Country */}
                <Input
                    label="Country"
                    name="country"
                    labelId="country"
                    placeholder="Enter country"
                    value={formData.country}
                    onChange={handleInputChange}
                />

                {/* Status */}
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Status: </label>
                    </div>
                    <div className="col-lg-8">
                        <select
                            className="form-select"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClientsEditContent;
