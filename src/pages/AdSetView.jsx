import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Footer from '@/components/shared/Footer'

const AdSetView = () => {
    const { id } = useParams()
    const adSetId = id;
    const navigate = useNavigate()
    const [adSet, setAdSet] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchAdSet()
    }, [adSetId])

    const fetchAdSet = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await fetch(
                `https://api-0ggv.onrender.com/api/meta-ads/adsets/${adSetId}`
                // `https://api-0ggv.onrender.com/api/meta-ads/adsets/${adSetId}`
            )

            const result = await response.json()

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'Failed to fetch ad set details'
                )
            }

            setAdSet(result.data)

        } catch (err) {
            console.error('Fetch Ad Set Error:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (date) => {
        if (!date) return '-'

        return new Date(date).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        })
    }

    const formatValue = (value) => {
        if (value === null || value === undefined || value === '') {
            return '-'
        }

        if (typeof value === 'object') {
            return JSON.stringify(value, null, 2)
        }

        return value
    }

    if (loading) {
        return (
            <>
                <PageHeader>
                    <h5 className="m-b-10">Ad Set</h5>
                </PageHeader>

                <div className="main-content">
                    <div className="text-center py-5">
                        <div
                            className="spinner-border text-primary"
                            role="status"
                        >
                            <span className="visually-hidden">
                                Loading...
                            </span>
                        </div>

                        <p className="mt-3 text-muted">
                            Loading ad set details...
                        </p>
                    </div>
                </div>

                <Footer />
            </>
        )
    }

    if (error) {
        return (
            <>
                <PageHeader>
                    <h5 className="m-b-10">Ad Set</h5>
                </PageHeader>

                <div className="main-content">
                    <div className="alert alert-danger">
                        <strong>Error:</strong> {error}
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/meta-ads/adsets')}
                    >
                        <i className="feather-arrow-left me-2"></i>
                        Back to Ad Sets
                    </button>
                </div>

                <Footer />
            </>
        )
    }

    return (
        <>
            <PageHeader>
                <h5 className="m-b-10">Ad Set Details</h5>
            </PageHeader>

            <div className="main-content">

                {/* Header */}
                {/* <div className="page-header">
                    <div className="page-header-left d-flex align-items-center">
                        <div className="page-header-title">
                            <h5 className="m-b-10">
                                Meta Ads
                            </h5>
                        </div>

                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="/dashboard">
                                    Home
                                </a>
                            </li>

                            <li className="breadcrumb-item">
                                <a href="/meta-ads/campaigns">
                                    Campaigns
                                </a>
                            </li>

                            <li className="breadcrumb-item">
                                Ad Sets
                            </li>

                            <li className="breadcrumb-item">
                                View
                            </li>
                        </ul>
                    </div>

                    <div className="page-header-right ms-auto">
                        <div className="page-header-right-items">
                            <button
                                className="btn btn-light-brand"
                                onClick={() =>
                                    navigate('/meta-ads/adsets')
                                }
                            >
                                <i className="feather-arrow-left me-2"></i>
                                Back
                            </button>
                        </div>
                    </div>
                </div> */}

                {/* Ad Set Header Card */}
                <div className="row">

                    <div className="col-xxl-8 col-xl-8">
                        <div className="card stretch stretch-full">

                            <div className="card-header">
                                <div>
                                    <h5 className="card-title mb-1">
                                        {adSet?.name || 'Ad Set'}
                                    </h5>

                                    <span className="text-muted fs-12">
                                        Ad Set ID: {adSet?.id || adSetId}
                                    </span>
                                </div>

                                <div className="ms-auto">
                                    <span
                                        className={`badge ${adSet?.status === 'ACTIVE'
                                                ? 'bg-soft-success text-success'
                                                : 'bg-soft-warning text-warning'
                                            }`}
                                    >
                                        {adSet?.status || 'UNKNOWN'}
                                    </span>
                                </div>
                            </div>

                            <div className="card-body">

                                <div className="row g-4">

                                    <div className="col-md-6">
                                        <div className="p-3 border rounded">
                                            <small className="text-muted d-block">
                                                Ad Set Name
                                            </small>

                                            <h6 className="mt-2 mb-0">
                                                {adSet?.name || '-'}
                                            </h6>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="p-3 border rounded">
                                            <small className="text-muted d-block">
                                                Status
                                            </small>

                                            <h6 className="mt-2 mb-0">
                                                {adSet?.status || '-'}
                                            </h6>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="p-3 border rounded">
                                            <small className="text-muted d-block">
                                                Daily Budget
                                            </small>

                                            <h6 className="mt-2 mb-0">
                                                {adSet?.daily_budget
                                                    ? `₹${(
                                                        Number(
                                                            adSet.daily_budget
                                                        ) / 100
                                                    ).toLocaleString('en-IN')}`
                                                    : '-'}
                                            </h6>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="p-3 border rounded">
                                            <small className="text-muted d-block">
                                                Lifetime Budget
                                            </small>

                                            <h6 className="mt-2 mb-0">
                                                {adSet?.lifetime_budget
                                                    ? `₹${(
                                                        Number(
                                                            adSet.lifetime_budget
                                                        ) / 100
                                                    ).toLocaleString('en-IN')}`
                                                    : '-'}
                                            </h6>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="p-3 border rounded">
                                            <small className="text-muted d-block">
                                                Start Time
                                            </small>

                                            <h6 className="mt-2 mb-0">
                                                {formatDate(
                                                    adSet?.start_time
                                                )}
                                            </h6>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="p-3 border rounded">
                                            <small className="text-muted d-block">
                                                End Time
                                            </small>

                                            <h6 className="mt-2 mb-0">
                                                {formatDate(
                                                    adSet?.end_time
                                                )}
                                            </h6>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="col-xxl-4 col-xl-4">
                        <div className="card stretch stretch-full">

                            <div className="card-header">
                                <h5 className="card-title">
                                    Ad Set Summary
                                </h5>
                            </div>

                            <div className="card-body">

                                <div className="d-flex justify-content-between mb-4">
                                    <span className="text-muted">
                                        ID
                                    </span>

                                    <span className="fw-semibold text-break ms-3">
                                        {adSet?.id || adSetId}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between mb-4">
                                    <span className="text-muted">
                                        Campaign ID
                                    </span>

                                    <span className="fw-semibold text-break ms-3">
                                        {adSet?.campaign_id || '-'}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between mb-4">
                                    <span className="text-muted">
                                        Objective
                                    </span>

                                    <span className="fw-semibold">
                                        {adSet?.optimization_goal || '-'}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between mb-4">
                                    <span className="text-muted">
                                        Billing Event
                                    </span>

                                    <span className="fw-semibold">
                                        {adSet?.billing_event || '-'}
                                    </span>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">
                                        Bid Strategy
                                    </span>

                                    <span className="fw-semibold">
                                        {adSet?.bid_strategy || '-'}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

                {/* Targeting */}
                <div className="card stretch stretch-full mt-4">
    <div className="card-header">
        <h5 className="card-title mb-0">
            Targeting
        </h5>
    </div>

    <div className="card-body">

        {adSet?.targeting ? (
            <div className="row">

                {/* LEFT - Basic Targeting */}
                <div className="col-lg-4">
                    <div className="border rounded p-4 h-100">

                        <h6 className="fw-semibold mb-4">
                            Audience
                        </h6>

                        {/* Age */}
                        <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
                            <div>
                                <span className="text-muted fs-12 d-block">
                                    Age Range
                                </span>

                                <span className="fw-semibold">
                                    {adSet.targeting.age_min || '-'}
                                    {' - '}
                                    {adSet.targeting.age_max || '-'}
                                </span>
                            </div>

                            <span className="badge bg-soft-primary text-primary">
                                Age
                            </span>
                        </div>

                        {/* Gender */}
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <span className="text-muted fs-12 d-block">
                                    Gender
                                </span>

                                <span className="fw-semibold">
                                    {adSet.targeting.genders?.length
                                        ? adSet.targeting.genders.join(', ')
                                        : 'All'}
                                </span>
                            </div>

                            <span className="badge bg-soft-primary text-primary">
                                Gender
                            </span>
                        </div>

                    </div>
                </div>


                {/* RIGHT - Location */}
                <div className="col-lg-8 mt-4 mt-lg-0">
                    <div className="border rounded p-4">

                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <div>
                                <h6 className="fw-semibold mb-1">
                                    Locations
                                </h6>

                                <span className="text-muted fs-12">
                                    Geographic targeting for this ad set
                                </span>
                            </div>

                            {adSet.targeting.geo_locations && (
                                <span className="badge bg-soft-success text-success">
                                    Configured
                                </span>
                            )}
                        </div>


                        {adSet.targeting.geo_locations ? (

                            <div>

                                {/* Countries */}
                                {adSet.targeting.geo_locations.countries?.length > 0 && (
                                    <div className="mb-4">

                                        <div className="d-flex align-items-center mb-2">
                                            <span className="text-muted fs-12 fw-semibold text-uppercase">
                                                Countries
                                            </span>
                                        </div>

                                        <div className="d-flex flex-wrap gap-2">
                                            {adSet.targeting.geo_locations.countries.map(
                                                (country, index) => (
                                                    <span
                                                        key={index}
                                                        className="badge bg-soft-primary text-primary px-3 py-2"
                                                    >
                                                        {country}
                                                    </span>
                                                )
                                            )}
                                        </div>

                                    </div>
                                )}


                                {/* Cities */}
                                {adSet.targeting.geo_locations.cities?.length > 0 && (
                                    <div className="mb-4">

                                        <span className="text-muted fs-12 fw-semibold text-uppercase d-block mb-2">
                                            Cities
                                        </span>

                                        <div className="row g-2">

                                            {adSet.targeting.geo_locations.cities.map(
                                                (city, index) => (
                                                    <div
                                                        key={index}
                                                        className="col-md-6"
                                                    >
                                                        <div className="bg-light rounded p-3">

                                                            <div className="d-flex align-items-center justify-content-between">

                                                                <span className="fw-semibold">
                                                                    {city.name ||
                                                                        city.key}
                                                                </span>

                                                                {city.radius && (
                                                                    <span className="text-muted fs-12">
                                                                        {city.radius}{' '}
                                                                        {city.distance_unit ||
                                                                            'mile'}
                                                                    </span>
                                                                )}

                                                            </div>

                                                        </div>
                                                    </div>
                                                )
                                            )}

                                        </div>

                                    </div>
                                )}


                                {/* Regions */}
                                {adSet.targeting.geo_locations.regions?.length > 0 && (
                                    <div className="mb-4">

                                        <span className="text-muted fs-12 fw-semibold text-uppercase d-block mb-2">
                                            Regions
                                        </span>

                                        <div className="d-flex flex-wrap gap-2">

                                            {adSet.targeting.geo_locations.regions.map(
                                                (region, index) => (
                                                    <span
                                                        key={index}
                                                        className="badge bg-soft-info text-info px-3 py-2"
                                                    >
                                                        {region.name ||
                                                            region.key}
                                                    </span>
                                                )
                                            )}

                                        </div>

                                    </div>
                                )}


                                {/* ZIP Codes */}
                                {adSet.targeting.geo_locations.zips?.length > 0 && (
                                    <div>

                                        <span className="text-muted fs-12 fw-semibold text-uppercase d-block mb-2">
                                            ZIP Codes
                                        </span>

                                        <div className="d-flex flex-wrap gap-2">

                                            {adSet.targeting.geo_locations.zips.map(
                                                (zip, index) => (
                                                    <span
                                                        key={index}
                                                        className="badge bg-soft-secondary text-secondary px-3 py-2"
                                                    >
                                                        {zip.key || zip}
                                                    </span>
                                                )
                                            )}

                                        </div>

                                    </div>
                                )}


                                {/* Nothing specific */}
                                {!adSet.targeting.geo_locations.countries?.length &&
                                    !adSet.targeting.geo_locations.cities?.length &&
                                    !adSet.targeting.geo_locations.regions?.length &&
                                    !adSet.targeting.geo_locations.zips?.length && (
                                        <div className="text-center py-4">
                                            <span className="text-muted">
                                                Location configured
                                            </span>
                                        </div>
                                    )}

                            </div>

                        ) : (

                            <div className="text-center py-5">
                                <span className="text-muted">
                                    No location targeting configured
                                </span>
                            </div>

                        )}

                    </div>
                </div>

            </div>
        ) : (

            <div className="text-center py-5 text-muted">
                No targeting information available.
            </div>

        )}

    </div>
</div>

                {/* Raw Details */}
                {/* <div className="card stretch stretch-full mt-4">

                    <div className="card-header">
                        <h5 className="card-title">
                            Complete Ad Set Data
                        </h5>
                    </div>

                    <div className="card-body">

                        <pre
                            className="bg-light p-3 rounded"
                            style={{
                                maxHeight: '500px',
                                overflow: 'auto',
                                fontSize: '13px'
                            }}
                        >
                            {JSON.stringify(adSet, null, 2)}
                        </pre>

                    </div>
                </div> */}

            </div>

            <Footer />
        </>
    )
}

export default AdSetView