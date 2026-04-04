import React, { useState } from 'react'
import TabProjectType from './TabProjectType'
import TabProjectDetails from './TabProjectDetails';
import TabProjectBudget from './TabProjectBudget';
import TabProjectAssigned from './TabProjectAssigned';
import TabProjectTarget from './TabProjectTarget';
import TabCompleted from './TabCompleted';
// import TabAttachement from './TabAttachement';
// import TabProjectSettings from './TabProjectSettings';

const steps = [
    { name: "Type", required: true },
    { name: "Details", required: false },
    { name: "Budget", required: true },
    { name: "Assagined", required: false },
    { name: "Target", required: false },
    { name: "Completed", required: false },
    // { name: "Settings", required: false },
    // { name: "Attachment", required: false },
];

const ProjectCreateContent = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState(false)
    const [formData, setFormData] = useState({
        project_name: '',
        description: '',
        project_code: '',
        project_type: '',
        priority: '',
        start_date: new Date(),
        end_date: null,
        billing_type: 'tasks-hours',
        status: 'planning',
        tags: [],
        project_manager_id: null,
        is_billable: true,
        is_public: false,
        auto_task_numbering: true,
        task_prefix: '',
        custom_fields: {},
        notes: '',
        client_id: null,
        agency_id: null,
        estimated_hours: null,
        budget_amount: null,
        budget_currency: 'USD',
        // optional / extra fields can be added here
    })


    const validateFields = () => {
        const { projectManage, projectType, budgetsSpend, projectBudgets, target } = formData;
        if (steps[currentStep].required) {
            if (
                (currentStep === 0 && (projectManage === "" || projectType === "")) ||
                (currentStep === 3 && (projectBudgets === "" || budgetsSpend === ""))
            ) {
                setError(true)
                return false;
            }
        }
        return true;
    };
const handleNext = (e) => {
    e.preventDefault();

    let isValid = true;

    // STEP 0 → Type
    if (currentStep === 0) {
        if (!formData.agency_id || !formData.client_id) {
            isValid = false;
        }
    }

    // STEP 1 → Details
    if (currentStep === 1) {
        if (!formData.project_name || !formData.project_type) {
            isValid = false;
        }
    }

    // STEP 2 → Budget
    // if (currentStep === 2) {
    //     if (!formData.budget_amount) {
    //         isValid = false;
    //     }
    // }

    // STEP 3 → Assigned
    if (currentStep === 3) {
        if (!formData.project_manager_id) {
            isValid = false;
        }
    }

    if (!isValid) {
        setError(true);
        return;
    }

    setError(false);
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
};
    // const handleNext = (e) => {
    //     e.preventDefault(); // Prevent <a> default navigation

    //     if (index < currentStep) {
    //         setError(false)
    //         setCurrentStep(index)
    //         return
    //     }
    //     if (index > currentStep) {
    //         if (index > 0 && (formData.agency_id === null || formData.client_id === null)) {
    //             setError(true)
    //             return
    //         }
    //         if (index > 1 && (formData.project_name === "" || formData.project_type === "")) {
    //             setError(true)
    //             return
    //         }
    //         console.log(formData.project_manager_id)
    //         if (index > 3 && formData.project_manager_id === null) {
    //             setError(true)
    //             return
    //         }
    //         setError(false)
    //         setCurrentStep(index)
    //         return
    //     }

    //     // validate only when moving forward
    //     if (validateFields()) {
    //         setCurrentStep(index)
    //     }
    //     // validation: agency & client must be selected
    //     // if (formData.agency_id === null || formData.client_id === null) {
    //     //     setError(true)
    //     //     return
    //     // }

    //     // setError(false)
    //     // setCurrentStep(prev => prev + 1)
    // }


    // Handle prev button click
    const handlePrev = (e) => {
        e.preventDefault()
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    };

    // Handle tab click to change step
    // const handleTabClick = (e, index) => {
    //     e.preventDefault()
    //     if (validateFields()) {
    //         setCurrentStep(index);
    //     }
    // };
    const handleTabClick = (e, index) => {
        e.preventDefault()

        // allow going backward freely
        if (index < currentStep) {
            setError(false)
            setCurrentStep(index)
            return
        }
        if (index > currentStep) {
            if (index > 0 && (formData.agency_id === null || formData.client_id === null)) {
                setError(true)
                return
            }
            if (index > 1 && (formData.project_name === "" || formData.project_type === "")) {
                setError(true)
                return
            }
            console.log(formData.project_manager_id)
            if (index > 3 && formData.project_manager_id === null) {
                setError(true)
                return
            }
            setError(false)
            setCurrentStep(index)
            return
        }

        // validate only when moving forward
        if (validateFields()) {
            setCurrentStep(index)
        }
    }

    return (
        <div className="col-lg-12">
            <div className="card border-top-0">
                <div className="card-body p-0 wizard" id="project-create-steps">
                    <div className='steps clearfix'>
                        <ul role="tablist">
                            {steps.map((step, index) => (
                                <li
                                    key={index}
                                    className={`${currentStep === index ? "current" : ""} ${currentStep === index && error ? "error" : ""}`}
                                    onClick={(e) => handleTabClick(e, index)}
                                >
                                    <a href="#" className='d-block fw-bold'>{step.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="content clearfix">
                        {currentStep === 0 && <TabProjectType setFormData={setFormData} formData={formData} error={error} setError={setError} />}
                        {currentStep === 1 && <TabProjectDetails setFormData={setFormData} formData={formData} error={error} setError={setError} />}
                        {/* {currentStep === 2 && <TabProjectSettings />} */}
                        {currentStep === 2 && <TabProjectBudget setFormData={setFormData} formData={formData} error={error} setError={setError} />}
                        {currentStep === 3 && <TabProjectAssigned setFormData={setFormData} formData={formData} error={error} setError={setError} />}
                        {currentStep === 4 && <TabProjectTarget setFormData={setFormData} formData={formData} error={error} setError={setError} />}
                        {/* {currentStep === 5 && <TabAttachement />} */}
                        {currentStep === 5 && <TabCompleted setFormData={setFormData} formData={formData} error={error} setError={setError} />}
                    </div>

                    {/* Buttons */}
                    <div className="actions clearfix">
                        <ul>
                            <li className={`${currentStep === 0 ? "disabled" : ""}`} onClick={(e) => handlePrev(e)} disabled={currentStep === 0}>
                                <a href="#">Previous</a>
                            </li>
                            <li
                                className='me-3'
                            >
                                <div className={`p-2 border-2-gray bg-primary rounded-2 text-white  ${currentStep === steps.length - 1 ? "disabled" : ""}`}
                                    onClick={handleNext}
                                    style={{ cursor: currentStep === steps.length - 1 ? 'not-allowed' : 'pointer' }}>
                                    Next
                                </div>
                            </li>

                        </ul>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default ProjectCreateContent
