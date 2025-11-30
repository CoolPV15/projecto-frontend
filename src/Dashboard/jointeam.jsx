/**
 * @file JoinTeam.jsx
 * @description
 * This component allows authenticated users to browse available teams/projects and send
 * join requests to team owners. It displays a list of teams fetched from the backend
 * based on the user's skill set (frontend/backend). Upon selecting a project, details
 * appear on the right side with the message input and project info.
 *
 * It features:
 * - Dynamic fetching of team data using Axios
 * - Real-time validation of message input
 * - Context-aware user data via AuthContext
 * - Inline detail view for selected project
 * - Error handling via a custom ErrorToast component
 *
 * @module JoinTeam
 * @author Pranav Singh
 */

import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import axiosInstance from "../Interceptors/axiosInstance";
import { AuthContext } from "../context/AuthProvider.jsx";
import SuccessToast from "../toasts/SuccessToast.jsx";
import ErrorToast from "../toasts/ErrorToast.jsx";
import { useDashboard } from "../context/DashboardContext.jsx";
import {
  Users,
  MessageCircle,
  Layers,
  ArrowRight,
  Code,
  Monitor,
  Server,
} from "lucide-react";

/**
 * @function JoinTeam
 * @description
 * Main functional component for displaying available teams in a list format
 * and handling team join requests.
 *
 * @returns {JSX.Element} Rendered JoinTeam component.
 */
function JoinTeam() {
  /** --------------------------- State Management --------------------------- */
  const { user } = useContext(AuthContext);
  const { triggerRefresh } = useDashboard();
  const [refresh, setRefresh] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  /** ------------------------------------------------------------------------
   * @function useEffect
   * @description Fetches available projects from the API based on the user’s skills (frontend/backend).
   * Triggered whenever the `user` object changes.
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get("projects/", {
          params: { email: user.email, frontend: user.frontend, backend: user.backend },
        });
        setProjects(response.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, refresh]);

  /** ------------------------------------------------------------------------
   * @function handleMessageChange
   * @description Handles message input changes, limits characters to 400, and updates the counter.
   * ------------------------------------------------------------------------ */
  const handleMessageChange = (e) => {
    const value = e.target.value;
    if (value.length > 400) return;
    setCount(value.length);
    setMessage(value);
  };

  /** ------------------------------------------------------------------------
   * @function authenticateData
   * @description Validates message and project selection, constructs the join request payload,
   * and sends it to the backend API. Also triggers dashboard refresh.
   * ------------------------------------------------------------------------ */
  const authenticateData = async () => {
    const final_message = message.trim();
    if (final_message.length < 10) {
      setError("Message is too short");
      return;
    }

    if (!selectedProject?.owner_email || !selectedProject?.projectname) {
      setError("No Project Selected");
      return;
    }

    const new_request = {
      owner_email: selectedProject.owner_email,
      projectname: selectedProject.projectname,
      member_email: user.email,
      message: final_message,
    };

    try {
      await axiosInstance.post("projectrequests/", new_request);
      setSuccess("Request sent successfully!");
      triggerRefresh();
      setRefresh((prev) => !prev);
      setSelectedProject(null);
      setMessage("");
      setCount(0);
    } catch (err) {
      console.log("An Error occurred ", err);
      setError("Failed to send request. Try Again");
    }
  };

  /** ------------------------------------------------------------------------
   * @function handleSubmit
   * @description Prevents default form submission and sends request.
   * ------------------------------------------------------------------------ */
  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateData();
  };

  /** ------------------------------------------------------------------------
   * @function handleErrorClose
   * @description Closes error toast.
   * ------------------------------------------------------------------------ */
  const handleErrorClose = () => setError("");

  /* -------------------------------------------------------------------------------------------------
   * Conditional Rendering: Loading State
   * -------------------------------------------------------------------------------------------------*/
  if (loading) {
    return <p className="text-center text-gray-500 mt-8 animate-pulse">Loading projects...</p>;
  }

  /* -------------------------------------------------------------------------------------------------
   * JSX: UI Rendering
   * -------------------------------------------------------------------------------------------------*/
  return (
    <div className="p-8 relative w-full">
      {/* --------------------------- Container --------------------------- */}
      <div className="relative w-full flex flex-col lg:flex-row gap-8">
        {/* --------------------------- Project Grid / List --------------------------- */}
        <div
          className={`flex-1 transition-all duration-500 ease-in-out ${
            selectedProject ? "lg:w-1/2 scale-95 opacity-90" : "w-full scale-100 opacity-100"
          }`}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Users className="text-indigo-600" size={28} />
            Join a Team
          </h2>

          {projects.length === 0 ? (
            <p className="text-gray-500 text-center">
              No teams available to join currently. Check back later!
            </p>
          ) : (
            <div
              className={`grid gap-6 ${
                selectedProject
                  ? "grid-cols-1"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
              }`}
            >
              {projects.map((team) => (
                <div
                  key={team.id || team.projectname}
                  onClick={() =>
                    setSelectedProject((prev) =>
                      prev?.projectname === team.projectname ? null : team
                    )
                  }
                  className={`relative cursor-pointer flex flex-col p-5 rounded-3xl transition-transform duration-300 ease-in-out
                    ${
                      selectedProject?.projectname === team.projectname
                        ? "bg-gradient-to-r from-indigo-50 via-white to-indigo-50 border-2 border-indigo-600 shadow-2xl transform scale-105"
                        : "bg-white border border-gray-200 shadow hover:shadow-2xl hover:scale-105"
                    }
                  `}
                >
                  {/* Card content */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Layers className="text-indigo-600" size={18} />
                        {team.projectname}
                      </h3>
                      <p className="text-gray-500 text-sm mt-2">
                        Owner: <span className="text-gray-700 font-medium">{team.fname} {team.lname}</span>
                      </p>

                      <p className="text-gray-500 text-sm mt-3 line-clamp-3">
                        {team.description
                          ? team.description.slice(0, 120) +
                            (team.description.length > 120 ? "…" : "")
                          : "No description provided."}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {team.frontend && (
                          <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-50 to-indigo-50/40 border border-indigo-200/60 shadow-sm hover:shadow-md">
                            <Code className="w-4 h-4 text-indigo-600" />
                            <span className="text-indigo-700">Frontend</span>
                          </span>
                        )}
                        {team.backend && (
                          <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-50 to-green-50/40 border border-green-200/60 shadow-sm hover:shadow-md">
                            <Monitor className="w-4 h-4 text-green-600" />
                            <span className="text-green-700">Backend</span>
                          </span>
                        )}
                        {team.fullstack && (
                          <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-50 to-purple-50/40 border border-purple-200/60 shadow-sm hover:shadow-md">
                            <Server className="w-4 h-4 text-purple-600" />
                            <span className="text-purple-700">Full Stack</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-gray-400">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --------------------------- Right Panel --------------------------- */}
        {selectedProject && (
        <div
          className="absolute lg:relative top-20 right-0 w-full lg:w-1/2 bg-white rounded-3xl shadow-2xl p-8 h-[85vh] overflow-y-auto flex-none transition-transform duration-300 ease-in-out transform lg:translate-x-0"
        style={{ zIndex: 20 }}
          >

            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-indigo-700 mb-2 flex items-center gap-2">
                  <MessageCircle size={22} /> {selectedProject.projectname}
                </h2>
                <p className="text-gray-700 mb-4 whitespace-pre-line">
                  {selectedProject.description || "No description provided."}
                </p>

                <p className="text-gray-500 mb-2">
                  Owner:{" "}
                  <span className="text-gray-700 font-medium">
                    {selectedProject.fname} {selectedProject.lname}
                  </span>
                </p>
                <p className="text-gray-500 mb-4">
                  Email: <span className="text-gray-700">{selectedProject.owner_email}</span>
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                  {selectedProject.frontend && (
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-50 to-indigo-50/40 border border-indigo-200/60 shadow-sm">
                      <Code className="w-4 h-4 text-indigo-600" />
                      <span className="text-indigo-700">Frontend</span>
                    </span>
                  )}
                  {selectedProject.backend && (
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-50 to-green-50/40 border border-green-200/60 shadow-sm">
                      <Monitor className="w-4 h-4 text-green-600" />
                      <span className="text-green-700">Backend</span>
                    </span>
                  )}
                  {selectedProject.fullstack && (
                    <span className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-50 to-purple-50/40 border border-purple-200/60 shadow-sm">
                      <Server className="w-4 h-4 text-purple-600" />
                      <span className="text-purple-700">Full Stack</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="hidden lg:flex items-start">
                <button
                  onClick={() => {
                    setSelectedProject(null);
                  }}
                  aria-label="close panel"
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-md"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4">
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Write a personalized message..."
                className="w-full h-32 resize-none p-4 rounded-2xl border border-gray-300 focus:border-indigo-500 outline-none transition bg-gray-50 shadow-sm hover:shadow-md"
              ></textarea>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">{count}/400 characters</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMessage("");
                      setCount(0);
                    }}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-2xl font-semibold hover:bg-indigo-700 transition active:scale-95 shadow-md flex items-center gap-2"
                  >
                    <ArrowRight size={16} /> Send Request
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* --------------------------- Toasts --------------------------- */}
      {error && (
        <div className="mt-4">
          <ErrorToast error={error} onClose={handleErrorClose} />
        </div>
      )}
      {success && (
        <div className="mt-4">
          <SuccessToast message={success} onClose={() => setSuccess("")} />
        </div>
      )}
    </div>
  );
}

export default JoinTeam;