import React from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";
import MetaAdForm from "@/components/metaAds/MetaAdForm";

const AdSetCreate = () => {

    return (
        <>
            <PageHeader>
                <h5 className="m-0">
                    Create Ad Set
                </h5>
            </PageHeader>

            <div className="main-content">
                <MetaAdForm
                    type="adset"
                />
            </div>

            <Footer />
        </>
    );
};

export default AdSetCreate;