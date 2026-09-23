import React, { useState } from 'react';

const CreateMetaFormModal = ({
    show,
    onClose,
    onSuccess,
}) => {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        privacy_policy_url: '',
        thank_you_title: 'Thank You!',
        thank_you_description:
            'Our team will contact you shortly.',
    });

    const [questions, setQuestions] = useState([
        {
            type: 'FULL_NAME',
        },
        {
            type: 'EMAIL',
        },
        {
            type: 'PHONE',
        },
    ]);

    /* ================= INPUT CHANGE ================= */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    /* ================= ADD CUSTOM QUESTION ================= */

    const addCustomQuestion = () => {

        setQuestions((prev) => [
            ...prev,
            {
                type: 'CUSTOM',
                key: '',
                label: '',
            },
        ]);

    };

    /* ================= QUESTION CHANGE ================= */

    const handleQuestionChange = (
        index,
        field,
        value
    ) => {

        setQuestions((prev) => {

            const updated = [...prev];

            updated[index] = {
                ...updated[index],
                [field]: value,
            };

            return updated;

        });

    };

    /* ================= REMOVE QUESTION ================= */

    const removeQuestion = (index) => {

        setQuestions((prev) =>
            prev.filter((_, i) => i !== index)
        );

    };

    /* ================= CREATE FORM ================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const token = localStorage.getItem('token');

            const payload = {
                name: formData.name,
                privacy_policy_url:
                    formData.privacy_policy_url,

                questions,

                thank_you_title:
                    formData.thank_you_title,

                thank_you_description:
                    formData.thank_you_description,
            };
            console.log('Payload:', payload);
            const response = await fetch(
                'https://api-0ggv.onrender.com/api/meta-leads/forms',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify(payload),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                    'Failed to create Meta form'
                );
            }

            onSuccess(result.data);

            onClose();

            /* Reset form */

            setFormData({
                name: '',
                privacy_policy_url: '',
                thank_you_title: 'Thank You!',
                thank_you_description:
                    'Our team will contact you shortly.',
            });

            setQuestions([
                {
                    type: 'FULL_NAME',
                },
                {
                    type: 'EMAIL',
                },
                {
                    type: 'PHONE',
                },
            ]);

        } catch (error) {

            console.error(
                'Create Meta form error:',
                error
            );

            alert(
                error.message ||
                'Failed to create Meta form'
            );

        } finally {

            setLoading(false);

        }

    };

    if (!show) {
        return null;
    }

    return (
        <div
            className="modal fade show"
            style={{
                display: 'block',
                backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            tabIndex="-1"
        >

            <div className="modal-dialog modal-lg modal-dialog-centered">

                <div className="modal-content">

                    {/* ================= HEADER ================= */}

                    <div className="modal-header">

                        <h5 className="modal-title">
                            Create Facebook Lead Form
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            disabled={loading}
                        />

                    </div>

                    {/* ================= BODY ================= */}

                    <form onSubmit={handleSubmit}>

                        <div className="modal-body">

                            {/* Form Name */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Form Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="TechLeela Website Leads"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* Privacy Policy */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Privacy Policy URL
                                </label>

                                <input
                                    type="url"
                                    name="privacy_policy_url"
                                    className="form-control"
                                    placeholder="https://techleela.com/privacy-policy"
                                    value={
                                        formData.privacy_policy_url
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            {/* ================= QUESTIONS ================= */}

                            <div className="mb-3">

                                <div className="d-flex justify-content-between align-items-center mb-2">

                                    <label className="form-label mb-0">
                                        Questions
                                    </label>

                                    <button
                                        type="button"
                                        className="btn btn-sm btn-light-brand"
                                        onClick={
                                            addCustomQuestion
                                        }
                                    >
                                        + Add Custom Question
                                    </button>

                                </div>

                                {questions.map(
                                    (question, index) => (

                                        <div
                                            key={index}
                                            className="border rounded p-3 mb-2"
                                        >

                                            <div className="row align-items-end">

                                                <div className="col-md-4">

                                                    <label className="form-label">
                                                        Type
                                                    </label>

                                                    <select
                                                        className="form-select"
                                                        value={
                                                            question.type
                                                        }
                                                        onChange={(e) =>
                                                            handleQuestionChange(
                                                                index,
                                                                'type',
                                                                e.target.value
                                                            )
                                                        }
                                                    >

                                                        <option value="FULL_NAME">
                                                            Full Name
                                                        </option>

                                                        <option value="EMAIL">
                                                            Email
                                                        </option>

                                                        <option value="PHONE">
                                                            Phone
                                                        </option>

                                                        <option value="CUSTOM">
                                                            Custom
                                                        </option>

                                                    </select>

                                                </div>

                                                {question.type ===
                                                    'CUSTOM' && (
                                                    <>
                                                        <div className="col-md-3">

                                                            <label className="form-label">
                                                                Key
                                                            </label>

                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="company_name"
                                                                value={
                                                                    question.key ||
                                                                    ''
                                                                }
                                                                onChange={(e) =>
                                                                    handleQuestionChange(
                                                                        index,
                                                                        'key',
                                                                        e.target.value
                                                                    )
                                                                }
                                                                required
                                                            />

                                                        </div>

                                                        <div className="col-md-3">

                                                            <label className="form-label">
                                                                Label
                                                            </label>

                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Company Name"
                                                                value={
                                                                    question.label ||
                                                                    ''
                                                                }
                                                                onChange={(e) =>
                                                                    handleQuestionChange(
                                                                        index,
                                                                        'label',
                                                                        e.target.value
                                                                    )
                                                                }
                                                                required
                                                            />

                                                        </div>
                                                    </>
                                                )}

                                                <div className="col-md-2">

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger w-100"
                                                        onClick={() =>
                                                            removeQuestion(
                                                                index
                                                            )
                                                        }
                                                        disabled={
                                                            questions.length <=
                                                            1
                                                        }
                                                    >
                                                        Remove
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                            {/* Thank You Title */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Thank You Title
                                </label>

                                <input
                                    type="text"
                                    name="thank_you_title"
                                    className="form-control"
                                    value={
                                        formData.thank_you_title
                                    }
                                    onChange={handleChange}
                                />

                            </div>

                            {/* Thank You Description */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Thank You Description
                                </label>

                                <textarea
                                    name="thank_you_description"
                                    className="form-control"
                                    rows="3"
                                    value={
                                        formData.thank_you_description
                                    }
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        {/* ================= FOOTER ================= */}

                        <div className="modal-footer">

                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                        />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Form'
                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default CreateMetaFormModal;