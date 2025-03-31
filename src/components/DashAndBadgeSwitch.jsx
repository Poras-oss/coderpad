import { useState } from 'react';
import Dashboard from './Dashboard';
import BadgesAndAchievements from './BadgesAndAchievements';

const NavSwitcher = () => {
  const [activeTab, setActiveTab] = useState('recent');

  return (
    <div className="w-full mx-auto p-4">
      {/* Navigation Tabs */}
      <nav className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('recent')}
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'recent'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`py-2 px-4 font-medium text-sm focus:outline-none ${
            activeTab === 'live'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Badges
        </button>
      </nav>

      {/* Content Area */}
      <div className="">
        {activeTab === 'recent' && (
          <div className="p-4">
            <Dashboard />
            {/* Your recent submissions content here */}
          </div>
        )}
        {activeTab === 'live' && (
          <div className="p-4">
            <BadgesAndAchievements />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavSwitcher;