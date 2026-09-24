import React, { useEffect, useState } from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";
import AdSetsHeader from "@/components/metaAds/AdSetsHeader";
import AdSetsTable from "@/components/metaAds/AdSetsTable";
import { useNavigate, useParams } from "react-router-dom";
import { verifyPagePermission } from "@/utils/verifyPagePermission";

const AdSetsList = () => {

    const navigate = useNavigate();
    const { campaignId } = useParams();

    const [filter, setFilter] = useState("all");
    const [adSets, setAdSets] = useState([]);

    // useEffect(() => {
    //     verifyPagePermission(
    //         "meta_ads",
    //         "view",
    //         navigate
    //     );
    // }, [navigate]);

    const filteredAdSets = adSets.filter(
        (adSet) => {

            if (filter === "active")
                return adSet.status === "ACTIVE";

            if (filter === "paused")
                return adSet.status === "PAUSED";

            return true;
        }
    );

    return (
        <>
            <PageHeader>
                <AdSetsHeader
                    campaignId={campaignId}
                    onFilter={setFilter}
                />
            </PageHeader>

            <div className="main-content">
                <div className="row">
                    <AdSetsTable
                        campaignId={campaignId}
                        adSets={filteredAdSets}
                        setAdSets={setAdSets}
                    />
                </div>
            </div>

            <Footer />
        </>
    );
};

export default AdSetsList;