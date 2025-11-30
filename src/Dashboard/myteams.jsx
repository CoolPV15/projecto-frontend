/**
 * @file myteams.jsx
 * @description 
 * React component that serves as a central hub for users to manage their teams.
 * It provides a tabbed interface to view created teams, pending join requests,
 * and teams the user has already joined. The component dynamically switches 
 * between views without reloading the page.
 * @author Pranav Singh
 */

import { useState, useEffect} from "react";
import { Users, Clock, CheckCircle2 } from "lucide-react";
import PendingProjects from "./ProjectTabs/RequestedProjects.jsx";
import JoinedProjects from "./ProjectTabs/JoinedProjects.jsx";
import LeadProjects from "./ProjectTabs/LeadProjects.jsx";

/**
 * @component MyTeams
 * @description
 * This component acts as a container that organizes different team-related views
 * under an interactive tab-based interface.
 * 
 * @features
 *  - Displays three tabs: Created Teams, Pending Requests, and Joined Teams.
 *  - Allows seamless tab switching with visual indicators for the active tab.
 *  - Loads corresponding subcomponents (`LeadProjects`, `PendingProjects`, `JoinedProjects`)
 *    dynamically based on the selected tab.
 */

function MyTeams(Tab="created") {
  /** --------------------------- State Management --------------------------- */
  // Tracks which tab is currently active: "created", "pending", or "joined".
  const [activeTab, setActiveTab] = useState("created");

  /** ------------------------------------------------------------------------
   * @function UseEffect (Triggers on change in "Tab" object)
   * @description Listens for change in "Tab" object and sets the ActiveTab
   *              based on the change.
   */
  useEffect(() =>{
    if(Tab.val!="") setActiveTab(Tab.val);
  },[Tab])

  /** --------------------------- JSX Structure --------------------------- */
  return (
    <div className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-200">
      {/* --------------------------- Header Section --------------------------- */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-8 flex items-center gap-2">
        <Users size={22} className="text-indigo-600" />
        My Teams
      </h2>

      {/* --------------------------- Tab Navigation --------------------------- */}
      <div className="flex gap-6 mb-6 border-b border-gray-200">
        {/* Created Teams Tab */}
        <button
          onClick={() => setActiveTab("created")}
          className={`flex items-center gap-2 pb-3 font-medium transition ${
            activeTab === "created"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Users size={18} />
          Created Teams
        </button>

        {/* Pending Requests Tab */}
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 pb-3 font-medium transition ${
            activeTab === "pending"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Clock size={18} />
          Pending Requests
        </button>

        {/* Joined Teams Tab */}
        <button
          onClick={() => setActiveTab("joined")}
          className={`flex items-center gap-2 pb-3 font-medium transition ${
            activeTab === "joined"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <CheckCircle2 size={18} />
          Joined Teams
        </button>
      </div>

      {/* --------------------------- Tab Content --------------------------- */}
      <div className="mt-4">
        {activeTab === "created" && <LeadProjects />}
        {activeTab === "pending" && <PendingProjects />}
        {activeTab === "joined" && <JoinedProjects />}
      </div>
    </div>
  );
}

export default MyTeams;