"use client";

import { useState } from "react";
import { Copy, Check, Send } from "lucide-react";
import { motion } from "framer-motion";

interface TweetCardProps {
  content: string;
  timeLabel: string;
  isDone?: boolean;
}

export default function TweetCard({ content, timeLabel, isDone }: TweetCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-6 mb-4 relative overflow-hidden ${isDone ? 'opacity-50' : ''}`}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-primary/80 px-2 py-1 bg-primary/10 rounded-full">
          {timeLabel}
        </span>
        <Send className="w-4 h-4 text-zinc-600" />
      </div>
      
      <p className="text-zinc-200 text-lg leading-relaxed mb-6 font-medium">
        {content}
      </p>

      <button
        onClick={handleCopy}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-bold ${
          copied 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-white/5 hover:bg-white/10 text-white'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copié !
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copier le texte
          </>
        )}
      </button>

      {isDone && (
        <div className="absolute top-2 right-2 bg-primary/20 p-1 rounded-full">
          <Check className="w-3 h-3 text-primary" />
        </div>
      )}
    </motion.div>
  );
}
