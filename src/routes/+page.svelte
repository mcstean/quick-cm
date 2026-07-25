<script>
  // Svelte 5 runes ONLY — Guardrails v2.2
  let index = $state(0);
  let paused = $state(false);
  let ctaSource = $state(null);
  let selectedKwat = $state('');
  let otherKwat = $state('');
  let showBot = $state(false);

  const copies = [
    "Fatigué des statuts WhatsApp qui disparaissent en 24h ? Crée ta boutique en ligne en 3 clics avec quick.cm.",
    "Marre des livraisons compliquées ? Trouve tout directement dans ton kwat à Akwa ou Bonabéri.",
    "Zéro commission sur tes ventes, connecte tes clients directement sur ton WhatsApp pro.",
    "Le Business commence ici"
  ];

  function getAvailableQuarters() {
    return ["Akwa","Bonapriso","Bonabéri","Bepanda","Deido","Bonamoussadi","Bastos","Biyem-Assi","Makepe","Ndokoti"];
  }

  // Svelte 5 timer — $effect
  $effect(() => {
    if (paused) return;
    const t = setTimeout(() => {
      index = (index + 1) % copies.length;
    }, 4000);
    return () => clearTimeout(t);
  });

  function handleCTA(source) {
    ctaSource = source;
    showBot = true;
    // Store for bot pre-qualification
    try { localStorage.setItem('quickcm_cta', source); } catch {}
  }

  function openBotFromCTA() {
    showBot = true;
  }
</script>

<svelte:head>
  <title>quick.cm — CHAT. CONNECT. SELL FASTER.</title>
</svelte:head>

<div class="min-h-screen bg-white dark:bg-[#000000] text-black dark:text-white flex flex-col" style="font-family: Inter, sans-serif;">
  <!-- Header -->
  <header class="flex justify-between items-center p-4 border-b border-zinc-100 dark:border-zinc-900">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-[#10C66F] rounded-[10px] flex items-center justify-center">⚡</div>
      <span class="font-black">Quick.cm</span>
      <span class="text-[10px] opacity-60 ml-1">CHAT. CONNECT. SELL FASTER.</span>
    </div>
    <div class="text-[11px] opacity-60">fr-CM</div>
  </header>

  <!-- Hero -->
  <main class="flex-1 max-w-[900px] mx-auto w-full p-6">
    <div 
      class="hero rounded-[24px] p-8 md:p-12 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-center shadow-sm"
      onmouseenter={() => paused = true}
      onmouseleave={() => paused = false}
      onfocusin={() => paused = true}
      onfocusout={() => paused = false}
      role="region"
      aria-live="polite"
    >
      <div class="min-h-[84px] flex items-center justify-center">
        <h1 class="text-[22px] md:text-[28px] font-[700] leading-tight">
          {copies[index]}
        </h1>
      </div>

      <div class="flex flex-col md:flex-row gap-3 justify-center mt-8">
        <button 
          class="px-7 py-3 rounded-full bg-[#10C66F] text-black font-bold hover:brightness-110 transition"
          onclick={() => handleCTA('vendeur')}
        >Je veux vendre</button>
        <button 
          class="px-7 py-3 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold hover:bg-zinc-50 transition"
          onclick={() => handleCTA('fouille')}
        >Je fouille...</button>
      </div>

      <!-- Kwat search -->
      <div class="mt-8 flex flex-wrap gap-2 justify-center items-center">
        <select 
          class="px-4 py-2 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-700"
          bind:value={selectedKwat}
        >
          <option value="">Choisis ton kwat</option>
          {#each getAvailableQuarters() as q}
            <option value={q}>{q}</option>
          {/each}
        </select>
        <input 
          class="px-4 py-2 rounded-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-700 min-w-[140px]"
          placeholder="Autre / Autre"
          bind:value={otherKwat}
        />
        <button 
          class="px-5 py-2 rounded-full bg-[#204CFF] text-white font-bold"
          onclick={openBotFromCTA}
        >Go</button>
      </div>

      <!-- Cameroon inline SVG <100KB -->
      <div class="mt-10 flex justify-center">
        <svg width="180" height="180" viewBox="0 0 100 120" class="opacity-80">
          <path d="M30 10 L70 10 L80 30 L75 60 L70 90 L50 110 L30 90 L20 60 L25 30 Z" fill="none" stroke="#10C66F" stroke-width="1.5"/>
          <circle cx="42" cy="55" r="3" fill="#204CFF"/><text x="47" y="57" font-size="6">Douala</text>
          <circle cx="50" cy="75" r="3" fill="#204CFF"/><text x="55" y="77" font-size="6">Yaoundé</text>
        </svg>
      </div>
    </div>

    <!-- Revenue matrix -->
    <div class="mt-8 rounded-[20px] border border-zinc-100 dark:border-zinc-800 p-6">
      <h2 class="font-bold text-[14px] mb-3">Ad Slots — 10k à 100k XAF / semaine — Exemple Akwa 1M / mois</h2>
      <div class="grid grid-cols-3 gap-2 text-[12px]">
        <div class="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900">FEATURED_TOP — Akwa — 100k</div>
        <div class="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900">CATEGORY_TOP — Bonabéri — 50k</div>
        <div class="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900">GEO_PUSH — Bepanda — 10k</div>
      </div>
      <p class="mt-3 text-[11px] opacity-60">0% commission sur tes ventes — Trackable: https://quick.cm/go/[shop-id] ou wa.me avec texte quick.cm</p>
    </div>

    <!-- Privacy notice -->
    <p class="mt-6 text-[11px] text-center opacity-60">Ton numéro sert uniquement à connecter tes clients directement via quick.cm.</p>
  </main>

  <!-- Bot floating — bottom-sheet translateY(100%) pattern -->
  {#if showBot}
  <div class="fixed inset-0 bg-black/30 flex items-end justify-center z-50" onclick={() => showBot = false} onkeydown={(e) => e.key === 'Escape' && (showBot = false)} role="button" tabindex="0">
    <div class="w-full max-w-[500px] bg-white dark:bg-zinc-900 rounded-t-[24px] p-6 translate-y-0 transition-transform duration-300" style="transform: translateY(0%)" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="dialog">
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-2"><div class="w-7 h-7 bg-[#10C66F] rounded-full"></div><span class="font-bold">Quick.cm Bot</span></div>
        <button onclick={() => showBot = false} class="text-xl">✕</button>
      </div>
      <p class="text-[13px]">CTA source: {ctaSource} — Kwat: {selectedKwat || otherKwat || 'non choisi'}</p>
      <p class="mt-2 text-[13px] font-semibold">1. Tu cherches un produit ou tu veux vendre tes articles ?</p>
      <p class="text-[13px]">2. Dans quel kwat es-tu ? — {selectedKwat || otherKwat}</p>
      <p class="text-[13px]">3. Quel type de produit t'intéresse ou tu vends ?</p>
      <div class="mt-4 flex gap-2">
        <button class="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[12px]">Je vends</button>
        <button class="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[12px]">Je cherche</button>
        <button class="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[12px]">Les deux</button>
      </div>
    </div>
  </div>
  {/if}

  <!-- Floating button -->
  <button 
    class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#10C66F] text-black font-black shadow-lg"
    onclick={() => showBot = true}
    aria-label="Ouvrir bot"
  >💬</button>
</div>

<style>
  /* 3G-safe CSS-only micro-interactions — no Lottie */
  .hero { transition: all 0.2s ease }
</style>
