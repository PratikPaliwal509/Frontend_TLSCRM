import React from "react";
import {
    FiBarChart,
    FiEye,
    FiFilter,
    FiPaperclip,
    FiPlus,
    FiPause,
    FiCheckCircle,
    FiArchive
} from "react-icons/fi";

import {
    BsFiletypeCsv,
    BsFiletypeExe,
    BsFiletypePdf,
    BsFiletypeTsx,
    BsFiletypeXml,
    BsPrinter
} from "react-icons/bs";

import Dropdown from "@/components/shared/Dropdown";
import { Link } from "react-router-dom";

const CampaignsHeader = ({ onExport, onFilter }) => {

    const fileType = [
        {
            label: "PDF",
            icon: <BsFiletypePdf />,
            action: () => onExport("pdf")
        },
        {
            label: "CSV",
            icon: <BsFiletypeCsv />,
            action: () => onExport("csv")
        },
        {
            label: "XML",
            icon: <BsFiletypeXml />,
            action: () => onExport("xml")
        },
        {
            label: "Text",
            icon: <BsFiletypeTsx />,
            action: () => onExport("txt")
        },
        {
            label: "Excel",
            icon: <BsFiletypeExe />,
            action: () => onExport("excel")
        },
        {
            label: "Print",
            icon: <BsPrinter />,
            action: () => onExport("print")
        }
    ];

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
        },
        {
            label: "Archived",
            icon: <FiArchive />,
            onClick: () => onFilter("archived")
        }
    ];

    return (
        <>
            <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">

                <a
                    href="#"
                    className="btn btn-icon btn-light-brand"
                    data-bs-toggle="collapse"
                    data-bs-target="#campaignStatistics"
                >
                    <FiBarChart
                        size={16}
                        strokeWidth={1.6}
                    />
                </a>

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

                <Dropdown
                    dropdownItems={fileType}
                    triggerPosition={"0, 12"}
                    triggerIcon={
                        <FiPaperclip
                            size={16}
                            strokeWidth={1.6}
                        />
                    }
                    triggerClass="btn btn-icon btn-light-brand"
                    iconStrokeWidth={0}
                    isAvatar={false}
                />

                <Link
                    to="/meta-ads/campaigns/create"
                    className="btn btn-primary"
                >
                    <FiPlus
                        size={16}
                        className="me-2"
                    />

                    <span>Create Campaign</span>
                </Link>

            </div>
        </>
    );
};

export default CampaignsHeader;