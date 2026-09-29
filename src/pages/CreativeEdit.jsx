import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";
import MetaAdForm from "@/components/metaAds/MetaAdForm";
import Loader from "@/components/loader";

const CreativeEdit = () => {

    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {

        const fetchData = async () => {

            const token =
                localStorage.getItem("token");

            const res = await fetch(
                `https://api-0ggv.onrender.com/api/meta-ads/creatives/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const result = await res.json();
console.log("Creative Edit Data:", result.data);
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
                    Edit Creative
                </h5>
            </PageHeader>

            <div className="main-content">

                <MetaAdForm
                    type="creative"
                    initialData={data}
                    editId={id}
                />

            </div>

            <Footer />
        </>
    );
};

export default CreativeEdit;