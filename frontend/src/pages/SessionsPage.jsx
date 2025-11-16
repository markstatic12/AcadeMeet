import React, { useState, useEffect } from 'react';
// No axios import needed
import DashboardLayout from '../components/DashboardLayout'; // Adjust path if needed
import { SlCalender } from "react-icons/sl"; // Calendar icon
import { IoTimeOutline } from "react-icons/io5"; // Clock icon
import { GrVideo } from "react-icons/gr"; // Video/Location icon

/**
 * Main Sessions Page Component
 * - Fetches sessions from the API using the native fetch() API
 * - Handles loading and error states
 * - Renders the list of sessions
 */
const Sessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data on component mount
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setLoading(true);
                // GET request using the fetch() API
                const response = await fetch('http://localhost:8080/api/sessions/all-sessions');

                // Check if the response was successful
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Parse the JSON data from the response
                const data = await response.json();
                
                setSessions(data);
                setError(null);
            } catch (err) {
                // Handle error
                setError('Failed to fetch sessions. Please try again later.');
                console.error("Error fetching sessions:", err);
            } finally {
                // Stop loading state
                setLoading(false);
            }
        };

        fetchSessions();
    }, []); // Empty dependency array ensures this runs only once

    // Helper function to render content based on state
    const renderContent = () => {
        if (loading) {
            return <p className="text-gray-400">Loading sessions...</p>;
        }

        if (error) {
            return <p className="text-red-500">{error}</p>;
        }

        if (sessions.length === 0) {
            return <p className="text-gray-400">No sessions found.</p>;
        }

        // On success, map over sessions and render a card for each
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sessions.map(session => (
                    <SessionCard key={session.id} session={session} />
                ))}
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className="p-8 text-white min-h-screen">
                <h1 className="text-3xl font-bold mb-6">Sessions</h1>
                {renderContent()}
            </div>
        </DashboardLayout>
    );
};

/**
 * Session Card Component
 * - Displays details for a single session
 * - Uses data from the Session.java model
 */
const SessionCard = ({ session }) => {
    
    // Helper function to format date: "Sep 31, 2025"
    const formatDate = (month, day, year) => {
        // Assuming month is a full string like "September". Let's abbreviate.
        const monthAbbr = month ? month.substring(0, 3) : 'N/A';
        return `${monthAbbr} ${day}, ${year}`;
    };

    // Helper function to format time: "9:00 AM"
    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        try {
            const [hours, minutes] = timeString.split(':');
            const hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
            return `${formattedHour}:${minutes} ${ampm}`;
        } catch (e) {
            console.error("Error formatting time:", e);
            return timeString; // Fallback
        }
    };

    return (
        <div className="bg-[#1e1e1e] rounded-xl p-5 flex flex-col gap-3 shadow-lg">
            {/* NOTE: The image and tags from your screenshot are not included here
              because they are not present in the Session.java model you provided.
            */}
            
            <h3 className="text-xl font-semibold text-white truncate">{session.title}</h3>
            
            <div className="flex items-center gap-3 text-gray-400 text-sm">
                <SlCalender />
                <span>{formatDate(session.month, session.day, session.year)}</span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-400 text-sm">
                <IoTimeOutline />
                <span>
                    {formatTime(session.startTime)} - {formatTime(session.endTime)}
                </span>
            </div>
            
            <div className="flex items-center gap-3 text-gray-400 text-sm">
                <GrVideo />
                <span>{session.location}</span>
            </div>
        </div>
    );
};

export default Sessions;