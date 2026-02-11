import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CardHeader from '@/components/shared/CardHeader'
import CircleProgress from '@/components/shared/CircleProgress';
import { teamMembersList } from '@/utils/fackData/teamMembersList'
import CardLoader from '@/components/shared/CardLoader';
import useCardTitleActions from '@/hooks/useCardTitleActions';

const Progress = ({ footerShow, title, btnFooter }) => {
 const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token"); // if your API needs auth

    // Fetch team members from API
    const fetchTeamMembers = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:5000/api/teams/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            const json = await res.json();

            if (json.success && Array.isArray(json.data)) {
                setTeamMembers(json.data);
            } else {
                setError("Failed to fetch team members");
            }
        } catch (err) {
            console.error("Error fetching team members:", err);
            setError("Error fetching team members");
        } finally {
            setLoading(false);
        }
    };

    // Fetch once on mount
    useEffect(() => {
        fetchTeamMembers();
    }, []);

    if (isRemoved) return null;

    return (
        // <div className="col-xxl-4">
        //     <div className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
        //         <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

        //         <div className="card-body custom-card-action">
        //             {
        //                 teamMembersList.slice(0, 4).map(({ id, name, position, progress, thumbnail, color }) => {
        //                     return (
        //                         <div key={id} className="hstack justify-content-between border border-dashed rounded-3 p-3 team-card chat-single-item">
        //                             <div className="hstack gap-3">
        //                                 {
        //                                     thumbnail ?
        //                                         <div className="avatar-image">
        //                                             <img src={thumbnail} alt="img" className="img-fluid" />
        //                                         </div>
        //                                         :
        //                                         <div className="text-white avatar-text user-avatar-text">{name.substring(0, 1)}</div>
        //                                 }
        //                                 <div>
        //                                     <Link href="#">{name}</Link>
        //                                     <div className="fs-11 text-muted">{position}</div>
        //                                 </div>
        //                             </div>
        //                             <div className="team-progress">
        //                                 <CircleProgress value={progress} text_sym={"%"} path_width='6px' path_color={color} />
        //                             </div>
        //                         </div>
        //                     )
        //                 }
        //                 )
        //             }
        //         </div>
        //         {
        //             footerShow ?
        //                 <Link to="#" className="card-footer fs-11 fw-bold text-uppercase text-center">Update 30 Min Ago</Link>
        //                 :
        //                 ""
        //         }
        //         {
        //             btnFooter && <div className="card-footer">
        //                 <Link to="#" className="btn btn-primary">Generate Report</Link>
        //             </div>
        //         }
        //         <CardLoader refreshKey={refreshKey} />
        //     </div>
        // </div>
        <div className="col-xxl-4">
            <div className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

                <div className="card-body custom-card-action">
                    {loading && <p className="text-center">Loading team members...</p>}
                    {error && <p className="text-center text-danger">{error}</p>}
                    {!loading && !error && teamMembers.slice(0, 4).map(({ team_id, description, team_name, position, progress = 0, avatar_url, color = "#0d6efd" }) => (
                        <div key={team_id} className="hstack justify-content-between border border-dashed rounded-3 p-3 team-card chat-single-item">
                            <div className="hstack gap-3">
                                {avatar_url
                                    ? <div className="avatar-image"><img src={avatar_url} alt="img" className="img-fluid" /></div>
                                    : <div className="text-white avatar-text user-avatar-text">{team_name.substring(0, 1)}</div>
                                }
                                <div>
                                    <Link to={`/teams/view/${team_id}`}>{team_name}</Link>
                                    <div className="fs-11 text-muted">{description.substring(0, 28)+"..."}</div>
                                    <div className="fs-11 text-muted">{position}</div>
                                </div>
                            </div>
                            <div className="team-progress">
                                <CircleProgress value={progress} text_sym={"%"} path_width='6px' path_color={color} />
                            </div>
                        </div>
                    ))}
                </div>

                {footerShow && <Link to="#" className="card-footer fs-11 fw-bold text-uppercase text-center">Update 30 Min Ago</Link>}
                {btnFooter && <div className="card-footer"><Link to="#" className="btn btn-primary">Generate Report</Link></div>}
                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    )
}

export default Progress
