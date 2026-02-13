import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CardHeader from '@/components/shared/CardHeader'
import CircleProgress from '@/components/shared/CircleProgress';
import { teamMembersList } from '@/utils/fackData/teamMembersList'
import CardLoader from '@/components/shared/CardLoader';
import useCardTitleActions from '@/hooks/useCardTitleActions';
import Pagination from '@/components/shared/Pagination'

const Progress = ({ footerShow, title, btnFooter }) => {
 const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token"); // if your API needs auth
const [currentPage, setCurrentPage] = useState(1)
const itemsPerPage = 4
const indexOfLastItem = currentPage * itemsPerPage
const indexOfFirstItem = indexOfLastItem - itemsPerPage
const currentTeams = teamMembers.slice(indexOfFirstItem, indexOfLastItem)

const totalPages = Math.ceil(teamMembers.length / itemsPerPage)

    // Fetch team members from API
    const fetchTeamMembers = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("https://api-0ggv.onrender.com/api/teams/", {
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
useEffect(() => {
  setCurrentPage(1)
}, [teamMembers])

    if (isRemoved) return null;

    return (
        <div className="col-xxl-4">
            <div className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

                <div className="card-body custom-card-action">
                    {loading && <p className="text-center">Loading team members...</p>}
                    {error && <p className="text-center text-danger">{error}</p>}
                    {!loading && !error && currentTeams.map(({ team_id, description, team_name, position, progress = 0, avatar_url, color = "#0d6efd" }) => (
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

                <div className="card-footer d-flex flex-column gap-2">

  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
  />

  {footerShow && (
    <Link to="#" className="fs-11 fw-bold text-uppercase text-center">
      Update 30 Min Ago
    </Link>
  )}

  {btnFooter && (
    <div className="text-center">
      <Link to="#" className="btn btn-primary">
        Generate Report
      </Link>
    </div>
  )}

</div>

                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    )
}

export default Progress
