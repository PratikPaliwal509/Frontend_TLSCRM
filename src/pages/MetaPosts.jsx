
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import MetaPostsHeader from '@/components/metaPosts/MetaPostsHeader';
import MetaPostsContent from '@/components/metaPosts/MetaPostsContent';
import Footer from '@/components/shared/Footer';
import { verifyPagePermission } from '@/utils/verifyPagePermission';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import GenerateReportModal from '@/components/metaPosts/GenerateReportModal';
const MetaPosts = () => {
    const navigate = useNavigate();
    const [showReportModal, setShowReportModal] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    /* ================= PERMISSION ================= */
    // useEffect(() => {
    //     const checkPermission = async () => {
    //         await verifyPagePermission('meta_posts', 'view', navigate);
    //     };

    //     checkPermission();
    // }, [navigate]);

    /* ================= FETCH POSTS ================= */
    const fetchPosts = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem('token');

            const response = await fetch(
                'https://api-0ggv.onrender.com/api/facebook/posts',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(
                    result.message || 'Failed to fetch Facebook posts'
                );
            }

            /*
             * Your API response:
             *
             * {
             *   success: true,
             *   message: "...",
             *   data: {
             *      data: [...]
             *   }
             * }
             */

            setPosts(result.data?.data || []);

        } catch (error) {
            console.error('Facebook posts fetch error:', error);

            toast.error(
                error.message || 'Failed to fetch Facebook posts'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    /* ================= DELETE POST ================= */
    const handleDelete = async (postId) => {
        const confirm = await Swal.fire({
            title: 'Delete Facebook Post?',
            text: 'This post will be deleted from the Facebook Page.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
        });

        if (!confirm.isConfirmed) return;

        try {
            setDeletingId(postId);

            const token = localStorage.getItem('token');

            const response = await fetch(
                `https://api-0ggv.onrender.com/api/facebook/posts/${encodeURIComponent(postId)}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'Failed to delete Facebook post'
                );
            }

            // Remove deleted post from UI
            setPosts((prevPosts) =>
                prevPosts.filter((post) => post.id !== postId)
            );

            await Swal.fire({
                icon: 'success',
                title: 'Post Deleted',
                text: 'Facebook post deleted successfully.',
                confirmButtonText: 'OK',
            });

        } catch (error) {
            console.error('Delete Facebook post error:', error);

            toast.error(
                error.message || 'Failed to delete Facebook post'
            );
        } finally {
            setDeletingId(null);
        }
    };

    /* ================= CREATE POST ================= */
    const handleCreatePost = () => {
        navigate('/meta/posts/create');
    };
    const handleGenerateReport = () => {
        setShowReportModal(true);
    };
    return (
        <>
            {/* ================= PAGE HEADER ================= */}
            <PageHeader>
                <MetaPostsHeader
                    loading={loading}
                    postCount={posts.length}
                    onRefresh={fetchPosts}
                    onCreatePost={handleCreatePost}
                    onGenerateReport={handleGenerateReport}
                />
            </PageHeader>

            {/* ================= MAIN CONTENT ================= */}
            <div className="main-content">
                <div className="row" style={{ height: '60vh' }}>

                    <MetaPostsContent
                        posts={posts}
                        loading={loading}
                        deletingId={deletingId}
                        onDelete={handleDelete}
                    />
                </div>
            </div>

            <Footer />
            <GenerateReportModal
                show={showReportModal}
                onClose={() => setShowReportModal(false)}
            />
        </>
    );
};

export default MetaPosts;
