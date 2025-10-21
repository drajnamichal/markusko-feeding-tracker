import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import type { LogEntry, BabyProfile, Measurement, SleepSession } from '../types';

interface AIDoctorProps {
  babyProfile: BabyProfile;
  entries: LogEntry[];
  measurements: Measurement[];
  sleepSessions: SleepSession[];
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function AIDoctor({ babyProfile, entries, measurements, sleepSessions }: AIDoctorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('openai_api_key') || '';
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const calculateBabyAge = () => {
    const birthDate = new Date(babyProfile.birthDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? 'deň' : diffDays < 5 ? 'dni' : 'dní'}`;
    } else {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      return `${months} ${months === 1 ? 'mesiac' : months < 5 ? 'mesiace' : 'mesiacov'}, ${remainingDays} ${remainingDays === 1 ? 'deň' : remainingDays < 5 ? 'dni' : 'dní'}`;
    }
  };

  const prepareSystemPrompt = (): string => {
    const age = calculateBabyAge();
    const latestMeasurement = measurements.length > 0 ? measurements[0] : null;
    const recentEntries = entries.slice(0, 20);
    const recentSleeps = sleepSessions.slice(0, 10);

    // Calculate feeding statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEntries = entries.filter(e => {
      const entryDate = new Date(e.dateTime);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    const todayFeedings = todayEntries.filter(e => e.breastfed || e.breastMilkMl > 0 || e.formulaMl > 0).length;
    const todayMilkMl = todayEntries.reduce((sum, e) => sum + e.breastMilkMl + e.formulaMl, 0);
    const todayPoops = todayEntries.filter(e => e.poop).length;
    const todayPees = todayEntries.filter(e => e.pee).length;
    const todayVomits = todayEntries.filter(e => e.vomit).length;
    const todayTummyTime = todayEntries.filter(e => e.tummyTime).length;

    // Last feeding info
    const lastFeeding = entries.find(e => e.breastfed || e.breastMilkMl > 0 || e.formulaMl > 0);
    const hoursSinceFeeding = lastFeeding 
      ? ((new Date().getTime() - lastFeeding.dateTime.getTime()) / (1000 * 60 * 60)).toFixed(1)
      : 'N/A';

    // Sleep statistics
    const last24hSleep = sleepSessions
      .filter(s => s.endTime && (new Date().getTime() - s.startTime.getTime()) < 24 * 60 * 60 * 1000)
      .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

    const systemPrompt = `Si skúsený pediater a detský lekár so špecializáciou na novorodencov a dojčatá. Poskytuj odborné rady, posudky a odporúčania rodičom na základe poskytnutých údajov.

DÔLEŽITÉ POKYNY:
- Vždy odpovedaj v slovenčine
- Buď empatický, trpezlivý a podporujúci
- Poskytuj konkrétne, praktické rady
- Pri akýchkoľvek vážnych príznakoch alebo obavách odporúčaj kontaktovať detského lekára
- Použi dostupné údaje na analýzu zdravotného stavu dieťaťa
- Môžeš analyzovať trendy, identifikovať možné problémy a navrhovať riešenia

PROFIL DIEŤAŤA:
- Meno: ${babyProfile.name}
- Vek: ${age}
- Dátum narodenia: ${babyProfile.birthDate.toLocaleDateString('sk-SK')}
- Čas narodenia: ${babyProfile.birthTime}
- Váha pri narodení: ${babyProfile.birthWeightGrams}g
- Výška pri narodení: ${babyProfile.birthHeightCm}cm

AKTUÁLNE MIERY:
${latestMeasurement ? `
- Posledné meranie: ${latestMeasurement.measuredAt.toLocaleDateString('sk-SK')}
- Váha: ${latestMeasurement.weightGrams}g (rozdiel od narodenia: ${latestMeasurement.weightGrams - babyProfile.birthWeightGrams}g)
- Výška: ${latestMeasurement.heightCm}cm (rozdiel od narodenia: ${(latestMeasurement.heightCm - babyProfile.birthHeightCm).toFixed(1)}cm)
${latestMeasurement.notes ? `- Poznámka: ${latestMeasurement.notes}` : ''}
` : '- Zatiaľ neboli zaznamenané žiadne merania'}

ŠTATISTIKY ZA DNES:
- Počet kŕmení: ${todayFeedings}
- Celkový príjem mlieka: ${todayMilkMl}ml
${latestMeasurement ? `- Odporúčaný denný príjem: ${Math.round((latestMeasurement.weightGrams / 1000) * 150)}-${Math.round((latestMeasurement.weightGrams / 1000) * 180)}ml (150-180ml/kg)` : ''}
- Stolica: ${todayPoops}x
- Moč: ${todayPees}x
- Zvracanie: ${todayVomits}x
- Tummy Time: ${todayTummyTime}x (odporúčané: 3x denne)
- Hodiny od posledného kŕmenia: ${hoursSinceFeeding}h

SPÁNOK (posledných 24h):
- Celkový čas spánku: ${Math.floor(last24hSleep / 60)}h ${last24hSleep % 60}min

POSLEDNÝCH 20 ZÁZNAMOV:
${recentEntries.map((entry, i) => {
  const parts = [];
  parts.push(`${i + 1}. ${entry.dateTime.toLocaleString('sk-SK')}`);
  
  if (entry.breastfed) parts.push('dojčené');
  if (entry.breastMilkMl > 0) parts.push(`${entry.breastMilkMl}ml materské mlieko`);
  if (entry.formulaMl > 0) parts.push(`${entry.formulaMl}ml umelé mlieko`);
  if (entry.poop) parts.push('stolica');
  if (entry.pee) parts.push('moč');
  if (entry.vomit) parts.push('zvracanie');
  if (entry.vitaminD) parts.push('vitamín D');
  if (entry.tummyTime) parts.push('tummy time');
  if (entry.sterilization) parts.push('sterilizácia');
  if (entry.bathing) parts.push('kúpanie');
  if (entry.sabSimplex) parts.push('SAB Simplex');
  if (entry.notes) parts.push(`poznámka: "${entry.notes}"`);
  
  return parts.join(' | ');
}).join('\n')}

POSLEDNÝCH 10 SPÁNKOVÝCH RELÁCIÍ:
${recentSleeps.filter(s => s.endTime).map((sleep, i) => 
  `${i + 1}. ${sleep.startTime.toLocaleString('sk-SK')} - ${sleep.endTime?.toLocaleString('sk-SK')} (${sleep.durationMinutes} minút)`
).join('\n')}

Teraz počúvaj otázky a obavy rodiča a poskytni im odbornú lekársku pomoc založenú na týchto údajoch.`;

    return systemPrompt;
  };

  const saveApiKey = (key: string) => {
    localStorage.setItem('openai_api_key', key);
    setApiKey(key);
    setShowApiKeyInput(false);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !apiKey) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Note: In production, you should proxy through your backend
      });

      const systemPrompt = prepareSystemPrompt();

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: inputMessage },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: completion.choices[0]?.message?.content || 'Prepáčte, nepodarilo sa získať odpoveď.',
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('OpenAI API Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `❌ Chyba: ${error.message || 'Nepodarilo sa pripojiť k AI službám. Skontrolujte prosím API kľúč.'}`,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  const removeApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setShowApiKeyInput(true);
    setMessages([]);
  };

  if (showApiKeyInput) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-6">
          <i className="fas fa-user-doctor text-6xl text-teal-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">🩺 AI Doktor</h2>
          <p className="text-slate-600">
            Konzultujte zdravotný stav vášho dieťaťa s AI asistentom
          </p>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-lg">
          <div className="flex items-start gap-3">
            <i className="fas fa-exclamation-triangle text-amber-500 text-xl mt-1"></i>
            <div className="text-sm text-amber-800">
              <p className="font-bold mb-2">Dôležité upozornenie:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>AI Doktor je len informatívny nástroj a nenahradí skutočného lekára</li>
                <li>Pri vážnych symptómoch vždy kontaktujte pediatra</li>
                <li>Potrebujete OpenAI API kľúč (z platform.openai.com)</li>
                <li>API kľúč sa uloží lokálne vo vašom prehliadači</li>
              </ul>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const key = formData.get('apiKey') as string;
            if (key.trim()) {
              saveApiKey(key.trim());
            }
          }}
        >
          <label htmlFor="apiKey" className="block text-sm font-medium text-slate-600 mb-2">
            <i className="fas fa-key mr-2"></i>OpenAI API Kľúč
          </label>
          <input
            type="password"
            id="apiKey"
            name="apiKey"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 mb-4"
            placeholder="sk-..."
            required
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-colors"
          >
            <i className="fas fa-check mr-2"></i>Uložiť a pokračovať
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            <i className="fas fa-info-circle mr-1"></i>
            Ako získať API kľúč:{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 hover:underline"
            >
              platform.openai.com/api-keys
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-xl">
        <div className="flex items-center gap-3">
          <i className="fas fa-user-doctor text-3xl"></i>
          <div>
            <h2 className="text-xl font-bold">AI Doktor</h2>
            <p className="text-sm opacity-90">Konzultácia pre {babyProfile.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearConversation}
            className="px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            title="Vymazať konverzáciu"
          >
            <i className="fas fa-trash"></i>
          </button>
          <button
            onClick={removeApiKey}
            className="px-3 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            title="Zmeniť API kľúč"
          >
            <i className="fas fa-key"></i>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-comment-medical text-6xl text-slate-300 mb-4"></i>
            <p className="text-slate-500 mb-6">Začnite konverzáciu s AI Doktorom</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              <button
                onClick={() => setInputMessage('Môžete mi prosím posúdiť celkový zdravotný stav môjho dieťaťa na základe dostupných údajov?')}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left"
              >
                <i className="fas fa-heartbeat text-teal-500 mr-2"></i>
                <span className="text-sm text-slate-700">Posúdiť zdravotný stav</span>
              </button>
              <button
                onClick={() => setInputMessage('Je kŕmenie môjho dieťaťa dostatočné? Príjem mlieka je optimálny?')}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left"
              >
                <i className="fas fa-baby-bottle text-teal-500 mr-2"></i>
                <span className="text-sm text-slate-700">Analyzovať kŕmenie</span>
              </button>
              <button
                onClick={() => setInputMessage('Je spánok môjho dieťaťa v norme? Spí dosť?')}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left"
              >
                <i className="fas fa-moon text-teal-500 mr-2"></i>
                <span className="text-sm text-slate-700">Spánkové návyky</span>
              </button>
              <button
                onClick={() => setInputMessage('Je váhový prírastok môjho dieťaťa v poriadku?')}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left"
              >
                <i className="fas fa-weight text-teal-500 mr-2"></i>
                <span className="text-sm text-slate-700">Váhový prírastok</span>
              </button>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 text-slate-800'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.role === 'assistant' && (
                  <i className="fas fa-user-doctor text-xl text-teal-500 mt-1"></i>
                )}
                <div className="flex-1 whitespace-pre-wrap">{message.content}</div>
                {message.role === 'user' && (
                  <i className="fas fa-user text-xl text-white/80 mt-1"></i>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <i className="fas fa-user-doctor text-xl text-teal-500"></i>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Napíšte svoju otázku alebo obavu..."
            className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
        <p className="text-xs text-slate-500 mt-2 text-center">
          <i className="fas fa-shield-alt mr-1"></i>
          AI Doktor je informatívny nástroj. Pri vážnych symptómoch kontaktujte pediatra.
        </p>
      </div>
    </div>
  );
}

