import React from 'react';
import VideoCard from '../components/VideoCard.jsx';

const mockVideos = [
  {
    _id: "1",
    title: "The Evolution of Archival Film Restoration Techniques",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&auto=format&fit=crop",
    duration: "12:45",
    views: "45K views",
    createdAt: "2 days ago",
    owner: {
      username: "cinemahistorians",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop"
    }
  },
  {
    _id: "2",
    title: "Shadow Play: Mastering Dynamic Cinematic Lighting Setups",
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500&auto=format&fit=crop",
    duration: "08:22",
    views: "128K views",
    createdAt: "1 week ago",
    owner: {
      username: "design_theory",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop"
    }
  },
  {
    _id: "3",
    title: "Inside the Vault: Preserving 100-Year-Old Film Rolls",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop",
    duration: "24:10",
    views: "93K views",
    createdAt: "3 days ago",
    owner: {
      username: "archive_proj",
      avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=80&auto=format&fit=crop"
    }
  }
];

export default function Home() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-8">
        {mockVideos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}