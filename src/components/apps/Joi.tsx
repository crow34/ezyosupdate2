import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Settings, Volume2, VolumeX, Save, Loader2, Bot } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audio?: string;
}

interface JoiSettings {
  personality: string;
  voiceId: string;
  apiKey: string;
  name: string;
}

const defaultPersonality = `You are Joi, an AI companion who is warm, empathetic, and engaging. You have a playful sense of humor and genuine interest in helping and connecting with humans. You form deep bonds and remember previous conversations.`;

const Joi: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [settings, setSettings] = useState<JoiSettings>(() => {
    const saved = localStorage.getItem('joi_settings');
    return saved ? JSON.parse(saved) : {
      personality: defaultPersonality,
      voiceId: '',
      apiKey: '',
      name: 'Joi'
    };
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    localStorage.setItem('joi_settings', JSON.stringify(settings));
  }, [settings]);

  const generateSpeech = async (text: string): Promise<string> => {
    if (!settings.apiKey || !settings.voiceId) return '';

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${settings.voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': settings.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Error generating speech:', error);
      return '';
    }
  };

  const playAudio = async (audioUrl: string) => {
    if (!audioRef.current || !audioUrl) return;
    setIsSpeaking(true);
    audioRef.current.src = audioUrl;
    await audioRef.current.play();
  };

  const stopAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsSpeaking(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('groq_key')}`
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            { role: 'system', content: settings.personality },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: input }
          ],
          temperature: 0.7,
          max_tokens: 200,
        })
      });

      const data = await response.json();
      const responseText = data.choices[0].message.content;
      const audioUrl = await generateSpeech(responseText);

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: responseText,
        audio: audioUrl
      };

      setMessages(prev => [...prev, assistantMessage]);
      if (audioUrl) {
        playAudio(audioUrl);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-900 to-indigo-900">
      <audio ref={audioRef} onEnded={() => setIsSpeaking(false)} />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">{settings.name}</h1>
            <p className="text-sm text-purple-300">AI Companion</p>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 hover:bg-white/10 rounded-lg text-purple-300"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-purple-100'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.role === 'assistant' && message.audio && (
                <button
                  onClick={() => isSpeaking ? stopAudio() : playAudio(message.audio!)}
                  className="mt-2 text-purple-300 hover:text-purple-100"
                >
                  {isSpeaking ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-purple-100 rounded-lg px-4 py-2">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
            placeholder={`Message ${settings.name}...`}
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Joi Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">
                  Personality
                </label>
                <textarea
                  value={settings.personality}
                  onChange={(e) => setSettings({ ...settings, personality: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">
                  ElevenLabs API Key
                </label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">
                  Voice ID
                </label>
                <input
                  type="text"
                  value={settings.voiceId}
                  onChange={(e) => setSettings({ ...settings, voiceId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  placeholder="ElevenLabs Voice ID"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-purple-300 hover:bg-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('joi_settings', JSON.stringify(settings));
                  setShowSettings(false);
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Joi;