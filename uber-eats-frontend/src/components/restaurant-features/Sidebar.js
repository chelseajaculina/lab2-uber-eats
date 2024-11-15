// Sidebar.js
import React from 'react';
import './Sidebar.css'; // Create CSS file for styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Uber Eats</h2>
      <ul>
        <li>Home</li>
        <li>Feedback</li>
        <li>Reports</li>
        <li>Payments</li>
        <li>Menu</li>
        <li>Holiday Hours</li>
        <li>Marketing</li>
        <li>Preparation Times</li>
        <li>Users</li>
        <li>Documents</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
