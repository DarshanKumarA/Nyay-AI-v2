// frontend/src/pages/Timeline.jsx

import React, { useState, useEffect } from 'react';
import { fetchUserFiles, fetchCaseTimeline } from '../api/apiService';
import { LuFileClock, LuCalendarClock, LuHistory } from 'react-icons/lu';
import Loader from '../components/LoadingSpinner';
import './Timeline.css';
import './EvidenceAnalysis.css'; // Reusing file selection styles

function Timeline() {
    const [allFiles, setAllFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isLoadingFiles, setIsLoadingFiles] = useState(true);
    const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);
    const [timelineEvents, setTimelineEvents] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadFiles = async () => {
            setIsLoadingFiles(true);
            try {
                const response = await fetchUserFiles();
                // Dedup logic reused from EvidenceAnalysis
                const uniqueFiles = [];
                const seenFilenames = new Set();
                for (const file of response.data) {
                    if (!seenFilenames.has(file.filename)) {
                        seenFilenames.add(file.filename);
                        uniqueFiles.push(file);
                    }
                }
                setAllFiles(uniqueFiles);
            } catch (err) {
                setError("Could not load files.");
            } finally {
                setIsLoadingFiles(false);
            }
        };
        loadFiles();
    }, []);

    const handleFileSelectionChange = (filename) => {
        setSelectedFiles(prev =>
            prev.includes(filename) ? prev.filter(f => f !== filename) : [...prev, filename]
        );
    };

    const handleGenerateTimeline = async () => {
        if (selectedFiles.length === 0) {
            setError("Please select at least one file.");
            return;
        }

        setIsLoadingTimeline(true);
        setTimelineEvents(null);
        setError('');

        try {
            const response = await fetchCaseTimeline(selectedFiles);
            setTimelineEvents(response.data.events);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to generate timeline.");
        } finally {
            setIsLoadingTimeline(false);
        }
    };

    return (
        <div className="timeline-container">
            <h1>Case Timeline</h1>
            <p className="subtitle">Visualize the chronological sequence of events across your case files.</p>

            {/* File Selection */}
            <div className="file-selection-container">
                <h3><LuFileClock /> Select Files for Timeline</h3>
                {isLoadingFiles && <Loader text="Loading files..." />}
                {!isLoadingFiles && allFiles.length > 0 && (
                    <div className="file-list">
                        {allFiles.map(file => (
                            <div key={file.id} className="file-item">
                                <input
                                    type="checkbox"
                                    id={`file-${file.id}`}
                                    checked={selectedFiles.includes(file.filename)}
                                    onChange={() => handleFileSelectionChange(file.filename)}
                                />
                                <label htmlFor={`file-${file.id}`}>{file.filename}</label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                className="analyze-button"
                onClick={handleGenerateTimeline}
                disabled={selectedFiles.length === 0 || isLoadingTimeline}
            >
                {isLoadingTimeline ? 'Processing...' : 'Generate Timeline'}
            </button>

            {isLoadingTimeline && <Loader text="Constructing Timeline..." />}

            {error && <div className="analysis-results error-message">{error}</div>}

            {/* --- UPDATED LOGIC START --- */}

            {/* Only render the timeline wrapper (and the vertical line) if there ARE events */}
            {timelineEvents && !isLoadingTimeline && timelineEvents.length > 0 && (
                <div className="timeline-wrapper">
                    {timelineEvents.map((event, index) => (
                        <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                            <div className="timeline-content">
                                <span className="timeline-date">{event.date}</span>
                                <h3>{event.description}</h3>
                                <div className="timeline-source">
                                    <LuCalendarClock size={14} /> Source: {event.source_file}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Render the "No events" message OUTSIDE the wrapper so no line appears */}
            {timelineEvents && !isLoadingTimeline && timelineEvents.length === 0 && (
                <p className="no-files-message" style={{ marginTop: '3rem' }}>
                    No specific dated events were found in the selected documents.
                </p>
            )}

            {/* --- UPDATED LOGIC END --- */}

        </div>
    );
}

export default Timeline;