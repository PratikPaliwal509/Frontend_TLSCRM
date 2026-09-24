import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";
import MetaAdForm from "@/components/metaAds/MetaAdForm";
import Loader from "@/components/loader";

const AdEdit = () => {

    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {

        const fetchData = async () => {

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

            if (result.success) {
                setData(
                    result.data?.data ||
                    result.data
                );
            }
        };

        fetchData();

    }, [id]);

    if (!data)
        return <Loader />;

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