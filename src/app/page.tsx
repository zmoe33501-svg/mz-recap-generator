'use client';

import { useState, useEffect } from 'react';
import { Film, Image as ImageIcon, FileText, Loader2, Copy, CheckCircle2, Key } from 'lucide-react';

export default function RecapGenerator() {
  const [movieTitle, setMovieTitle] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // App စပွင့်တာနဲ့ သိမ်းထားတဲ့ API Key ရှိရင် ပြန်ခေါ်မယ်
  useEffect(() => {
    const savedKey = localStorage.getItem('mz_gemini_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setApiKey(val);
    localStorage.setItem('mz_gemini_api_key', val); // Key ကို သိမ်းထားမယ်
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResult(null);

    if (!apiKey) {
      setErrorMsg("ကျေးဇူးပြု၍ သင့်ရဲ့ Gemini API Key ကို ထည့်သွင်းပါ။");
      return;
    }
    if (!movieTitle) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // API Key ကို Backend ဆီပါ ပို့ပေးမယ်
        body: JSON.stringify({ movieTitle, apiKey }) 
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "တစ်ခုခု မှားယွင်းနေပါသည်။ API Key မှန်ကန်မှုရှိမရှိ စစ်ဆေးပါ။");
      }
      setResult(data);
    } catch (error: any) {
      console.error("Error:", error);
      setErrorMsg(error.message);
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
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Film className="text-blue-600" />
            MZ Studio: Script Generator
          </h1>
          
          {/* API Key Input */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
            <Key className="text-blue-500 w-5 h-5 flex-shrink-0" />
            <input 
              type="password" 
              value={apiKey}
              onChange={handleKeyChange}
              placeholder="သင့်ရဲ့ Gemini API Key ကို ဤနေရာတွင် ထည့်ပါ..." 
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
          
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              placeholder="ဇာတ်ကားအမည် ထည့်ပါ (ဥပမာ - The Matrix)" 
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

          {/* Error Message */}
          {errorMsg && (
            <p className="text-red-500 text-sm mt-4 text-center">{errorMsg}</p>
          )}
        </div>

        {/* Results Section (Same as before) */}
        {result && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText size={20} className="text-green-500" /> Suggested Titles
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {result.suggestedTitles.map((title: string, i: number) => (
                  <li key={i}>{title}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FileText size={20} className="text-purple-500" /> Burmese Script
                </h2>
                <button onClick={() => handleCopy(result.scriptBurmese, 'script')} className="text-gray-400 hover:text-blue-600">
                  {copiedSection === 'script' ? <CheckCircle2 size={20} className="text-green-500" /> : <Copy size={20} />}
                </button>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{result.scriptBurmese}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <ImageIcon size={20} className="text-orange-500" /> AI Thumbnail Prompts
              </h2>
              <div className="space-y-4">
                {result.thumbnailPrompts.map((prompt: string, i: number) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600 relative pr-10">
                    {prompt}
                    <button onClick={() => handleCopy(prompt, `prompt-${i}`)} className="absolute right-3 top-3 text-gray-400 hover:text-blue-600">
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
