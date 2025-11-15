import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateSessionPage = () => {
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);

  const [sessionData, setSessionData] = useState({
    title: "",
    host: "", // This is the editable field for the host's name
    month: "",
    day: "",
    year: "",
    startTime: "",
    endTime: "",
    location: "",
    additionalNotes: "",
    description: "",
  });

  useEffect(() => {
    const storedStudentData = localStorage.getItem("student"); 
    
    if (storedStudentData) {
      setStudent(JSON.parse(storedStudentData));
    } else {
      console.error("No student data found in localStorage. Redirecting to login.");
      alert("You must be logged in to create a session.");
      navigate("/login"); // Redirect if no user is found
    }
  }, [navigate]); // Add 'navigate' as a dependency

  const handleChange = (e) => {
    setSessionData({ ...sessionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!student) {
      alert("Student data is not loaded. Cannot create session.");
      return;
    }

    // Create the final payload to send
    const dataToSend = {
      ...sessionData, 
      creatorId: student.studentId,       
      startTime: sessionData.startTime || null,
      endTime: sessionData.endTime || null,
    };

    try {
      const res = await fetch("http://localhost:8080/api/sessions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend), 
      });

      if (!res.ok) {
         const errorData = await res.json();
         console.error("Backend error:", errorData);
         throw new Error("Failed to create session. Status: " + res.status);
      }

      alert("Session created successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating session. Check console for details.");
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <div className="relative z-10 p-8">

        {/* FORM START */}
        <form onSubmit={handleSubmit}>
          
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-3 text-white hover:text-indigo-400 transition-colors group"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>

            <button
              type="submit"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4" 
                />
              </svg>
              Create
            </button>
          </div>

          {/* Profile Pic + Title */}
          <div className="flex items-center gap-6 mb-12">
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <svg className="w-16 h-16 text-indigo-400" fill="currentColor">
                  <path d="M4 5h13v7h2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h8v-2H4V5zm16 10l-4-4v3H9v2h7v3l4-4z" />
                </svg>
              </div>
              <button type="button" className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center transition-colors shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
              </button>
            </div>

            <div className="flex-1">
              <input
                type="text"
                name="title"
                value={sessionData.title}
                onChange={handleChange}
                placeholder="Enter Meeting Name"
                className="w-full bg-transparent text-4xl font-bold text-indigo-300 placeholder-indigo-300/50 focus:outline-none focus:text-white transition-colors"
                required // Good idea to add this
              />
            </div>
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-3 gap-8">

            {/* LEFT PANEL */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6">
              <h3 className="text-white font-bold text-xl mb-6">Details</h3>

              {/* Host */}
              <div className="mb-6">
                <input
                  type="text"
                  name="host"
                  value={sessionData.host}
                  onChange={handleChange}
                  placeholder="Host Name"
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm"
                  required // Good idea to add this
                />
              </div>

              {/* Date */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <select
                    name="month"
                    value={sessionData.month}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm"
                    required
                  >
                    <option value="">Month</option>
                    {[
                      "January","February","March","April","May","June",
                      "July","August","September","October","November","December",
                    ].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  <select
                    name="day"
                    value={sessionData.day}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm"
                    required
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>

                  <select
                    name="year"
                    value={sessionData.year}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm"
                    required
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 10 }, (_, i) => 2025 + i).map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    name="startTime"
                    value={sessionData.startTime}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm"
                  />
                  <span className="text-gray-500">—</span>
                  <input
                    type="time"
                    name="endTime"
                    value={sessionData.endTime}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <input
                  type="text"
                  name="location"
                  value={sessionData.location}
                  onChange={handleChange}
                  placeholder="Enter Location"
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-white text-sm font-semibold mb-3 block">
                  Additional Notes:
                </label>
                <textarea
                  name="additionalNotes"
                  value={sessionData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Write notes here..."
                  rows="4"
                  className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-gray-300 text-sm resize-none"
                />
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="col-span-2 bg-[#1a1a1a] rounded-2xl p-6">
              <h3 className="text-white font-bold text-xl mb-6">Meeting Overview</h3>

              <textarea
                name="description"
                value={sessionData.description}
                onChange={handleChange}
                placeholder="Describe the meeting..."
                rows={18}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-gray-800 rounded-lg text-gray-300 text-sm resize-none"
              />
            </div>

          </div>

        </form>
        {/* FORM END */}

      </div>
    </div>
  );
};

export default CreateSessionPage;