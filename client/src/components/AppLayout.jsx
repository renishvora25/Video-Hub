import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { FaHome, FaUsers, FaList, FaHistory, FaCog, FaQuestionCircle, FaSignOutAlt, FaSearch, FaUpload, FaBell, FaUserCircle } from 'react-icons/fa';

export default function AppLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/api/v1/users/current-user', { withCredentials: true })
      .then(res => {
        const userData = 
          res.data?.data?.user || 
          res.data?.data || 
          res.data?.user || 
          res.data;
          
        setUser(userData);
      })
      .catch(err => {
        console.log("Navbar session check paused or unauthorized:", err);
      });
  }, []);

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">

      {/* BLACK TOP NAVBAR*/}
      <header className="bg-black text-white h-16 min-h-16 flex items-center justify-between px-6 z-30 shadow-md">
        {/* Left: Brand Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight select-none cursor-pointer">
          Stream<span className="text-[#C85C2C]">Vault</span>
        </Link>

        {/* Middle: Centered Search Bar */}
        <div className="flex-1 max-w-xl mx-8 relative">
          <input 
            type="text" 
            placeholder="Search archives..." 
            className="w-full h-9 bg-neutral-900 border border-neutral-800 rounded-full pl-4 pr-10 text-sm text-gray-200 placeholder-neutral-500 focus:outline-none focus:border-[#C85C2C] focus:ring-1 focus:ring-[#C85C2C] transition-all"
          />
          <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm cursor-pointer hover:text-white" />
        </div>

        {/* Right: Functional Core Actions */}
        <div className="flex items-center gap-5">
          <button className="bg-[#C85C2C] hover:bg-[#b04f23] text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 transition-all shadow-sm">
            <FaUpload /> Upload
          </button>

          <button className="text-neutral-400 hover:text-white relative p-1 transition-colors">
            <FaBell className="text-lg" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#C85C2C] rounded-full"></span>
          </button>

          <Link 
            to="/profile" 
            className="w-8 h-8 rounded-full bg-neutral-950 border border-neutral-800 overflow-hidden cursor-pointer hover:scale-105 active:scale-95 transition-all block flex items-center justify-center"
            title={user?.fullname || "View Profile"}
          >
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt="User profile" 
                className="w-full h-full object-cover"
              />
            ) : (

              <FaUserCircle className="w-full h-full text-neutral-400 bg-neutral-900" />
            )}
          </Link>
        </div>
      </header>

      {/* INNER APPLAYOUT FRAMEWORK */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Navigation Drawer */}
        <aside className="w-60 bg-white border-r border-gray-100 flex flex-col justify-between p-4 h-full">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">Library</p>
              <nav className="space-y-1">
                <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#C85C2C] bg-orange-50/50 transition-all">
                  <FaHome className="text-lg" /> Home
                </Link>
                <Link to="/subscriptions" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                  <FaUsers className="text-lg text-gray-400" /> Subscriptions
                </Link>
                <Link to="/playlists" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                  <FaList className="text-lg text-gray-400" /> Playlists
                </Link>
                <Link to="/history" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                  <FaHistory className="text-lg text-gray-400" /> History
                </Link>
              </nav>
            </div>
          </div>

          <div className="space-y-1 border-t border-gray-100 pt-4">
            <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
              <FaCog className="text-lg" /> Settings
            </Link>
            <Link to="/help" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
              <FaQuestionCircle className="text-lg" /> Help
            </Link>
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50/50 transition-all text-left"
            >
              <FaSignOutAlt className="text-lg" /> Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}