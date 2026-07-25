// src/lib/stores/bot.svelte.ts — Svelte 5 runes — IDs D1 35e5601a KV ccc2faaf
export let currentQuestion = $state(1);
export let answers = $state<string[]>([]);
export let ctaSource = $state<'vendeur' | 'fouille'>('vendeur');
export let unclearCount = $state(0);
export const questions = [
  "Tu cherches un produit ou tu veux vendre tes articles ?",
  "Dans quel kwat es-tu ?",
  "Quel type de produit t'intéresse ou tu vends ?"
];
export const PRIVACY_NOTICE = "Ton numéro sert uniquement à connecter tes clients directement via quick.cm.";
export function getAvailableQuarters(): string[] {
  return ["Akwa","Bonapriso","Bonabéri","Bepanda","Deido","Bonamoussadi","Bastos","Biyem-Assi","Makepe","Ndokoti"];
}
export function getQuickReplies(): string[] {
  if (unclearCount >= 2) {
    return ["Je vends chaussures à Akwa","Je cherche téléphone à Bonabéri","Les deux — vendeur et acheteur"];
  }
  return [];
}
export function resetBot() { currentQuestion = 1; answers = []; unclearCount = 0; }
export function submitAnswer(answer: string): boolean {
  const trimmed = answer.trim();
  if (!trimmed || trimmed.length < 2) { unclearCount++; return false; }
  answers.push(trimmed); unclearCount = 0;
  if (currentQuestion < 3) currentQuestion++;
  try {
    localStorage.setItem('quickcm_bot_answers', JSON.stringify(answers));
    localStorage.setItem('quickcm_bot_q', String(currentQuestion));
  } catch {}
  return true;
}
export function loadFromStorage() {
  try {
    const savedCta = localStorage.getItem('quickcm_cta') as any;
    if (savedCta) ctaSource = savedCta;
    const savedAnswers = localStorage.getItem('quickcm_bot_answers');
    if (savedAnswers) answers = JSON.parse(savedAnswers);
    const savedQ = localStorage.getItem('quickcm_bot_q');
    if (savedQ) currentQuestion = parseInt(savedQ) || 1;
  } catch {}
}
