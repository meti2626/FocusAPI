import React from 'react';
import { LayoutDashboard, Search, Library, Zap, Menu, BookOpen, Settings } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setPage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, isOpen, setIsOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'search', label: 'Explore', icon: Search },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'flashcards', label: 'Flashcards', icon: Zap },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-30 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20 lg:w-64'}
      `}>
        <div className="flex flex-col h-full">
          
          {/* Logo Area */}
          <div className="h-16 flex items-center justify-center border-b border-slate-100">
            <div className="flex items-center gap-2 text-primary-600 font-bold text-xl">
              <BookOpen className="w-8 h-8" />
              <span className={`transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden lg:opacity-100'}`}>
                FocusLearn
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-6 px-3 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setPage(item.id);
                    // Close on mobile selection
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-200
                    ${isActive 
                      ? 'bg-primary-50 text-primary-600 font-medium' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                  `}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                  <span className={`whitespace-nowrap transition-all duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 md:hidden lg:opacity-100'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Area */}
          <div className="p-4 border-t border-slate-100">
            <button className="flex items-center gap-3 text-slate-400 hover:text-slate-600 transition-colors w-full px-3 py-2">
              <Settings className="w-5 h-5" />
               <span className={`${isOpen ? 'block' : 'hidden md:hidden lg:block'}`}>Settings</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;