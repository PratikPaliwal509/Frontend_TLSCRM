import React from "react";

import {
    FiEye,
    FiFilter,
    FiPlus,
    FiCheckCircle,
    FiPause
} from "react-icons/fi";

import Dropdown from "@/components/shared/Dropdown";
import { Link } from "react-router-dom";

const AdSetsHeader = ({
    campaignId,
    onFilter
}) => {

    const filterAction = [
        {
            label: "All",
            icon: <FiEye />,
            onClick: () => onFilter("all")
        },
        {
            label: "Active",
            icon: <FiCheckCircle />,
            onClick: () => onFilter("active")
        },
        {
            label: "Paused",
            icon: <FiPause />,
            onClick: () => onFilter("paused")
        }
    ];

    return (
        <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">

            <Dropdown
                dropdownItems={filterAction}
                triggerPosition={"0, 12"}
                triggerIcon={
                    <FiFilter
                        size={16}
                        strokeWidth={1.6}
                    />
                }
                triggerClass="btn btn-icon btn-light-brand"
                isAvatar={false}
            />

            <Link
                to={`/meta-ads/campaigns/${campaignId}/adsets/create`}
                className="btn btn-primary"
            >
                <FiPlus
                    size={16}
                    className="me-2"
                />

                Create Ad Set
            </Link>

        </div>
    );
};

export default AdSetsHeader;