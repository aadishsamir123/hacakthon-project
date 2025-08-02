import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import moderationService from '../services/moderationService';
import LoadingScreen from '../components/LoadingScreen';
import './ModerationDashboard.css';

const ModerationDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalViolations: 0,
        activeBans: 0,
        totalBans: 0,
        recentViolations: []
    });
    const [bans, setBans] = useState([]);
    const [violations, setViolations] = useState([]);

    useEffect(() => {
        loadModerationData();
    }, []);

    const loadModerationData = async () => {
        try {
            setLoading(true);
            
            // Load violations
            const violationsSnapshot = await getDocs(
                query(collection(db, 'user_violations'), orderBy('createdAt', 'desc'), limit(50))
            );
            const violationsData = violationsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Load bans
            const bansSnapshot = await getDocs(collection(db, 'user_bans'));
            const bansData = bansSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Calculate active bans
            const now = new Date();
            const activeBans = bansData.filter(ban => {
                const expiresAt = ban.banExpiresAt?.toDate();
                return expiresAt && now < expiresAt;
            });

            setViolations(violationsData);
            setBans(bansData);
            setStats({
                totalViolations: violationsData.length,
                activeBans: activeBans.length,
                totalBans: bansData.length,
                recentViolations: violationsData.slice(0, 10)
            });

        } catch (error) {
            console.error('Error loading moderation data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveBan = async (banId, userId) => {
        if (!window.confirm('Are you sure you want to remove this ban?')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'user_bans', banId));
            setBans(bans.filter(ban => ban.id !== banId));
            alert('Ban removed successfully');
            loadModerationData(); // Refresh data
        } catch (error) {
            console.error('Error removing ban:', error);
            alert('Failed to remove ban');
        }
    };

    const handleCleanupExpiredBans = async () => {
        try {
            const removedCount = await moderationService.cleanupExpiredBans();
            alert(`Removed ${removedCount} expired bans`);
            loadModerationData(); // Refresh data
        } catch (error) {
            console.error('Error cleaning up bans:', error);
            alert('Failed to cleanup expired bans');
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
        
        return date.toLocaleString();
    };

    const getRiskLevelColor = (riskLevel) => {
        switch (riskLevel) {
            case 'high': return '#f44336';
            case 'medium': return '#ff9800';
            case 'low': return '#ff5722';
            default: return '#757575';
        }
    };

    if (loading) {
        return <LoadingScreen message="Loading moderation dashboard..." />;
    }

    return (
        <div className="moderation-dashboard">
            <div className="dashboard-header">
                <h1>🛡️ Moderation Dashboard</h1>
                <button onClick={handleCleanupExpiredBans} className="cleanup-btn">
                    🧹 Cleanup Expired Bans
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-number">{stats.totalViolations}</div>
                    <div className="stat-label">Total Violations</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.activeBans}</div>
                    <div className="stat-label">Active Bans</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.totalBans}</div>
                    <div className="stat-label">Total Bans</div>
                </div>
            </div>

            {/* Recent Violations */}
            <div className="section">
                <h2>Recent Violations</h2>
                <div className="violations-list">
                    {stats.recentViolations.map(violation => (
                        <div key={violation.id} className="violation-card">
                            <div className="violation-header">
                                <span className="violation-id">#{violation.violationNumber}</span>
                                <span 
                                    className="risk-badge"
                                    style={{ backgroundColor: getRiskLevelColor(violation.riskLevel) }}
                                >
                                    {violation.riskLevel} risk
                                </span>
                                <span className="violation-date">
                                    {formatDate(violation.createdAt)}
                                </span>
                            </div>
                            <div className="violation-content">
                                <strong>Content:</strong> {violation.content?.substring(0, 200)}
                                {violation.content?.length > 200 && '...'}
                            </div>
                            <div className="violation-flags">
                                <strong>Flags:</strong> {violation.flags?.map(flag => flag.type).join(', ')}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Bans */}
            <div className="section">
                <h2>Current Bans</h2>
                <div className="bans-list">
                    {bans.filter(ban => {
                        const now = new Date();
                        const expiresAt = ban.banExpiresAt?.toDate();
                        return expiresAt && now < expiresAt;
                    }).map(ban => (
                        <div key={ban.id} className="ban-card">
                            <div className="ban-header">
                                <span className="ban-user">User: {ban.userId}</span>
                                <span className="ban-duration">{ban.banDurationMinutes} min</span>
                                <button 
                                    onClick={() => handleRemoveBan(ban.id, ban.userId)}
                                    className="remove-ban-btn"
                                >
                                    Remove Ban
                                </button>
                            </div>
                            <div className="ban-details">
                                <div><strong>Reason:</strong> {ban.banReason}</div>
                                <div><strong>Created:</strong> {formatDate(ban.banCreatedAt)}</div>
                                <div><strong>Expires:</strong> {formatDate(ban.banExpiresAt)}</div>
                                <div><strong>Violation #:</strong> {ban.violationCount}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ModerationDashboard;
