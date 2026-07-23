<script>
	// Svelte 5 Runes - Quick.cm Homepage + Chat Onboarding
	let showChat = $state(false);
	let accent = $state(0); // 0 = Catalogue -> Maps, 1 = Clients -> Chat
	let mode = $state(null); // 'seller' | 'buyer' | null
	let sellerStep = $state(0);
	let buyerStep = $state(0);
	let shopName = $state('');
	let quartier = $state('');
	let produits = $state('');
	let searchQuery = $state('');
	let buyerQuartier = $state('');
	let messages = $state([]);
	let quickReplies = $state([]);
	let inputValue = $state('');
	let isTyping = $state(false);
	let messagesEl = $state(null);
	let hasCompleted = $state(false);
	let funnel = $state('organic');
	let refCode = $state('');
	let embeddedReady = $state(true); // Meta Embedded Signup ready, bot flow for now

	$effect(() => {
		if (typeof window === 'undefined') return;
		const p = new URLSearchParams(window.location.search);
		funnel = p.get('utm_campaign') || p.get('ad') || p.get('f') || 'organic';
		refCode = p.get('ref') || '';
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({ event: 'page_view', funnel, ref: refCode });
		try { const saved = localStorage.getItem('quick_chat'); if (saved) { const d = JSON.parse(saved); if (d.shopName) shopName = d.shopName; if (d.quartier) quartier = d.quartier; } } catch {}
	});

	$effect(() => {
		const id = setInterval(() => {
			accent = accent === 0 ? 1 : 0;
		}, 4000);
		return () => clearInterval(id);
	});

	function track(event, data = {}) {
		if (typeof window === 'undefined') return;
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({ event, ...data, funnel, ref: refCode });
		if (typeof window.fbq !== 'undefined') window.fbq('track', event, data);
		if (typeof window.gtag !== 'undefined') window.gtag('event', event, data);
	}

	function saveLocal() {
		try { localStorage.setItem('quick_chat', JSON.stringify({ shopName, quartier, produits, searchQuery, buyerQuartier })); } catch {}
	}

	function shareViral() {
		const link = `https://quick.cm/${(shopName || 'shop').toLowerCase().replace(/\s+/g,'-')}?ref=${refCode || 'viral'}&utm_campaign=viral_share`;
		const text = `Trouve mon catalogue WhatsApp sur Maps: ${link} — Quick.cm CHAT. CONNECT. SELL FASTER.`;
		if (typeof navigator !== 'undefined' && navigator.share) navigator.share({ title: 'Quick.cm', text, url: link });
		else window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
		track('viral_share', { shopName });
	}

	$effect(() => {
		// auto scroll chat
		if (messages.length && messagesEl) {
			queueMicrotask(() => {
				messagesEl.scrollTop = messagesEl.scrollHeight;
			});
		}
	});

	function openChat() {
		showChat = true;
		track('open_chat', { source: 'hero_cta' });
		if (messages.length === 0) resetChat();
		if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
	}

	function closeChat() {
		showChat = false;
		if (typeof document !== 'undefined') document.body.style.overflow = '';
		track('close_chat');
	}

	function resetChat() {
		messages = [
			{
				id: 1,
				role: 'assistant',
				text: "Yo O Mboa! C'est Quick. Tu es là pour vendre ou pour trouver aujourd'hui?"
			}
		];
		quickReplies = ['Je vends au quartier', 'Je cherche à côté'];
		mode = null;
		sellerStep = 0;
		buyerStep = 0;
		isTyping = false;
		hasCompleted = false;
	}

	const delay = (ms) => new Promise((r) => setTimeout(r, ms));

	async function addAssistant(text, opts = {}) {
		isTyping = true;
		await delay(opts.delay ?? 650);
		isTyping = false;
		messages = [
			...messages,
			{
				id: Date.now() + Math.random(),
				role: 'assistant',
				text,
				component: opts.component,
				meta: opts.meta
			}
		];
		quickReplies = opts.quickReplies ?? [];
	}

	function addUser(text) {
		messages = [
			...messages,
			{
				id: Date.now() + Math.random(),
				role: 'user',
				text
			}
		];
		quickReplies = [];
	}

	async function handleFlow(userText) {
		if (!userText.trim()) return;
		const txt = userText.trim();
		addUser(txt);
		inputValue = '';

		if (!mode) {
			if (txt.toLowerCase().includes('vend')) {
				mode = 'seller';
				sellerStep = 1;
				await addAssistant("Top! C'est quoi le nom de ta boutique?", { quickReplies: [] });
			} else {
				mode = 'buyer';
				buyerStep = 1;
				await addAssistant("Tcha! Bienvenue O Mboa! Tu cherches quoi exactement?", {
					quickReplies: ['iPhone 13', 'Chaussures', 'Pagne', 'Cosmétiques']
				});
			}
			return;
		}

		if (mode === 'seller') {
			if (sellerStep === 1) {
				shopName = txt;
				sellerStep = 2;
				await addAssistant(`Top ${shopName}! Tu vends depuis quel quartier? Ex: Akwa, Bastos, Bonaberi`, {
					quickReplies: ['Akwa', 'Bastos', 'Bonabéri', 'Mendong']
				});
			} else if (sellerStep === 2) {
				quartier = txt;
				sellerStep = 3;
				await addAssistant(`Parfait. Tu vends quoi là-bas à ${quartier}? Donne 2-3 produits.`, {
					quickReplies: ['Chaussures', 'iPhones', 'Pagnes', 'Cosmétiques']
				});
			} else if (sellerStep === 3) {
				produits = txt;
				sellerStep = 4;
				await addAssistant('Boom! Voilà comment tu apparais direct:', {
					component: 'seller_preview',
					meta: { shopName, quartier, produits }
				});
				await delay(500);
				sellerStep = 5;
				await addAssistant("Le Continent te cherche déjà. Connecte ton WhatsApp pour recevoir les clients direct?", {
					component: 'seller_final'
				});
			}
		} else if (mode === 'buyer') {
			if (buyerStep === 1) {
				searchQuery = txt;
				buyerStep = 2;
				await addAssistant(`Ok ${searchQuery}. Dans quel kwat tu veux chercher?`, {
					quickReplies: ['Près de moi', 'Akwa', 'Bonamoussadi', 'Yaoundé']
				});
			} else if (buyerStep === 2) {
				buyerQuartier = txt;
				buyerStep = 3;
				await addAssistant('Je fouille...', { component: 'buyer_scanning' });
				await delay(1200);
				buyerStep = 4;
				await addAssistant(`J'ai trouvé ça pour toi:`, {
					component: 'buyer_results',
					meta: { searchQuery, buyerQuartier }
				});
				await delay(350);
				buyerStep = 5;
				await addAssistant(`Voilà 2 shops qui ont ça SUR PLACE à ${buyerQuartier}. Tu veux chatter avec qui?`, {
					quickReplies: ['Chatter avec Etam Boutique', 'Chatter avec Tech Hub']
				});
			} else if (buyerStep >= 4) {
				const shop = txt.toLowerCase().includes('etam') ? 'Etam Boutique Akwa' : 'Tech Hub Bastos';
				if (typeof window !== 'undefined') {
					window.open(
						`https://wa.me/237677957755?text=${encodeURIComponent(`Salut ${shop}, je cherche ${searchQuery} à ${buyerQuartier}. Dispo sur place?`)}`,
						'_blank'
					);
				}
				await addAssistant(`Parfait! J'ouvre WhatsApp avec ${shop}. Le business reste au kwat! 🙌`);
				hasCompleted = true;
			}
		}
	}

	function handleSend() {
		if (!inputValue.trim()) return;
		handleFlow(inputValue.trim());
	}

	function handleQuickReply(r) {
		handleFlow(r);
	}

	function handleKey(e) {
		if (e.key === 'Enter') handleSend();
	}

	function connectWhatsapp() {
		const msg = `Salut Quick! Je suis ${shopName} à ${quartier} et je vends ${produits}. Je veux être visible sur Maps.`;
		if (typeof window !== 'undefined') {
			window.open(`https://wa.me/237677957755?text=${encodeURIComponent(msg)}`, '_blank');
		}
		hasCompleted = true;
		closeChat();
	}

	let proofData = $state({
		seller: [
			{ label: 'Chaussures', price: '12k FCFA' },
			{ label: 'Pagne', price: '8k' },
			{ label: 'iPhone', price: '245k' }
		],
		buyer: [
			{ name: 'Etam Boutique Akwa', dist: '400m', stock: 'Disponible' },
			{ name: 'Tech Hub Bastos', dist: '620m', stock: 'Stock' }
		]
	});
</script>


<!-- ANALYTICS INTEGRATED - Facebook, Google, TikTok via GTM + direct fallback -->
<!-- Keep UI identical, only <svelte:head> changes -->

<svelte:head>
	<title>Quick.cm — Le business commence ici.</title>
	<meta name="description" content="Ton catalogue WhatsApp plus ta position égale clients du kwat qui te trouvent sur Maps." />
	<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%2310C66F' d='M16 3C9 3 4 8 4 13.5c0 3 1.5 5.5 4.2 7.1L7 27l5.7-2.3c1 .3 2 .5 3.3 .5 7 0 12-4.8 12-10.7S23 3 16 3zm0 2c5.8 0 10 3.9 10 8.7S21.8 22.8 16 22.8c-1 0-1.9-.1-2.8-.4L10 23.6l.8-3.3C8.8 19 6 16.8 6 13.7 6 8.9 10.2 5 16 5z'/%3E%3Cpath fill='%2310C66F' d='M20.2 4.2L12 14.2l4.2.2L13 26l11-13.8-5.4-.3 1.6-7.7z'/%3E%3C/svg%3E" />
	<style>
		:root { --ink:#111213; --emerald:#10C66F; --cobalt:#204CFF; --border:#E5E7EB; --bg:#FAFAF9; }
		* { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
	</style>

	<!-- 1. GOOGLE TAG MANAGER - Master container for all pixels -->
	<script>
		(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-HLVYNHFSKG');
	</script>

	<!-- 2. GA4 - Consent Mode default denied (GDPR + Cameroon) -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-HLVYNHFSKG"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('consent', 'default', { ad_storage:'denied', analytics_storage:'denied', ad_user_data:'denied', ad_personalization:'denied' });
		gtag('config', 'G-HLVYNHFSKG');
		gtag('config', 'GT-W6JZCFFR');
	</script>

	<!-- 3. META PIXEL (Facebook) - Direct + via GTM -->
	<script>
		!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
		fbq('init', '1708048603852413');
		fbq('track', 'PageView');
	</script>
	<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1708048603852413&ev=PageView&noscript=1" /></noscript>

	<!-- 4. TIKTOK PIXEL -->
	<script>
		!function (w, d, t) {
		  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
		  ttq.load('TIKTOK_1708048603852413');
		  ttq.page();
		}(window, document, 'ttq');
	</script>
</svelte:head>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-HLVYNHFSKG" height="0" width="0" style="display:none;visibility:hidden" title="GTM"></iframe></noscript>


<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-HLVYNHFSKG" height="0" width="0" style="display:none;visibility:hidden" title="GTM"></iframe></noscript>
<div
	class="min-h-screen w-full bg-white overflow-x-hidden relative flex flex-col selection:bg-[#10C66F]/20"
	style="background-image: radial-gradient(#E5E7EB 1px, transparent 1px); background-size: 24px 24px;"
>
	<!-- TOP META -->
	<div class="w-full flex flex-col items-center pt-6 md:pt-8 px-4 gap-4">
		<!-- Badge -->
		<div
			class="inline-flex items-center gap-2 border border-[#E5E7EB] bg-white px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.14em] text-[#111213]/60"
		>
			<span class="relative flex w-[6px] h-[6px]">
				<span class="absolute inset-0 bg-[#10C66F] rounded-full animate-[pulseDot_1.5s_ease-out_infinite]"></span>
				<span class="relative w-[6px] h-[6px] bg-[#10C66F] rounded-full"></span>
			</span>
			CUSTOMER ACQUISITION SYSTEM • MADE IN CAMEROON
		</div>

		<!-- Logo Pill -->
		<div
			class="inline-flex items-center gap-2.5 bg-white border border-[#E5E7EB] px-4 py-2 rounded-full z-10"
		>
			<!-- Flat SVG Logo - speech bubble + lightning + up arrow - under 1kb -->
			<svg
				width="28"
				height="28"
				viewBox="0 0 32 32"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				class="text-[#10C66F]"
			>
				<path
					d="M16 2.8C8.5 2.8 3 7.2 3 13.2C3 16.2 4.6 18.8 7.2 20.6L6 27L12.4 22.5C13.6 22.8 14.8 23 16 23C23.5 23 29 18.6 29 13.2C29 7.2 23.5 2.8 16 2.8Z"
					stroke="currentColor"
					stroke-width="2.1"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M19.2 3.5L11.8 13.6H16.2L13.3 26.2L24.8 11.8H19.8L23 3.5H19.2Z"
					fill="currentColor"
				/>
			</svg>
			<span class="font-bold tracking-tight text-[15px] text-[#111213]">Quick.cm</span>
			<span class="hidden sm:inline text-[10px] text-[#111213]/50 ml-1 tracking-wide"
				>Douala • Yaoundé • Partout au Kwat</span
			>
		</div>
	</div>

	<!-- HERO -->
	<main
		class="flex-1 flex flex-col items-center justify-center w-full max-w-[720px] mx-auto px-4 py-10 md:py-20"
	>
		<h1
			class="font-[800] text-[#111213] text-center leading-[0.95] tracking-[-0.03em] text-[46px] md:text-[64px]"
		>
			Le business<br />commence ici.
		</h1>

		<!-- Alternating Accent Line -->
		<div class="mt-5 h-[24px] overflow-hidden relative">
			{#key accent}
				<div
					class="flex items-center gap-2 text-[14px] font-medium tracking-tight animate-[slideUpAccent_400ms_cubic-bezier(0.16,1,0.3,1)]"
				>
					{#if accent === 0}
						<span class="relative w-[6px] h-[6px] bg-[#10C66F] rounded-full"></span>
						<span class="text-[#111213]/80">→ Catalogue WhatsApp → Visible sur Maps</span>
					{:else}
						<span class="relative w-[6px] h-[6px] bg-[#204CFF] rounded-full"></span>
						<span class="text-[#111213]/80">→ Clients à côté te trouvent → Te chattent direct</span>
					{/if}
				</div>
			{/key}
		</div>

		<p
			class="mt-4 text-[16px] leading-[1.5] text-[#111213]/70 text-center max-w-[480px] mx-auto"
		>
			Trouve ou crée ton catalogue WhatsApp, connecte-le à Google Maps sans difficulté.
		</p>

		<!-- Proof Card -->
		<div
			class="w-full max-w-[95vw] md:w-[380px] border border-[#E5E7EB] rounded-[16px] bg-white p-3 mt-8 relative"
		>
			{#key accent}
				<div class="animate-[fadeIn_300ms_ease-out]">
					{#if accent === 0}
						<!-- SELLER STATE -->
						<div class="flex gap-2 overflow-x-auto scrollbar-none pb-1">
							{#each proofData.seller as prod}
								<div
									class="shrink-0 border border-[#E5E7EB] rounded-full px-2.5 py-1 text-[11px] font-medium bg-[#FAFAF9] flex items-center gap-1.5"
								>
									<span class="text-[#111213]">{prod.label}</span>
									<span class="w-px h-3 bg-[#E5E7EB]"></span>
									<span class="text-[#111213]/60">{prod.price}</span>
								</div>
							{/each}
						</div>
						<!-- mini map -->
						<div
							class="mt-2.5 h-[56px] bg-[#F9FAFB] rounded-[10px] border border-[#E5E7EB]/60 relative overflow-hidden flex items-center justify-center"
						>
							<div class="absolute inset-0 opacity-[0.06]" style="background-image: radial-gradient(#111213 1px, transparent 1px); background-size: 12px 12px;"></div>
							<div class="relative w-full h-full">
								<span class="absolute left-[22%] top-[38%] w-2 h-2 bg-[#10C66F] rounded-full">
									<span class="absolute inset-0 bg-[#10C66F] rounded-full animate-[pulseDot_1.4s_ease-out_infinite]"></span>
								</span>
								<span class="absolute left-[54%] top-[58%] w-2 h-2 bg-[#10C66F] rounded-full">
									<span class="absolute inset-0 bg-[#10C66F] rounded-full animate-[pulseDot_1.4s_0.2s_ease-out_infinite]"></span>
								</span>
								<span class="absolute left-[78%] top-[32%] w-2 h-2 bg-[#10C66F] rounded-full">
									<span class="absolute inset-0 bg-[#10C66F] rounded-full animate-[pulseDot_1.4s_0.4s_ease-out_infinite]"></span>
								</span>
							</div>
						</div>
						<div class="mt-2.5 flex items-center justify-between text-[10px] text-[#111213]/60">
							<span class="flex items-center gap-1.5">
								<span class="w-[5px] h-[5px] bg-[#10C66F] rounded-full animate-[pulseDot_1.5s_infinite]"></span>
								Acquis: 3 produits live à Akwa • 12 vues aujourd'hui
							</span>
						</div>
					{:else}
						<!-- BUYER STATE -->
						<div class="flex flex-col gap-2">
							{#each proofData.buyer as shop}
								<div class="flex items-center justify-between border border-[#E5E7EB] rounded-[12px] px-3 py-2.5 bg-white">
									<div class="flex flex-col">
										<span class="text-[12px] font-semibold text-[#111213] leading-none">{shop.name}</span>
										<span class="text-[10px] text-[#111213]/60 mt-1">{shop.dist} — {shop.stock}</span>
									</div>
									<span class="w-2 h-2 rounded-full bg-[#10C66F]"></span>
								</div>
							{/each}
						</div>
						<div class="mt-2.5 flex items-center justify-between text-[10px] text-[#111213]/60">
							<span class="flex items-center gap-1.5">
								<span class="w-[5px] h-[5px] bg-[#204CFF] rounded-full animate-[pulseDot_1.5s_infinite]"></span>
								Acquis: 2 shops trouvés à 400m • Chat ouvert
							</span>
						</div>
					{/if}
				</div>
			{/key}
			<!-- 1px detail accent line bottom -->
			<div class="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-[#10C66F]/0 via-[#E5E7EB] to-[#204CFF]/0"></div>
		</div>

		<!-- Primary CTA Desktop -->
		<button
			on:click={openChat}
			class="hidden md:flex mt-8 bg-[#111213] text-white rounded-full px-8 py-4 font-semibold text-[15px] items-center gap-2.5 mx-auto hover:scale-[1.02] active:scale-[0.98] transition-transform"
			aria-label="Ouvrir Quick.cm"
		>
			<span class="flex items-center gap-1">
				<span class="w-[6px] h-[6px] rounded-full bg-[#10C66F]"></span>
				<span class="w-[6px] h-[6px] rounded-full bg-[#204CFF]"></span>
			</span>
			Ouvrir Quick.cm
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<path d="M3 8H13M9 3L14 8L9 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>

		<p class="hidden md:block mt-3 text-[11px] text-[#111213]/50 text-center">
			Pas de formulaire. 30s. On te demande tout en chat.
		</p>

		<p class="mt-6 text-center text-[13px] leading-[1.4] text-[#111213]/60 max-w-[360px] md:hidden">
			Ton catalogue WhatsApp plus ta position égale clients du kwat qui te trouvent sur Maps. Sans site, sans code, sans difficulté.
		</p>
	</main>

	<!-- MOBILE STICKY CTA -->
	<div
		class="md:hidden sticky bottom-0 z-30 w-full p-4 bg-white/80 backdrop-blur border-t border-[#E5E7EB]"
	>
		<button
			on:click={openChat}
			class="w-full bg-[#111213] text-white rounded-full px-6 py-4 font-semibold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
		>
			<span class="flex items-center gap-1">
				<span class="w-[6px] h-[6px] rounded-full bg-[#10C66F]"></span>
				<span class="w-[6px] h-[6px] rounded-full bg-[#204CFF]"></span>
			</span>
			Ouvrir Quick.cm
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M3 8H13M9 3L14 8L9 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
		<p class="mt-2 text-[11px] text-[#111213]/50 text-center">Pas de formulaire. 30s. On te demande tout en chat.</p>
	</div>

	<!-- Explainer Strip -->
	<section class="w-full border-t border-[#E5E7EB] bg-[#FAFAF9] py-16 px-6">
		<div class="max-w-[960px] mx-auto">
			<p class="text-[12px] uppercase tracking-[0.14em] text-[#111213]/60">
				Comment ça marche? Pas un site. Un système d'acquisition.
			</p>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mt-8">
				<!-- CONNECTE -->
				<div class="flex flex-col gap-3">
					<div class="flex items-center gap-2">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111213" stroke-width="1.6" aria-hidden="true">
							<path d="M5 19V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-5 2v-2Z" />
							<path d="M12 9v6M9 12h6" />
						</svg>
						<span class="w-[6px] h-[6px] rounded-full bg-[#10C66F]"></span>
					</div>
					<h3 class="font-bold text-[14px] tracking-tight text-[#111213]">CONNECTE</h3>
					<p class="text-[13px] leading-[1.5] text-[#111213]/70">
						Importe ton catalogue WhatsApp en 10s. Ou crée-le direct dans le chat. Photos, prix en FCFA, stock.
					</p>
				</div>
				<!-- AFFICHE -->
				<div class="flex flex-col gap-3">
					<div class="flex items-center gap-2">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111213" stroke-width="1.6" aria-hidden="true">
							<path d="M12 21s6-4.5 6-10a6 6 0 1 0-12 0c0 5.5 6 10 6 10Z" />
							<path d="M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
							<path d="M14.5 9L13 11.5H14.5L13.5 14.5L16 11H14.5L14.5 9Z" fill="currentColor" stroke="none" />
						</svg>
						<span class="w-[6px] h-[6px] rounded-full bg-[#204CFF]"></span>
					</div>
					<h3 class="font-bold text-[14px] tracking-tight text-[#111213]">AFFICHE</h3>
					<p class="text-[13px] leading-[1.5] text-[#111213]/70">
						On te met sur Google Maps automatiquement. Ton kwat te voit: Akwa, Bastos, Bonabéri, Mendong, Yaoundé...
					</p>
				</div>
				<!-- ENCAISSE -->
				<div class="flex flex-col gap-3">
					<div class="flex items-center gap-2">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111213" stroke-width="1.6" aria-hidden="true">
							<path d="M4 17V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9l-5 2v-1Z" />
							<path d="M9 14L12 11L9 8" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						<span class="w-[6px] h-[6px] rounded-full bg-[#111213]"></span>
					</div>
					<h3 class="font-bold text-[14px] tracking-tight text-[#111213]">ENCAISSE</h3>
					<p class="text-[13px] leading-[1.5] text-[#111213]/70">
						Le client cherche, te trouve à côté, te chatte sur WhatsApp. Pas de commission. Le business reste au kwat.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Trust Strip -->
	<div class="w-full border-t border-[#E5E7EB] bg-white py-3 px-4 text-center">
		<p class="text-[11px] tracking-wide text-[#111213]/60">
			Déjà testé à Akwa, Bastos, Bonabéri, Bonamoussadi, Mendong — Douala & Yaoundé.
		</p>
	</div>

	<!-- Footer -->
	<footer class="w-full border-t border-[#E5E7EB] py-8 px-4 text-center">
		<p class="text-[11px] text-[#111213]/50">© 2026 Quick.cm — Douala, Cameroun. Le système local.</p>
		<p class="mt-2 text-[10px] uppercase tracking-[0.12em] text-[#111213]/40">CHAT. CONNECT. SELL FASTER.</p>
	</footer>

	<!-- CHAT OVERLAY -->
	{#if showChat}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center p-0 md:p-4"
			on:click={closeChat}
		>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class="chat-window w-full md:w-[380px] max-w-[95vw] md:max-w-[380px] h-[85vh] md:h-[520px] bg-white rounded-t-[16px] md:rounded-[16px] border border-[#E5E7EB] flex flex-col animate-[slideUpChat_300ms_ease-out]"
				role="dialog"
				aria-modal="true"
				aria-label="Quick Assistant Local"
				on:click|stopPropagation={() => {}}
			>
				<!-- Header -->
				<div class="h-14 border-b border-[#E5E7EB] px-4 flex items-center gap-3 shrink-0 bg-white rounded-t-[16px]">
					<svg width="20" height="20" viewBox="0 0 32 32" fill="none" class="text-[#10C66F] shrink-0">
						<path
							d="M16 2.8C8.5 2.8 3 7.2 3 13.2C3 16.2 4.6 18.8 7.2 20.6L6 27L12.4 22.5C13.6 22.8 14.8 23 16 23C23.5 23 29 18.6 29 13.2C29 7.2 23.5 2.8 16 2.8Z"
							stroke="currentColor"
							stroke-width="2.1"
							fill="none"
						/>
						<path d="M19.2 3.5L11.8 13.6H16.2L13.3 26.2L24.8 11.8H19.8L23 3.5H19.2Z" fill="currentColor" />
					</svg>
					<div class="flex flex-col leading-none">
						<span class="font-bold text-[14px] text-[#111213]">Quick - Assistant Local</span>
						<span class="text-[10px] text-[#111213]/60 mt-0.5 flex items-center gap-1">
							<span class="relative w-[8px] h-[8px] bg-[#10C66F] rounded-full">
								<span class="absolute inset-0 bg-[#10C66F] rounded-full animate-[pulseDot_1.2s_ease-out_infinite]"></span>
							</span>
							En ligne • Douala
						</span>
					</div>
					<button
						on:click={closeChat}
						class="ml-auto w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#111213]/60 hover:bg-[#111213] hover:text-white hover:border-[#111213] transition-colors"
						aria-label="Fermer"
					>
						<svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 2L14 14M14 2L2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
					</button>
				</div>

				<!-- Messages -->
				<div
					bind:this={messagesEl}
					class="flex-1 overflow-y-auto p-4 gap-3 flex flex-col bg-[#FCFCFB]"
					aria-live="polite"
					aria-atomic="false"
				>
					{#each messages as msg (msg.id)}
						{#if msg.role === 'user'}
							<div
								class="self-end max-w-[78%] bg-[#111213] text-white rounded-[18px] rounded-br-[6px] px-4 py-2.5 text-[14px] leading-[1.4]"
							>
								{msg.text}
							</div>
						{:else}
							<div class="self-start relative max-w-[85%] flex flex-col gap-2">
								<div
									class="bg-white border border-[#E5E7EB] rounded-[18px] rounded-bl-[6px] px-4 py-2.5 text-[14px] text-[#111213] leading-[1.4] relative"
								>
									{#if mode}
										<span
											class="absolute -left-1 -top-1 w-2 h-2 rounded-full {mode === 'seller'
												? 'bg-[#10C66F]'
												: 'bg-[#204CFF]'}"
										></span>
									{/if}
									{msg.text}
								</div>

								{#if msg.component === 'seller_preview'}
									<div class="bg-[#F9FAFB] rounded-[12px] p-3 border border-[#E5E7EB] w-[280px]">
										<div class="flex gap-2 mb-2">
											{#each (msg.meta?.produits?.split(',')?.slice(0, 3) ?? ['Chaussures', 'Pagne', 'iPhone']) as p}
												<div
													class="flex-1 border border-[#E5E7EB] rounded-[10px] bg-white p-2 text-[11px] text-center font-medium"
												>
													{p.trim()}
												</div>
											{/each}
										</div>
										<div
											class="h-[44px] bg-white rounded-[8px] border border-[#E5E7EB]/60 relative overflow-hidden"
										>
											<div class="absolute inset-0 opacity-[0.04]" style="background-image: radial-gradient(#111213 1px, transparent 1px); background-size: 10px 10px;"></div>
											<span class="absolute left-[25%] top-[40%] w-1.5 h-1.5 bg-[#10C66F] rounded-full"></span>
											<span class="absolute left-[55%] top-[60%] w-1.5 h-1.5 bg-[#10C66F] rounded-full"></span>
											<span class="absolute left-[75%] top-[30%] w-1.5 h-1.5 bg-[#10C66F] rounded-full"></span>
										</div>
										<p class="mt-2 text-[10px] text-[#111213]/60">
											{msg.meta?.shopName ?? 'Ta boutique'} • {msg.meta?.quartier ?? 'Akwa'} • 12 vues aujourd'hui
										</p>
									</div>
								{:else if msg.component === 'seller_final'}
									<button
										on:click={connectWhatsapp}
										class="w-[280px] bg-[#10C66F] text-white rounded-full py-3 font-semibold text-[13px] flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-transform"
									>
										Connecter WhatsApp →
									</button>
								{:else if msg.component === 'buyer_scanning'}
									<div class="bg-white border border-[#E5E7EB] rounded-[12px] p-3 w-[280px] overflow-hidden relative">
										<div class="text-[11px] text-[#111213]/60 mb-2 flex items-center gap-1.5">
											<span class="w-1 h-1 bg-[#204CFF] rounded-full animate-[pulseDot_1s_infinite]"></span>
											Scan du kwat...
										</div>
										<div class="h-[2px] bg-[#E5E7EB] rounded-full relative overflow-hidden">
											<div class="absolute inset-y-0 w-[40%] bg-[#204CFF] animate-[scanLine_1.2s_ease-in-out_infinite]"></div>
										</div>
									</div>
								{:else if msg.component === 'buyer_results'}
									<div class="flex flex-col gap-2 w-[280px]">
										<div class="border border-[#E5E7EB] rounded-[12px] p-3 bg-white">
											<div class="flex justify-between items-start">
												<span class="font-bold text-[13px] text-[#111213]">Etam Boutique Akwa</span>
												<span class="text-[10px] px-1.5 py-0.5 rounded-full bg-[#10C66F]/10 text-[#10C66F] border border-[#10C66F]/20 flex items-center gap-1">
													<span class="w-1 h-1 bg-[#10C66F] rounded-full"></span> Disponible
												</span>
											</div>
											<p class="text-[11px] text-[#111213]/60 mt-1">
												{msg.meta?.searchQuery} — 350k FCFA • 400m
											</p>
											<button
												on:click={() => handleFlow('Chatter avec Etam Boutique')}
												class="mt-2 w-full bg-[#111213] text-white rounded-full py-1.5 text-[11px] font-medium"
											>
												Chatter
											</button>
										</div>
										<div class="border border-[#E5E7EB] rounded-[12px] p-3 bg-white">
											<div class="flex justify-between items-start">
												<span class="font-bold text-[13px] text-[#111213]">Tech Hub Bastos</span>
												<span class="text-[10px] px-1.5 py-0.5 rounded-full bg-[#10C66F]/10 text-[#10C66F] border border-[#10C66F]/20 flex items-center gap-1">
													<span class="w-1 h-1 bg-[#10C66F] rounded-full"></span> Stock
												</span>
											</div>
											<p class="text-[11px] text-[#111213]/60 mt-1">
												{msg.meta?.searchQuery} — 345k FCFA • 620m
											</p>
											<button
												on:click={() => handleFlow('Chatter avec Tech Hub')}
												class="mt-2 w-full bg-white border border-[#E5E7EB] text-[#111213] rounded-full py-1.5 text-[11px] font-medium hover:bg-[#111213] hover:text-white transition-colors"
											>
												Chatter
											</button>
										</div>
									</div>
								{/if}
							</div>
						{/if}
					{/each}

					{#if isTyping}
						<div
							class="self-start bg-white border border-[#E5E7EB] rounded-[18px] rounded-bl-[6px] px-4 py-3 flex items-center gap-1"
						>
							<span class="w-1.5 h-1.5 bg-[#111213]/60 rounded-full animate-[bounceDot_1s_0s_infinite]"></span>
							<span class="w-1.5 h-1.5 bg-[#111213]/60 rounded-full animate-[bounceDot_1s_0.12s_infinite]"></span>
							<span class="w-1.5 h-1.5 bg-[#111213]/60 rounded-full animate-[bounceDot_1s_0.24s_infinite]"></span>
							<svg width="10" height="10" viewBox="0 0 24 24" class="ml-1 text-[#10C66F] animate-[pulseDot_1s_infinite]">
								<path d="M13 2L4 14h5l-2 8 9-12h-5l2-8z" fill="currentColor" />
							</svg>
						</div>
					{/if}
				</div>

				<!-- Quick Replies -->
				{#if quickReplies.length > 0}
					<div class="px-4 pb-2 flex flex-wrap gap-2 bg-white">
						{#each quickReplies as qr}
							<button
								on:click={() => handleQuickReply(qr)}
								class="border border-[#E5E7EB] rounded-full px-3 py-1.5 text-[12px] font-medium bg-white text-[#111213] hover:bg-[#111213] hover:text-white hover:border-[#111213] transition-colors"
							>
								{qr}
							</button>
						{/each}
					</div>
				{/if}

				<!-- Input -->
				<div class="border-t border-[#E5E7EB] p-3 flex gap-2 items-center bg-white shrink-0 rounded-b-[16px]">
					<input
						bind:value={inputValue}
						on:keydown={handleKey}
						placeholder={mode === 'seller'
							? 'Ex: Boutique Etam Akwa'
							: mode === 'buyer'
								? 'Ex: iPhone 13'
								: 'Écris ici...'}
						class="flex-1 rounded-full border border-[#E5E7EB] px-4 py-2.5 text-[14px] outline-none focus:border-[#111213] transition-colors bg-white placeholder:text-[#111213]/40"
						autocomplete="off"
					/>
					<button
						on:click={handleSend}
						class="w-9 h-9 rounded-full bg-[#111213] text-white flex items-center justify-center shrink-0 hover:scale-[1.05] active:scale-[0.95] transition-transform"
						aria-label="Envoyer"
					>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<path d="M3 8H13M9 3L14 8L9 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes slideUpAccent {
		from {
			transform: translateY(16px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
	@keyframes slideUpChat {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes pulseDot {
		0% {
			transform: scale(1);
			opacity: 0.9;
		}
		70% {
			transform: scale(2.4);
			opacity: 0;
		}
		100% {
			transform: scale(2.4);
			opacity: 0;
		}
	}
	@keyframes bounceDot {
		0%,
		80%,
		100% {
			transform: translateY(0);
		}
		40% {
			transform: translateY(-4px);
		}
	}
	@keyframes scanLine {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(250%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			animation: none !important;
			transition: none !important;
		}
	}
	:global(*:focus-visible) {
		outline: 2px solid #111213;
		outline-offset: 2px;
	}
</style>
