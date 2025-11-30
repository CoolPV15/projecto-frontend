/**
 * @file DashboardContext.jsx
 * @description Manages global dashboard refresh triggers so that components such as
 *              JoinTeam, CreateTeam, and MyTeams can request the dashboard to re-fetch
 *              project counts or update UI when changes occur.
 */

import React, { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [refreshDashboard, setRefreshDashboard] = useState(false);

  /** ------------------------------------------------------------------------
   * @function triggerRefresh
   * @description Flips the refreshDashboard flag to notify all subscribed components
   *              to re-fetch their data. Used after operations like joining a team,
   *              leaving a team, or creating a team.
   * ------------------------------------------------------------------------ */
  const triggerRefresh = () => {
    setRefreshDashboard((prev) => !prev);
  };

  return (
    <DashboardContext.Provider value={{ refreshDashboard, triggerRefresh }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
