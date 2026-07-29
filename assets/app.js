/* ================================================================
   BEASTCONVERTER — CLIENT-SIDE APPLICATION LOGIC
   Organized in clearly separated modules:
     1. i18n            — language strings + RTL handling
     2. TOOLS config     — the list of supported conversions
     3. Counter/paywall  — 3-per-15-min business logic (localStorage)
     4. AdBlock detection
     5. File handling / dropzone
     6. Converters        — the actual pdf-lib / heic2any / xlsx code
     7. Stripe / cookie consent placeholders
     8. Wiring / init
   ================================================================ */

/* ---------------------------------------------------------------
   1. I18N — English + Danish. English is the fallback for any
   missing key in Danish.
   --------------------------------------------------------------- */
const I18N = {
  en: { dir:'ltr', name:'English',
    seo:{ title:'BeastConverter: Free, Private PDF to Word & File Converter', description:'Convert PDF to Word, compress PDF, and more — 100% in your browser. Files are never uploaded to a server. Free, private, secure file conversion.' },
    eyebrow:'100% local · nothing ever uploaded',
    nav_beastpass:'Beast Pass · $1/24h',
    nav_free:'Free',
    hero_title:'Convert files like a <em>beast.</em> Right in your browser.',
    hero_sub:'Images, PDFs and spreadsheets — converted instantly on your own device. No servers, no waiting rooms, no stranger touching your files.',
    meter_label:'conversions remaining', meter_window:'resets on a rolling 15-minute window', meter_label_pass:'conversions — Beast Pass active', meter_pass_expires:'Beast Pass expires in',
    drop_title:'Drag files here to unleash the beast',
    drop_sub:'or choose files from your device — they never leave it',
    drop_browse:'Browse files',
    drop_formats:'HEIC · PNG · JPG · WEBP · PDF · CSV — max 50MB per file',
    tools_kicker:'Choose your weapon',
    tools_title:'Every tool runs offline, in your tab',
    bar_selected:'Selected tool', bar_none:'none', bar_files:'Files', bar_convert:'Convert now',
    results_kicker:'Fresh out of the den', results_title:'Your files are ready',
    ad_placeholder:'Advertisement — 728×90', ad_placeholder_sidebar:'Advertisement — 300×600',
    pw_title:'The beast needs to rest',
    pw_sub:"You've used all 3 free conversions. They reset automatically — or skip the wait below.",
    pw_countdown_label:'until your free conversions reset',
    pw_video:'Watch a 30s video to convert instantly for free', pw_video_sub:'Rewarded video · no account needed',
    pw_pass:'Unlock instantly with a 24-Hour Beast Pass — $1 USD', pw_pass_sub:'Unlimited conversions · secured by Stripe',
    pw_value_compare_title:'Why a Beast Pass?', pw_value_compare_body:'Other online tools charge $10+/month. BeastConverter gives you 24 hours of premium local power for just $1. No subscriptions. No hidden traps. 100% SSL secure via Stripe. Ads stay on — that\'s how we keep it this cheap.',
    ab_title:'We noticed an ad blocker',
    ab_sub:"We get it, ads can be annoying. But unlike other converters, BeastConverter runs 100% in your browser. We don't harvest your data, and we don't use expensive cloud servers. We just need ads to keep the beast alive. Please whitelist us to continue for free, watch a quick rewarded video, or grab a $1 pass.",
    ab_video:'Watch a quick video instead',
    ab_whitelist:"I've whitelisted the site", ab_pass:'Get Beast Pass instead — $1',
    cookie_text:'We use cookies for ads and basic analytics. No file data is ever collected — conversions happen entirely on your device.',
    cookie_decline:'Decline', cookie_accept:'Accept',
    footer_tagline:'Local-first file conversion. Your files stay on your device, always.',
    footer_tools:'Tools', footer_tools_1:'Image conversion', footer_tools_2:'PDF tools', footer_tools_3:'Spreadsheets',
    footer_company:'Company', footer_privacy:'Privacy policy', footer_terms:'Terms of use', footer_contact:'Contact', footer_legal:'Legal notice',
    contact_title:'Get in touch', contact_sub:"Questions, bug reports, or a Beast Pass billing issue — send a message and we'll get back to you.",
    contact_name:'Name', contact_email:'Email', contact_message:'Message', contact_send:'Send message',
    contact_success:"Thanks — that's on its way to us.", contact_error:'Something went wrong sending that. Try emailing us directly instead.',
    contact_direct:'Prefer email? Write to <a href="mailto:contact@beastconverter.com" style="color:inherit; text-decoration:underline;">contact@beastconverter.com</a> directly.',
    footer_note:'Built with zero servers. Powered by your CPU.', download:'Download',
    t_heic2jpg_name:'HEIC to JPG', t_heic2jpg_desc:'Convert iPhone photos to universally-readable JPG.',
    t_png2jpg_name:'PNG to JPG', t_png2jpg_desc:'Flatten transparency and shrink file size.',
    t_webp_name:'WebP to PNG/JPG', t_webp_desc:'Unlock WebP images for apps that need older formats.',
    t_img2pdf_name:'Images to PDF', t_img2pdf_desc:'Combine one or more images into a single PDF.',
    t_pdf2img_name:'PDF to Images', t_pdf2img_desc:'Export every page of a PDF as a PNG image.',
    t_mergepdf_name:'Merge PDF', t_mergepdf_desc:'Stitch multiple PDFs into one document, in order.',
    t_splitpdf_name:'Split PDF', t_splitpdf_desc:'Pull every page of a PDF out as its own file.',
    t_csv2xlsx_name:'CSV to Excel', t_csv2xlsx_desc:'Turn a CSV into a properly formatted .xlsx workbook.',
    t_pdf2word_name:'PDF to Word', t_pdf2word_desc:'Extract text into an editable .docx you can revise.',
    t_compresspdf_name:'Compress PDF', t_compresspdf_desc:'Shrink file size by stripping redundant PDF structure.',
    t_word2pdf_name:'Word to PDF', t_word2pdf_desc:'Turn a .docx into a shareable, print-ready PDF.',
    t_pdf2text_name:'PDF to Text', t_pdf2text_desc:'Pull the plain text out of a PDF as a .txt file.',
    badge_popular:'Most popular',
    home_about_title:'What Is BeastConverter?',
    home_about_body:"BeastConverter is a free, browser-based file conversion tool for PDFs, images, and spreadsheets. Unlike most online converters, every conversion happens locally, on your own device — your files are never uploaded to a server, stored in the cloud, or seen by anyone but you. That means faster results, no waiting for uploads or downloads to finish, and none of the privacy risk that comes with handing sensitive documents to a stranger's server. Whether you're converting a PDF to Word, compressing a bulky file, or turning an iPhone photo into a JPG, the entire process runs inside your browser tab using modern web technology — no installation, no account, and nothing left behind once you close the tab.",
    home_how_title:'How BeastConverter Works',
    home_how_1:'Choose a tool from the grid below — PDF to Word, Compress PDF, HEIC to JPG, and more.',
    home_how_2:'Drop in your file, or select it from your device.',
    home_how_3:'Your browser processes the file directly, using JavaScript running on your own CPU — nothing is sent anywhere.',
    home_how_4:"Download your converted file the moment it's ready.",
    home_faq_title:'Frequently Asked Questions',
    home_faq_1:'Is BeastConverter really free? Yes. Every tool includes 3 free conversions every 15 minutes, no account required. For unlimited conversions, a 24-Hour Beast Pass is available for $1.',
    home_faq_2:"How can conversion work without uploading my file? Modern browsers can run the same kind of code that used to require a server — reading, transforming, and writing files entirely in JavaScript. BeastConverter uses that capability instead of a traditional upload-process-download cycle.",
    home_faq_3:'What file types can I convert? PDFs, Word documents, spreadsheets (CSV/XLSX), and common image formats including HEIC, PNG, JPG, and WebP — see the full tool list above.',
    home_faq_4:"Is there a limit to file size? Very large or complex files depend on your own device's memory and processing power, since your browser — not a remote server — is doing the work. Closing other tabs can help with large files.",
    home_faq_5:"Is my data actually safe? Since your files never leave your device, there's no upload to intercept and no server-side storage to be breached. Your data's security depends on your own device, exactly as it would with a desktop application.",
    t_resizeimage_name:'Resize Image', t_resizeimage_desc:'Scale an image down (or up) to an exact width, right in your browser.',
    resize_width_label:'Target width', resize_width_hint:'px — height scales automatically to match',
    t_rotatepdf_name:'Rotate PDF', t_rotatepdf_desc:'Fix sideways pages — rotate every page in a PDF at once.',
    t_excel2csv_name:'Excel to CSV', t_excel2csv_desc:'Turn an .xlsx spreadsheet into a plain .csv file.',
    rotate_angle_label:'Rotation', rotate_option_90:'Rotate 90° clockwise', rotate_option_180:'Rotate 180°', rotate_option_270:'Rotate 90° counter-clockwise',
    rv_confirm_title:'Watch a quick ad?', rv_confirm_body:'A 30-second video ad gets you 3 fresh free conversions, right now.',
    rv_confirm_watch:'Watch ad', rv_confirm_cancel:'Not now',
    rv_playing_title:'Ad playing…', rv_playing_body:'(Simulated for testing — a real ad network will show its own player here.)',
    rv_success_title:'Reward granted!', rv_success_body:"You've got 3 fresh free conversions.", rv_success_continue:'Continue',
  },
  da: { dir:'ltr', name:'Dansk',
    seo:{ title:'BeastConverter – Gratis PDF til Word, 100% Privat', description:'Konverter PDF til Word, komprimer PDF og mere — 100% i din browser. Filer uploades aldrig til en server. Gratis og sikker filkonvertering.' },
    eyebrow:'100% lokalt · intet uploades nogensinde',
    nav_beastpass:'Beast Pass · $1/24t',
    nav_free:'Gratis',
    hero_title:'Konverter filer som et <em>udyr.</em> Direkte i din browser.',
    hero_sub:'Billeder, PDF\'er og regneark — konverteret øjeblikkeligt på din egen enhed. Ingen servere, ingen ventetid, ingen fremmede der rører dine filer.',
    meter_label:'konverteringer tilbage', meter_window:'nulstilles i et rullende 15-minutters vindue', meter_label_pass:'konverteringer — Beast Pass aktiv', meter_pass_expires:'Beast Pass udløber om',
    drop_title:'Træk filer hertil for at udløse udyret',
    drop_sub:'eller vælg filer fra din enhed — de forlader den aldrig',
    drop_browse:'Vælg filer',
    drop_formats:'HEIC · PNG · JPG · WEBP · PDF · CSV — maks. 50MB pr. fil',
    tools_kicker:'Vælg dit værktøj',
    tools_title:'Alle værktøjer kører offline, i din fane',
    bar_selected:'Valgt værktøj', bar_none:'ingen', bar_files:'Filer', bar_convert:'Konverter nu',
    results_kicker:'Lige ud af hulen', results_title:'Dine filer er klar',
    ad_placeholder:'Annonce — 728×90', ad_placeholder_sidebar:'Annonce — 300×600',
    pw_title:'Udyret trænger til hvile',
    pw_sub:'Du har brugt alle 3 gratis konverteringer. De nulstilles automatisk — eller spring ventetiden over nedenfor.',
    pw_countdown_label:'til dine gratis konverteringer nulstilles',
    pw_video:'Se en 30 sekunders video for at konvertere med det samme, gratis', pw_video_sub:'Belønningsvideo · intet login krævet',
    pw_pass:'Lås op med det samme med en 24-timers Beast Pass — $1 USD', pw_pass_sub:'Ubegrænsede konverteringer · sikret af Stripe',
    pw_value_compare_title:'Hvorfor en Beast Pass?', pw_value_compare_body:'Andre online værktøjer koster $10+/måned. BeastConverter giver dig 24 timers premium lokal kraft for kun $1. Intet abonnement. Ingen skjulte fælder. 100% SSL-sikret via Stripe. Reklamer forbliver — det er sådan, vi holder prisen så lav.',
    ab_title:'Vi opdagede en annonceblokering',
    ab_sub:'Vi forstår godt, at annoncer kan være irriterende. Men i modsætning til andre konverteringsværktøjer kører BeastConverter 100% i din browser. Vi høster ikke dine data, og vi bruger ikke dyre cloud-servere. Vi har bare brug for annoncer for at holde udyret i live. Whitelist os for at fortsætte gratis, se en kort belønningsvideo, eller få en $1 pas.',
    ab_video:'Se en kort video i stedet',
    ab_whitelist:'Jeg har whitelistet siden', ab_pass:'Få Beast Pass i stedet — $1',
    cookie_text:'Vi bruger cookies til annoncer og basal analyse. Ingen filer indsamles nogensinde — konverteringer sker udelukkende på din enhed.',
    cookie_decline:'Afvis', cookie_accept:'Accepter',
    footer_tagline:'Lokal filkonvertering. Dine filer forbliver altid på din enhed.',
    footer_tools:'Værktøjer', footer_tools_1:'Billedkonvertering', footer_tools_2:'PDF-værktøjer', footer_tools_3:'Regneark',
    footer_company:'Virksomhed', footer_privacy:'Privatlivspolitik', footer_terms:'Servicevilkår', footer_contact:'Kontakt', footer_legal:'Juridisk meddelelse',
    contact_title:'Kontakt os', contact_sub:'Spørgsmål, fejlrapporter eller et problem med Beast Pass-betaling — send en besked, så vender vi tilbage.',
    contact_name:'Navn', contact_email:'E-mail', contact_message:'Besked', contact_send:'Send besked',
    contact_success:'Tak — den er på vej til os.', contact_error:'Noget gik galt. Prøv i stedet at skrive til os direkte på e-mail.',
    contact_direct:'Foretrækker du e-mail? Skriv til <a href="mailto:contact@beastconverter.com" style="color:inherit; text-decoration:underline;">contact@beastconverter.com</a> direkte.',
    footer_note:'Bygget uden servere. Drevet af din CPU.', download:'Download',
    t_heic2jpg_name:'HEIC til JPG', t_heic2jpg_desc:'Konverter iPhone-billeder til universelt læsbart JPG.',
    t_png2jpg_name:'PNG til JPG', t_png2jpg_desc:'Fjern gennemsigtighed og reducer filstørrelsen.',
    t_webp_name:'WebP til PNG/JPG', t_webp_desc:'Lås op for WebP-billeder til ældre apps og formater.',
    t_img2pdf_name:'Billeder til PDF', t_img2pdf_desc:'Kombiner et eller flere billeder til én PDF.',
    t_pdf2img_name:'PDF til billeder', t_pdf2img_desc:'Eksporter hver side af en PDF som et PNG-billede.',
    t_mergepdf_name:'Flet PDF', t_mergepdf_desc:'Sammensæt flere PDF\'er til ét dokument, i rækkefølge.',
    t_splitpdf_name:'Split PDF', t_splitpdf_desc:'Træk hver side af en PDF ud som sin egen fil.',
    t_csv2xlsx_name:'CSV til Excel', t_csv2xlsx_desc:'Omdan en CSV til en korrekt formateret .xlsx-fil.',
    t_pdf2word_name:'PDF til Word', t_pdf2word_desc:'Udtræk tekst til en redigerbar .docx-fil.',
    t_compresspdf_name:'Komprimer PDF', t_compresspdf_desc:'Reducer filstørrelsen ved at fjerne overflødig PDF-struktur.',
    t_word2pdf_name:'Word til PDF', t_word2pdf_desc:'Omdan en .docx-fil til en delbar, udskriftsklar PDF.',
    t_pdf2text_name:'PDF til tekst', t_pdf2text_desc:'Træk almindelig tekst ud af en PDF som en .txt-fil.',
    badge_popular:'Mest populær',
    home_about_title:'Hvad er BeastConverter?',
    home_about_body:'BeastConverter er et gratis, browserbaseret værktøj til at konvertere PDF-filer, billeder og regneark. I modsætning til de fleste online-konverteringsværktøjer sker hver konvertering lokalt, på din egen enhed — dine filer uploades aldrig til en server, gemmes aldrig i skyen, og bliver aldrig set af andre end dig. Det betyder hurtigere resultater, ingen ventetid på upload eller download, og ingen af de privatlivsrisici, der følger med at aflevere følsomme dokumenter til en fremmed servers varetægt. Uanset om du konverterer en PDF til Word, komprimerer en stor fil, eller omdanner et iPhone-billede til JPG, kører hele processen inde i din browserfane med moderne webteknologi — ingen installation, ingen konto, og intet efterlades, når du lukker fanen.',
    home_how_title:'Sådan virker BeastConverter',
    home_how_1:'Vælg et værktøj fra oversigten nedenfor — PDF til Word, Komprimer PDF, HEIC til JPG og flere.',
    home_how_2:'Træk din fil ind, eller vælg den fra din enhed.',
    home_how_3:'Din browser behandler filen direkte, med JavaScript der kører på din egen CPU — intet sendes nogen steder.',
    home_how_4:'Download din konverterede fil, så snart den er klar.',
    home_faq_title:'Ofte stillede spørgsmål',
    home_faq_1:'Er BeastConverter virkelig gratis? Ja. Hvert værktøj giver 3 gratis konverteringer hver 15. minut, uden krav om konto. For ubegrænsede konverteringer fås en 24-timers Beast Pass for $1.',
    home_faq_2:'Hvordan kan konvertering fungere uden at uploade min fil? Moderne browsere kan køre samme slags kode, der tidligere krævede en server — at læse, omdanne og skrive filer udelukkende i JavaScript. BeastConverter bruger denne mulighed i stedet for den traditionelle upload-behandl-download-cyklus.',
    home_faq_3:'Hvilke filtyper kan jeg konvertere? PDF-filer, Word-dokumenter, regneark (CSV/XLSX) og gængse billedformater som HEIC, PNG, JPG og WebP — se hele værktøjslisten ovenfor.',
    home_faq_4:'Er der en grænse for filstørrelse? Meget store eller komplekse filer afhænger af din egen enheds hukommelse og processorkraft, da det er din browser — ikke en ekstern server — der udfører arbejdet. Det kan hjælpe at lukke andre faner ved store filer.',
    home_faq_5:'Er mine data virkelig sikre? Fordi dine filer aldrig forlader din enhed, er der ingen upload at opsnappe og ingen server-lagring, der kan brydes ind i. Sikkerheden for dine data afhænger af din egen enhed, præcis som hvis du brugte et desktop-program.',
    t_resizeimage_name:'Skaler billede', t_resizeimage_desc:'Skaler et billede op eller ned til en præcis bredde, direkte i din browser.',
    resize_width_label:'Ønsket bredde', resize_width_hint:'px — højden skaleres automatisk med',
    t_rotatepdf_name:'Rotér PDF', t_rotatepdf_desc:'Ret sidevendte sider — rotér alle sider i en PDF på én gang.',
    t_excel2csv_name:'Excel til CSV', t_excel2csv_desc:'Omdan et .xlsx-regneark til en almindelig .csv-fil.',
    rotate_angle_label:'Rotation', rotate_option_90:'Rotér 90° med uret', rotate_option_180:'Rotér 180°', rotate_option_270:'Rotér 90° mod uret',
    rv_confirm_title:'Se en kort reklame?', rv_confirm_body:'En 30 sekunders videoreklame giver dig 3 friske gratis konverteringer, med det samme.',
    rv_confirm_watch:'Se reklame', rv_confirm_cancel:'Ikke nu',
    rv_playing_title:'Reklame afspilles…', rv_playing_body:'(Simuleret til test — et rigtigt annoncenetværk vil vise sin egen afspiller her.)',
    rv_success_title:'Belønning givet!', rv_success_body:'Du har fået 3 friske gratis konverteringer.', rv_success_continue:'Fortsæt',
  },
};

/* fill in any missing keys for non-English locales from English, so nothing ever renders blank */
Object.keys(I18N).forEach(code=>{
  if(code==='en') return;
  I18N[code] = Object.assign({}, I18N.en, I18N[code]);
});

/* currentLang starts as a placeholder; the real default is resolved by
   initLanguage() (see the LANGUAGE AUTO-DETECTION block below), following
   the priority chain: saved preference → browser locale → English. */
let currentLang = 'en';

/* persist=true (the default) writes the choice to localStorage, which
   means it will always win on future visits. The automatic browser-locale
   guess passes persist=false so it never locks in ahead of a real user
   choice — the person can still change it and have that stick. */
function applyLanguage(code, persist = true){
  if(!I18N[code]) code = 'en';
  currentLang = code;
  if(persist){
    localStorage.setItem('bc_lang', code);
    syncLangToURL(code); // explicit choice → make the current URL shareable in this language
  }
  const dict = I18N[code];
  document.documentElement.lang = code;
  document.documentElement.dir = dict.dir;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(dict[key] !== undefined){ el.innerHTML = dict[key]; }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
    const key = el.getAttribute('data-i18n-placeholder');
    if(dict[key] !== undefined){ el.setAttribute('placeholder', dict[key]); }
  });
  renderToolGrid(); // tool card labels come from i18n too
  updateBarSelection();
  renderMeter(); // meter readout text is language-dependent too
  updateSEOMeta(dict); // swap <title> + meta description — see caveats where this is defined
  const sel = document.getElementById('lang-select');
  if(sel && sel.value !== code) sel.value = code; // keep the dropdown in sync when language changes automatically
}

/* Swaps <title> and <meta name="description"> to match the active
   language's SEO copy (see the `seo:{title,description}` entry on
   each language in I18N above).
   REAL LIMITS, not glossed over:
   - This helps Googlebot, which executes JavaScript before indexing.
     It does NOT help Facebook/Twitter/LinkedIn link-preview bots —
     those read the raw HTML's <meta property="og:*"> tags once, at
     share time, without running any JS, so shared links always show
     the English Open Graph tags from <head> regardless of the
     visitor's in-app language.
   - This is still a single URL. Changing the <title> client-side
     doesn't create a separately indexable page per language — for
     that, Google needs distinct crawlable URLs (see the to-do list
     for what that would take). This function is a genuine but
     partial improvement, not full multilingual SEO.
   DEDICATED LANDING PAGES (e.g. /pdf-to-word/, /da/pdf-til-word/)
   set window.BC_SKIP_SEO_META_UPDATE = true in an inline script
   BEFORE this file loads. Those pages already have their own unique,
   hand-written, hard-coded title/meta tags baked into the HTML —
   the entire point of the multi-page structure — so this function
   must NOT overwrite them with the generic homepage copy on load. */
function updateSEOMeta(dict){
  if(window.BC_SKIP_SEO_META_UPDATE) return;
  if(!dict.seo) return;
  document.title = dict.seo.title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if(metaDesc) metaDesc.setAttribute('content', dict.seo.description);
}

function t(key){
  return (I18N[currentLang] && I18N[currentLang][key]) || (I18N.en[key]) || key;
}

function buildLangSelector(){
  const sel = document.getElementById('lang-select');
  sel.innerHTML = '';
  Object.entries(I18N).forEach(([code, dict])=>{
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = dict.name || code.toUpperCase();
    if(code === currentLang) opt.selected = true;
    sel.appendChild(opt);
  });
  // A person picking a language from the dropdown is an explicit,
  // permanent choice — always persist it (persist defaults to true).
  sel.addEventListener('change', e=> applyLanguage(e.target.value));
}

/* ---------------------------------------------------------------
   LANGUAGE AUTO-DETECTION
   Default-language priority order:
     1. A language the person explicitly picked before, saved in
        localStorage as 'bc_lang' — always wins.
     2. The browser's own reported language (navigator.language /
        navigator.languages) — a same-origin, zero-network signal
        already sitting in the browser, so it costs nothing and
        makes no outbound request to a third party.
     3. English — the fallback if the browser reports a language
        we don't have translated.

   No IP geolocation: an earlier version of this file called two
   third-party IP lookup APIs to guess the visitor's country. That
   was removed deliberately — it contradicted the app's own "100%
   local, nothing ever uploaded" positioning (a network request
   firing before the visitor does anything doesn't read as local,
   even though it only carried a language guess), and it added a
   dependency on an external service's uptime and rate limits for
   a cosmetic default. Browser locale gets most of the same result
   with none of that cost.
   --------------------------------------------------------------- */

/* Instant, no-network best-guess from the browser itself. */
function guessLanguageFromBrowser(){
  const langs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'];
  for(const l of langs){
    const code = l.split('-')[0].toLowerCase();
    if(I18N[code]) return code;
  }
  return 'en';
}

/* Orchestrates the default-language priority chain and applies
   whichever language wins. Called once from init(). Synchronous —
   no network involved, so there's no flash of the wrong language
   while a lookup is in flight.

   Priority, highest first:
     1. ?lang=xx in the URL — lets a shared link carry language state
        for REAL VISITORS who click it. See the big caveat below.
     2. Saved preference (explicit past choice)
     3. Browser locale guess
     4. English

   HONEST SCOPE OF WHAT ?lang= DOES AND DOES NOT FIX:
   This makes a link like beastconverter.com/?lang=da correctly load
   in Danish for an actual person who clicks it — that's a genuine,
   real improvement over always defaulting to English. It does NOT
   fix Facebook/X/LinkedIn share-preview cards, which will always
   show the English og:title/og:description from <head>, because
   those bots read the raw HTML without executing this (or any)
   JavaScript — the query string is invisible to them in the sense
   that matters: it never changes what raw HTML this URL serves.
   Solving THAT requires real per-language static pages or edge
   middleware, not a client-side query-string trick. Don't mistake
   this feature for having solved the sharing-preview problem. */
function initLanguage(){
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang');
  if(urlLang && I18N[urlLang]){
    applyLanguage(urlLang, false); // link-carried, not necessarily a saved preference
    return;
  }

  const storedPref = localStorage.getItem('bc_lang');
  if(storedPref && I18N[storedPref]){
    applyLanguage(storedPref, false); // explicit past choice
    return;
  }
  applyLanguage(guessLanguageFromBrowser(), false);
}

/* Keeps the ?lang= URL param in sync whenever the language changes,
   so the CURRENT page's URL is always shareable with language state
   intact for the next human who clicks it (again: not for bots —
   see the caveat on initLanguage() above). Uses replaceState, not
   pushState, so switching languages doesn't spam the back button. */
function syncLangToURL(code){
  const params = new URLSearchParams(window.location.search);
  params.set('lang', code);
  const newURL = window.location.pathname + '?' + params.toString();
  history.replaceState({}, '', newURL);
}

/* ---------------------------------------------------------------
   2. TOOLS CONFIG — single source of truth for the tool grid.
   `accept` restricts which files count toward that tool's queue.
   `run` is wired up in section 6 (Converters).
   --------------------------------------------------------------- */
/* ---------------------------------------------------------------
   TOOLS CONFIG — the 10 tools shown, ranked by real-world demand.
   Ranking source: cross-referenced industry coverage of PDF-tool
   search behavior (Merge PDF is consistently cited as the single
   most-searched PDF operation online; PDF to Word and Compress PDF
   are the other two that repeatedly show up as "most popular" on
   competitor sites' own tool grids). HEIC to JPG and CSV to Excel
   are kept in the top 10 despite being narrower categories because
   they're consistently high-intent, high-completion-rate tasks
   (iPhone photo compatibility; spreadsheet data cleanup) rather than
   browse-and-bounce traffic.
   Each tool gets its own accent color — NOT copied from any
   competitor's palette, but built from BeastConverter's own color
   family so the grid reads as one coherent product, not a copy.
   popular: true marks the top 3 for the "Most Popular" ribbon.
   --------------------------------------------------------------- */
const TOOLS = [
  { id:'mergepdf', nameKey:'t_mergepdf_name', descKey:'t_mergepdf_desc', accept:['.pdf'], icon:'pdf', color:'#17C989', popular:true },
  { id:'pdf2word', nameKey:'t_pdf2word_name', descKey:'t_pdf2word_desc', accept:['.pdf'], icon:'doc', color:'#4C8DFF', popular:true },
  { id:'compresspdf', nameKey:'t_compresspdf_name', descKey:'t_compresspdf_desc', accept:['.pdf'], icon:'pdf', color:'#F5A524', popular:true },
  { id:'splitpdf', nameKey:'t_splitpdf_name', descKey:'t_splitpdf_desc', accept:['.pdf'], icon:'pdf', color:'#17C989' },
  { id:'pdf2img',  nameKey:'t_pdf2img_name',  descKey:'t_pdf2img_desc',  accept:['.pdf'], icon:'img', color:'#B57BEE' },
  { id:'img2pdf',  nameKey:'t_img2pdf_name',  descKey:'t_img2pdf_desc',  accept:['.png','.jpg','.jpeg','.webp'], icon:'pdf', color:'#4C8DFF' },
  { id:'word2pdf', nameKey:'t_word2pdf_name', descKey:'t_word2pdf_desc', accept:['.docx'], icon:'doc', color:'#F2495C' },
  { id:'heic2jpg', nameKey:'t_heic2jpg_name', descKey:'t_heic2jpg_desc', accept:['.heic','.heif'], icon:'img', color:'#B57BEE' },
  { id:'pdf2text', nameKey:'t_pdf2text_name', descKey:'t_pdf2text_desc', accept:['.pdf'], icon:'txt', color:'#7C8B9C' },
  { id:'csv2xlsx', nameKey:'t_csv2xlsx_name', descKey:'t_csv2xlsx_desc', accept:['.csv'], icon:'sheet', color:'#17C989' },
  { id:'resizeimage', nameKey:'t_resizeimage_name', descKey:'t_resizeimage_desc', accept:['.png','.jpg','.jpeg','.webp'], icon:'img', color:'#B57BEE' },
  { id:'rotatepdf', nameKey:'t_rotatepdf_name', descKey:'t_rotatepdf_desc', accept:['.pdf'], icon:'pdf', color:'#4C8DFF' },
  { id:'excel2csv', nameKey:'t_excel2csv_name', descKey:'t_excel2csv_desc', accept:['.xlsx'], icon:'sheet', color:'#F5A524' },
];

const ICONS = {
  img:  '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><circle cx="8.5" cy="9.5" r="1.5" fill="currentColor"/><path d="M21 15L16 10L5 20" stroke="currentColor" stroke-width="1.6"/></svg>',
  pdf:  '<svg viewBox="0 0 24 24" fill="none"><path d="M6 2H14L20 8V20A2 2 0 0118 22H6A2 2 0 014 20V4A2 2 0 016 2Z" stroke="currentColor" stroke-width="1.6"/><path d="M14 2V8H20" stroke="currentColor" stroke-width="1.6"/></svg>',
  sheet:'<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M3 10H21M9 4V20" stroke="currentColor" stroke-width="1.6"/></svg>',
  doc:  '<svg viewBox="0 0 24 24" fill="none"><path d="M6 2H14L20 8V20A2 2 0 0118 22H6A2 2 0 014 20V4A2 2 0 016 2Z" stroke="currentColor" stroke-width="1.6"/><path d="M14 2V8H20M8 13H16M8 17H13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  txt:  '<svg viewBox="0 0 24 24" fill="none"><path d="M6 2H14L20 8V20A2 2 0 0118 22H6A2 2 0 014 20V4A2 2 0 016 2Z" stroke="currentColor" stroke-width="1.6"/><path d="M14 2V8H20M8 12H16M8 16H12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
};

let selectedTool = TOOLS[0].id;

function renderToolGrid(){
  const grid = document.getElementById('tool-grid');
  grid.innerHTML = '';
  TOOLS.forEach(tool=>{
    const card = document.createElement('div');
    card.className = 'tool-card' + (tool.id === selectedTool ? ' active' : '');
    card.style.setProperty('--tool-color', tool.color);
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.dataset.toolId = tool.id;
    card.innerHTML = `
      ${tool.popular ? `<span class="popular-ribbon" data-i18n="badge_popular">${t('badge_popular')}</span>` : ''}
      <span class="tool-badge">${tool.accept.join(' ').toUpperCase()}</span>
      <div class="tool-icon" style="color:${tool.color}; background:${tool.color}1a;">${ICONS[tool.icon]}</div>
      <h4>${t(tool.nameKey)}</h4>
      <p>${t(tool.descKey)}</p>
    `;
    card.addEventListener('click', ()=> selectTool(tool.id));
    card.addEventListener('keydown', e=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); selectTool(tool.id); } });
    grid.appendChild(card);
  });
}

function selectTool(id){
  selectedTool = id;
  document.querySelectorAll('.tool-card').forEach(c=>{
    c.classList.toggle('active', c.dataset.toolId === id);
  });
  document.getElementById('resize-options').style.display = (id === 'resizeimage') ? 'flex' : 'none';
  document.getElementById('rotate-options').style.display = (id === 'rotatepdf') ? 'flex' : 'none';
  renderFileList(); // keeps the "Selected tool: X" label above the file list in sync
  updateBarSelection();
}

function updateBarSelection(){
  const tool = TOOLS.find(x=>x.id===selectedTool);
  document.getElementById('bar-tool-name').textContent = tool ? t(tool.nameKey) : t('bar_none');
  refreshConvertButtonState();
}

/* ---------------------------------------------------------------
   3. COUNTER / PAYWALL — "Beast Engine" business logic.
   Stored in localStorage as { count: number, windowStart: epoch_ms }.
   Window resets fully once 15 minutes have elapsed since windowStart.
   --------------------------------------------------------------- */
const FREE_LIMIT = 3;
const WINDOW_MS = 15 * 60 * 1000;
const STORAGE_KEY = 'bc_usage';
let countdownInterval = null;
let beastPassActive = false; // set true once Stripe checkout placeholder "succeeds"

function getUsage(){
  let raw;
  try{ raw = JSON.parse(localStorage.getItem(STORAGE_KEY)); }catch(e){ raw = null; }
  const now = Date.now();
  if(!raw || !raw.windowStart || (now - raw.windowStart) >= WINDOW_MS){
    raw = { count: 0, windowStart: now };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
  }
  return raw;
}

function remainingConversions(){
  if(beastPassActive || hasActiveBeastPass()) return Infinity;
  const usage = getUsage();
  return Math.max(0, FREE_LIMIT - usage.count);
}

function registerConversion(){
  if(beastPassActive || hasActiveBeastPass()) return; // pass holders are unmetered
  const usage = getUsage();
  usage.count += 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  renderMeter();
}

function hasActiveBeastPass(){
  const expiry = Number(localStorage.getItem('bc_pass_expiry') || 0);
  return expiry > Date.now();
}

function grantBeastPass(hours = 24){
  const expiry = Date.now() + hours * 60 * 60 * 1000;
  localStorage.setItem('bc_pass_expiry', String(expiry));
  beastPassActive = true;
  renderMeter();
  hidePaywallModal();
  refreshConvertButtonState();
}

/* ---------------------------------------------------------------
   BUSINESS RULE, made explicit: the Beast Pass removes ONLY the
   3-conversion / 15-minute limit. It does NOT hide ads — this is a
   deliberate dual-monetization decision, not an oversight. There is
   intentionally no updateAdVisibility()-style function here; the
   three ad slots (.ad-top, .ad-sidebar, .ad-below-download) are
   always visible in the HTML with no JS toggling their display,
   regardless of pass status. If this ever needs to change, the right
   place to add it back is here — but as of this build, don't.
   --------------------------------------------------------------- */

/* Renders the "cockpit gauge" readout above the drop zone:
   3 notches + a JetBrains Mono technical readout string, e.g.
   "3/3 conversions remaining" with the rolling-window caption beneath it. */
let passExpiryInterval = null;

function renderMeter(){
  const remaining = remainingConversions();
  const notches = document.querySelectorAll('#meter-notches .notch');
  const readout = document.getElementById('meter-readout');
  const panel = document.getElementById('meter-panel');
  const windowEl = document.getElementById('meter-window-text');

  if(remaining === Infinity){
    // Beast Pass active — distinct "premium" visual state, and a real
    // live countdown to expiry instead of the normal free-tier caption.
    notches.forEach(n=>{
      n.classList.add('filled', 'pass-active');
      n.classList.remove('warn','danger');
    });
    readout.classList.add('pass-active');
    readout.innerHTML = `∞ <span data-i18n="meter_label_pass">${t('meter_label_pass')}</span>`;
    panel.classList.add('pass-active');
    windowEl.classList.add('pass-active');
    startPassExpiryCountdown();
    return;
  }

  // Not on a pass — normal free-tier look, and make sure any leftover
  // pass-active styling/countdown from a just-expired pass is cleared.
  if(passExpiryInterval){ clearInterval(passExpiryInterval); passExpiryInterval = null; }
  panel.classList.remove('pass-active');
  readout.classList.remove('pass-active');
  windowEl.classList.remove('pass-active');
  windowEl.textContent = t('meter_window');

  notches.forEach((n, i)=>{
    const filled = i < remaining;
    n.classList.toggle('filled', filled);
    n.classList.remove('warn','danger','pass-active');
    if(filled && remaining === 1) n.classList.add('danger');
    else if(filled && remaining === 2) n.classList.add('warn');
  });
  readout.innerHTML = `${remaining}/${FREE_LIMIT} <span data-i18n="meter_label">${t('meter_label')}</span>`;
}

/* Live countdown to Beast Pass expiry, shown in place of the normal
   "resets on a rolling 15-minute window" caption. Ticks every second;
   stops and hands back to the normal free-tier render the instant the
   pass actually expires, so the UI never gets stuck showing "00:00:00"
   or a stale "Beast Pass active" state after time's up. */
function startPassExpiryCountdown(){
  if(passExpiryInterval) return; // already running
  const windowEl = document.getElementById('meter-window-text');

  function tick(){
    const expiry = Number(localStorage.getItem('bc_pass_expiry') || 0);
    const msLeft = expiry - Date.now();
    if(msLeft <= 0){
      clearInterval(passExpiryInterval); passExpiryInterval = null;
      beastPassActive = false;
      renderMeter(); // falls through to the normal free-tier state above
      refreshConvertButtonState();
      return;
    }
    const totalSeconds = Math.floor(msLeft / 1000);
    const hh = String(Math.floor(totalSeconds / 3600)).padStart(2,'0');
    const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2,'0');
    const ss = String(totalSeconds % 60).padStart(2,'0');
    windowEl.textContent = `${t('meter_pass_expires')} ${hh}:${mm}:${ss}`;
  }
  tick();
  passExpiryInterval = setInterval(tick, 1000);
}

function refreshConvertButtonState(){
  const btn = document.getElementById('convert-btn');
  const fileCount = queuedFiles.length;
  document.getElementById('bar-file-count').textContent = fileCount;
  const remaining = remainingConversions();
  const gated = remaining <= 0;
  btn.disabled = fileCount === 0 || gated;
  document.getElementById('dropzone').classList.toggle('disabled', gated);
}

/* ---------------------------------------------------------------
   PAYWALL MODAL — a true full-screen overlay (#paywall-overlay),
   triggered the instant the free-conversion count reaches zero.
   --------------------------------------------------------------- */
function showPaywallModal(){
  document.getElementById('paywall-overlay').classList.add('show');
  startCountdown();
}
function hidePaywallModal(){
  document.getElementById('paywall-overlay').classList.remove('show');
  if(countdownInterval){ clearInterval(countdownInterval); countdownInterval = null; }
}
/* Backwards-compatible aliases used elsewhere in this file */
const showPaywall = showPaywallModal;
const hidePaywall = hidePaywallModal;

function startCountdown(){
  if(countdownInterval) return; // already running
  const el = document.getElementById('countdown');
  const labelHTML = `<span data-i18n="pw_countdown_label">${t('pw_countdown_label')}</span>`;

  function tick(){
    const usage = getUsage(); // getUsage() self-resets once window has elapsed
    const msLeft = Math.max(0, WINDOW_MS - (Date.now() - usage.windowStart));
    if(msLeft <= 0){
      clearInterval(countdownInterval); countdownInterval = null;
      renderMeter();
      refreshConvertButtonState();
      hidePaywallModal();
      return;
    }
    const mm = String(Math.floor(msLeft / 60000)).padStart(2,'0');
    const ss = String(Math.floor((msLeft % 60000) / 1000)).padStart(2,'0');
    el.innerHTML = `${mm}:${ss}${labelHTML}`;
  }
  tick();
  countdownInterval = setInterval(tick, 1000);
}

/* ---------------------------------------------------------------
   REWARDED VIDEO — honest status: NOT connected to a real ad network.
   ---------------------------------------------------------------
   What this currently does: shows a 3-step modal (confirm → simulated
   "playing" → success) so the UX flow can be reviewed and tested.
   The "playing" step is a timed pause with no actual video — nothing
   is shown to the visitor and no ad impression is served or paid for.

   What a REAL integration requires, in order:
     1. A rewarded-video ad network account. Note: rewarded video is
        a mature pattern for mobile apps/games; it is NOT a standard
        AdSense feature for websites. You'd need Google Ad Manager
        (a bigger product than AdSense) or a smaller web-specific
        rewarded-ad network — research availability before assuming
        this is a quick swap.
     2. Their SDK's own player replaces the #rv-step-playing content
        below — it takes over rendering the actual video, typically
        in its own overlay/iframe.
     3. resetConversionCounter() must ONLY be called from that SDK's
        own "reward earned" callback — never on a timer, and never if
        the person closes the ad early. Most networks require this
        contractually, not just as good practice: rewarding incomplete
        views is exactly what gets publishers suspended from ad
        networks for policy violations.
   The three functions below (showRewardedVideoModal / the confirm
   button handler / the simulated timer) are the pieces to replace
   once a real network is wired in — everything else (the modal
   markup, the i18n copy, the reward-granting logic itself) can stay. */
function watchRewardedVideoPlaceholder(){
  document.getElementById('rewarded-video-modal').classList.add('show');
  showRVStep('confirm');
}

function showRVStep(step){
  ['confirm','playing','success'].forEach(s=>{
    document.getElementById('rv-step-' + s).style.display = (s === step) ? 'block' : 'none';
  });
}

function hideRewardedVideoModal(){
  document.getElementById('rewarded-video-modal').classList.remove('show');
}

/* SIMULATION ONLY — see the honest-status comment above. Replace the
   body of this function with your real ad SDK's "play ad" call once
   one is integrated; call resetConversionCounter() only from that
   SDK's reward-earned callback, not from a plain setTimeout like this. */
function simulateRewardedVideoPlayback(){
  showRVStep('playing');
  setTimeout(()=>{
    showRVStep('success');
    resetConversionCounter({ closeModals:false }); // grant the reward, but keep this modal open to show the success step
  }, 2500); // short simulated delay, NOT a real 30s ad — just enough to feel like something happened
}

/* Resets the 15-minute usage window completely — 0 used, fresh 3/3 —
   rather than just refunding one conversion. This is the standard
   "watch an ad, get a full refill" pattern from freemium mobile
   games; it's intentionally more generous than a single +1 credit,
   since the whole point is to give people a reason to sit through
   the ad instead of bouncing. */
function resetConversionCounter({ closeModals = true } = {}){
  const usage = { count: 0, windowStart: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  renderMeter();
  refreshConvertButtonState();
  if(closeModals){
    hidePaywallModal();
    hideAdBlockModal();
  }
}

/* ---------------------------------------------------------------
   4. ADBLOCK DETECTION
   Two-layer heuristic:
   (a) a synthetic "bait" element using classnames/ids ad blockers
       commonly target (adsbox / adsbygoogle / ad-banner);
   (b) the real ad slot elements on the page (.ad-top / .ad-sidebar /
       .ad-below-download) — if any of these end up collapsed or
       hidden once a real <ins class="adsbygoogle"> is injected into
       them, that's just as strong a signal as the bait.
   Neither layer is a guarantee — adblock detection is inherently a
   cat-and-mouse heuristic — but combining both catches more cases
   than either alone.

   MOBILE FIX: #ad-sidebar is deliberately hidden by CSS under 980px
   (it's a desktop-only slot — see the HTML comment above that slot).
   That means on every mobile visit, regardless of any real ad blocker,
   ad-sidebar always has display:none — which used to make slotsBlocked
   true for 100% of mobile traffic and pop the ad-block modal on every
   phone visitor. Excluding ad-sidebar below 980px fixes that false
   positive; it still gets checked normally on desktop widths.
   --------------------------------------------------------------- */
function detectAdBlock(){
  const bait = document.createElement('div');
  bait.className = 'adsbox ad-banner ads adsbygoogle';
  bait.style.cssText = 'position:absolute; left:-9999px; width:1px; height:1px;';
  document.body.appendChild(bait);

  setTimeout(()=>{
    const baitBlocked = (
      bait.offsetParent === null ||
      bait.offsetHeight === 0 ||
      getComputedStyle(bait).display === 'none' ||
      getComputedStyle(bait).visibility === 'hidden'
    );
    bait.remove();

    // Sidebar is deliberately hidden under 980px via CSS — never treat
    // that as a blocked-by-adblock signal, or every mobile visitor
    // triggers a false positive.
    const slotIds = window.innerWidth < 980
      ? ['ad-top', 'ad-below-download']
      : ['ad-top', 'ad-sidebar', 'ad-below-download'];

    const realSlots = slotIds.map(id => document.getElementById(id)).filter(Boolean);
    const slotsBlocked = realSlots.some(slot=>{
      const style = getComputedStyle(slot);
      return slot.offsetHeight === 0 || style.display === 'none' || style.visibility === 'hidden';
    });

    if((baitBlocked || slotsBlocked) && !hasActiveBeastPass()){
      showAdBlockModal();
    }
  }, 400);
}

function showAdBlockModal(){ document.getElementById('adblock-modal').classList.add('show'); }
function hideAdBlockModal(){ document.getElementById('adblock-modal').classList.remove('show'); }

/* ---------------------------------------------------------------
   CONTACT MODAL
   Unlike the paywall/AdBlock modals (which are deliberately sticky),
   this one is a normal dismissible dialog: closes on the × click,
   on clicking the dark backdrop, or on Escape.
   --------------------------------------------------------------- */
function showContactModal(){ document.getElementById('contact-modal').classList.add('show'); }
function hideContactModal(){ document.getElementById('contact-modal').classList.remove('show'); }

/* Submits the contact form via fetch instead of a full page
   navigation, so we can show an inline success/error message.
   Requires a real endpoint — see the big comment on the <form> tag
   in the HTML for how to wire one up (Formspree or a serverless
   function); this will fail gracefully with an error message until
   that's done. */
async function handleContactSubmit(e){
  e.preventDefault();
  const form = e.target;
  const statusEl = document.getElementById('contact-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  statusEl.textContent = '';
  statusEl.style.color = '';

  try{
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' },
    });
    if(res.ok){
      statusEl.textContent = t('contact_success');
      statusEl.style.color = 'var(--emerald)';
      form.reset();
    } else {
      throw new Error('Non-OK response');
    }
  }catch(err){
    console.error('Contact form submission failed:', err);
    statusEl.textContent = t('contact_error');
    statusEl.style.color = 'var(--red)';
  }
  submitBtn.disabled = false;
}

/* ---------------------------------------------------------------
   5. FILE HANDLING / DROPZONE
   --------------------------------------------------------------- */
let queuedFiles = []; // { file, id, status: 'pending'|'working'|'done'|'error' }

function formatBytes(bytes){
  if(bytes < 1024) return bytes + ' B';
  if(bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/(1024*1024)).toFixed(1) + ' MB';
}

/* addFiles() is the "Beast Engine" demo trigger: for testing/demo purposes
   in this artifact, the act of dropping or selecting file(s) itself counts
   as a simulated conversion event and immediately decrements the gauge —
   it does NOT wait for the "Convert now" button. This lets the full
   counter -> paywall -> modal chain be exercised end-to-end without
   needing real files to actually finish processing. */
function addFiles(fileListLike){
  const files = Array.from(fileListLike);
  if(files.length === 0) return;

  files.forEach(file=>{
    queuedFiles.push({ file, id: crypto.randomUUID(), status:'pending' });
  });
  renderFileList();

  // Gate BEFORE spending a conversion: if already at zero, don't let this
  // upload count — just show the paywall again immediately.
  if(remainingConversions() <= 0){
    refreshConvertButtonState();
    showPaywallModal();
    return;
  }

  // Simulated conversion: one upload action = one unit spent from the gauge.
  registerConversion();
  refreshConvertButtonState();

  if(remainingConversions() <= 0){
    // The gauge just hit zero — trigger the paywall modal immediately.
    showPaywallModal();
  }
}

function removeFile(id){
  queuedFiles = queuedFiles.filter(f=>f.id !== id);
  renderFileList();
  refreshConvertButtonState();
}

function renderFileList(){
  const list = document.getElementById('file-list');
  const toolLabel = document.getElementById('file-list-tool-label');

  // Show which tool is selected right above the file list — a direct
  // answer to "if you tend to have doubts, it's good to see it there
  // too", so the tool choice is visible right next to the files, not
  // only in the convert bar further down.
  if(queuedFiles.length > 0){
    const tool = TOOLS.find(x=>x.id===selectedTool);
    toolLabel.textContent = `${t('bar_selected')}: ${tool ? t(tool.nameKey) : t('bar_none')}`;
    toolLabel.style.display = 'block';
  } else {
    toolLabel.style.display = 'none';
  }

  list.innerHTML = '';
  queuedFiles.forEach(entry=>{
    const row = document.createElement('div');
    row.className = 'file-row';
    row.innerHTML = `
      <div class="fi">${ICONS.img.replace(/#12161D/g,'#4C8DFF')}</div>
      <div class="meta">
        <div class="fname">${entry.file.name}</div>
        <div class="fsize">${formatBytes(entry.file.size)}</div>
      </div>
      <span class="status ${entry.status}">${entry.status}</span>
      <button class="remove" aria-label="Remove file" data-id="${entry.id}">&times;</button>
    `;
    row.querySelector('.remove').addEventListener('click', ()=> removeFile(entry.id));
    list.appendChild(row);
  });
}

function setupDropzone(){
  const zone = document.getElementById('dropzone');
  const wideArea = document.getElementById('drop-catch-area');
  const input = document.getElementById('file-input');

  // The small box gets its own tighter highlight; the whole wrapper
  // (dropzone + tool grid) gets a lighter full-area highlight and is
  // ALSO a valid drop target — see the HTML comment on #drop-catch-area
  // for why: dropping a file shouldn't require scrolling back up to
  // the small box once you've selected a tool further down the page.
  ;['dragenter','dragover'].forEach(evt=>{
    wideArea.addEventListener(evt, e=>{
      e.preventDefault();
      wideArea.classList.add('drag-over-wide');
      if(e.target === zone || zone.contains(e.target)) zone.classList.add('drag-over');
    });
  });
  ;['dragleave','drop'].forEach(evt=>{
    wideArea.addEventListener(evt, e=>{
      e.preventDefault();
      wideArea.classList.remove('drag-over-wide');
      zone.classList.remove('drag-over');
    });
  });
  wideArea.addEventListener('drop', e=>{
    if(zone.classList.contains('disabled')) return;
    if(e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  });
  input.addEventListener('change', e=>{
    if(e.target.files?.length) addFiles(e.target.files);
    input.value = ''; // allow re-selecting the same file
  });
}

/* ---------------------------------------------------------------
   6. CONVERTERS — one function per tool. Each returns an array of
   { name, blob } results, downloaded via createObjectURL links.
   All processing happens in-memory in the browser; nothing is ever
   sent to a server.
   --------------------------------------------------------------- */
function downloadResult(name, blob){
  const url = URL.createObjectURL(blob);
  return { name, url, size: blob.size };
}

function loadImageFromFile(file){
  return new Promise((resolve, reject)=>{
    const img = new Image();
    img.onload = ()=> resolve(img);
    // The browser calls onerror with a raw Event object, not an Error —
    // that Event has no .message, so it was propagating all the way up
    // to the console as an unhelpful "Conversion failed: Event" with no
    // explanation. Wrapping it in a real Error with the filename and the
    // most likely cause fixes that for good.
    img.onerror = ()=> reject(new Error(
      `Could not load "${file.name}" as an image. Most browsers can't display HEIC files directly (that's why HEIC to JPG is its own separate tool) — if this is a HEIC file, use that tool instead. Otherwise the file may be corrupted or in an unsupported format.`
    ));
    img.src = URL.createObjectURL(file);
  });
}

function canvasToBlob(canvas, type, quality){
  return new Promise(resolve=> canvas.toBlob(resolve, type, quality));
}

/* Detects whether a file is PNG/WebP/JPEG using BOTH its MIME type
   (file.type) AND its filename extension, falling back to the
   extension whenever the MIME type is empty or unreliable — some
   browsers/OSes/drag-and-drop sources don't set file.type correctly,
   which was silently mis-routing files (e.g. a real PNG with no
   MIME type falling into the JPEG branch and pdf-lib rejecting it
   outright, since PNG bytes aren't valid JPEG). Returns 'png',
   'webp', or 'jpeg' (the default/fallback). */
function detectImageKind(file){
  const type = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();
  if(type.includes('png') || name.endsWith('.png')) return 'png';
  if(type.includes('webp') || name.endsWith('.webp')) return 'webp';
  return 'jpeg';
}

const Converters = {

  /* HEIC/HEIF -> JPG via heic2any */
  async heic2jpg(files){
    const results = [];
    for(const {file} of files){
      const outBlob = await heic2any({ blob:file, toType:'image/jpeg', quality:0.9 });
      const blob = Array.isArray(outBlob) ? outBlob[0] : outBlob;
      results.push(downloadResult(file.name.replace(/\.[^.]+$/, '') + '.jpg', blob));
    }
    return results;
  },

  /* PNG -> JPG via canvas (flattens transparency onto white) */
  async png2jpg(files){
    const results = [];
    for(const {file} of files){
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, 'image/jpeg', 0.92);
      results.push(downloadResult(file.name.replace(/\.[^.]+$/, '') + '.jpg', blob));
    }
    return results;
  },

  /* WebP -> PNG (browser can decode WebP natively via <img>/canvas) */
  async webp(files){
    const results = [];
    for(const {file} of files){
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, 'image/png');
      results.push(downloadResult(file.name.replace(/\.[^.]+$/, '') + '.png', blob));
    }
    return results;
  },

  /* Images -> single PDF via pdf-lib */
  async img2pdf(files){
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    for(const {file} of files){
      // Always decode via the browser's own <img> element (canvas) rather
      // than branching on detected type and handing raw bytes straight to
      // pdf-lib's embedPng/embedJpg — those are strict about exact byte
      // structure and threw "SOI not found in JPEG" on files the browser
      // itself could decode just fine. The browser's decoder is far more
      // forgiving and handles PNG/JPEG/WebP uniformly; we always embed the
      // canvas output as PNG, so there's only one code path, not three.
      const img = await loadImageFromFile(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      const pngBlob = await canvasToBlob(canvas, 'image/png');
      const bytes = new Uint8Array(await pngBlob.arrayBuffer());
      const embedded = await pdfDoc.embedPng(bytes);
      const page = pdfDoc.addPage([embedded.width, embedded.height]);
      page.drawImage(embedded, { x:0, y:0, width:embedded.width, height:embedded.height });
    }
    const bytes = await pdfDoc.save();
    return [downloadResult('images-combined.pdf', new Blob([bytes], {type:'application/pdf'}))];
  },

  /* PDF -> Images via pdf.js rendering each page to canvas */
  async pdf2img(files){
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const results = [];
    for(const {file} of files){
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      for(let p = 1; p <= pdf.numPages; p++){
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        const blob = await canvasToBlob(canvas, 'image/png');
        results.push(downloadResult(`${file.name.replace(/\.pdf$/i,'')}-page${p}.png`, blob));
      }
    }
    return results;
  },

  /* Merge multiple PDFs -> one PDF, in the order they were added */
  async mergepdf(files){
    const { PDFDocument } = PDFLib;
    const merged = await PDFDocument.create();
    for(const {file} of files){
      const bytes = new Uint8Array(await file.arrayBuffer());
      const src = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(src, src.getPageIndices());
      pages.forEach(p=> merged.addPage(p));
    }
    const bytes = await merged.save();
    return [downloadResult('merged.pdf', new Blob([bytes], {type:'application/pdf'}))];
  },

  /* Split each PDF into one file per page */
  async splitpdf(files){
    const { PDFDocument } = PDFLib;
    const results = [];
    for(const {file} of files){
      const bytes = new Uint8Array(await file.arrayBuffer());
      const src = await PDFDocument.load(bytes);
      const total = src.getPageCount();
      for(let i = 0; i < total; i++){
        const out = await PDFDocument.create();
        const [page] = await out.copyPages(src, [i]);
        out.addPage(page);
        const outBytes = await out.save();
        results.push(downloadResult(`${file.name.replace(/\.pdf$/i,'')}-page${i+1}.pdf`, new Blob([outBytes], {type:'application/pdf'})));
      }
    }
    return results;
  },

  /* CSV -> XLSX via SheetJS */
  async csv2xlsx(files){
    const results = [];
    for(const {file} of files){
      const text = await file.text();
      const workbook = XLSX.read(text, { type:'string' });
      const out = XLSX.write(workbook, { bookType:'xlsx', type:'array' });
      results.push(downloadResult(file.name.replace(/\.csv$/i,'') + '.xlsx', new Blob([out], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})));
    }
    return results;
  },

  /* PDF -> Word (.docx) via pdf.js text extraction + the `docx` library.
     HONEST LIMITATION: this is a text-based conversion, not a layout
     reconstruction. It extracts each page's text (grouped into
     paragraphs by pdf.js's line breaks) and writes it into a clean,
     editable .docx — but original fonts, exact spacing, tables, and
     embedded images are NOT preserved. That's a real gap versus
     competitors who run heavier server-side layout-reconstruction
     engines; the trade-off is that this version never uploads the
     file anywhere to get there. Best for text-heavy PDFs (reports,
     letters, contracts); a scanned/image-only PDF will produce an
     empty document since there's no OCR step in this tool. */
  async pdf2word(files){
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    // docx is an ES module — loaded here via dynamic import() rather than a
    // <script> tag, because a plain script tag doesn't reliably expose a
    // window.docx global for this package. The /+esm suffix is jsDelivr's
    // dedicated endpoint for exactly this: it pre-bundles the package (and
    // resolves its internal imports) into a single browser-ready ES module,
    // which the raw /build/index.js file is NOT — that's what caused the
    // "Failed to fetch dynamically imported module" error on the first fix
    // attempt. The browser caches the module after the first successful import.
    const docxLib = await import('https://cdn.jsdelivr.net/npm/docx@8.5.0/+esm');
    const { Document, Packer, Paragraph, TextRun } = docxLib;
    const results = [];
    for(const {file} of files){
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const paragraphs = [];
      for(let p = 1; p <= pdf.numPages; p++){
        const page = await pdf.getPage(p);
        const content = await page.getTextContent();
        // Group text items into lines using their y-position, since
        // pdf.js returns individual text runs, not paragraphs.
        let lastY = null, line = [];
        const lines = [];
        content.items.forEach(item=>{
          const y = item.transform[5];
          if(lastY !== null && Math.abs(y - lastY) > 2){
            lines.push(line.join(' '));
            line = [];
          }
          line.push(item.str);
          lastY = y;
        });
        if(line.length) lines.push(line.join(' '));
        lines.forEach(l=>{
          if(l.trim()) paragraphs.push(new Paragraph({ children:[new TextRun(l.trim())] }));
        });
        if(p < pdf.numPages) paragraphs.push(new Paragraph({ children:[new TextRun('')] })); // page break spacer
      }
      if(paragraphs.length === 0){
        paragraphs.push(new Paragraph({ children:[new TextRun('[No extractable text found — this PDF may be a scanned image without a text layer.]')] }));
      }
      const doc = new Document({ sections:[{ children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      results.push(downloadResult(file.name.replace(/\.pdf$/i,'') + '.docx', blob));
    }
    return results;
  },

  /* Compress PDF via pdf-lib's own save-time optimizations.
     HONEST LIMITATION: pdf-lib doesn't do deep image recompression
     (re-encoding embedded JPEGs at a lower quality, downsampling
     DPI) the way server-side tools using Ghostscript-style pipelines
     do. What this DOES do: strips unused objects, deduplicates
     shared resources, and writes with object streams — real size
     reduction on PDFs with redundant structure (common from
     "print to PDF" exports and merged documents), but a PDF that's
     large because of high-resolution embedded photos won't shrink
     nearly as much here as it would through a server-side recompressor. */
  async compresspdf(files){
    const { PDFDocument } = PDFLib;
    const results = [];
    for(const {file} of files){
      const bytes = new Uint8Array(await file.arrayBuffer());
      const src = await PDFDocument.load(bytes, { updateMetadata:false });
      const out = await src.save({ useObjectStreams:true, addDefaultPage:false });
      results.push(downloadResult(file.name.replace(/\.pdf$/i,'') + '-compressed.pdf', new Blob([out], {type:'application/pdf'})));
    }
    return results;
  },

  /* Word (.docx) -> PDF via mammoth.js (docx -> HTML) + html2canvas
     (HTML -> image) + pdf-lib (image -> paginated PDF).
     HONEST LIMITATION: this renders the document as a single tall
     image sliced into pages, so text is NOT selectable in the output
     PDF, and complex Word layouts (multi-column, floating images,
     unusual tables) may not render exactly as they do in Word. It
     works well for standard text documents — headings, paragraphs,
     simple tables, inline images — which covers most everyday use. */
  async word2pdf(files){
    const { PDFDocument } = PDFLib;
    const results = [];
    for(const {file} of files){
      const arrayBuffer = await file.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

      // Render into an off-screen container sized like an A4 page.
      const container = document.createElement('div');
      container.style.cssText = 'position:fixed; left:-99999px; top:0; width:794px; padding:48px; background:#fff; color:#111; font-family:Georgia,serif; font-size:16px; line-height:1.5;';
      container.innerHTML = html;
      document.body.appendChild(container);

      const canvas = await html2canvas(container, { scale:2, backgroundColor:'#ffffff' });
      document.body.removeChild(container);

      // Slice the tall canvas into A4-proportioned pages.
      const pdfDoc = await PDFDocument.create();
      const pageWidthPt = 595.28, pageHeightPt = 841.89; // A4 in points
      const scaleFactor = pageWidthPt / canvas.width;
      const pageHeightPx = Math.floor(pageHeightPt / scaleFactor);
      let y = 0;
      while(y < canvas.height){
        const sliceHeight = Math.min(pageHeightPx, canvas.height - y);
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = sliceHeight;
        sliceCanvas.getContext('2d').drawImage(canvas, 0, y, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
        const sliceBlob = await canvasToBlob(sliceCanvas, 'image/png');
        const sliceBytes = new Uint8Array(await sliceBlob.arrayBuffer());
        const embedded = await pdfDoc.embedPng(sliceBytes);
        const page = pdfDoc.addPage([pageWidthPt, sliceHeight * scaleFactor]);
        page.drawImage(embedded, { x:0, y:0, width:pageWidthPt, height:sliceHeight * scaleFactor });
        y += sliceHeight;
      }
      const outBytes = await pdfDoc.save();
      results.push(downloadResult(file.name.replace(/\.docx$/i,'') + '.pdf', new Blob([outBytes], {type:'application/pdf'})));
    }
    return results;
  },

  /* PDF -> plain .txt via pdf.js text-layer extraction.
     HONEST LIMITATION: same as PDF to Word — this reads the PDF's
     embedded text layer, so a scanned/image-only PDF with no text
     layer will produce an empty (or near-empty) file. There's no
     OCR step in this build. */
  async pdf2text(files){
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const results = [];
    for(const {file} of files){
      const data = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      let fullText = '';
      for(let p = 1; p <= pdf.numPages; p++){
        const page = await pdf.getPage(p);
        const content = await page.getTextContent();
        const pageText = content.items.map(item=>item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      if(!fullText.trim()) fullText = '[No extractable text found — this PDF may be a scanned image without a text layer.]';
      results.push(downloadResult(file.name.replace(/\.pdf$/i,'') + '.txt', new Blob([fullText], {type:'text/plain'})));
    }
    return results;
  },

  /* Resize Image via canvas — pure browser primitive, no library needed.
     Two modes, controlled by the #resize-keep-ratio checkbox:
       - CHECKED (default): only the width field is used; height is
         computed per-file from that file's own original aspect ratio.
         Safe default — never distorts an image.
       - UNCHECKED: both width AND height fields are used exactly as
         typed, for every queued file. This CAN stretch or squash
         images whose original proportions don't match the chosen
         width:height pair — that's an expected trade-off of asking
         for an exact size, not a bug, and is disclosed in the UI copy
         next to the checkbox. */
  async resizeimage(files){
    const widthEl = document.getElementById('resize-width-input');
    const heightEl = document.getElementById('resize-height-input');
    const keepRatio = document.getElementById('resize-keep-ratio').checked;

    const rawWidth = parseInt(widthEl.value, 10);
    const targetWidth = Math.max(16, Math.min(8000, isNaN(rawWidth) ? 1024 : rawWidth));
    const rawHeight = parseInt(heightEl.value, 10);
    const manualHeight = Math.max(16, Math.min(8000, isNaN(rawHeight) ? 768 : rawHeight));

    const results = [];
    for(const {file} of files){
      const img = await loadImageFromFile(file);
      if(!img.width || !img.height){
        throw new Error(`Could not read image dimensions for "${file.name}" — the file may be corrupted or in an unsupported format.`);
      }

      let outWidth, outHeight;
      if(keepRatio){
        outWidth = targetWidth;
        outHeight = Math.max(1, Math.round(img.height * (targetWidth / img.width)));
      } else {
        outWidth = targetWidth;
        outHeight = manualHeight; // exact — may distort, by design when unchecked
      }

      const canvas = document.createElement('canvas');
      canvas.width = outWidth; canvas.height = outHeight;
      canvas.getContext('2d').drawImage(img, 0, 0, outWidth, outHeight);
      const outIsPng = detectImageKind(file) === 'png';
      const blob = await canvasToBlob(canvas, outIsPng ? 'image/png' : 'image/jpeg', 0.92);
      const ext = outIsPng ? '.png' : '.jpg';
      results.push(downloadResult(file.name.replace(/\.[^.]+$/, '') + '-resized' + ext, blob));
    }
    return results;
  },

  /* Rotate PDF via pdf-lib. Rotation is RELATIVE to each page's current
     orientation (adds the chosen angle to whatever rotation the page
     already has), matching how rotation tools conventionally behave —
     verified against pdf-lib's own documented pattern: read the current
     angle via page.getRotation().angle, add the chosen amount, then
     write it back with PDFLib.degrees(). */
  async rotatepdf(files){
    const { PDFDocument, degrees } = PDFLib;
    const angle = parseInt(document.getElementById('rotate-angle-select').value, 10) || 90;
    const results = [];
    for(const {file} of files){
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await PDFDocument.load(bytes);
      pdf.getPages().forEach(page=>{
        const current = page.getRotation().angle;
        page.setRotation(degrees(current + angle));
      });
      const outBytes = await pdf.save();
      results.push(downloadResult(file.name.replace(/\.pdf$/i,'') + '-rotated.pdf', new Blob([outBytes], {type:'application/pdf'})));
    }
    return results;
  },

  /* Excel (.xlsx) -> CSV via SheetJS — the reverse of csv2xlsx, using
     the same already-loaded library. Only the first sheet is exported;
     workbooks with multiple sheets would need one CSV per sheet, which
     this tool deliberately keeps simple rather than building a sheet
     picker UI for what's a fairly narrow use case. */
  async excel2csv(files){
    const results = [];
    for(const {file} of files){
      const data = new Uint8Array(await file.arrayBuffer());
      const workbook = XLSX.read(data, { type:'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      results.push(downloadResult(file.name.replace(/\.xlsx$/i,'') + '.csv', new Blob([csv], {type:'text/csv'})));
    }
    return results;
  },
};

/* ---------------------------------------------------------------
   FILE SIGNATURE VALIDATION
   Reads the first few bytes of a file and checks them against the
   real, well-known "magic number" every format starts with — this
   is checking the file's ACTUAL content, not its extension or MIME
   type (both of which can be wrong or missing). This exists because
   testing revealed a recurring pattern: PDF tools failing with "No
   PDF header found", Word to PDF failing with "not a zip file", and
   Images to PDF failing with "SOI not found in JPEG" are all the
   exact same underlying problem — a file was tried against a tool
   expecting a different format than what the file actually is.
   Catching that HERE, before any parsing library even runs, turns a
   cryptic library crash into an immediate, specific, friendly
   message — and it's the same check regardless of which tool.
   --------------------------------------------------------------- */
function readFileSignatureBytes(file, numBytes){
  return new Promise((resolve, reject)=>{
    const reader = new FileReader();
    reader.onload = ()=> resolve(new Uint8Array(reader.result));
    reader.onerror = ()=> reject(new Error('Could not read file'));
    reader.readAsArrayBuffer(file.slice(0, numBytes));
  });
}

function bytesStartWith(bytes, ...expected){
  return expected.every((b, i)=> bytes[i] === b);
}

/* Maps each tool to the format its input file must actually be, and
   how to recognize that format from its first bytes. 'text' formats
   (CSV) have no reliable magic number, so they're only checked
   against being ACCIDENTALLY a binary format someone mis-selected
   (a very common real mistake), not validated as "definitely CSV". */
const FILE_SIGNATURES = {
  pdf: { bytes:4, check: b => bytesStartWith(b, 0x25,0x50,0x44,0x46), label:'a PDF' }, // %PDF
  zip: { bytes:4, check: b => bytesStartWith(b, 0x50,0x4B) , label:'a Word (.docx) or Excel (.xlsx) file' }, // PK..
  jpeg:{ bytes:3, check: b => bytesStartWith(b, 0xFF,0xD8,0xFF), label:'a JPEG image' },
  png: { bytes:8, check: b => bytesStartWith(b, 0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A), label:'a PNG image' },
  webp:{ bytes:12, check: b => bytesStartWith(b, 0x52,0x49,0x46,0x46) && b[8]===0x57 && b[9]===0x45 && b[10]===0x42 && b[11]===0x50, label:'a WebP image' },
};

// Which signature each tool's file(s) must match. Tools not listed
// here (CSV-based, or ones that already do their own robust format
// sniffing like heic2jpg) skip this upfront check.
const TOOL_EXPECTED_FORMAT = {
  mergepdf:'pdf', splitpdf:'pdf', compresspdf:'pdf', rotatepdf:'pdf',
  pdf2img:'pdf', pdf2word:'pdf', pdf2text:'pdf',
  word2pdf:'zip', excel2csv:'zip',
  img2pdf:'image', resizeimage:'image', // 'image' = PNG or JPEG or WebP, checked specially below
};

/* Returns null if the file matches what the tool expects, or a
   specific, friendly error string if it doesn't. */
async function validateFileSignature(file, toolId){
  const expected = TOOL_EXPECTED_FORMAT[toolId];
  if(!expected) return null; // this tool doesn't get this check

  const bytes = await readFileSignatureBytes(file, 16);

  if(expected === 'image'){
    const isImage = FILE_SIGNATURES.jpeg.check(bytes) || FILE_SIGNATURES.png.check(bytes) || FILE_SIGNATURES.webp.check(bytes);
    if(!isImage){
      return `"${file.name}" doesn't look like a real PNG, JPEG, or WebP image — its content doesn't match any of those formats, regardless of its filename. Double-check this is the right file for this tool.`;
    }
    return null;
  }

  const sig = FILE_SIGNATURES[expected];
  if(!sig.check(bytes)){
    return `"${file.name}" doesn't look like ${sig.label} — its actual content doesn't start with the bytes a real ${sig.label} always has, regardless of its filename or extension. Double-check you've selected the right file for this tool.`;
  }
  return null;
}

async function runConversion(){
  // Note: the free-conversion gauge is spent at upload time (see addFiles()),
  // not here — this function only performs the actual client-side file
  // processing. This guard just protects against a stale enabled button.
  if(remainingConversions() <= 0 && !hasActiveBeastPass() && !beastPassActive){ showPaywallModal(); return; }
  if(queuedFiles.length === 0) return;

  const fn = Converters[selectedTool];
  if(!fn){ console.error('No converter registered for tool:', selectedTool); return; }

  // Check every queued file's ACTUAL content against what this tool
  // needs, before attempting anything — see FILE SIGNATURE VALIDATION
  // above for why this exists.
  for(const entry of queuedFiles){
    const problem = await validateFileSignature(entry.file, selectedTool);
    if(problem){
      alert(problem);
      return; // stop here — don't even attempt the conversion
    }
  }

  queuedFiles.forEach(f=> f.status = 'working');
  renderFileList();

  try{
    const results = await fn(queuedFiles);
    renderResults(results);
    // Clear the queue on success — an already-converted file has no
    // reason to stick around, and leaving it in queuedFiles was the
    // actual bug: it got re-validated (and could block) every future
    // conversion attempt, even against a completely different tool.
    // On FAILURE (catch block below), files are deliberately left in
    // place, marked 'error', so the person can see what failed and
    // remove it manually via the existing remove button.
    queuedFiles = [];
    renderFileList();
  }catch(err){
    console.error('Conversion failed:', err);
    queuedFiles.forEach(f=> f.status = 'error');
    renderFileList();
    alert(explainConversionError(err, selectedTool));
  }
  refreshConvertButtonState();
}

/* Translates known library error signatures into a message that tells
   the person what to actually do, instead of a raw stack trace. These
   patterns come from real errors seen in testing:
   - mammoth throws a JSZip "end of central directory" error when the
     file isn't a real .docx (a .docx IS a zip archive internally — an
     old .doc, or a mismatched file, will fail exactly like this).
   - pdf.js throws InvalidPDFException for anything that isn't a
     structurally valid, uncorrupted PDF.
   - heic2any explicitly refuses files that are already a browser-
     readable format (e.g. a .jpg someone tried to run through the
     HEIC converter).
   - heic2any's underlying HEIC decoder (libheif) has a known, currently
     UNRESOLVED open issue with HEIC files from newer iPhones (iPhone 15
     Pro/Pro Max and later, iOS 18+) — confirmed against heic2any's own
     GitHub issue tracker. This is not something fixable in our code;
     it's a real limitation of the decoding library itself. */
function explainConversionError(err, toolId){
  const msg = String(err && err.message || err);

  if(/ERR_LIBHEIF/i.test(msg)){
    return "This HEIC file uses a format variant our converter's decoder doesn't support yet — this affects photos from newer iPhones (iPhone 15 Pro and later, iOS 18+) specifically, and is a known open issue in the underlying library, not something wrong with your file. Workaround: on your iPhone, go to Settings → Camera → Formats and switch to \"Most Compatible\" — new photos will save as JPG directly, skipping HEIC entirely. Existing photos can also be re-exported as JPG from the Photos app (Share → then most export options offer a JPG option).";
  }
  if(/central directory|is this a zip file/i.test(msg)){
    return "That file doesn't look like a valid .docx — Word to PDF needs a modern Word document (2007 or later). If you have an older .doc file, open it in Word and re-save it as .docx first.";
  }
  if(err && err.name === 'InvalidPDFException'){
    return "That file doesn't look like a valid, readable PDF. It may be corrupted, or not actually a PDF — try a different file.";
  }
  if(/already browser readable/i.test(msg)){
    return "That file is already in a standard format (like JPEG) — HEIC to JPG only works on actual .heic files, typically straight from an iPhone.";
  }
  return 'Something went wrong during conversion. Check the console for details.';
}

/* Renders a completed conversion's downloadable file(s). Deliberately
   does NOT clear previous results first — every conversion in the
   session stays visible and downloadable until the page is refreshed,
   newest at the top. Losing earlier results the moment you convert a
   second file was a real usability gap, not intended behavior. */
function renderResults(results){
  const section = document.getElementById('results');
  const list = document.getElementById('result-list');
  results.forEach(r=>{
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <div class="ri">${ICONS.pdf.replace(/#12161D/g,'#17C989')}</div>
      <div class="rmeta">
        <div class="rname">${r.name}</div>
        <div class="rsub">${formatBytes(r.size)}</div>
      </div>
      <a class="download-link" href="${r.url}" download="${r.name}">${t('download')}</a>
    `;
    list.prepend(card); // newest conversion appears at the top
  });
  section.classList.add('show');
  section.scrollIntoView({ behavior:'smooth', block:'start' });
}

/* ---------------------------------------------------------------
   7. STRIPE CHECKOUT
   ---------------------------------------------------------------
   HOW THIS ACTUALLY WORKS (read this before deploying):

   1. CLIENT (this file): calls your backend to create a Checkout
      Session, then hands the returned session ID to Stripe.js, which
      redirects the browser to Stripe's own hosted payment page. This
      file NEVER touches your Secret Key — only the Publishable Key,
      which is meant to be public and safe to ship in browser code.

   2. YOUR BACKEND (does not exist in this static file — you need a
      small serverless function): creates the actual Checkout Session
      using your SECRET key, and separately verifies the webhook Stripe
      sends after payment using your WEBHOOK SECRET. Both of those keys
      must live only as environment variables on that backend — never
      in any file a browser downloads. See stripe-backend-example.js
      (a separate reference file, not part of this app) for a working
      Node/Express version of both endpoints, with clearly marked
      placeholders for STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in
      the one place they're actually safe to sit: your server's env vars.

   3. THE "UNLOCK": once the browser is redirected back to this page
      after a successful payment (success_url below), this file grants
      the pass by writing an expiry timestamp to localStorage — see
      handleStripeRedirectReturn() further down. This is intentionally
      lightweight client-side "soft" enforcement, not real session
      auth — it's proportionate for a $1 microtransaction, but it
      IS bypassable by anyone editing localStorage directly. That
      trade-off is disclosed in your Terms of Use §3 and again here in
      code; don't reuse this pattern for a higher-value product without
      real server-verified sessions.
   --------------------------------------------------------------- */

/* ============== CONFIG — fill these in ============== */
// Safe to expose in client code — publishable keys are designed for
// this. Get it from https://dashboard.stripe.com/apikeys (use the
// pk_test_... key while developing, pk_live_... only once you're ready
// to take real payments).
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51Tojub1Q1WEoih3D3SrAJSILhhAbkpT4Ad22izadeloSX1lpPqvdBBjwSjKkoSgTqFUUKj8f2jleOUw8XqjIryzM00EMe1OF5n';

// The backend endpoint that creates a Checkout Session (see
// stripe-backend-example.js). Until this points at a real, deployed
// endpoint, checkout falls back to DEMO_MODE below rather than failing
// silently on your users.
const CHECKOUT_SESSION_ENDPOINT = 'https://beastconverter-backend.onrender.com/api/create-checkout-session';
/* ====================================================== */

let stripeClient = null;
function getStripeClient(){
  if(!stripeClient && window.Stripe){
    stripeClient = Stripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripeClient;
}

async function triggerStripeCheckout({ product = 'beast-pass-24h', priceUSD = 1 } = {}){
  const demoMode = STRIPE_PUBLISHABLE_KEY.includes('YOUR_PUBLISHABLE_KEY_HERE');

  if(demoMode){
    // No real key/backend configured yet — fall back to a clearly
    // labeled simulation so the UI/UX can still be demoed and
    // reviewed. DO NOT ship this branch live; once STRIPE_PUBLISHABLE_KEY
    // and CHECKOUT_SESSION_ENDPOINT are set for real, this path is
    // never reached (demoMode becomes false automatically).
    console.warn('[DEMO MODE] Stripe is not configured yet — simulating a successful purchase. Set STRIPE_PUBLISHABLE_KEY and CHECKOUT_SESSION_ENDPOINT before going live.');
    alert(`[DEMO MODE — no real payment] Stripe isn't configured yet.\nSimulating a successful $${priceUSD} USD Beast Pass purchase for UI testing.`);
    grantBeastPass(24);
    return;
  }

  try{
    const res = await fetch(CHECKOUT_SESSION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product,
        priceUSD,
        success_url: window.location.origin + window.location.pathname + '?beast_pass=success&session_id={CHECKOUT_SESSION_ID}',
        cancel_url: window.location.origin + window.location.pathname + '?beast_pass=cancelled',
      }),
    });
    if(!res.ok) throw new Error('Backend did not return a valid session (HTTP ' + res.status + ')');
    const { id: sessionId } = await res.json();
    if(!sessionId) throw new Error('Backend response missing session id');

    const stripe = getStripeClient();
    if(!stripe) throw new Error('Stripe.js failed to load');

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if(error) throw error; // redirect only fails on a real error (e.g. bad session)
  }catch(err){
    console.error('Stripe checkout failed:', err);
    alert('Something went wrong starting checkout. Please try again in a moment, or contact contact@beastconverter.com if this keeps happening.');
  }
}

/* Called once on page load. Reads the ?beast_pass=success&session_id=...
   query params Stripe's success_url redirects back with, and grants
   the pass client-side. NOTE: this only checks that the params are
   present — it does not verify the session_id against Stripe's API,
   because that verification requires your Secret Key and therefore
   must happen server-side (ideally the same backend that creates the
   session should also confirm it, and could return a short-lived
   signed proof instead of trusting the client's URL — a stronger
   version of this you can build later, listed on the to-do list). */
function handleStripeRedirectReturn(){
  const params = new URLSearchParams(window.location.search);
  const status = params.get('beast_pass');
  if(status === 'success' && params.get('session_id')){
    grantBeastPass(24);
  }
  if(status){
    // Clean the URL so refreshing/sharing the link doesn't replay it.
    params.delete('beast_pass');
    params.delete('session_id');
    const clean = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    history.replaceState({}, '', clean);
  }
}

/* Cookie consent — placeholder wiring for a free banner script such as
   YesCookie or CookieConsent (https://www.cookieconsent.com). Swap the
   accept/decline handlers for the real SDK's consent API once added,
   e.g. window.YesCookie.accept() / window.YesCookie.decline(). */
function setupCookieBanner(){
  const banner = document.getElementById('cookie-banner');
  const consent = localStorage.getItem('bc_cookie_consent');
  if(!consent) banner.classList.add('show');

  document.getElementById('cookie-accept').addEventListener('click', ()=>{
    localStorage.setItem('bc_cookie_consent', 'accepted');
    banner.classList.remove('show');
    // window.YesCookie?.accept();
  });
  document.getElementById('cookie-decline').addEventListener('click', ()=>{
    localStorage.setItem('bc_cookie_consent', 'declined');
    banner.classList.remove('show');
    // window.YesCookie?.decline();
  });
}

/* ---------------------------------------------------------------
   8. WIRING / INIT
   --------------------------------------------------------------- */
function init(){
  document.getElementById('footer-year').textContent = new Date().getFullYear();
  beastPassActive = hasActiveBeastPass();

  buildLangSelector();
  initLanguage(); // saved pref → browser locale → English. No network calls.
  setupDropzone();
  renderMeter();
  refreshConvertButtonState();
  setupCookieBanner();
  handleStripeRedirectReturn(); // grants the pass if we just came back from a successful Stripe Checkout

  /* TEMPORARY, DELIBERATE: rewarded video is not connected to a real ad
     network yet (see the honest-status comment on watchRewardedVideoPlaceholder()
     below) — leaving the button live would let anyone bypass the paywall
     for free, unlimited times, with zero ad revenue. Hidden here until a
     real network is integrated; re-enabling later is just deleting these
     two lines, nothing else needs to change. */
  document.getElementById('watch-video-btn').style.display = 'none';
  document.getElementById('ab-video-btn').style.display = 'none';

  document.getElementById('convert-btn').addEventListener('click', runConversion);
  document.getElementById('watch-video-btn').addEventListener('click', watchRewardedVideoPlaceholder);
  document.getElementById('beast-pass-btn').addEventListener('click', ()=> triggerStripeCheckout());
  document.getElementById('beast-pass-nav-btn').addEventListener('click', ()=> triggerStripeCheckout());
  document.getElementById('ab-pass-btn').addEventListener('click', ()=>{ hideAdBlockModal(); triggerStripeCheckout(); });
  document.getElementById('ab-video-btn').addEventListener('click', watchRewardedVideoPlaceholder);
  document.getElementById('ab-whitelist-btn').addEventListener('click', hideAdBlockModal);

  // Rewarded video modal: confirm → simulated playing → success.
  document.getElementById('rv-watch-btn').addEventListener('click', simulateRewardedVideoPlayback);
  document.getElementById('rv-cancel-btn').addEventListener('click', hideRewardedVideoModal);
  document.getElementById('rv-continue-btn').addEventListener('click', ()=>{
    hideRewardedVideoModal();
    hidePaywallModal();   // closes it if that's where the person came from
    hideAdBlockModal();   // closes it if that's where the person came from instead
  });

  // Resize Image: toggling "keep aspect ratio" off enables manual height entry.
  document.getElementById('resize-keep-ratio').addEventListener('change', e=>{
    document.getElementById('resize-height-input').disabled = e.target.checked;
  });

  // Contact modal: open from the footer link, close via backdrop click
  // or Escape (unlike the paywall/AdBlock modals, this one is meant to
  // be freely dismissible).
  document.getElementById('footer-contact-link').addEventListener('click', e=>{ e.preventDefault(); showContactModal(); });
  document.getElementById('contact-form').addEventListener('submit', handleContactSubmit);
  document.getElementById('contact-modal').addEventListener('click', e=>{
    if(e.target.id === 'contact-modal') hideContactModal(); // clicked the dark backdrop, not the card
  });
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape') hideContactModal();
  });

  // If the gauge is already spent from an earlier visit in this 15-minute
  // window (localStorage persists across reloads), surface the paywall
  // modal immediately rather than waiting for the next upload attempt.
  if(remainingConversions() <= 0) showPaywallModal();

  // Run adblock detection after initial paint so it doesn't block first render
  window.addEventListener('load', ()=> setTimeout(detectAdBlock, 800));
}

document.addEventListener('DOMContentLoaded', init);
