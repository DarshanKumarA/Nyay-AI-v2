// frontend/src/pages/Drafting.jsx

import React, { useState, useEffect } from 'react';
import { fetchUserFiles, generateDraft } from '../api/apiService';
import Loader from '../components/LoadingSpinner';
import { LuPenTool, LuCopy, LuDownload, LuFileText, LuCheck } from 'react-icons/lu';
import './Drafting.css';

const DOCUMENT_TYPES = [
    "Legal Notice",
    "Plaint",
    "Written Statement",
    "Bail Application",
    "Vakalatnama",
    "Affidavit",
    "Contract Agreement",
    "Will"
];

function Drafting() {
    // State for Left Panel (Inputs)
    const [allFiles, setAllFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]);
    const [instructions, setInstructions] = useState("");

    // State for Right Panel (Output)
    const [draftText, setDraftText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFilesLoading, setIsFilesLoading] = useState(true);

    const [isCopied, setIsCopied] = useState(false);

    // Load files on mount
    useEffect(() => {
        const loadFiles = async () => {
            try {
                const response = await fetchUserFiles();
                // Simple deduplication logic
                const unique = [];
                const seen = new Set();
                response.data.forEach(f => {
                    if (!seen.has(f.filename)) {
                        seen.add(f.filename);
                        unique.push(f);
                    }
                });
                setAllFiles(unique);
            } catch (error) {
                console.error("Failed to load files", error);
            } finally {
                setIsFilesLoading(false);
            }
        };
        loadFiles();
    }, []);

    const handleFileToggle = (filename) => {
        setSelectedFiles(prev =>
            prev.includes(filename) ? prev.filter(f => f !== filename) : [...prev, filename]
        );
    };

    const handleGenerate = async () => {
        if (selectedFiles.length === 0) {
            alert("Please select at least one source file.");
            return;
        }

        setIsLoading(true);
        setDraftText(""); // Clear previous draft

        try {
            const payload = {
                document_type: documentType,
                filenames: selectedFiles,
                user_instructions: instructions
            };

            const response = await generateDraft(payload);
            setDraftText(response.data.draft_text);
        } catch (error) {
            console.error("Drafting failed", error);
            alert("Failed to generate draft. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(draftText);
        setIsCopied(true);

        // Reset back to "Copy" icon after 2 seconds
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([draftText], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `${documentType.replace(/\s+/g, '_')}_Draft.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="drafting-container">
            {/* LEFT PANEL: Controls */}
            <div className="drafting-controls">
                <h2><LuPenTool /> Drafting Assistant</h2>
                <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    Select case files and AI will draft legal documents for you.
                </p>

                <div className="control-group">
                    <label>1. Select Source Files</label>
                    {isFilesLoading ? <Loader text="Loading..." /> : (
                        <div className="compact-file-list">
                            {allFiles.length > 0 ? allFiles.map(file => (
                                <div key={file.id} className="compact-file-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedFiles.includes(file.filename)}
                                        onChange={() => handleFileToggle(file.filename)}
                                    />
                                    <span>{file.filename}</span>
                                </div>
                            )) : <p style={{ padding: '0.5rem', color: '#666' }}>No files found.</p>}
                        </div>
                    )}
                </div>

                <div className="control-group">
                    <label>2. Document Type</label>
                    <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                        {DOCUMENT_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label>3. Specific Instructions (Optional)</label>
                    <textarea
                        placeholder="E.g., 'Emphasize the breach of contract date', 'Use an aggressive tone'..."
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                    />
                </div>

                <button
                    className="generate-btn"
                    onClick={handleGenerate}
                    disabled={isLoading || selectedFiles.length === 0}
                >
                    {isLoading ? "Drafting..." : "Generate Draft"}
                </button>
            </div>

            {/* RIGHT PANEL: Editor */}
            <div className="drafting-editor">
                <div className="editor-header">
                    <h2>{isLoading ? "AI is writing..." : "Draft Editor"}</h2>
                    <div className="editor-actions">
                        <button
                            onClick={handleCopy}
                            disabled={!draftText}
                            title="Copy to Clipboard"
                            className={isCopied ? "copy-success" : ""} // Add class for green color
                        >
                            {isCopied ? <LuCheck /> : <LuCopy />}
                            {isCopied ? "Copied" : "Copy"}
                        </button>

                        <button onClick={handleDownload} disabled={!draftText} title="Download Text">
                            <LuDownload /> Save
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="editor-placeholder">
                        <Loader text="Analyzing facts and generating legal prose..." />
                    </div>
                ) : (
                    <textarea
                        className="editor-textarea"
                        value={draftText}
                        onChange={(e) => setDraftText(e.target.value)}
                        placeholder="Your generated legal draft will appear here..."
                        spellCheck="false"
                    />
                )}
            </div>
        </div>
    );
}

export default Drafting;