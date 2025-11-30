/**
 * @file LeftPane.jsx
 * @description
 * Left-side visual component for authentication screens.
 * Displays the site name and a brief description using a blue gradient background.
 * @author Pranav Singh
 */

export default function LeftPane() {
  return (
    <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-b from-blue-700 to-blue-500 w-full md:w-1/2 h-screen p-10">
      <h1
        id="sitename"
        className="text-[80px] text-[darkblue] font-[Verdana] font-extrabold mb-4 tracking-wide"
      >
        PROJECTO
      </h1>
      <h3
        id="sitedsc"
        className="text-[medium] text-[navy] font-[Verdana] text-center font-medium"
      >
        PROJECT COLLABORATION PLATFORM
      </h3>
    </div>
  );
}