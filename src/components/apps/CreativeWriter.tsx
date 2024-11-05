import React, { useState } from 'react';
import { Book, Sparkles, User, MessageSquare, Save, Download, Loader2, AlertCircle } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  content: string;
  created: Date;
}

const CreativeWriter: React.FC = () => {
  const [mode, setMode] = useState<'story' | 'character' | 'prompt'>('story');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedStories, setSavedStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('creative_stories');
    return saved ? JSON.parse(saved) : [];
  });

  const generateContent = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setResult('');
    setError(null);

    const apiKey = localStorage.getItem('groq_key');
    if (!apiKey) {
      setError('Please add your Groq API key in Settings');
      setIsLoading(false);
      return;
    }

    try {
      let prompt = '';
      switch (mode) {
        case 'story':
          prompt = `Write a creative story based on this idea: ${input}. Make it engaging and descriptive.`;
          break;
        case 'character':
          prompt = `Create a detailed character profile based on this concept: ${input}. Include personality traits, background, motivations, and physical description.`;
          break;
        case 'prompt':
          prompt = `Generate 5 creative writing prompts related to: ${input}. Make them unique and inspiring.`;
          break;
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1024,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setResult(data.choices[0]?.message?.content || '');
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while generating content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveStory = () => {
    if (!result) return;
    
    const story: Story = {
      id: Date.now().toString(),
      title: input,
      content: result,
      created: new Date()
    };

    const updatedStories = [...savedStories, story];
    setSavedStories(updatedStories);
    localStorage.setItem('creative_stories', JSON.stringify(updatedStories));
  };

  const exportStories = () => {
    const blob = new Blob([JSON.stringify(savedStories, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'creative_stories.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4">
        <div className="space-y-2">
          <button
            onClick={() => setMode('story')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${
              mode === 'story' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <Book className="w-5 h-5" />
            Story Generator
          </button>
          <button
            onClick={() => setMode('character')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${
              mode === 'character' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <User className="w-5 h-5" />
            Character Creator
          </button>
          <button
            onClick={() => setMode('prompt')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg ${
              mode === 'prompt' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Writing Prompts
          </button>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Saved Stories</h2>
            <button
              onClick={exportStories}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
              title="Export Stories"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {savedStories.map(story => (
              <div
                key={story.id}
                className="p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setInput(story.title);
                  setResult(story.content);
                }}
              >
                <h3 className="font-medium truncate">{story.title}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(story.created).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-2">
              {mode === 'story' && 'Story Generator'}
              {mode === 'character' && 'Character Creator'}
              {mode === 'prompt' && 'Writing Prompts'}
            </h1>
            <p className="text-gray-600">
              {mode === 'story' && 'Enter a story idea or concept to generate a creative story'}
              {mode === 'character' && 'Describe a character concept to generate a detailed profile'}
              {mode === 'prompt' && 'Enter a theme or topic to generate writing prompts'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="mb-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'story'
                  ? 'Enter your story idea...'
                  : mode === 'character'
                  ? 'Describe your character concept...'
                  : 'Enter a theme or topic...'
              }
              className="w-full h-32 p-4 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={generateContent}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>

          {result && (
            <div className="bg-white border rounded-lg p-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={saveStory}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Save className="w-5 h-5" />
                  Save
                </button>
              </div>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{result}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeWriter;