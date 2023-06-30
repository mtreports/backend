import React from "react";

const ThemeLoading = () => {
  return (
    <>
      <div id="spinner" className="loading-suspense w-full h-screen p-6 text-lg font-medium text-gray-600">
      <div className="text-data-loading">Syncing Data...</div>
      </div>
     
    </>
  );
};

export default ThemeLoading;
