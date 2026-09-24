import React from "react";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from "@/components/shared/Footer";
import MetaAdForm from "@/components/metaAds/MetaAdForm";

const CampaignCreate = () => {

    return (
        <>
            <PageHeader>
                <h5 className="m-0">
                    Create Campaign
                </h5>
            </PageHeader>

            <div className="main-content">
                <MetaAdForm
                    type="campaign"
                />
            </div>

            <Footer />
        </>
    );
};

export default CampaignCreate;