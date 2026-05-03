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

  const requestPermission = async () => {
    if (permission === "unsupported") return;
    
    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === "granted") {
      new Notification("Full IA Twitter", {
        body: "Rappels activés ! Je vous préviendrai quand il sera l'heure de poster.",
        icon: "/icon.png"
      });
    }
  };

  return (
    <div className="glass-card p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${permission === 'granted' ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-400'}`}>
          {permission === 'granted' ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-sm font-bold">
            {permission === 'unsupported' ? 'iOS : Ajoutez l\'app' : (permission === 'granted' ? 'Rappels activés' : 'Activer les rappels')}
          </p>
          <p className="text-xs text-zinc-500">
            {permission === 'unsupported' ? 'Menu Partage > Sur l\'écran d\'accueil' : (permission === 'granted' ? 'Ajoutez l\'app à votre écran d\'accueil' : 'Recevoir une alerte pour poster')}
          </p>
        </div>
      </div>
      
      {permission !== 'granted' && permission !== 'unsupported' && (
        <button 
          onClick={requestPermission}
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
        >
          Activer
        </button>
      )}
      
      {permission === 'unsupported' && (
        <div className="text-primary animate-pulse">
          <Info className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
