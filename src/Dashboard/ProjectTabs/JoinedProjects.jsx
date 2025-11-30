/**
 * @file JoinedProjects.jsx
 * @description
 * This component displays all projects that the currently logged-in user has joined.
 * It allows expanding each project to view its members, fetches data from backend
 * APIs, and handles loading states, errors, and UI transitions.
 *
 * @author Pranav Singh
 */

import {
  ChevronRight,
  ChevronDown,
  Users,
  Loader2,
} from "lucide-react";
import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider.jsx";

/**
 * @component JoinedProjects
 * @description
 * Main component responsible for fetching the user's joined projects and displaying
 * them in an expandable card format. Each project card reveals its members on expand.
 */
function JoinedProjects() {
  const { user } = useContext(AuthContext);

  const [joinedProjects, setJoinedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [expandedProject, setExpandedProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);

  /**
   * @function useEffect
   * @description Fetches all projects joined by the logged-in user using their email.
   * Sets the project list into state and manages loading state.
   */
  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/joinedprojects/",
          {
            params: { email: user.email },
          }
        );
        setJoinedProjects(response.data || []);
      } catch (err) {
        console.log("Error fetching projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  /**
   * @function fetchMembers
   * @description Fetches all team members belonging to a specific project.
   *
   * @param {Object} project - The selected project object.
   * @param {string} project.owner_email - Owner's email used for backend query.
   * @param {string} project.projectname - Name of the project to fetch members for.
   */
  const fetchMembers = async (project) => {
    setMembersLoading(true);

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/projectmembersdisplay/",
        {
          params: {
            email: project.owner_email,
            projectname: project.projectname,
          },
        }
      );

      setMembers(response.data || []);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setMembersLoading(false);
    }
  };

  /**
   * @function handleToggleProject
   * @description Expands or collapses the project card. If expanded, project
   * members will be fetched from the backend.
   *
   * @param {Object} project - Project to expand or collapse.
   */
  const handleToggleProject = (project) => {
    if (expandedProject === project.projectname) {
      setExpandedProject(null);
      setMembers([]);
    } else {
      setExpandedProject(project.projectname);
      fetchMembers(project);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading joined teams...
      </div>
    );
  }

  if (joinedProjects.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        <Users size={40} className="mx-auto mb-3 text-gray-400" />
        <p>No teams joined currently</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {joinedProjects.map((project) => (
        <div
          key={project.projectname}
          className="bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-2xl transition p-6 hover:scale-[1.01]"
        >
          {/* ------------------------------ Project Header ------------------------------ */}
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => handleToggleProject(project)}
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 px-5 mt-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                {project.projectname
                  ? project.projectname.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-indigo-600">
                  {project.projectname}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {project.description || "No description available."}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Owner:{" "}
                  <span className="font-medium">
                    {project.owner_fname} {project.owner_lname}
                  </span>{" "}
                  ({project.owner_email})
                </p>
              </div>
            </div>

            {expandedProject === project.projectname ? (
              <ChevronDown className="text-gray-500" />
            ) : (
              <ChevronRight className="text-gray-500" />
            )}
          </div>

          {/* ----------------------------- Members Section ------------------------------ */}
          {expandedProject === project.projectname && (
            <div className="mt-6 border-t pt-6">
              {membersLoading ? (
                <div className="flex items-center justify-center py-6 text-gray-500">
                  <Loader2 className="animate-spin mr-2" /> Loading members...
                </div>
              ) : members.length === 0 ? (
                <p className="text-gray-500 text-sm italic">
                  No team members yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {members.map((m, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-indigo-50 to-white border border-gray-200 rounded-xl shadow-md p-4 hover:shadow-lg transition transform hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold shadow">
                          {m.member_fname
                            ? m.member_fname.charAt(0).toUpperCase()
                            : "M"}
                        </div>

                        <div>
                          <p className="font-medium text-gray-800">
                            {m.member_fname} {m.member_lname}
                          </p>
                          <p className="text-sm text-gray-500">
                            {m.member_email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default JoinedProjects;
