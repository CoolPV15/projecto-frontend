/**
 * @file PendingProjects.jsx
 * @description
 * React component that displays all projects for which the logged-in user has sent a join
 * request and is awaiting approval. It retrieves data from the backend endpoint
 * `/api/pendingprojects/` using the user's email as a query parameter.
 *
 * @features
 * - Fetches all pending join requests for the authenticated user.
 * - Handles loading and empty states.
 * - Displays project details, owner info, and user's request message.
 *
 * @author Pranav Singh
 */

import { Clock, Mail, User } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/AuthProvider.jsx";
import { useContext, useEffect, useState } from "react";

/**
 * @component PendingProjects
 * @description
 * Functional component that fetches and renders all pending join requests sent by
 * the currently authenticated user.
 *
 * @returns {JSX.Element} A list of pending projects, or loading/empty state messages.
 */
function PendingProjects() {
  const { user } = useContext(AuthContext);

  const [pendingProjects, setPendingProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
  * @function useEffect
  * @description Fetches pending join requests for the authenticated user from the backend.
  * Updates the component state with the retrieved projects or an empty array if none found.
  */
  useEffect(() => {
    if (!user) return;
    const fetchPendingProjects = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${API_BASE}/api/pendingprojects/`,
          {
            params: { email: user.email },
          }
        );

        setPendingProjects(response.data || []);
      } catch (err) {
        console.error("Error fetching pending projects", err);
        setPendingProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingProjects();
  }, [user]);

  /**
   * @render
   * @description Renders loading, empty, or list of pending project requests.
   */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Clock className="animate-spin mr-2" /> Loading pending requests...
      </div>
    );
  }

  if (pendingProjects.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        <Clock size={40} className="mx-auto mb-3 text-gray-400" />
        <p>No pending requests currently</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pendingProjects.map((p, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-md transition"
        >
          {/* ----------------------------
                Project Title & Description with Avatar
              ---------------------------- */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 px-5 mt-1 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-lg shadow-sm">
              {p.projectname?.charAt(0)?.toUpperCase() || "P"}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-600">{p.projectname}</h3>
              <p className="text-sm text-gray-700 mt-1">{p.description}</p>
            </div>
          </div>

          {/* ----------------------------
                Owner Details
              ---------------------------- */}
          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p className="flex items-center">
              <User size={16} className="mr-1 text-gray-500" />
              Owner: {p.owner_fname} {p.owner_lname}
            </p>

            <p className="flex items-center">
              <Mail size={16} className="mr-1 text-gray-500" />
              {p.owner_email}
            </p>
          </div>

          {/* ----------------------------
                User's Join Request Message
              ---------------------------- */}
          <div className="mt-5 bg-gray-50 border-l-4 border-indigo-500 p-4 rounded-md">
            <h4 className="font-medium text-gray-800">Your Request Message:</h4>
            <p className="text-sm text-gray-600 mt-1 italic">"{p.message}"</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PendingProjects;