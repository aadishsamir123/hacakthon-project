/**
 * CommunityReports Component
 * 
 * This component allows users to view, filter, and interact with community-shared reports.
 * Users can provide anonymous solutions to help others, and the system includes moderation
 * to ensure a safe and supportive environment.
 * 
 * Features:
 * - Fetch and display reports from Firestore
 * - Filter reports by status and priority
 * - View detailed report information and solutions
 * - Submit anonymous solutions with moderation
 * - Increment view and helpful counts for reports and solutions
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import LoadingScreen from '../components/LoadingScreen';
import BanNotification from '../components/BanNotification';
import { useModeration } from '../hooks/useModeration';
import './CommunityReports.css';

const CommunityReports = () => {
    // State for managing reports, filters, and user interactions
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { moderateContent, isBanned, getBanInfo } = useModeration();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedReport, setSelectedReport] = useState(null);
    const [solutions, setSolutions] = useState([]);
    const [solutionText, setSolutionText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingSolutions, setLoadingSolutions] = useState(false);
    const [showBanNotification, setShowBanNotification] = useState(false);

    // Effect: Fetch reports from Firestore and listen for real-time updates
    useEffect(() => {
        const reportsQuery = query(
            collection(db, 'reports'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
            const reportsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReports(reportsData);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching reports:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleBack = () => {
        navigate('/home');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return '#ff9800';
            case 'solved': return '#4caf50';
            case 'closed': return '#757575';
            default: return '#757575';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low': return '#4caf50';
            case 'medium': return '#ff9800';
            case 'high': return '#ff5722';
            case 'critical': return '#f44336';
            default: return '#757575';
        }
    };

    /**
     * Formats a Firestore timestamp into a readable date and time string.
     * 
     * @param {Object} timestamp - Firestore timestamp or Date object
     * @returns {string} Formatted date and time string
     */
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        
        let date;
        if (timestamp.toDate) {
            date = timestamp.toDate();
        } else {
            date = new Date(timestamp);
        }
        
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    /**
     * Handles viewing a specific report.
     * - Sets the selected report for detailed view.
     * - Increments the view count in Firestore.
     * - Fetches existing solutions for the report.
     * 
     * @param {Object} report - The report object to view
     */
    const handleViewReport = async (report) => {
        setSelectedReport(report);
        setLoadingSolutions(true);
        
        // Increment view count
        try {
            await updateDoc(doc(db, 'reports', report.id), {
                viewCount: increment(1)
            });
        } catch (error) {
            console.error('Error updating view count:', error);
        }

        // Load existing solutions
        try {
            const solutionsSnapshot = await getDocs(
                query(
                    collection(db, 'reports', report.id, 'solutions'),
                    orderBy('createdAt', 'desc')
                )
            );
            
            const solutionsData = solutionsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setSolutions(solutionsData);
        } catch (error) {
            console.error('Error loading solutions:', error);
            setSolutions([]);
        } finally {
            setLoadingSolutions(false);
        }
    };

    const handleSubmitSolution = async (e) => {
        e.preventDefault();
        
        if (!solutionText.trim()) {
            alert('Please provide a solution before submitting.');
            return;
        }

        // Check if user is banned before submission
        if (isBanned()) {
            setShowBanNotification(true);
            return;
        }

        setIsSubmitting(true);

        try {
            // Moderate content before submission
            const moderationResult = await moderateContent(solutionText, 'solution');

            if (!moderationResult.allowed) {
                if (moderationResult.reason === 'content_violation') {
                    alert(moderationResult.message);
                    setShowBanNotification(true);
                } else if (moderationResult.reason === 'user_banned') {
                    alert(moderationResult.message);
                    setShowBanNotification(true);
                } else {
                    alert(moderationResult.message || 'Content could not be processed.');
                }
                return;
            }

            // Content passed moderation - submit the solution
            await addDoc(collection(db, 'reports', selectedReport.id, 'solutions'), {
                solution: solutionText,
                isAnonymous: true,
                helpfulCount: 0,
                createdAt: serverTimestamp(),
                solutionId: Date.now() + Math.random().toString(36).substr(2, 9)
            });

            // Update report solution count
            await updateDoc(doc(db, 'reports', selectedReport.id), {
                solutionCount: increment(1)
            });

            // Refresh solutions list
            const solutionsSnapshot = await getDocs(
                query(
                    collection(db, 'reports', selectedReport.id, 'solutions'),
                    orderBy('createdAt', 'desc')
                )
            );
            
            const solutionsData = solutionsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setSolutions(solutionsData);
            setSolutionText('');
            alert('Solution submitted successfully!');
        } catch (error) {
            console.error('Error submitting solution:', error);
            alert('Failed to submit solution. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMarkHelpful = async (solutionId) => {
        try {
            await updateDoc(doc(db, 'reports', selectedReport.id, 'solutions', solutionId), {
                helpfulCount: increment(1)
            });

            // Update local state to reflect the change
            setSolutions(prevSolutions => 
                prevSolutions.map(solution => 
                    solution.id === solutionId 
                        ? { ...solution, helpfulCount: (solution.helpfulCount || 0) + 1 }
                        : solution
                )
            );
        } catch (error) {
            console.error('Error marking solution as helpful:', error);
        }
    };

    const filteredReports = reports.filter(report => {
        if (filter === 'all') return true;
        if (filter === 'open') return report.status === 'open';
        if (filter === 'solved') return report.status === 'solved';
        if (filter === 'high-priority') return report.priority === 'high' || report.priority === 'critical';
        return true;
    });

    if (loading) {
        return <LoadingScreen message="Loading community reports..." />;
    }

    return (
        <div className="community-reports-container">
            {/* Ban Notification Modal */}
            {showBanNotification && (
                <BanNotification 
                    banInfo={getBanInfo()} 
                    onClose={() => setShowBanNotification(false)} 
                />
            )}
            
            <div className="community-reports-content">
                <header className="community-reports-header">
                    <button onClick={handleBack} className="back-btn">
                        ← Back
                    </button>
                    <h1>🤝 Help Your Friends</h1>
                    <p>See what other kids are sharing and help them with kind advice!</p>
                </header>

                <div className="reports-filters">
                    <div className="filter-group">
                        <label htmlFor="status-filter">Show me:</label>
                        <select
                            id="status-filter"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Thoughts</option>
                            <option value="open">Needs Help</option>
                            <option value="solved">Already Helped</option>
                            <option value="high-priority">Really Important</option>
                        </select>
                    </div>
                </div>

                <div className="reports-summary">
                    <div className="summary-item">
                        <span className="summary-number">{reports.length}</span>
                        <span className="summary-label">Shared Thoughts</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-number">
                            {reports.filter(r => r.status === 'open').length}
                        </span>
                        <span className="summary-label">Need Help</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-number">
                            {reports.filter(r => r.status === 'solved').length}
                        </span>
                        <span className="summary-label">Got Help</span>
                    </div>
                </div>

                <div className="reports-list">
                    {filteredReports.length === 0 ? (
                        <div className="no-reports">
                            <p>No thoughts shared in this category yet.</p>
                        </div>
                    ) : (
                        filteredReports.map(report => (
                            <div key={report.id} className="report-card">
                                <div className="report-card-header">
                                    <h3 className="report-title">{report.title}</h3>
                                    <div className="report-badges">
                                        <span 
                                            className="status-badge" 
                                            style={{ backgroundColor: getStatusColor(report.status) }}
                                        >
                                            {report.status === 'open' ? 'needs help' : report.status === 'solved' ? 'helped' : report.status}
                                        </span>
                                        <span 
                                            className="priority-badge"
                                            style={{ backgroundColor: getPriorityColor(report.priority) }}
                                        >
                                            {report.priority === 'low' ? 'sharing' : 
                                             report.priority === 'medium' ? 'advice needed' : 
                                             report.priority === 'high' ? 'needs help' : 'very important'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="report-meta">
                                    <span className="report-category">
                                        {report.category === 'school' ? '🏫 School' :
                                         report.category === 'friends' ? '👫 Friends' :
                                         report.category === 'family' ? '👨‍👩‍👧‍👦 Family' :
                                         report.category === 'bullying' ? '🛡️ Being Mean' :
                                         report.category === 'feelings' ? '💭 Feelings' :
                                         report.category === 'help' ? '🆘 Need Help' :
                                         '🌟 Other'}
                                    </span>
                                    <span className="report-date">
                                        {formatDate(report.createdAt)}
                                    </span>
                                </div>
                                
                                <div className="report-description">
                                    {report.description}
                                </div>

                                <div className="report-stats">
                                    <span className="stat">👁️ {report.viewCount || 0} kids saw this</span>
                                    <span className="stat">💡 {report.solutionCount || 0} helpful replies</span>
                                </div>

                                <div className="report-actions">
                                    <button 
                                        onClick={() => handleViewReport(report)}
                                        className="view-btn"
                                    >
                                        🤝 Help This Friend
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Solution Modal */}
                {selectedReport && (
                    <div className="solution-modal-overlay" onClick={() => setSelectedReport(null)}>
                        <div className="solution-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>🤝 Help a Friend</h2>
                                <button 
                                    onClick={() => setSelectedReport(null)}
                                    className="close-btn"
                                >
                                    ✕
                                </button>
                            </div>
                            
                            <div className="modal-content">
                                <div className="problem-summary">
                                    <h3>{selectedReport.title}</h3>
                                    <p>{selectedReport.description}</p>
                                    <div className="problem-meta">
                                        <span className="meta-item">About: {
                                            selectedReport.category === 'school' ? '🏫 School' :
                                            selectedReport.category === 'friends' ? '👫 Friends' :
                                            selectedReport.category === 'family' ? '👨‍👩‍👧‍👦 Family' :
                                            selectedReport.category === 'bullying' ? '🛡️ Being Mean' :
                                            selectedReport.category === 'feelings' ? '💭 Feelings' :
                                            selectedReport.category === 'help' ? '🆘 Need Help' :
                                            '🌟 Other'
                                        }</span>
                                        <span className="meta-item">Shared: {formatDate(selectedReport.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Existing Solutions Section */}
                                <div className="existing-solutions">
                                    <h4>💝 Kind Replies from Friends ({solutions.length})</h4>
                                    
                                    {loadingSolutions ? (
                                        <div className="loading-solutions">
                                            <div className="spinner"></div>
                                            <p>Loading replies...</p>
                                        </div>
                                    ) : solutions.length > 0 ? (
                                        <div className="solutions-list">
                                            {solutions.map((solution) => (
                                                <div key={solution.id} className="solution-item">
                                                    <div className="solution-content">
                                                        <p>{solution.solution}</p>
                                                    </div>
                                                    <div className="solution-footer">
                                                        <span className="solution-date">
                                                            {solution.createdAt?.toDate().toLocaleDateString()}
                                                        </span>
                                                        <button 
                                                            className="helpful-btn"
                                                            onClick={() => handleMarkHelpful(solution.id)}
                                                        >
                                                            � This Helped! ({solution.helpfulCount || 0})
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="no-solutions">
                                            <p>💭 No kind replies yet. Be the first friend to help!</p>
                                        </div>
                                    )}
                                </div>

                                {/* Add New Solution Section */}
                                <div className="add-solution-section">
                                    <h4>💌 Send a Kind Reply</h4>
                                    <form onSubmit={handleSubmitSolution} className="solution-form">
                                        <label htmlFor="solution">Your kind words (anonymous):</label>
                                        <textarea
                                            id="solution"
                                            value={solutionText}
                                            onChange={(e) => setSolutionText(e.target.value)}
                                            placeholder="Share kind words, helpful advice, or just let them know they're not alone..."
                                            rows={4}
                                            required
                                        />
                                        
                                        <div className="form-actions">
                                            <button 
                                                type="button" 
                                                onClick={() => setSelectedReport(null)}
                                                className="cancel-btn"
                                            >
                                                Maybe Later
                                            </button>
                                            <button 
                                                type="submit" 
                                                className="submit-solution-btn"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? '💌 Sending...' : '� Send Kind Reply'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityReports;
