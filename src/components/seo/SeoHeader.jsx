import React from "react";
import { FiFileText } from "react-icons/fi";

const SeoHeader = ({ onGenerateReport }) => {
    return (
        <div className="d-flex align-items-center justify-content-between w-100">
            <div>
                <h4 className="mb-1">
                    SEO Analytics
                </h4>

                <p className="text-muted mb-0">
                    Website performance and search analytics
                </p>
            </div>

            <div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onGenerateReport}
                >
                    <FiFileText className="me-2" />
                    Generate SEO Report
                </button>
            </div>
        </div>
    );
};

export default SeoHeader;