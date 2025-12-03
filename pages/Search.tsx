import React, { useState } from 'react';
import { Search as SearchIcon, Play, Filter, Loader2, Info } from 'lucide-react';
import { GeminiService } from '../services/gemini';
import { Video } from '../types';

interface SearchProps {
  onNavigate: (page: string, data?: any) => void;
}

const Search: React.FC<SearchProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const videos = await GeminiService.searchEducationalVideos(query);
      setResults(videos);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto min-h-[80vh]">
      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight">What do you want to learn today?</h1>
        <p className="text-slate-500 text-lg mb-8">AI-curated educational content, filtered for clarity.</p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. 'Calculus Derivatives', 'History of Rome', 'Python Basics'..."
            className="w-full p-4 pl-12 rounded-2xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none text-lg transition-all shadow-sm"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-6 py-2 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 font-medium"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </form>
        
        {!process.env.API_KEY && (
             <p className="mt-4 text-amber-600 text-sm bg-amber-50 inline-block px-4 py-2 rounded-lg border border-amber-200">
               <Info className="w-4 h-4 inline mr-2"/>
               Note: API_KEY is required for live AI results.
             </p>
        )}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
           {[1, 2, 3, 4, 5, 6].map((i) => (
             <div key={i} className="bg-white rounded-2xl h-80 border border-slate-100"></div>
           ))}
        </div>
      )}

      {!isLoading && hasSearched && results.length === 0 && (
         <div className="text-center py-20 text-slate-400">
           <div className="bg-slate-50 inline-block p-6 rounded-full mb-4">
             <Filter className="w-10 h-10" />
           </div>
           <p className="text-xl">No pure educational content found.</p>
           <p className="text-sm mt-2">Our AI filter is strict! Try broadening your search terms.</p>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {results.map((video) => (
          <div 
            key={video.id} 
            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
            onClick={() => onNavigate('watch', video)}
          >
            <div className="relative aspect-video bg-slate-100">
              <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                {video.difficulty}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all drop-shadow-lg" />
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-2 flex flex-wrap gap-2">
                {video.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2">
                {video.title}
              </h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
                {video.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-slate-700 font-medium text-sm">{video.channelTitle}</span>
                <span className="text-primary-500 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                  Watch Now &rarr;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;