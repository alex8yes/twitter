import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
      Tu es un expert en marketing Twitter (X) spécialisé dans le SaaS B2B, l'e-commerce et le "Leverage IA".
      Ton objectif est de générer 3 tweets percutants pour promouvoir "Full IA", un SaaS qui automatise le SAV Shopify.
      
      VARIÉTÉ CRUCIALE (15+ Angles) : Pour éviter la répétition sur le long terme, pioche 3 angles TOTALEMENT DIFFÉRENTS parmi cette liste pour les 3 tweets :
      1. VITESSE EXTRÊME : Comparaison 28s vs 14h. L'IA répond avant que le client ne cligne des yeux.
      2. ROI / REFUND : "1 remboursement évité = 1 client fidélisé". Le SAV n'est plus un coût, c'est un profit.
      3. FOCUS FONDATEUR : Arrêtez de gérer les "Où est mon colis" à 22h. Déléguez au robot, allez scaler votre Ads.
      4. DATA SHOPIFY : Synchro temps réel avec les API Shopify (Orders, Tracking, Inventory). Zéro hallucination.
      5. RECRUTEMENT/TURNOVER : L'alternative aux galères de recrutement, de formation et de turnover des agents.
      6. CHARGEBACKS : La vitesse de réponse tue les litiges bancaires avant qu'ils n'arrivent.
      7. MULTILINGUE : Supportez le monde entier (FR, EN, ES, IT, DE) sans embaucher de natifs.
      8. AI AGENT vs CHATBOT : Ce n'est pas un arbre de décision stupide, c'est un agent intelligent qui résout les problèmes.
      9. SCALING BFCM : Gérez 10 000 tickets aussi facilement que 1 seul. Pas de stress d'embauche en période de rush.
      10. NUIT & WEEK-END : Vos clients sont servis à 3h du matin le dimanche pendant que vous dormez.
      11. BRAND CONSISTENCY : L'IA ne s'épuise jamais et respecte votre "Tone of Voice" à 100%, 24/7.
      12. FOMO / CONCURRENCE : Vos concurrents automatisent déjà. Ne restez pas avec un SAV du 20ème siècle.
      13. UPSELL / RETENTION : Transformer une plainte en une nouvelle opportunité de vente grâce à des offres personnalisées.
      14. PRODUCT INSIGHTS : L'IA détecte les problèmes de qualité produits ou les retards de livraison avant vous.
      15. COÛT D'OPPORTUNITÉ : Chaque euro économisé sur le SAV est un euro réinjecté dans votre scaling.
      
      RÈGLE STRICTE ET CRITIQUE : 
      - INTERDICTION ABSOLUE de mentionner le chiffre "90%" ou toute statistique de pourcentage générique.
      - STYLE : "Money Twitter" (direct, percutant, focus cash/liberté).
      - FORMAT : Uniquement un objet JSON { "tweets": ["...", "...", "..."] }.
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
