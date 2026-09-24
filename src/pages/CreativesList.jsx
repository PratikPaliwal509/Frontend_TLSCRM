
import React, {
    useState
} from "react";

import PageHeader
    from "@/components/shared/pageHeader/PageHeader";

import Footer
    from "@/components/shared/Footer";

import CreativesHeader
    from "@/components/metaAds/CreativesHeader";

import CreativesTable
    from "@/components/metaAds/CreativesTable";

import {
    useParams
} from "react-router-dom";

const CreativesList = () => {

    const {
        adId
    } = useParams();

    const [
        creatives,
        setCreatives
    ] = useState([]);

    console.log(
        "CreativesList Ad ID:",
        adId
    );

    return (
        <>
            <PageHeader>

                <CreativesHeader
                    adId={adId}
                />

            </PageHeader>

            <div className="main-content">

                <div className="row">

                    <div className="col-lg-12">

                        <div className="card stretch stretch-full">

                            <CreativesTable
                                adId={adId}
                                creatives={creatives}
                                setCreatives={
                                    setCreatives
                                }
                            />

                        </div>

                    </div>

                </div>

            </div>

            <Footer />

        </>
    );
};

export default CreativesList;

