import React from "react";
import { useNavigate } from "react-router-dom";

const MetaAdView = ({
    title,
    data = {}
}) => {

    const navigate = useNavigate();

    return (
        <div className="card">

            <div className="card-header">
                <h5 className="card-title mb-0">
                    {title}
                </h5>
            </div>

            <div className="card-body">

                <div className="row g-4">

                    {Object.entries(data).map(
                        ([key, value]) => (

                            <div
                                className="col-md-6"
                                key={key}
                            >

                                <div className="fw-semibold text-muted mb-1">
                                    {key
                                        .replaceAll(
                                            "_",
                                            " "
                                        )
                                        .replace(
                                            /\b\w/g,
                                            (c) =>
                                                c.toUpperCase()
                                        )}
                                </div>

                                <div>
                                    {typeof value ===
                                    "object"
                                        ? JSON.stringify(
                                            value
                                        )
                                        : value ||
                                          "—"}
                                </div>

                            </div>
                        )
                    )}

                </div>

            </div>

            <div className="card-footer">

                <button
                    className="btn btn-light"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    Back
                </button>

            </div>

        </div>
    );
};

export default MetaAdView;