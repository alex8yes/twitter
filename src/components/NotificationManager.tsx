"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Info } from "lucide-react";

export default function NotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    if (!("Notification" in window)) {
      setPermission("unsupported");
    } else {
      setPermission(Notification.permission);
    }
  }, []);

  // Scheduling logic
  useEffect(() => {
    if (permission !== "granted") return;

    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const today = now.toLocaleDateString();

      // Target slots: 8h, 11h, 14h, 18h, 21h
      const targetSlots = [8, 11, 14, 18, 21];
      
      if (targetSlots.includes(hours) && minutes === 0) {
        // Check if already notified for this slot today
        const historyRaw = localStorage.getItem("notification_history");
        const history = historyRaw ? JSON.parse(historyRaw) : {};
        
        if (!history[today]) history[today] = [];
        
        if (!history[today].includes(hours)) {
          // Send notification
          new Notification("🚀 TweetPromoter", {
            body: `Il est ${hours}h00 ! C'est l'heure du boost Full IA. 1/5 de la journée accompli.`,
            icon: "/icon.png",
            badge: "/icon.png",
            tag: `slot-${hours}`
          });

          // Update history
          history[today].push(hours);
          localStorage.setItem("notification_history", JSON.stringify(history));
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkTime, 60000);
    // Initial check
    checkTime();

    return () => clearInterval(interval);
  }, [permission]);

  const requestPermission = async () => {
    if (permission === "unsupported") return;
    
    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === "granted") {
      new Notification("🚀 Full IA Twitter", {
        body: "Rappels activés ! 5 posts par jour : 8h, 11h, 14h, 18h, 21h.",
        icon: "/icon.png"
      });
    }
  };

  return (
    <div className="glass-card p-4 mb-6 flex items-center justify-between border-primary/20 bg-primary/5">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${permission === 'granted' ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-zinc-800 text-zinc-400'}`}>
          {permission === 'granted' ? <Bell className="w-5 h-5 animate-pulse" /> : <BellOff className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-sm font-bold tracking-tight">
            {permission === 'unsupported' ? 'iOS : Ajoutez l\'app' : (permission === 'granted' ? 'Rappels actifs (5x par jour)' : 'Activer les rappels')}
          </p>
          <p className="text-[11px] text-zinc-500 font-medium">
            {permission === 'unsupported' ? 'Menu Partage > Sur l\'écran d\'accueil' : (permission === 'granted' ? '8h, 11h, 14h, 18h, 21h' : 'Ne ratez aucun créneau stratégique')}
          </p>
        </div>
      </div>
      
      {permission !== 'granted' && permission !== 'unsupported' && (
        <button 
          onClick={requestPermission}
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all active:scale-95"
        >
          Activer
        </button>
      )}
      
      {permission === 'unsupported' && (
        <div className="text-primary p-1 bg-primary/10 rounded-lg">
          <Info className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
