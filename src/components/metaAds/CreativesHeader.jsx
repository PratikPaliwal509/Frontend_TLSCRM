import React from "react";

import {
    FiPlus
} from "react-icons/fi";

import {
    Link
} from "react-router-dom";

const CreativesHeader = ({
    adId
}) => {

    return (
        <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">

            <Link
                to={`/meta-ads/ads/${adId}/creatives/create`}
                className="btn btn-primary"
            >

                <FiPlus
                    size={16}
                    className="me-2"
                />

                Create Creative

            </Link>

        </div>
    );
};

export default CreativesHeader;