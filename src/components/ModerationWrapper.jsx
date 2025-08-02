import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useModeration } from '../hooks/useModeration';
import BanNotification from './BanNotification';
import LoadingScreen from './LoadingScreen';

/**
 * Higher-order component that wraps content submission pages with ban checking
 */
const ModerationWrapper = ({ children, requiresContentSubmission = false }) => {
    const { currentUser } = useAuth();
    const { isBanned, getBanInfo, loading } = useModeration();
    const [showBanModal, setShowBanModal] = useState(false);

    useEffect(() => {
        // If this page requires content submission capability and user is banned
        if (requiresContentSubmission && isBanned()) {
            setShowBanModal(true);
        }
    }, [requiresContentSubmission, isBanned]);

    if (loading) {
        return <LoadingScreen message="Checking account status..." />;
    }

    return (
        <>
            {/* Show ban notification if user is banned and trying to submit content */}
            {showBanModal && (
                <BanNotification 
                    banInfo={getBanInfo()} 
                    onClose={() => setShowBanModal(false)} 
                />
            )}
            
            {/* Render children normally - individual components handle submission blocking */}
            {children}
        </>
    );
};

export default ModerationWrapper;
