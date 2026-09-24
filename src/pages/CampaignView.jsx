import React, {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";

import PageHeader
    from "@/components/shared/pageHeader/PageHeader";

import Footer
    from "@/components/shared/Footer";

import MetaAdView
    from "../components/metaAds/MetaAdView"

import Loader
    from "@/components/loader";

const CampaignView = () => {

    const { id } = useParams();

    const [data, setData] =
        useState(null);

    useEffect(() => {

        const fetchData = async () => {

            const token =
                localStorage.getItem("token");

            const res = await fetch(
                `https://api-0ggv.onrender.com/api/meta-ads/campaigns/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const result =
                await res.json();

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
                    Campaign Details
                </h5>
            </PageHeader>

            <div className="main-content">

                <MetaAdView
                    title="Campaign Details"
                    data={data}
                />

            </div>

            <Footer />
        </>
    );
};

export default CampaignView;