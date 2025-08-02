/**
 * ViewReports Component
 * 
 * Displays a list of reports submitted by the community for review and interaction.
 * Features:
 * - Fetch and display reports from Firestore
 * - Filter and sort reports by various criteria
 * - View detailed information about each report
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import LoadingScreen from '../components/LoadingScreen';
import './ViewReports.css';

const ViewReports = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Since reports are now anonymous, redirect to community reports
        navigate('/community/reports');
    }, [navigate]);

    const handleBack = () => {
        navigate('/home');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ff9800';
            case 'in-progress': return '#2196f3';
            case 'resolved': return '#4caf50';
            case 'rejected': return '#f44336';
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

    const filteredReports = reports.filter(report => {
        if (filter === 'all') return true;
        return report.status === filter;
    });

    if (loading) {
        return <LoadingScreen message="Loading your reports..." />;
    }

    return (
        <div className="view-reports-container">
            <div className="view-reports-content">
                <header className="view-reports-header">
                    <button onClick={handleBack} className="back-btn">
                        ← Back
                    </button>
                    <h1>My Reports</h1>
                </header>

                <div className="reports-filters">
                    <div className="filter-group">
                        <label htmlFor="status-filter">Filter by Status:</label>
                        <select
                            id="status-filter"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Reports</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="reports-summary">
                    <div className="summary-item">
                        <span className="summary-number">{reports.length}</span>
                        <span className="summary-label">Total Reports</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-number">
                            {reports.filter(r => r.status === 'pending').length}
                        </span>
                        <span className="summary-label">Pending</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-number">
                            {reports.filter(r => r.status === 'resolved').length}
                        </span>
                        <span className="summary-label">Resolved</span>
                    </div>
                </div>

                <div className="reports-list">
                    {filteredReports.length === 0 ? (
                        <div className="no-reports">
                            <p>No reports found.</p>
                            {filter !== 'all' && (
                                <button 
                                    onClick={() => setFilter('all')} 
                                    className="show-all-btn"
                                >
                                    Show All Reports
                                </button>
                            )}
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
                                            {report.status}
                                        </span>
                                        <span 
                                            className="priority-badge"
                                            style={{ backgroundColor: getPriorityColor(report.priority) }}
                                        >
                                            {report.priority}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="report-meta">
                                    <span className="report-category">{report.category}</span>
                                    <span className="report-date">
                                        {formatDate(report.createdAt)}
                                    </span>
                                </div>
                                
                                <div className="report-description">
                                    {report.description}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewReports;
