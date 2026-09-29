import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";
import MetaAdForm from "@/components/metaAds/MetaAdForm";
import Loader from "@/components/loader";

const AdEdit = () => {

    const { id } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const res = await fetch(
                    `https://api-0ggv.onrender.com/api/meta-ads/ads/${id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const result = await res.json();

                console.log(
                    "AD EDIT API RESPONSE:",
                    result
                );

                if (!res.ok) {
                    throw new Error(
                        result.message ||
                        "Failed to fetch ad"
                    );
                }

                if (!result.success) {
                    throw new Error(
                        result.message ||
                        "Failed to fetch ad"
                    );
                }

                /*
                 * Handle different possible API
                 * response structures.
                 */

                const ad =
                    result.data?.data ||
                    result.data ||
                    result;

                console.log(
                    "NORMALIZED AD DATA:",
                    ad
                );

                setData(ad);

            } catch (error) {

                console.error(
                    "AD EDIT ERROR:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        if (id) {
            fetchData();
        }

    }, [id]);

    if (loading) {
        return <Loader />;
    }

    if (!data) {
        return (
            <div className="main-content p-4">
                <div className="alert alert-danger">
                    Ad data could not be loaded.
                </div>
            </div>
        );
    }

    return (
        <>
            <PageHeader>
                <h5 className="m-0">
                    Edit Ad
                </h5>
            </PageHeader>

            <div className="main-content">

                <MetaAdForm
                    type="ad"
                    initialData={data}
                    editId={id}
                />

            </div>

            <Footer />
        </>
    );
};

export default AdEdit;