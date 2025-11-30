/**
 * @file home.jsx
 * @description 
 * Main dashboard component for authenticated users. It serves as the central navigation hub
 * allowing users to create new teams, join existing ones, and manage their current teams.
 * The component also handles authentication verification, token-based redirection, and 
 * user data retrieval via the backend API.
 * @author Pranav Singh
 */

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Interceptors/axiosInstance";
import axios from 'axios';
import Logout from "./Logout.jsx";
import CreateTeam from "./createteam.jsx";
import JoinTeam from "./jointeam.jsx";
import MyTeams from "./myteams.jsx";
import { AuthContext } from "../context/AuthProvider.jsx";
import { useDashboard } from "../context/DashboardContext.jsx";
import {
  Users,
  PlusCircle,
  LogOut,
  UserPlus,
  Layers,
  Clock,
} from "lucide-react";
import LeadProjects from "./ProjectTabs/LeadProjects.jsx";

/**
 * @component Home
 * @description
 * Acts as the main landing page for authenticated users after login.
 * Provides navigation to different project-related functionalities through
 * a sidebar — including creating, joining, and managing teams.
 *
 * @features
 *  - Validates authentication tokens and redirects unauthorized users.
 *  - Displays user information and activity stats.
 *  - Renders subcomponents dynamically based on the selected sidebar tab.
 */

function Home() {
  /** --------------------------- Context and Navigation --------------------------- */
  // Accessing authentication data and user login function from AuthContext.
  const { user, loginUser } = useContext(AuthContext);

  // Using Dashboard context to check for refresh to update the counts
  const { refreshDashboard } = useDashboard();

  // React Router navigation hook.
  const navigate = useNavigate();

  /** --------------------------- State Management --------------------------- */
  // Tracks which sidebar tab is currently active: "create", "join", or "teams".
  const [activeTab, setActiveTab] = useState("create");

  // Tracks which component to load in the ProjectTab: JoinedProjects, LeadProjects, RequestedProjects
  const [tab, setTab] = useState("");
  
  // Tracks the count of each of: "createdprojects", "joinedprojects", "pendingrequests"
  const [counts, setCounts] = useState({createdprojects: 0, joinedprojects: 0, pendingrequests: 0});
  /** ------------------------------------------------------------------------
   * @function useEffect (Authentication Check)
   * @description Checks for the presence of a valid access token on component mount.
   *              If no token exists, the user is redirected to the login page.
   *              If a token exists, it fetches authenticated user details.
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/");
      localStorage.setItem("islogged", false);
    } else {
      (async () => {
        try {
          const { data } = await axiosInstance.get("accounts/home/");
          loginUser(data);
        } catch (error) {
          console.log("Not Authorized");
          localStorage.setItem("islogged", false);
          navigate("/");
        }
      })();
    }
  }, []);

  /** ------------------------------------------------------------------------
   * @function useEffect (Storage Listener)
   * @description Listens for changes in localStorage to automatically
   *              redirect the user when logged out from another tab or window.
   * ------------------------------------------------------------------------ */
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "islogged" && event.newValue === "false") {
        navigate("/");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /** ------------------------------------------------------------------------
   * @function useEffect (Triggers on Dashboard Refresh)
   * @description Checks for dashboard refresh to update the counts of various
   *              tabs after receiving the counts from the backend.
   * ------------------------------------------------------------------------- */
  useEffect(() => {
    if(!user) return;

    const getCounts = async () => {
      try{
        const response = await axios.get("http://127.0.0.1:8000/api/projectcount/",{
          params: {email:user.email}
        });
        setCounts({createdprojects: response.data["createdprojects"], 
          joinedprojects: response.data["joinedprojects"], 
          pendingrequests: response.data["pendingrequests"]
        });
      }
      catch(err){
        console.log("Error occurred",err);
      }
    }

    getCounts();
  },[user, refreshDashboard])

  /** --------------------------- Dashboard Stats --------------------------- */
  const stats = [
    { label: "Teams Created", value: counts["createdprojects"] , className:"created", icon: <PlusCircle className="text-blue-500" /> },
    { label: "Teams Joined", value: counts["joinedprojects"], className:"joined", icon: <Users className="text-green-500" /> },
    { label: "Pending Requests", value: counts["pendingrequests"], className:"pending",icon: <Clock className="text-yellow-500" /> },
  ];

  /** --------------------------- JSX Structure --------------------------- */
  return (
    <div className="h-screen flex bg-gray-100">

      {/* --------------------------- Sidebar Section --------------------------- */}
      <div className="w-72 backdrop-blur-lg bg-white/70 shadow-xl border-r border-gray-200 flex flex-col rounded-r-3xl">
        {/* App Title */}
        <div className="flex items-center justify-center py-8 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">PROJECTO</h2>
        </div>

        {/* Sidebar Navigation Buttons */}
        <nav className="flex-1 px-6 py-8 space-y-3">
          <SidebarButton
            icon={<PlusCircle size={20} />}
            label="Create a Team"
            active={activeTab === "create"}
            onClick={() => setActiveTab("create")}
          />
          <SidebarButton
            icon={<UserPlus size={20} />}
            label="Join a Team"
            active={activeTab === "join"}
            onClick={() => setActiveTab("join")}
          />
          <SidebarButton
            icon={<Layers size={20} />}
            label="My Teams"
            active={activeTab === "teams"}
            onClick={() => setActiveTab("teams")}
          />
        </nav>

        {/* Logout Section */}
        <div className="border-t border-gray-200 p-6 mt-auto">
          <div className="flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition rounded-xl px-4 py-3">
            <Logout />
            <LogOut className="text-gray-700" size={20} />
          </div>
        </div>
      </div>

      {/* --------------------------- Main Content Section --------------------------- */}
      <div className="flex-1 p-8 overflow-y-auto relative">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 transform -translate-y-20 -translate-x-20"></div>

        {/* --------------------------- Header Section --------------------------- */}
        {user && (
          <div className="flex gap-4 mb-10 items-stretch justify-between w-full">
            {/* User Statistics */}
            <div className="flex gap-4 items-stretch flex-1">
              {stats.map((stat, index) => (
                <div
                  onClick={() => {setTab(stat.className), setActiveTab("teams")}}
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col items-center justify-center hover:shadow-md transition flex-1"
                >
                  <div className="mb-2">{stat.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* User Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm hover:shadow-md transition p-5 flex items-center space-x-4 w-[420px] flex-shrink-0">
              <div className="flex-shrink-0">
                <img
                  className="w-14 h-14 rounded-full object-cover border border-gray-200"
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="User Avatar"
                />
              </div>

              <div className="flex flex-col flex-grow">
                <p className="font-semibold text-lg text-gray-800">
                  {user.firstname} {user.lastname}
                </p>
                <p className="text-gray-500 text-sm mb-1">{user.email}</p>

                <div className="flex gap-2 mt-1">
                  {user.frontend && (
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                      Frontend
                    </span>
                  )}
                  {user.backend && (
                    <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                      Backend
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------- Dynamic Content Rendering --------------------------- */}
        {activeTab === "create" && <CreateTeam />}
        {activeTab === "join" && <JoinTeam />}
        {activeTab === "teams" && <MyTeams val={tab}/>}
      </div>
    </div>
  );
}

/**
 * @component SidebarButton
 * @description
 * Reusable button component for the sidebar navigation.
 *
 * @param {Object} props - Component props
 * @param {JSX.Element} props.icon - Icon displayed alongside the label
 * @param {string} props.label - Text label for the button
 * @param {boolean} props.active - Indicates whether the button is currently active
 * @param {Function} props.onClick - Callback triggered when the button is clicked
 */
function SidebarButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
        active
          ? "bg-blue-600 text-white shadow-md scale-[1.02]"
          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default Home;