/**
 * @file createteam.jsx
 * @description 
 * React component that allows authenticated users to create a new project team
 * by specifying project details and team requirements. The component interacts
 * with a backend API to submit the project information.
 * @author Pranav Singh
 */

import React, { useState, useContext } from "react";
import axios from "axios";
import axiosInstance from "../Interceptors/axiosInstance";
import { AuthContext } from "../context/AuthProvider.jsx";
import SuccessToast from "../toasts/SuccessToast.jsx";
import { useDashboard } from "../context/DashboardContext.jsx";
import {
  Code2,
  FileText,
  Users,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import ErrorToast from "../toasts/ErrorToast.jsx";

/**
 * @component CreateTeam
 * @description
 * This component provides a user interface for project leads to create new teams.
 * It allows them to:
 *  - Enter a project name and description.
 *  - Select the type of developers required (frontend, backend, or both).
 *  - Submit project details to the backend API for storage.
 *  - View a live preview of the project information as they fill out the form.
 */

function CreateTeam() {
  /** --------------------------- State Management --------------------------- */
  const { triggerRefresh } = useDashboard();
  const [refresh, setRefresh] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [need, setNeed] = useState({ frontend: true, backend: true });
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);

  // Accessing logged-in user data from global AuthContext
  const { user } = useContext(AuthContext);


  /** ------------------------------------------------------------------------
   * @function handleProjectDescription
   * @description Updates project description while enforcing a maximum limit of 250 characters.
   *              Displays an error if the limit is exceeded.
   * @param {Event} event - Input change event
   * ------------------------------------------------------------------------ */
  const handleProjectDescription = (event) => {
    const value = event.target.value;
    if (value.length > 500) {
      setError("Project description must not exceed 500 words.");
      return;
    }
    setError("");
    setCount(value.length);
    setProjectDescription(value);
  };

  /** ------------------------------------------------------------------------
   * @function postProject
   * @description Sends a POST request to the backend API with the project data.
   *              On successful submission, it triggers a success toast message.
   * ------------------------------------------------------------------------ */
  const postProject = async () => {
    const project = {
      email: user.email,
      projectname: projectName,
      description: projectDescription,
      frontend: need.frontend,
      backend: need.backend,
    };

    try {
      await axiosInstance.post("api/projectleads/", project);
      console.log("Project Created Successfully");
      setCreated(true);
      triggerRefresh();
      setRefresh(prev => !prev);
    } catch (error) {
      console.error("An error occurred while creating the project:", error);
      setError("An error occurred while creating the project. Please try again.");
    }
  };

  /** ------------------------------------------------------------------------
   * @function handleSubmit
   * @description Handles form submission, validates input fields, and triggers
   *              the project creation request.
   * @param {Event} e - Form submission event
   * ------------------------------------------------------------------------ */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (count > 500) {
      setError("Project description must not exceed 500 words.");
      return;
    }
    setError("");
    postProject();
  };

  /** ------------------------------------------------------------------------
   * @function closePopUp
   * @description Closes the success toast popup after project creation.
   * ------------------------------------------------------------------------ */
  const closePopUp = () => {
    setCreated(false);
  };

  /** --------------------------- JSX Structure --------------------------- */
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg border border-gray-200 p-8 flex flex-col lg:flex-row gap-10">

      {/* --------------------------- Form Section --------------------------- */}
      <div className="flex-1">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-8">
          <Code2 className="text-blue-600" /> Create a New Team
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* --------------------------- Project Name Input --------------------------- */}
          <div>
            <label htmlFor="pname" className="block text-gray-700 font-medium mb-2">
              Project Name
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                id="pname"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                required
                className="w-full border border-gray-300 rounded-xl pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              />
            </div>
          </div>

          {/* --------------------------- Project Description Input --------------------------- */}
          <div>
            <label htmlFor="desc" className="block text-gray-700 font-medium mb-2">
              Project Description (max 500 words)
            </label>
            <textarea
              id="desc"
              value={projectDescription}
              onChange={handleProjectDescription}
              placeholder="Describe your project..."
              rows="5"
              required
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            ></textarea>
            <div className="flex justify-between mt-1">
              <p className="text-sm text-gray-500">Word Count: {count}/500</p>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>

          {/* --------------------------- Team Requirements --------------------------- */}
          <div>
            <label htmlFor="req" className="block text-gray-700 font-medium mb-3">
              Team Requirements
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  id="req"
                  type="radio"
                  name="requirement"
                  value="frontend"
                  checked={need.frontend && !need.backend}
                  onChange={() => setNeed({ frontend: true, backend: false })}
                  className="accent-blue-600"
                />
                Frontend Devs
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="requirement"
                  value="backend"
                  checked={!need.frontend && need.backend}
                  onChange={() => setNeed({ frontend: false, backend: true })}
                  className="accent-blue-600"
                />
                Backend Devs
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="requirement"
                  value="both"
                  checked={need.frontend && need.backend}
                  onChange={() => setNeed({ frontend: true, backend: true })}
                  className="accent-blue-600"
                />
                Both
              </label>
            </div>
          </div>

          {/* --------------------------- Submit Button --------------------------- */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Create Team
            </button>
          </div>

          {/* --------------------------- Success Toast --------------------------- */}
          {created && (
            <SuccessToast
              message="Project Created Successfully! Your team is now visible to other users."
              onClose={closePopUp}
            />
          )}
        </form>
      </div>

      {/* --------------------------- Live Project Preview --------------------------- */}
      <div className="hidden lg:flex flex-col flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-gray-200 shadow-inner">
        <h3 className="font-semibold text-gray-800 text-xl mb-4 flex items-center gap-2">
          <Users className="text-blue-600" /> Project Summary
        </h3>
        <div className="space-y-4 text-gray-700">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="font-semibold text-gray-800">
              {projectName || "No name entered yet"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="text-gray-700 leading-relaxed">
              {projectDescription || "Start typing your project idea..."}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Team Requirement</p>
            <div className="flex gap-2 mt-1">
              {need.frontend && (
                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                  Frontend
                </span>
              )}
              {need.backend && (
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                  Backend
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2">
            {created ? (
              <CheckCircle2 className="text-green-600" />
            ) : (
              <AlertTriangle className="text-yellow-600" />
            )}
            <p className="text-sm text-gray-600">
              {created
                ? "Team successfully created."
                : "Fill in the details to preview your project information."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTeam;