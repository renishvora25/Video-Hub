import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import VideoCard from '../components/VideoCard.jsx';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const userResponse = await axios.get('/api/v1/users/current-user', {
          withCredentials: true,
        });

        console.log("StreamVault Core User Payload:", userResponse.data);

        const userData = 
          userResponse.data?.data?.user || 
          userResponse.data?.data || 
          userResponse.data?.user || 
          userResponse.data;

        setUser(userData);

        try {
          const videosResponse = await axios.get('/api/v1/videos/my-videos', {
            withCredentials: true,
          });
          setVideos(videosResponse.data?.data || []);
        } catch (vidErr) {
          console.log("Video sub-routes offline. Loading design canvas fallback data.");
          setVideos([
            {
              _id: "v1",
              title: "The Evolution of Archival Film Restoration Techniques",
              thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&auto=format&fit=crop",
              duration: "12:45",
              views: "45K views",
              createdAt: "2 days ago",
              owner: {
                username: userData?.username || "creator",
                avatar: userData?.avatar
              }
            }
          ]);
        }

      } catch (err) {
        console.error("Core profile fetch failed:", err);
        setError(err.response?.data?.message || "Failed to load core profile account data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-sm font-semibold text-gray-500">
        Loading Archive Profile...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center py-12 text-red-500 font-medium bg-red-50/50 rounded-xl max-w-xl mx-auto mt-10 p-6 border border-red-100">
        <p className="font-bold mb-1">Profile Loading Error</p>
        <p className="text-sm text-red-600">{error}</p>
        <p className="text-xs text-gray-400 mt-4">Check your Inspect {"->"} Console tab to see the backend response code.</p>
      </div>
    );
  }

  return (
    <div className="w-full -mt-6 lg:-mt-8 -mx-6 lg:-mx-8 px-6 lg:px-8 pb-10">
      <div className="w-full h-44 sm:h-56 rounded-2xl overflow-hidden relative border border-gray-200 shadow-sm bg-neutral-900">
        {user.coverImage ? (
          <img 
            src={user.coverImage} 
            alt="Channel banner" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center opacity-85">
            <span className="text-neutral-600 font-bold tracking-widest text-xs uppercase select-none">
              StreamVault Archive Header
            </span>
          </div>
        )}
      </div>

      <div className="px-4 sm:px-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 relative z-10">
        <div className="-mt-14 sm:-mt-20 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white p-1 shadow-md border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.fullname || "User avatar"} 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <FaUserCircle className="w-full h-full text-neutral-300 bg-white rounded-full" />
          )}
        </div>

        <div className="text-center sm:text-left pt-2 sm:pt-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-none">
            {user.fullname || "Anonymous Archiver"}
          </h2>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-2 gap-y-0.5 mt-2 text-sm sm:text-base text-gray-500 font-medium">
            <span className="text-[#C85C2C]">@{user.username || "unknown"}</span>
            <span className="text-gray-300">&bull;</span>
            <span>{user.subscribersCount || 0} subscribers</span>
          </div>
        </div>

      </div>

      <hr className="border-gray-200 mb-8 mx-4 sm:mx-8" />

      <div className="px-4 sm:px-8">
        <h3 className="text-base font-bold text-gray-900 mb-5 tracking-tight uppercase border-b-2 border-[#C85C2C] w-max pb-1.5">
          Videos
        </h3>

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
            <p className="text-sm text-gray-400 font-medium">No videos uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}