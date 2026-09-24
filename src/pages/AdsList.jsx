import React, {
    useEffect,
    useState
} from "react";

import PageHeader
    from "@/components/shared/pageHeader/PageHeader";

import Footer
    from "@/components/shared/Footer";

import AdsHeader
    from "@/components/metaAds/AdsHeader";

import AdsTable
    from "@/components/metaAds/AdsTable";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    verifyPagePermission
} from "@/utils/verifyPagePermission";

const AdsList = () => {
console.log("Rendering AdsList component");
    const navigate = useNavigate();

    const { adSetId } = useParams();

    const [filter, setFilter] =
        useState("all");

    const [ads, setAds] =
        useState([]);

    // useEffect(() => {

    //     verifyPagePermission(
    //         "meta_ads",
    //         "view",
    //         navigate
    //     );

    // }, [navigate]);

    const filteredAds =
        ads.filter((ad) => {

            if (filter === "active")
                return ad.status === "ACTIVE";

            if (filter === "paused")
                return ad.status === "PAUSED";

            return true;
        });

    return (
        <>
            <PageHeader>

                <AdsHeader
                    adSetId={adSetId}
                    onFilter={setFilter}
                />

            </PageHeader>

            <div className="main-content">

                <div className="row">

                    <AdsTable
                        adSetId={adSetId}
                        ads={filteredAds}
                        setAds={setAds}
                    />

                </div>

            </div>

            <Footer />

        </>
    );
};

export default AdsList;