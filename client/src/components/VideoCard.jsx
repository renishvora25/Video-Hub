import React from 'react';

export default function VideoCard({ video }) {
  if (!video) return null;

  return (
    <div className="group flex flex-col cursor-pointer bg-white rounded-2xl p-3 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      
      {/* Thumbnail Box */}
      <div className="relative aspect-video w-full rounded-xl bg-neutral-200 overflow-hidden mb-3">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Duration Tag */}
        <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-[2px] text-[11px] font-bold text-white px-1.5 py-0.5 rounded-md tracking-wider">
          {video.duration}
        </span>
      </div>

      {/* Video Meta Row */}
      <div className="flex gap-3 px-1">
        <div className="w-9 h-9 rounded-full bg-neutral-200 border border-gray-100 overflow-hidden flex-shrink-0">
          <img 
            src={video.owner?.avatar || 'https://via.placeholder.com/150'} 
            alt={video.owner?.username} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug transition-colors duration-300 group-hover:text-[#C85C2C] mb-1">
            {video.title}
          </h3>
          <p className="text-xs text-gray-500 font-medium truncate mb-0.5">
            @{video.owner?.username}
          </p>
          <p className="text-[11px] font-medium text-gray-400">
            {video.views} &bull; {video.createdAt}
          </p>
        </div>
      </div>

    </div>
  );
}