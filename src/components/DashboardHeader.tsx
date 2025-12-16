"use client";

import React from "react";

const DashboardHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FinFlow</h1>
        <p className="text-gray-600 dark:text-gray-400">Your personal finance navigator</p>
      </div>
    </div>
  );
};

export default DashboardHeader;