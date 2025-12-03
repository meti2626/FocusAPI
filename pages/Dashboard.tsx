import React, { useEffect, useState } from 'react';
import { Play, TrendingUp, Clock, Award } from 'lucide-react';
import { StorageService } from '../services/storage';
import { UserProfile, Video } from '../types';

interface DashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedVideos, setSavedVideos] = useState<Video[]>([]);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setProfile(StorageService.getProfile());
    setSavedVideos(StorageService.getSavedVideos().slice(0, 3));
    
    // Simple motivational quotes rotation
    const quotes = [
      "The expert in anything was once a beginner.",
      "Focus is the key to all thinking.",
      "Learning never exhausts the mind.",
      "Study hard what interests you the most."
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header / Welcome */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {profile.name}</h1>
        <p className="text-slate-500 italic">"{quote}"</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Time Learned</p>
            <p className="text-2xl font-bold text-slate-800">{profile.totalMinutesLearned}m</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Daily Streak</p>
            <p className="text-2xl font-bold text-slate-800">{profile.streakDays} Days</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Topics Mastered</p>
            <p className="text-2xl font-bold text-slate-800">{profile.topicsCompleted}</p>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Continue Learning</h2>
          <button 
            onClick={() => onNavigate('library')}
            className="text-primary-600 text-sm font-medium hover:underline"
          >
            View Library
          </button>
        </div>

        {savedVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedVideos.map((video) => (
              <div 
                key={video.id} 
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => onNavigate('watch', video)}
              >
                <div className="relative aspect-video bg-slate-200">
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-6 h-6 text-slate-900 fill-current ml-1" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 line-clamp-2 mb-1">{video.title}</h3>
                  <p className="text-sm text-slate-500">{video.channelTitle}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-slate-500 mb-4">You haven't saved any videos yet.</p>
            <button 
              onClick={() => onNavigate('search')}
              className="bg-primary-500 text-white px-6 py-2 rounded-full hover:bg-primary-600 transition-colors"
            >
              Start Exploring
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-2xl font-bold mb-2">Ready for a focus session?</h2>
          <p className="text-primary-100 mb-6">Activate the timer and block out distractions for the next 25 minutes.</p>
          <button 
             onClick={() => {
                // Trigger the Pomodoro timer somehow.
                // For simplicity, we assume the user clicks the floating button, 
                // but we could lift state up to trigger it.
                // Here we just guide them.
             }}
             className="bg-white text-primary-700 px-6 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Start Timer (Bottom Right)
          </button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
           <Clock className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;