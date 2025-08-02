/**
 * Report Component
 * 
 * Allows users to create and submit reports for community review.
 * Features:
 * - Input fields for report details (title, description, category, etc.)
 * - Validation for required fields
 * - Integration with Firestore for report submission
 * - Feedback on successful or failed submissions
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import LoadingScreen from '../components/LoadingScreen';
import BanNotification from '../components/BanNotification';
import { useModeration } from '../hooks/useModeration';
import './Report.css';

const Report = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const { moderateContent, isBanned, getBanInfo } = useModeration();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'school',
        priority: 'medium'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState(null);
    const [showBanNotification, setShowBanNotification] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim() || !formData.description.trim()) {
            setSubmitMessage({ type: 'error', text: 'Please fill in all required fields.' });
            return;
        }

        // Check if user is banned before submission
        if (isBanned()) {
            setShowBanNotification(true);
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            // Moderate content before submission
            const contentToModerate = `${formData.title} ${formData.description}`;
            const moderationResult = await moderateContent(contentToModerate, 'report');

            if (!moderationResult.allowed) {
                if (moderationResult.reason === 'content_violation') {
                    setSubmitMessage({ 
                        type: 'error', 
                        text: moderationResult.message 
                    });
                    setShowBanNotification(true);
                } else if (moderationResult.reason === 'user_banned') {
                    setSubmitMessage({ 
                        type: 'error', 
                        text: moderationResult.message 
                    });
                    setShowBanNotification(true);
                } else {
                    setSubmitMessage({ 
                        type: 'error', 
                        text: moderationResult.message || 'Content could not be processed.' 
                    });
                }
                return;
            }

            // Content passed moderation - submit the report
            await addDoc(collection(db, 'reports'), {
                ...formData,
                // Anonymous submission - no user data stored
                isAnonymous: true,
                status: 'open',
                solutionCount: 0,
                viewCount: 0,
                createdAt: serverTimestamp(),
                reportId: Date.now() + Math.random().toString(36).substr(2, 9) // Generate unique ID
            });

            setSubmitMessage({ type: 'success', text: 'Anonymous report submitted successfully! It will be visible to the community for solutions.' });
            setFormData({
                title: '',
                description: '',
                category: 'school',
                priority: 'medium'
            });
        } catch (error) {
            console.error('Error submitting report:', error);
            setSubmitMessage({ type: 'error', text: 'Failed to submit report. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        navigate('/home');
    };

    return (
        <div className="report-container">
            {isSubmitting && <LoadingScreen message="Submitting your report..." overlay={true} />}
            
            {/* Ban Notification Modal */}
            {showBanNotification && (
                <BanNotification 
                    banInfo={getBanInfo()} 
                    onClose={() => setShowBanNotification(false)} 
                />
            )}
            
            <div className="report-content">
                <header className="report-header">
                    <button onClick={handleBack} className="back-btn">
                        ← Back
                    </button>
                    <h1>💭 Share Your Thoughts</h1>
                    <p className="header-subtitle">This is your safe space to talk about anything on your mind</p>
                </header>

                <div className="anonymity-notice">
                    <p>�️ Don't worry - everything you share here is completely anonymous and safe. Other kids might be able to help you with kind advice!</p>
                </div>

                <div className="report-form-container">
                    <form onSubmit={handleSubmit} className="report-form">
                        <div className="form-group">
                            <label htmlFor="title">What's on your mind? *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Give your thought a title..."
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">What's this about?</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="school">School Stuff</option>
                                <option value="friends">Friends & Friendships</option>
                                <option value="family">Family</option>
                                <option value="bullying">Someone is Being Mean</option>
                                <option value="feelings">My Feelings</option>
                                <option value="help">I Need Help</option>
                                <option value="other">Something Else</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">How urgent is this?</label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                            >
                                <option value="low">Just wanted to share</option>
                                <option value="medium">Could use some advice</option>
                                <option value="high">Really need help</option>
                                <option value="critical">This is very important</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Tell us more about it *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Share what's on your mind. Don't worry, this is a safe space where you can express your feelings..."
                                rows={6}
                                required
                            />
                        </div>

                        {submitMessage && (
                            <div className={`submit-message ${submitMessage.type}`}>
                                {submitMessage.text}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '✨ Sharing...' : '💭 Share My Thoughts'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Report;
