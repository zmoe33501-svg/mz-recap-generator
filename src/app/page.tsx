'use client';

import { useState } from 'react';
import { Film, Image as ImageIcon, FileText, Loader2, Copy, CheckCircle2 } from 'lucide-react';

export default function RecapGenerator() {
  const [movieTitle, setMovieTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieTitle) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieTitle })
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("တစ်ခုခု မှားယွင်းနေပါသည်။");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Film className="text-blue-600" />
            MZ Studio: Script & Prompt Generator
          </h1>
          <p className="text-gray-500 mt-2">ဇာတ်ကားအမည် ထည့်သွင်းပြီး Script နှင့် Thumbnail Prompts များကို အလွယ်တကူ ရယူပါ။</p>
          
          <form onSubmit={handleGenerate} className="mt-6 flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              placeholder="ဥပမာ - The Matrix (1999)" 
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium flex items-center justify-center min-w-[150px] transition"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Generate Now'}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-4">
            
            {/* Titles */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText size={20} className="text-green-500" /> Suggested Titles
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {result.suggestedTitles.map((title: string, i: number) => (
                  <li key={i}>{title}</li>
                ))}
              </ul>
            </div>

            {/* Script */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FileText size={20} className="text-purple-500" /> Burmese Script
                </h2>
                <button 
                  onClick={() => handleCopy(result.scriptBurmese, 'script')}
                  className="text-gray-400 hover:text-blue-600 transition"
                >
                  {copiedSection === 'script' ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{result.scriptBurmese}</p>
            </div>

            {/* Thumbnail Prompts */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <ImageIcon size={20} className="text-orange-500" /> AI Thumbnail Prompts
              </h2>
              <div className="space-y-4">
                {result.thumbnailPrompts.map((prompt: string, i: number) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600 relative pr-10">
                    {prompt}
                    <button 
                      onClick={() => handleCopy(prompt, `prompt-${i}`)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-blue-600"
                    >
                      {copiedSection === `prompt-${i}` ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
