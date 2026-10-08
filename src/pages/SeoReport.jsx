import React, { useState } from "react";

import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";

import SeoHeader from "@/components/seo/SeoHeader";
import GenerateSeoReportModal from "@/components/seo/GenerateSeoReportModal";

import { SEO_WEBSITES } from "../config/seoWebsites";

import {
    FiGlobe,
    FiFileText,
    FiExternalLink
} from "react-icons/fi";

const SeoReport = () => {

    const [showReportModal, setShowReportModal] =
        useState(false);

    const [selectedWebsite, setSelectedWebsite] =
        useState(null);


    const handleGenerateReport = (website) => {
        setSelectedWebsite(website);
        setShowReportModal(true);
    };


    return (
        <>
            <PageHeader>
                <SeoHeader
                    onGenerateReport={() => {
                        if (SEO_WEBSITES.length > 0) {
                            handleGenerateReport(SEO_WEBSITES[0]);
                        }
                    }}
                />
            </PageHeader>


            <div className="main-content">

                <div className="row">

                    <div className="col-12">

                        <div className="card">

                            <div className="card-header">
                                <div>
                                    <h5 className="mb-1">
                                        SEO Websites
                                    </h5>

                                    <p className="text-muted mb-0">
                                        Select a website to generate
                                        its SEO analytics report.
                                    </p>
                                </div>
                            </div>


                            <div className="card-body">

                                <div className="row g-3">

                                    {SEO_WEBSITES.map(
                                        (website, index) => (

                                            <div
                                                className="col-xl-4 col-md-6"
                                                key={website.url}
                                            >

                                                <div
                                                    className="border rounded p-3 h-100"
                                                >

                                                    <div className="d-flex align-items-start justify-content-between">

                                                        <div className="d-flex align-items-center">

                                                            <div
                                                                className="avatar-text bg-soft-primary text-primary me-3"
                                                                style={{
                                                                    width: "42px",
                                                                    height: "42px",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    borderRadius: "8px"
                                                                }}
                                                            >
                                                                <FiGlobe size={20} />
                                                            </div>


                                                            <div>

                                                                <h6 className="mb-1">
                                                                    {website.name}
                                                                </h6>

                                                                <small className="text-muted">
                                                                    Website #{index + 1}
                                                                </small>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    <div className="mt-3">

                                                        <a
                                                            href={website.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-muted small text-decoration-none"
                                                        >
                                                            {website.url}

                                                            <FiExternalLink
                                                                size={12}
                                                                className="ms-1"
                                                            />
                                                        </a>

                                                    </div>


                                                    <div className="mt-3">

                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btn-sm w-100"
                                                            onClick={() =>
                                                                handleGenerateReport(
                                                                    website
                                                                )
                                                            }
                                                        >
                                                            <FiFileText
                                                                className="me-2"
                                                            />

                                                            Generate SEO Report
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            <GenerateSeoReportModal
                show={showReportModal}
                website={selectedWebsite}
                onClose={() => {
                    setShowReportModal(false);
                    setSelectedWebsite(null);
                }}
            />


            <Footer />
        </>
    );
};

export default SeoReport;