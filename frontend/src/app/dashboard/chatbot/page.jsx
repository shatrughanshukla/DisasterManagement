'use client';

import React, { useEffect, useRef, useState } from 'react';
import DashboardHeader from '../../components/DashboardHeader'; // <- adjust path if different
import { FiSend } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';
import FormattedTime from '../../../components/FormattedTime';
import { formatTime } from '../../../lib/dateUtils';

// Replace this backend URL with an env var if you deploy / proxy it later
const BACKEND_CHAT_URL = 'http://127.0.0.1:5001/chat';

export default function Page() {
  return (
    <>
      <DashboardHeader />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Chatbot />
        </div>
      </div>
    </>
  );
}

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Welcome to DisasterReady!\n\nAsk me anything about emergency planning, safety procedures, first aid, evacuation protocols and more. Here are some quick suggestions to get started.`,
      time: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiStatus, setApiStatus] = useState('connected');
  const endRef = useRef(null);

  const quickSuggestions = [
    'What should be in an emergency kit?',
    'How to prepare for an earthquake?',
    'What to do during a flood?',
    'How to create a family emergency plan?'
  ];

  useEffect(() => {
    // auto-scroll
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  async function sendToBot(text) {
    if (!text || !text.trim()) return;

    // add user message
    setMessages(prev => [...prev, { sender: 'user', text: text.trim(), time: new Date().toISOString() }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(BACKEND_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (!res.ok) {
        setApiStatus('error');
        setMessages(prev => [...prev, { sender: 'bot', text: '⚠️ Server error — please try again later.', time: new Date().toISOString() }]);
        setIsTyping(false);
        return;
      }

      const data = await res.json();
      const botText = (data && data.response) ? data.response : (data.error ? `Error: ${data.error}` : 'No response from server');
      setApiStatus('connected');
      setMessages(prev => [...prev, { sender: 'bot', text: botText, time: new Date().toISOString() }]);
    } catch (err) {
      console.error('Chat error', err);
      setApiStatus('error');
      setMessages(prev => [...prev, { sender: 'bot', text: '⚠️ Error connecting to server', time: new Date().toISOString() }]);
    } finally {
      setIsTyping(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    sendToBot(input);
  }

  // --- Formatting function: turns simple markdown-ish text into safe-ish HTML ---
  function escapeHTML(s = '') {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function formatBotResponse(rawText = '') {
    // 1) escape
    let t = escapeHTML(String(rawText));

    // 2) inline formatting
    t = t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // bold
    t = t.replace(/\*(.*?)\*/g, '<em>$1</em>'); // italic

    // 3) headings (lines starting with #)
    t = t.replace(/^### (.*)$/gm, '<h4 class="text-md font-semibold mt-2">$1</h4>');
    t = t.replace(/^## (.*)$/gm, '<h3 class="text-lg font-semibold mt-2">$1</h3>');
    t = t.replace(/^# (.*)$/gm, '<h2 class="text-xl font-bold mt-2">$1</h2>');

    // 4) numbered lists groups
    t = t.replace(/(^|\n)((?:\d+\.\s.*(?:\n|$))+)/g, (m, p1, p2) => {
      const items = p2.trim().split(/\n+/).map(line => line.replace(/^\d+\.\s*/, '').trim());
      return p1 + '<ol class="list-decimal list-inside my-2">' + items.map(it => `<li class="mb-1">${it}</li>`).join('') + '</ol>';
    });

    // 5) bullet list groups (- or •)
    t = t.replace(/(^|\n)((?:[-•]\s.*(?:\n|$))+)/g, (m, p1, p2) => {
      const items = p2.trim().split(/\n+/).map(line => line.replace(/^[-•]\s*/, '').trim());
      return p1 + '<ul class="list-disc list-inside my-2">' + items.map(it => `<li class="mb-1">${it}</li>`).join('') + '</ul>';
    });

    // 6) paragraphs: split by two or more newlines and wrap blocks that are not already lists/headings
    const blocks = t.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
    const wrapped = blocks.map(b => {
      if (/^<h|^<ul|^<ol|^<pre|^<blockquote/.test(b)) return b; // already a block
      // single-line -> keep <br> for remaining single newlines
      return '<p class="mb-2 text-sm leading-relaxed">' + b.replace(/\n/g, '<br>') + '</p>';
    }).join('');

    return wrapped;
  }

  return (
    <div className="bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar (left) */}
        <aside className="md:col-span-3 hidden md:block">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-blue-600 font-semibold mb-3">Learning Topics</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-black px-3 py-2 bg-blue-50 rounded hover:bg-blue-100 cursor-pointer">Natural Disasters Overview</li>
              <li className="text-black px-3 py-2 bg-blue-50 rounded hover:bg-blue-100 cursor-pointer">Earthquake Preparedness</li>
              <li className="text-black px-3 py-2 bg-blue-50 rounded hover:bg-blue-100 cursor-pointer">Flood Safety Measures</li>
              <li className="text-black px-3 py-2 bg-blue-50 rounded hover:bg-blue-100 cursor-pointer">Cyclone & Hurricane Prep</li>
              <li className="text-black px-3 py-2 bg-blue-50 rounded hover:bg-blue-100 cursor-pointer">First Aid Basics</li>
            </ul>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Resources</h4>
              <a className="block text-sm text-blue-600 hover:underline">Download Guide (PDF)</a>
              <a className="block text-sm text-blue-600 hover:underline mt-1">Interactive Simulations</a>
            </div>
          </div>
        </aside>

        {/* Chat area (center) */}
        <section className="md:col-span-6 col-span-1 flex flex-col">
          <div className="bg-white rounded-xl shadow overflow-hidden flex flex-col h-[85vh]">
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <FaRobot />
              <div>
                <div className="font-semibold">Disaster Management Assistant</div>
                <div className="text-xs opacity-90">Ask anything about preparedness, response and recovery</div>
              </div>
              <div className="ml-auto text-xs px-2 py-1 rounded bg-white/10">API: {apiStatus === 'connected' ? <span>Connected</span> : <span className="text-yellow-200">Error</span>}</div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4" id="chat-window">
              {messages.map((m, idx) => (
                <div key={idx} className={`${m.sender === 'user' ? 'justify-end flex' : 'justify-start flex'}`}>
                  <div className={`${m.sender === 'user' ? 'bg-blue-600 text-white rounded-bl-2xl rounded-tl-xl rounded-tr-2xl' : 'bg-gray-100 text-gray-900 rounded-br-2xl rounded-tr-xl rounded-tl-2xl'} max-w-[80%] px-4 py-2`}>
                    {m.sender === 'bot' ? (
                      <div className="prose-sm" dangerouslySetInnerHTML={{ __html: formatBotResponse(m.text) }} />
                    ) : (
                      <div className="whitespace-pre-wrap text-sm">{m.text}</div>
                    )}
                    <div className="text-[10px] mt-1 opacity-60 text-right"><FormattedTime time={m.time} format="time" /></div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-br-2xl rounded-tr-xl rounded-tl-2xl px-4 py-2">
                    <div className="text-sm italic opacity-80">Assistant is typing...</div>
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Quick suggestions */}
            <div className="p-3 border-t bg-white flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendToBot(q)}
                    className="text-sm px-3 py-1.5 bg-white border rounded-full shadow-sm hover:bg-blue-50 text-gray-800"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input area */}
              <form onSubmit={onSubmit} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question here..."
                  className="flex-1 border rounded-full px-4 py-2 text-sm outline-none text-gray-800"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full shadow">
                  <FiSend />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Right column: extras / resources */}
        <aside className="md:col-span-3 hidden md:block">
          <div className="bg-white rounded-xl shadow p-4">
            <h4 className="font-semibold text-gray-800">Helpful Links</h4>
            <ul className="mt-2 text-sm space-y-2">
              <li className="text-blue-600 hover:underline cursor-pointer">Emergency Procedures Guide</li>
              <li className="text-blue-600 hover:underline cursor-pointer">Video Tutorials</li>
              <li className="text-blue-600 hover:underline cursor-pointer">Interactive Simulations</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
