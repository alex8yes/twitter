"use client";

import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Calendar, TrendingUp } from "lucide-react";
import TweetCard from "@/components/TweetCard";
import NotificationManager from "@/components/NotificationManager";
import { motion, AnimatePresence } from "framer-motion";

const TIMES = ["Matin (08:00)", "Midi (11:00)", "Déjeuner (14:00)", "Après-midi (18:00)", "Soir (21:00)"];

export default function Home() {
  const [tweets, setTweets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  useEffect(() => {
    const savedTweets = localStorage.getItem("tweets");
    const savedDate = localStorage.getItem("lastGenerated");
    if (savedTweets) {
      try {
        const parsed = JSON.parse(savedTweets);
        if (Array.isArray(parsed)) {
          // Normalize to strings if needed (to handle legacy objects {text: '...'})
          const normalized = parsed.map((t: any) => 
            typeof t === "string" ? t : (t.text || t.content || JSON.stringify(t))
          );
          setTweets(normalized);
        }
      } catch (e) {
        console.error("Error loading tweets from storage", e);
      }
    }
    if (savedDate) setLastGenerated(savedDate);
  }, []);

  const generateTweets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", { method: "POST" });
      const data = await res.json();
      if (data.tweets) {
        setTweets(data.tweets);
        const today = new Date().toLocaleDateString();
        setLastGenerated(today);
        localStorage.setItem("tweets", JSON.stringify(data.tweets));
        localStorage.setItem("lastGenerated", today);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto min-h-screen p-6 pb-24">
      {/* Header */}
      <header className="mb-8 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">TweetPromoter</h1>
        </div>
        <p className="text-zinc-500 text-sm font-medium">Promouvoir Full IA • 5 posts par jour</p>
      </header>

      <NotificationManager />

      {/* Action Banner */}
      <div className="glass-card p-6 mb-10 bg-primary/5 border-primary/20">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold mb-1">Boostez votre SaaS</h2>
            <p className="text-xs text-zinc-400">Générez vos 5 tweets stratégiques pour aujourd'hui.</p>
          </div>
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        
        <button
          onClick={generateTweets}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <>Générer les tweets du jour</>
          )}
        </button>
        
        {lastGenerated && (
          <p className="text-[10px] text-center mt-3 text-zinc-600 font-bold uppercase tracking-tighter">
            Dernière génération : {lastGenerated}
          </p>
        )}
      </div>

      {/* Schedule / Timeline */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Planning du jour</h3>
        </div>

        <AnimatePresence mode="popLayout">
          {tweets.length > 0 ? (
            tweets.map((tweet, index) => (
              <TweetCard 
                key={index} 
                content={tweet} 
                timeLabel={TIMES[index]} 
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                <Sparkles className="w-8 h-8 text-zinc-700" />
              </div>
              <p className="text-zinc-500 font-medium">Aucun tweet généré pour le moment.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Spacer for Mobile PWA feel */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </main>
  );
}
