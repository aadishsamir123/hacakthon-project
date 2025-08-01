import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import LoadingScreen from '../components/LoadingScreen';
import './Report.css';

const Report = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'bug',
        priority: 'medium'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState(null);

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

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            await addDoc(collection(db, 'reports'), {
                ...formData,
                userId: currentUser.uid,
                userEmail: currentUser.email,
                userName: currentUser.displayName || 'Anonymous',
                status: 'pending',
                createdAt: serverTimestamp()
            });

            setSubmitMessage({ type: 'success', text: 'Report submitted successfully!' });
            setFormData({
                title: '',
                description: '',
                category: 'bug',
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
            <div className="report-content">
                <header className="report-header">
                    <button onClick={handleBack} className="back-btn">
                        ← Back
                    </button>
                    <h1>Submit a Report</h1>
                </header>

                <div className="report-form-container">
                    <form onSubmit={handleSubmit} className="report-form">
                        <div className="form-group">
                            <label htmlFor="title">Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Brief description of the issue"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="mental violence">Mental Violence</option>
                                <option value="physical violence">Physical Violence</option>
                                <option value="complaint">Complaint</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Detailed description of the issue or request"
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
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Report;
