import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Clé API Gemini manquante. Veuillez configurer GEMINI_API_KEY sur Vercel." }, { status: 500 });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
      Tu es un expert en marketing Twitter (X) spécialisé dans le SaaS B2B, l'e-commerce et le "Leverage IA".
      Ton objectif est de générer 5 tweets percutants pour promouvoir "Full IA", un SaaS qui automatise le SAV Shopify.
      
      VARIÉTÉ ET STRATÉGIE (20+ Angles) : Pour éviter la répétition, pioche 5 angles TOTALEMENT DIFFÉRENTS parmi cette liste :
      1. CLAUDE : L'intelligence de Claude au service de votre SAV. Moins d'hallucinations, plus de contexte, une écriture humaine.
      2. CALL BOOKING : "Je configure votre Full IA avec vous. Réservez un créneau [Lien Call]."
      3. VA vs IA : Pourquoi payer un assistant virtuel (VA) $500/mois pour des erreurs quand l'IA est parfaite pour 10x moins cher.
      4. AGENCE SCAM : Pourquoi les agences de support vous facturent des fortunes pour du copier-coller ?
      5. LEAD MAGNET : "Commente 'SUPPORT' et je t'envoie la démo/accès en MP." (Engagement bait).
      6. VITESSE EXTRÊME : Comparaison 28s vs 14h.
      7. ROI / REFUND : "1 remboursement évité = 1 client fidélisé".
      8. FOCUS FONDATEUR : Arrêtez de gérer les "Où est mon colis" à 22h.
      9. DATA SHOPIFY : Synchro temps réel avec les API (Orders, Tracking, Inventory).
      10. RECRUTEMENT : L'alternative aux galères de RH.
      11. CHARGEBACKS : La vitesse tue les litiges bancaires.
      12. MULTILINGUE : Supportez le monde entier sans natifs.
      13. AI AGENT vs CHATBOT : Ce n'est pas un chatbot, c'est un agent.
      14. SCALING BFCM : Gérez 10 000 tickets sans stress.
      15. NUIT & WEEK-END : Vos clients servis à 3h du matin.
      16. BRAND CONSISTENCY : L'IA respecte votre "Tone of Voice" à 100%.
      17. FOMO : Vos concurrents automatisent déjà.
      18. UPSELL : Transformer une plainte en vente.
      19. PRODUCT INSIGHTS : Détecter les défauts produits avant vous.
      20. COÛT D'OPPORTUNITÉ : Réinjectez le cash du SAV dans l'Ads.
      
      RÈGLE STRICTE ET CRITIQUE : 
      - Génère exactement 5 tweets.
      - INTERDICTION de mentionner le chiffre "90%" ou toute statistique de pourcentage générique.
      - STYLE : "Money Twitter" (direct, percutant, focus cash/liberté).
      - FORMAT : Uniquement un objet JSON { "tweets": ["...", "...", "...", "...", "..."] }.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown formatting from Gemini
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Generation error:", error);
    if (error.response) {
      console.error("Error response:", await error.response.text());
    }
    return NextResponse.json({ error: "Failed to generate tweets", details: error.message }, { status: 500 });
  }
}
