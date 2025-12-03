import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { Video } from '../types';
import { Play, Trash2, Search } from 'lucide-react';

interface LibraryProps {
  onNavigate: (page: string, data?: any) => void;
}

const Library: React.FC<LibraryProps> = ({ onNavigate }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setVideos(StorageService.getSavedVideos());
  }, []);

  const removeVideo = (e: React.MouseEvent, video: Video) => {
    e.stopPropagation();
    StorageService.toggleSaveVideo(video);
    setVideos(StorageService.getSavedVideos());
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(filter.toLowerCase()) || 
    v.channelTitle.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">My Library</h1>
          <p className="text-slate-500">Your collection of focused learning materials.</p>
        </div>
        <div className="relative mt-4 md:mt-0 w-full md:w-64">
          <input
            type="text"
            placeholder="Filter library..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
           <p className="text-slate-400 text-lg mb-4">Your library is empty.</p>
           <button 
             onClick={() => onNavigate('search')}
             className="text-primary-600 font-semibold hover:underline"
           >
             Go explore some content
           </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
             <div 
             key={video.id} 
             className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
             onClick={() => onNavigate('watch', video)}
           >
             <div className="relative aspect-video bg-slate-200">
               <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Play className="w-12 h-12 text-white fill-current" />
               </div>
             </div>
             <div className="p-4 pr-10">
               <h3 className="font-semibold text-slate-800 line-clamp-2 mb-1">{video.title}</h3>
               <p className="text-sm text-slate-500">{video.channelTitle}</p>
             </div>
             
             <button
                onClick={(e) => removeVideo(e, video)}
                className="absolute bottom-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Remove from Library"
             >
               <Trash2 className="w-5 h-5" />
             </button>
           </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;