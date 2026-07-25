<script lang="ts">
  import { currentQuestion, answers, ctaSource, questions, PRIVACY_NOTICE, getAvailableQuarters, getQuickReplies, submitAnswer, loadFromStorage, resetBot } from '$lib/stores/bot.svelte.ts';
  let answerInput = $state('');
  let selectedKwat = $state('');
  let showQuickReplies = $state(false);
  let isOffline = $state(false);
  let whatsappInput = $state('');
  let showPrivacy = $state(false);
  let quickReplies = $derived(getQuickReplies());
  let trackableLink = $derived(`https://quick.cm/go/${answers[0]?.slice(0,8) || 'demo123'}?utm_source=quickcm_bot&cta=${ctaSource}`);
  $effect(() => { loadFromStorage(); try { isOffline = !navigator.onLine; window.addEventListener('online', () => isOffline = false); window.addEventListener('offline', () => isOffline = true); } catch {} });
  $effect(() => { if (quickReplies.length > 0) showQuickReplies = true; });
  function handleSubmit() { const toSubmit = selectedKwat || answerInput; if (!toSubmit.trim()) return; const ok = submitAnswer(toSubmit); if (!ok) { showQuickReplies = true; return; } answerInput=''; selectedKwat=''; showQuickReplies=false; if (answers.length >= 3) showPrivacy=true; }
  function handleKeydown(e: KeyboardEvent) { if (e.key === 'Enter') handleSubmit(); }
  function handleQuickReply(reply: string) { submitAnswer(reply); showQuickReplies=false; answerInput=''; }
</script>
<div class="bot-container fixed bottom-0 left-0 w-full bg-white dark:bg-zinc-900 border-t rounded-t- p-5 max-h- overflow-y-auto z-50" style="transform: translateY(0%)">
  <div class="flex justify-between items-center mb-4">
    <div class="flex items-center gap-2"><div class="w-8 h-8 rounded-full bg-[#10C66F] flex items-center justify-center font-bold">Q</div><div><p class="font-bold text-">Quick.cm — {ctaSource}</p><p class="text- opacity-60">Big sister/brother — 3 Q</p></div></div>
    <button onclick={() => resetBot()} class="text- px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">Reset</button>
  </div>
  {#if isOffline}<div class="mb-3 p-2 rounded-xl bg-amber-100 text-">Mode offline — cache MTN/Orange</div>{/if}
  <div class="space-y-3 mb-4">
    {#each answers as ans, i}<div class="flex justify-end"><span class="px-3 py-2 rounded- bg-[#10C66F] text-black text-">{ans}</span></div>{#if i < questions.length-1}<div class="flex justify-start"><span class="px-3 py-2 rounded- bg-zinc-100 dark:bg-zinc-800 text-">{questions[i+1]}</span></div>{/if}{/each}
    {#if currentQuestion <= 3}<div class="flex justify-start"><span class="px-3 py-2 rounded- bg-zinc-100 dark:bg-zinc-800 text- font-medium">{questions[currentQuestion-1]}</span></div>{/if}
  </div>
  {#if showQuickReplies && quickReplies.length > 0}<div class="flex flex-wrap gap-2 mb-4">{#each quickReplies as reply}<button onclick={() => handleQuickReply(reply)} class="px-3 py-1.5 rounded-full border border-[#10C66F] text-">{reply}</button>{/each}</div>{/if}
  {#if currentQuestion === 2}<div class="flex gap-2 mb-3"><select bind:value={selectedKwat} class="flex-1 px-4 py-3 rounded-full border text-"><option value="">Choisis ton kwat</option>{#each getAvailableQuarters() as q}<option value={q}>{q}</option>{/each}</select><input bind:value={answerInput} placeholder="Autre / Autre" class="flex-1 px-4 py-3 rounded-full border text-" onkeydown={handleKeydown} /></div>{:else}<div class="flex gap-2 mb-3"><input bind:value={answerInput} placeholder="Réponse..." class="flex-1 px-4 py-3 rounded-full border text-" onkeydown={handleKeydown} /><button onclick={handleSubmit} class="px-5 py-3 rounded-full bg-[#204CFF] text-white font-bold text-">Envoyer</button></div>{/if}
  {#if showPrivacy || answers.length >= 3}<div class="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border"><p class="text- opacity-70">{PRIVACY_NOTICE}</p><input bind:value={whatsappInput} placeholder="Ton WhatsApp Business" class="mt-2 w-full px-3 py-2 rounded-full border text-" /><div class="mt-3"><p class="text- font-bold">Lien trackable:</p><a href={trackableLink} class="text- text-[#204CFF] break-all">{trackableLink}</a></div></div>{/if}
</div>
