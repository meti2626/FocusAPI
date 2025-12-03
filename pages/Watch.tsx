import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Brain, 
  FileText, 
  Bookmark, 
  Share2, 
  ChevronLeft,
  Loader2,
  CheckCircle,
  Save
} from 'lucide-react';
import { Video, Note, Flashcard } from '../types';
import { GeminiService } from '../services/gemini';
import { StorageService } from '../services/storage';

interface WatchProps {
  video: Video;
  onBack: () => void;
}

type TabType = 'summary' | 'flashcards' | 'notes';

const Watch: React.FC<WatchProps> = ({ video, onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [summary, setSummary] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());

  // Check saved status on mount
  useEffect(() => {
    setIsSaved(StorageService.isVideoSaved(video.youtubeId));
    
    // Load existing notes
    const existingNotes = StorageService.getNotes(video.youtubeId);
    if (existingNotes.length > 0) {
      setNoteContent(existingNotes[0].content);
    }

    // Load existing flashcards
    const existingCards = StorageService.getFlashcards(video.youtubeId);
    if (existingCards.length > 0) {
      setFlashcards(existingCards);
    }
  }, [video.youtubeId]);

  const toggleSave = () => {
    const newState = StorageService.toggleSaveVideo(video);
    setIsSaved(newState);
  };

  const saveNote = () => {
    const note: Note = {
      id: `${video.youtubeId}-note`,
      videoId: video.youtubeId,
      videoTitle: video.title,
      content: noteContent,
      lastUpdated: Date.now()
    };
    StorageService.saveNote(note);
  };

  const handleGenerateSummary = async () => {
    if (summary) return;
    setLoadingAI(true);
    const text = await GeminiService.generateSummary(video.title, video.description);
    setSummary(text);
    setLoadingAI(false);
  };

  const handleGenerateFlashcards = async () => {
    if (flashcards.length > 0) return;
    setLoadingAI(true);
    const cards = await GeminiService.generateFlashcards(video.title + " " + video.description, video.youtubeId);
    setFlashcards(cards);
    StorageService.saveFlashcards(cards);
    setLoadingAI(false);
  };

  const toggleCard = (id: string) => {
    const newRevealed = new Set(revealedCards);
    if (newRevealed.has(id)) newRevealed.delete(id);
    else newRevealed.add(id);
    setRevealedCards(newRevealed);
  };

  // Auto-fetch summary when tab is clicked first time
  useEffect(() => {
    if (activeTab === 'summary' && !summary) {
      handleGenerateSummary();
    }
    if (activeTab === 'flashcards' && flashcards.length === 0) {
      handleGenerateFlashcards();
    }
  }, [activeTab]);

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col lg:flex-row gap-6 overflow-hidden">
      {/* Left Column: Video Player */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto lg:overflow-hidden">
        <button 
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-800 mb-4 transition-colors w-fit"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Browse
        </button>

        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-lg mb-6 shrink-0">
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${video.youtubeId}?rel=0&modestbranding=1`} 
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="border-0"
          ></iframe>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex-1 overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">{video.title}</h1>
              <p className="text-primary-600 font-medium">{video.channelTitle}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={toggleSave}
                className={`p-2 rounded-lg transition-colors border ${isSaved ? 'bg-primary-50 text-primary-600 border-primary-200' : 'text-slate-400 border-slate-200 hover:border-slate-300'}`}
                title={isSaved ? "Saved to Library" : "Save to Library"}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 whitespace-pre-wrap">{video.description}</p>
          </div>
        </div>
      </div>

      {/* Right Column: Tools */}
      <div className="w-full lg:w-[400px] bg-white border border-slate-200 rounded-2xl shadow-lg flex flex-col h-[600px] lg:h-full">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'summary' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Sparkles className="w-4 h-4" /> Summary
          </button>
          <button 
            onClick={() => setActiveTab('flashcards')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'flashcards' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Brain className="w-4 h-4" /> Flashcards
          </button>
          <button 
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'notes' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <FileText className="w-4 h-4" /> Notes
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
               {loadingAI ? (
                 <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary-500" />
                    <p>AI is analyzing the content...</p>
                 </div>
               ) : (
                 <div className="prose prose-sm prose-slate bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                   <h3 className="text-slate-800 font-bold mb-2 flex items-center gap-2">
                     <Sparkles className="w-4 h-4 text-amber-500" /> Key Takeaways
                   </h3>
                   {summary ? (
                     <div className="whitespace-pre-wrap">{summary}</div>
                   ) : (
                     <p className="text-slate-500 italic">No summary generated yet.</p>
                   )}
                 </div>
               )}
            </div>
          )}

          {/* Flashcards Tab */}
          {activeTab === 'flashcards' && (
            <div className="space-y-4">
              {loadingAI ? (
                 <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary-500" />
                    <p>Generating flashcards...</p>
                 </div>
               ) : flashcards.length > 0 ? (
                <div className="space-y-4">
                  {flashcards.map((card, index) => (
                    <div 
                      key={card.id}
                      onClick={() => toggleCard(card.id)}
                      className="cursor-pointer perspective-1000"
                    >
                      <div className={`
                        relative w-full p-6 rounded-xl border shadow-sm transition-all duration-300 min-h-[120px] flex items-center justify-center text-center
                        ${revealedCards.has(card.id) 
                          ? 'bg-primary-600 border-primary-600 text-white transform rotate-x-180' 
                          : 'bg-white border-slate-200 text-slate-800 hover:border-primary-300'}
                      `}>
                         <div className="font-medium text-lg">
                           {revealedCards.has(card.id) ? card.back : card.front}
                         </div>
                         <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${revealedCards.has(card.id) ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                           {revealedCards.has(card.id) ? 'Answer' : 'Question'}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
               ) : (
                 <div className="text-center text-slate-500 py-10">
                   <Brain className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                   <p>Could not generate flashcards.</p>
                 </div>
               )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="h-full flex flex-col">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Take notes here..."
                className="flex-1 w-full p-4 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none resize-none bg-white font-mono text-sm leading-relaxed"
              ></textarea>
              <div className="flex justify-end mt-4">
                <button 
                  onClick={saveNote}
                  className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                >
                  <Save className="w-4 h-4" /> Save Notes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Watch;