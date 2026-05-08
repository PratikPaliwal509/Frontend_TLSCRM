import React, { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CardHeader from '@/components/shared/CardHeader'
import { projectsData } from '@/utils/fackData/projectsData'
import useCardTitleActions from '@/hooks/useCardTitleActions'
import CardLoader from '@/components/shared/CardLoader'
import Pagination from '@/components/shared/Pagination'

const Project = ({ cardYSpaceClass, borderShow, title }) => {
    // const data = projectsData.runningProjects;
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 4
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentProjects = projects.slice(indexOfFirstItem, indexOfLastItem)

    const totalPages = Math.ceil(projects.length / itemsPerPage)

    // Fetch projects from API
    const fetchProjects = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:5000/api/projects", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const json = await res.json();

            if (json.success && Array.isArray(json.data)) {
                setProjects(json.data);
            } else {
                setError("Failed to fetch projects");
            }
        } catch (err) {
            console.error("Error fetching projects:", err);
            setError("Error fetching projects");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProjects();
    }, []);
    useEffect(() => {
        setCurrentPage(1)
    }, [projects])
    if (isRemoved) return null;
    return (
        <div className="col-xxl-4">
            <div className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

                <div className="card-body custom-card-action project-status">
                    {loading && <p className="text-center py-3">Loading projects...</p>}
                    {error && <p className="text-center text-danger py-3">{error}</p>}

                    {!loading && !error && currentProjects.map(({ project_id, category, description, logo_url, project_name, tasks, progress_percentage }, index) => {

                        // ✅ Calculate progress from tasks //Warning for progress, progress_percentage, 
                        // let progress = 0;
                        let progress = progress_percentage;
                        // if (tasks.length > 0) {
                        //     const totalProgress = tasks.reduce(
                        //         (sum, task) => sum + (task.progress_percentage || 0),
                        //         0
                        //     );
                        //     progress = Math.round(totalProgress / tasks.length);
                        // }

                        // ✅ Auto color based on progress
                        let progress_color = "bg-danger";

                        if (progress >= 75) {
                            progress_color = "bg-success";
                        } else if (progress >= 40) {
                            progress_color = "bg-warning";
                        } else if (progress > 0) {
                            progress_color = "bg-info";
                        }
                        // Warning
                        return (
                            <Fragment key={project_id}>
                                {borderShow && index !== 0 && <hr className="border-dashed my-3" />}
                                <div className={`d-flex ${index === projects.length - 1 ? "mb-0" : cardYSpaceClass}`}>
                                    <div className="d-flex w-50 align-items-center me-3">
                                        {/* {logo_url
                                        ? <img src={logo_url} alt={name} className="me-3" width="35" />
                                        : <div className="text-muted me-3">No Logo</div>
                                    } */}
                                        <div className="hstack gap-3">
                                            <div className="text-black avatar-text user-avatar-text me-3">{project_name?.substring(0, 1)}</div></div>
                                        <div>
                                            <a href={`/projects/view/${project_id}`} className="text-truncate-1-line">{project_name}</a>
                                            <div className="fs-11 text-muted">{description?.substring(0, 23) + "..." || "—"}</div>
                                            {/* <div className="fs-11 text-muted">{category || "—"}</div> */}
                                        </div>
                                    </div>

                                    <div className="d-flex flex-grow-1 align-items-center">
                                        <div className="progress w-100 me-3 ht-5">
                                            <div
                                                className={`progress-bar ${progress_color}`}
                                                role="progressbar"
                                                style={{ width: `${progress}%` }}
                                            >
                                            </div>

                                            {/* <div
                                                className={`progress-bar ${progress_color}`}
                                                role="progressbar"
                                                style={{ width: `${progress}%` }}
                                                aria-valuenow={progress}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            ></div> */}
                                        </div>
                                        <span className="text-muted">{progress}%</span>
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })}
                </div>

                <div className="card-footer d-flex flex-column gap-2">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />

                    <Link
                        to="#"
                        className="fs-11 fw-bold text-uppercase text-center"
                    >
                        Upcoming Projects
                    </Link>
                </div>

            </div>
            <CardLoader refreshKey={refreshKey} />
        </div>
    )
}

export default Project
