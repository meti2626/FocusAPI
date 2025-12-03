import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { PomodoroTimer } from './components/PomodoroTimer';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Watch from './pages/Watch';
import Library from './pages/Library';
import { Menu } from 'lucide-react';
import { Video } from './types';

const App: React.FC = () => {
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleNavigate = (targetPage: string, data?: any) => {
    if (targetPage === 'watch' && data) {
      setSelectedVideo(data);
    }
    setPage(targetPage);
    window.scrollTo(0, 0);
  };

  const renderContent = () => {
    switch (page) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'search':
        return <Search onNavigate={handleNavigate} />;
      case 'watch':
        return selectedVideo ? (
          <Watch video={selectedVideo} onBack={() => handleNavigate('search')} />
        ) : (
          <Dashboard onNavigate={handleNavigate} />
        );
      case 'library':
        return <Library onNavigate={handleNavigate} />;
      case 'flashcards':
        // Reuse library for now or a placeholder, asking user to go to a video to see cards
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Study Deck</h2>
                <p className="text-slate-500 mb-8">Flashcards are generated from specific videos. Go to a video to create or view them.</p>
                <button 
                  onClick={() => handleNavigate('library')}
                  className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600"
                >
                    Go to Library
                </button>
            </div>
        );
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Sidebar 
        currentPage={page} 
        setPage={(p) => handleNavigate(p)} 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b border-slate-200 z-20 px-4 py-3 flex items-center justify-between">
         <div className="flex items-center gap-2 font-bold text-primary-600">
             <span>FocusLearn</span>
         </div>
         <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600">
            <Menu className="w-6 h-6" />
         </button>
      </div>

      <main 
        className={`
            transition-all duration-300 ease-in-out min-h-screen
            md:ml-20 lg:ml-64 p-6 pt-20 md:pt-6
        `}
      >
        {renderContent()}
      </main>

      <PomodoroTimer />
    </div>
  );
};

export default App;