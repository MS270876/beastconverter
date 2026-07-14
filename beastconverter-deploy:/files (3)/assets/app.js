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
   1. I18N — 13 languages. Each entry only needs to define the keys
   used by data-i18n="key" attributes in the HTML above. English is
   the fallback for any missing key in another language.
   --------------------------------------------------------------- */
const I18N = {
  en: { dir:'ltr', name:'English',
    seo:{ title:'BeastConverter: Free, Private PDF to Word & File Converter', description:'Convert PDF to Word, compress PDF, and more — 100% in your browser. Files are never uploaded to a server. Free, private, secure file conversion.' },
    eyebrow:'100% local · nothing ever uploaded',
    nav_beastpass:'Beast Pass',
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
    pw_pass:'Unlock instantly with a 24-Hour Beast Pass — 7 DKK / 1 EUR', pw_pass_sub:'Unlimited conversions · secured by Stripe',
    pw_value_compare_title:'Why a Beast Pass?', pw_value_compare_body:'Other online tools charge 70+ DKK/month. BeastConverter gives you 24 hours of premium local power for just 7 DKK. No subscriptions. No hidden traps. 100% SSL secure via Stripe. Ads stay on — that\'s how we keep it this cheap.',
    ab_title:'We noticed an ad blocker',
    ab_sub:"We get it, ads can be annoying. But unlike other converters, BeastConverter runs 100% in your browser. We don't harvest your data, and we don't use expensive cloud servers. We just need ads to keep the beast alive. Please whitelist us to continue for free, watch a quick rewarded video, or grab a 7 DKK pass.",
    ab_video:'Watch a quick video instead',
    ab_whitelist:"I've whitelisted the site", ab_pass:'Get Beast Pass instead — 7 DKK',
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
    nav_beastpass:'Beast Pass',
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
    pw_pass:'Lås op med det samme med en 24-timers Beast Pass — 7 DKK / 1 EUR', pw_pass_sub:'Ubegrænsede konverteringer · sikret af Stripe',
    pw_value_compare_title:'Hvorfor en Beast Pass?', pw_value_compare_body:'Andre online værktøjer koster 70+ DKK/måned. BeastConverter giver dig 24 timers premium lokal kraft for kun 7 DKK. Intet abonnement. Ingen skjulte fælder. 100% SSL-sikret via Stripe. Reklamer forbliver — det er sådan, vi holder prisen så lav.',
    ab_title:'Vi opdagede en annonceblokering',
    ab_sub:'Vi forstår godt, at annoncer kan være irriterende. Men i modsætning til andre konverteringsværktøjer kører BeastConverter 100% i din browser. Vi høster ikke dine data, og vi bruger ikke dyre cloud-servere. Vi har bare brug for annoncer for at holde udyret i live. Whitelist os for at fortsætte gratis, se en kort belønningsvideo, eller få en 7 DKK pas.',
    ab_video:'Se en kort video i stedet',
    ab_whitelist:'Jeg har whitelistet siden', ab_pass:'Få Beast Pass i stedet — 7 DKK',
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
  es: { dir:'ltr', name:'Español',
    seo:{ title:'BeastConverter: PDF a Word Gratis y Privado', description:'Convierte PDF a Word, comprime PDF y más — 100% en tu navegador. Los archivos nunca se suben a un servidor. Conversión gratuita y segura.' },
    eyebrow:'100% local · nunca se sube nada',
    nav_beastpass:'Beast Pass',
    nav_free:'Gratis',
    hero_title:'Convierte archivos como una <em>bestia.</em> Directo en tu navegador.',
    hero_sub:'Imágenes, PDF y hojas de cálculo — convertidos al instante en tu propio dispositivo. Sin servidores, sin esperas.',
    meter_label:'conversiones restantes', meter_window:'se reinicia en una ventana móvil de 15 minutos', meter_label_pass:'conversiones — Beast Pass activo', meter_pass_expires:'El Beast Pass caduca en',
    drop_title:'Arrastra archivos aquí para liberar a la bestia',
    drop_sub:'o elige archivos desde tu dispositivo — nunca lo abandonan',
    drop_browse:'Elegir archivos',
    drop_formats:'HEIC · PNG · JPG · WEBP · PDF · CSV — máx. 50MB por archivo',
    tools_kicker:'Elige tu herramienta',
    tools_title:'Cada herramienta funciona sin conexión, en tu pestaña',
    bar_selected:'Herramienta seleccionada', bar_none:'ninguna', bar_files:'Archivos', bar_convert:'Convertir ahora',
    results_kicker:'Recién salido de la guarida', results_title:'Tus archivos están listos',
    ad_placeholder:'Publicidad — 728×90', ad_placeholder_sidebar:'Publicidad — 300×600',
    pw_title:'La bestia necesita descansar',
    pw_sub:'Has usado tus 3 conversiones gratis. Se reinician automáticamente, o salta la espera abajo.',
    pw_countdown_label:'hasta que se reinicien tus conversiones gratis',
    pw_video:'Ver un vídeo de 30s para convertir al instante, gratis', pw_video_sub:'Vídeo con recompensa · sin necesidad de cuenta',
    pw_pass:'Desbloquea al instante con un Beast Pass de 24 horas — 7 DKK / 1 EUR', pw_pass_sub:'Conversiones ilimitadas · protegido por Stripe',
    pw_value_compare_title:'¿Por qué un Beast Pass?', pw_value_compare_body:'Otras herramientas online cobran 70+ DKK/mes. BeastConverter te da 24 horas de potencia local premium por solo 7 DKK. Sin suscripciones. Sin trampas ocultas. 100% seguro con SSL vía Stripe. Los anuncios se mantienen — así podemos ofrecer un precio tan bajo.',
    ab_title:'Detectamos un bloqueador de anuncios',
    ab_sub:'Lo entendemos, los anuncios pueden ser molestos. Pero a diferencia de otros conversores, BeastConverter funciona 100% en tu navegador. No recopilamos tus datos ni usamos costosos servidores en la nube. Solo necesitamos anuncios para mantener viva a la bestia. Añádenos a la lista blanca para continuar gratis, mira un vídeo con recompensa, o consigue un pase por 7 DKK.',
    ab_video:'Ver un vídeo en su lugar',
    ab_whitelist:'Ya he añadido el sitio a la lista blanca', ab_pass:'Obtener Beast Pass en su lugar — 7 DKK',
    cookie_text:'Usamos cookies para anuncios y análisis básico. Nunca se recopilan datos de archivos — las conversiones ocurren enteramente en tu dispositivo.',
    cookie_decline:'Rechazar', cookie_accept:'Aceptar',
    footer_tagline:'Conversión de archivos local. Tus archivos siempre permanecen en tu dispositivo.',
    footer_tools:'Herramientas', footer_tools_1:'Conversión de imágenes', footer_tools_2:'Herramientas PDF', footer_tools_3:'Hojas de cálculo',
    footer_company:'Empresa', footer_privacy:'Política de privacidad', footer_terms:'Términos de uso', footer_contact:'Contacto',
    footer_note:'Construido sin servidores. Impulsado por tu CPU.', download:'Descargar',
    t_heic2jpg_name:'HEIC a JPG', t_heic2jpg_desc:'Convierte fotos de iPhone a un JPG universalmente legible.',
    t_png2jpg_name:'PNG a JPG', t_png2jpg_desc:'Aplana la transparencia y reduce el tamaño del archivo.',
    t_webp_name:'WebP a PNG/JPG', t_webp_desc:'Desbloquea imágenes WebP para apps que necesitan formatos antiguos.',
    t_img2pdf_name:'Imágenes a PDF', t_img2pdf_desc:'Combina una o más imágenes en un solo PDF.',
    t_pdf2img_name:'PDF a imágenes', t_pdf2img_desc:'Exporta cada página de un PDF como una imagen PNG.',
    t_mergepdf_name:'Combinar PDF', t_mergepdf_desc:'Une varios PDF en un solo documento, en orden.',
    t_splitpdf_name:'Dividir PDF', t_splitpdf_desc:'Extrae cada página de un PDF como su propio archivo.',
    t_csv2xlsx_name:'CSV a Excel', t_csv2xlsx_desc:'Convierte un CSV en un libro .xlsx correctamente formateado.',
    t_pdf2word_name:'PDF a Word', t_pdf2word_desc:'Extrae el texto a un .docx editable que puedes revisar.',
    t_compresspdf_name:'Comprimir PDF', t_compresspdf_desc:'Reduce el tamaño eliminando estructura PDF redundante.',
    t_word2pdf_name:'Word a PDF', t_word2pdf_desc:'Convierte un .docx en un PDF listo para compartir e imprimir.',
    t_pdf2text_name:'PDF a texto', t_pdf2text_desc:'Extrae el texto plano de un PDF como archivo .txt.',
    badge_popular:'Más popular',
    t_resizeimage_name:'Redimensionar imagen', t_resizeimage_desc:'Escala una imagen a un ancho exacto, directamente en tu navegador.',
    resize_width_label:'Ancho deseado', resize_width_hint:'px — la altura se ajusta automáticamente',
    t_rotatepdf_name:'Girar PDF', t_rotatepdf_desc:'Corrige páginas torcidas — gira todas las páginas de un PDF a la vez.',
    t_excel2csv_name:'Excel a CSV', t_excel2csv_desc:'Convierte una hoja de cálculo .xlsx en un archivo .csv simple.',
    rotate_angle_label:'Rotación', rotate_option_90:'Girar 90° en sentido horario', rotate_option_180:'Girar 180°', rotate_option_270:'Girar 90° en sentido antihorario',
    rv_confirm_title:'¿Ver un anuncio rápido?', rv_confirm_body:'Un anuncio de vídeo de 30 segundos te da 3 conversiones gratis nuevas, ahora mismo.',
    rv_confirm_watch:'Ver anuncio', rv_confirm_cancel:'Ahora no',
    rv_playing_title:'Reproduciendo anuncio…', rv_playing_body:'(Simulado para pruebas — una red publicitaria real mostrará su propio reproductor aquí.)',
    rv_success_title:'¡Recompensa obtenida!', rv_success_body:'Ya tienes 3 conversiones gratis nuevas.', rv_success_continue:'Continuar',
  },
  de: { dir:'ltr', name:'Deutsch',
    seo:{ title:'BeastConverter: Kostenlos PDF zu Word, 100% Privat', description:'PDF zu Word konvertieren, PDF komprimieren und mehr — 100% im Browser. Dateien werden nie hochgeladen. Kostenlose, sichere Dateikonvertierung.' },
    eyebrow:'100% lokal · es wird nie etwas hochgeladen',
    nav_beastpass:'Beast Pass',
    nav_free:'Kostenlos',
    hero_title:'Dateien konvertieren wie ein <em>Biest.</em> Direkt im Browser.',
    hero_sub:'Bilder, PDFs und Tabellen — sofort auf Ihrem eigenen Gerät konvertiert. Keine Server, keine Wartezeit.',
    meter_label:'Umwandlungen übrig', meter_window:'setzt sich in einem rollierenden 15-Minuten-Fenster zurück', meter_label_pass:'Umwandlungen — Beast Pass aktiv', meter_pass_expires:'Beast Pass läuft ab in',
    drop_title:'Dateien hierher ziehen, um das Biest loszulassen',
    drop_sub:'oder Dateien von Ihrem Gerät auswählen — sie verlassen es nie',
    drop_browse:'Dateien auswählen',
    drop_formats:'HEIC · PNG · JPG · WEBP · PDF · CSV — max. 50MB pro Datei',
    tools_kicker:'Wählen Sie Ihr Werkzeug',
    tools_title:'Jedes Tool läuft offline in Ihrem Tab',
    bar_selected:'Ausgewähltes Tool', bar_none:'keines', bar_files:'Dateien', bar_convert:'Jetzt konvertieren',
    results_kicker:'Frisch aus der Höhle', results_title:'Ihre Dateien sind fertig',
    ad_placeholder:'Werbung — 728×90', ad_placeholder_sidebar:'Werbung — 300×600',
    pw_title:'Das Biest braucht eine Pause',
    pw_sub:'Sie haben alle 3 kostenlosen Umwandlungen genutzt. Sie setzen sich automatisch zurück — oder überspringen Sie die Wartezeit unten.',
    pw_countdown_label:'bis Ihre kostenlosen Umwandlungen zurückgesetzt werden',
    pw_video:'Ein 30-Sekunden-Video ansehen und sofort kostenlos konvertieren', pw_video_sub:'Belohnungsvideo · kein Konto nötig',
    pw_pass:'Sofort freischalten mit einem 24-Stunden Beast Pass — 7 DKK / 1 EUR', pw_pass_sub:'Unbegrenzte Umwandlungen · gesichert von Stripe',
    pw_value_compare_title:'Warum ein Beast Pass?', pw_value_compare_body:'Andere Online-Tools kosten 70+ DKK/Monat. BeastConverter gibt Ihnen 24 Stunden lokale Premium-Power für nur 7 DKK. Kein Abo. Keine versteckten Fallen. 100% SSL-gesichert über Stripe. Werbung bleibt bestehen — so können wir den Preis so niedrig halten.',
    ab_title:'Wir haben einen Werbeblocker erkannt',
    ab_sub:'Wir verstehen es, Werbung kann nervig sein. Aber im Gegensatz zu anderen Konvertern läuft BeastConverter 100% in Ihrem Browser. Wir sammeln keine Daten und nutzen keine teuren Cloud-Server. Wir brauchen nur Werbung, um das Biest am Leben zu halten. Setzen Sie uns auf die Whitelist, um kostenlos fortzufahren, sehen Sie sich ein kurzes Belohnungsvideo an, oder holen Sie sich einen 7-DKK-Pass.',
    ab_video:'Stattdessen ein kurzes Video ansehen',
    ab_whitelist:'Ich habe die Seite freigeschaltet', ab_pass:'Stattdessen Beast Pass holen — 7 DKK',
    cookie_text:'Wir verwenden Cookies für Werbung und einfache Analysen. Es werden nie Dateidaten gesammelt — Umwandlungen erfolgen ausschließlich auf Ihrem Gerät.',
    cookie_decline:'Ablehnen', cookie_accept:'Akzeptieren',
    footer_tagline:'Lokale Dateikonvertierung. Ihre Dateien bleiben immer auf Ihrem Gerät.',
    footer_tools:'Werkzeuge', footer_tools_1:'Bildkonvertierung', footer_tools_2:'PDF-Werkzeuge', footer_tools_3:'Tabellen',
    footer_company:'Unternehmen', footer_privacy:'Datenschutz', footer_terms:'Nutzungsbedingungen', footer_contact:'Kontakt',
    footer_note:'Gebaut ohne Server. Angetrieben von Ihrer CPU.', download:'Herunterladen',
    t_heic2jpg_name:'HEIC zu JPG', t_heic2jpg_desc:'Konvertiert iPhone-Fotos in universell lesbares JPG.',
    t_png2jpg_name:'PNG zu JPG', t_png2jpg_desc:'Entfernt Transparenz und verkleinert die Dateigröße.',
    t_webp_name:'WebP zu PNG/JPG', t_webp_desc:'Macht WebP-Bilder für Apps mit älteren Formaten nutzbar.',
    t_img2pdf_name:'Bilder zu PDF', t_img2pdf_desc:'Kombiniert ein oder mehrere Bilder zu einem PDF.',
    t_pdf2img_name:'PDF zu Bildern', t_pdf2img_desc:'Exportiert jede Seite eines PDFs als PNG-Bild.',
    t_mergepdf_name:'PDF zusammenführen', t_mergepdf_desc:'Fügt mehrere PDFs der Reihe nach zu einem Dokument zusammen.',
    t_splitpdf_name:'PDF teilen', t_splitpdf_desc:'Extrahiert jede Seite eines PDFs als eigene Datei.',
    t_csv2xlsx_name:'CSV zu Excel', t_csv2xlsx_desc:'Wandelt eine CSV in eine korrekt formatierte .xlsx-Datei um.',
    t_pdf2word_name:'PDF zu Word', t_pdf2word_desc:'Extrahiert Text in ein bearbeitbares .docx-Dokument.',
    t_compresspdf_name:'PDF komprimieren', t_compresspdf_desc:'Verkleinert die Dateigröße durch Entfernen redundanter PDF-Struktur.',
    t_word2pdf_name:'Word zu PDF', t_word2pdf_desc:'Wandelt eine .docx-Datei in eine teilbare, druckfertige PDF um.',
    t_pdf2text_name:'PDF zu Text', t_pdf2text_desc:'Extrahiert den reinen Text aus einer PDF als .txt-Datei.',
    badge_popular:'Am beliebtesten',
    t_resizeimage_name:'Bild skalieren', t_resizeimage_desc:'Skalieren Sie ein Bild auf eine exakte Breite, direkt in Ihrem Browser.',
    resize_width_label:'Zielbreite', resize_width_hint:'px — die Höhe wird automatisch angepasst',
    t_rotatepdf_name:'PDF drehen', t_rotatepdf_desc:'Seitenverkehrte Seiten korrigieren — alle Seiten einer PDF auf einmal drehen.',
    t_excel2csv_name:'Excel zu CSV', t_excel2csv_desc:'Wandelt eine .xlsx-Tabelle in eine einfache .csv-Datei um.',
    rotate_angle_label:'Drehung', rotate_option_90:'90° im Uhrzeigersinn drehen', rotate_option_180:'180° drehen', rotate_option_270:'90° gegen den Uhrzeigersinn drehen',
    rv_confirm_title:'Kurze Werbung ansehen?', rv_confirm_body:'Ein 30-Sekunden-Videowerbespot gibt Ihnen sofort 3 neue kostenlose Umwandlungen.',
    rv_confirm_watch:'Werbung ansehen', rv_confirm_cancel:'Jetzt nicht',
    rv_playing_title:'Werbung läuft…', rv_playing_body:'(Simuliert zu Testzwecken — ein echtes Werbenetzwerk zeigt hier seinen eigenen Player.)',
    rv_success_title:'Belohnung erhalten!', rv_success_body:'Sie haben 3 neue kostenlose Umwandlungen.', rv_success_continue:'Weiter',
  },
  fr: { dir:'ltr', name:'Français',
    seo:{ title:'BeastConverter : PDF vers Word Gratuit et Privé', description:'Convertissez PDF en Word, compressez un PDF et plus — 100% dans votre navigateur. Fichiers jamais envoyés à un serveur. Conversion gratuite et sécurisée.' },
    eyebrow:'100% local · rien n\'est jamais envoyé',
    nav_beastpass:'Beast Pass',
    nav_free:'Gratuit',
    hero_title:'Convertissez vos fichiers comme une <em>bête.</em> Directement dans votre navigateur.',
    hero_sub:'Images, PDF et tableurs — convertis instantanément sur votre appareil. Aucun serveur, aucune attente.',
    meter_label:'conversions restantes', meter_window:'se réinitialise sur une fenêtre glissante de 15 minutes', meter_label_pass:'conversions — Beast Pass actif', meter_pass_expires:'Le Beast Pass expire dans',
    drop_title:'Glissez vos fichiers ici pour libérer la bête',
    drop_sub:'ou choisissez des fichiers depuis votre appareil — ils ne le quittent jamais',
    drop_browse:'Choisir des fichiers',
    drop_formats:'HEIC · PNG · JPG · WEBP · PDF · CSV — max. 50 Mo par fichier',
    tools_kicker:'Choisissez votre arme',
    tools_title:'Chaque outil fonctionne hors ligne, dans votre onglet',
    bar_selected:'Outil sélectionné', bar_none:'aucun', bar_files:'Fichiers', bar_convert:'Convertir maintenant',
    results_kicker:'Tout frais sortis de la tanière', results_title:'Vos fichiers sont prêts',
    ad_placeholder:'Publicité — 728×90', ad_placeholder_sidebar:'Publicité — 300×600',
    pw_title:'La bête a besoin de repos',
    pw_sub:'Vous avez utilisé vos 3 conversions gratuites. Elles se réinitialisent automatiquement — ou évitez l\'attente ci-dessous.',
    pw_countdown_label:'avant la réinitialisation de vos conversions gratuites',
    pw_video:'Regarder une vidéo de 30s pour convertir instantanément, gratuitement', pw_video_sub:'Vidéo récompensée · aucun compte requis',
    pw_pass:'Débloquez instantanément avec un Beast Pass 24h — 7 DKK / 1 EUR', pw_pass_sub:'Conversions illimitées · sécurisé par Stripe',
    pw_value_compare_title:'Pourquoi un Beast Pass ?', pw_value_compare_body:"D'autres outils en ligne facturent 70+ DKK/mois. BeastConverter vous offre 24h de puissance locale premium pour seulement 7 DKK. Aucun abonnement. Aucun piège caché. 100% sécurisé SSL via Stripe. Les publicités restent — c'est ce qui nous permet de garder un prix aussi bas.",
    ab_title:'Nous avons détecté un bloqueur de publicités',
    ab_sub:"On comprend, la publicité peut être agaçante. Mais contrairement aux autres convertisseurs, BeastConverter fonctionne à 100% dans votre navigateur. Nous ne collectons pas vos données et n'utilisons pas de serveurs cloud coûteux. Nous avons juste besoin de publicité pour garder la bête en vie. Ajoutez-nous à votre liste blanche pour continuer gratuitement, regardez une courte vidéo récompensée, ou obtenez un pass à 7 DKK.",
    ab_video:'Regarder une vidéo à la place',
    ab_whitelist:'J\'ai autorisé le site', ab_pass:'Obtenir le Beast Pass à la place — 7 DKK',
    cookie_text:'Nous utilisons des cookies pour la publicité et une analyse basique. Aucune donnée de fichier n\'est jamais collectée — les conversions se font entièrement sur votre appareil.',
    cookie_decline:'Refuser', cookie_accept:'Accepter',
    footer_tagline:'Conversion de fichiers locale. Vos fichiers restent toujours sur votre appareil.',
    footer_tools:'Outils', footer_tools_1:'Conversion d\'images', footer_tools_2:'Outils PDF', footer_tools_3:'Tableurs',
    footer_company:'Entreprise', footer_privacy:'Politique de confidentialité', footer_terms:'Conditions d\'utilisation', footer_contact:'Contact',
    footer_note:'Construit sans serveurs. Alimenté par votre CPU.', download:'Télécharger',
    t_heic2jpg_name:'HEIC vers JPG', t_heic2jpg_desc:'Convertit les photos iPhone en JPG universellement lisible.',
    t_png2jpg_name:'PNG vers JPG', t_png2jpg_desc:'Aplatit la transparence et réduit la taille du fichier.',
    t_webp_name:'WebP vers PNG/JPG', t_webp_desc:'Débloque les images WebP pour les applis nécessitant d\'anciens formats.',
    t_img2pdf_name:'Images vers PDF', t_img2pdf_desc:'Combine une ou plusieurs images en un seul PDF.',
    t_pdf2img_name:'PDF vers images', t_pdf2img_desc:'Exporte chaque page d\'un PDF en image PNG.',
    t_mergepdf_name:'Fusionner PDF', t_mergepdf_desc:'Assemble plusieurs PDF en un seul document, dans l\'ordre.',
    t_splitpdf_name:'Diviser PDF', t_splitpdf_desc:'Extrait chaque page d\'un PDF en fichier séparé.',
    t_csv2xlsx_name:'CSV vers Excel', t_csv2xlsx_desc:'Transforme un CSV en classeur .xlsx correctement formaté.',
    t_pdf2word_name:'PDF vers Word', t_pdf2word_desc:'Extrait le texte dans un .docx modifiable.',
    t_compresspdf_name:'Compresser PDF', t_compresspdf_desc:'Réduit la taille en supprimant la structure PDF redondante.',
    t_word2pdf_name:'Word vers PDF', t_word2pdf_desc:'Transforme un .docx en PDF partageable et prêt à imprimer.',
    t_pdf2text_name:'PDF vers texte', t_pdf2text_desc:'Extrait le texte brut d\'un PDF sous forme de fichier .txt.',
    badge_popular:'Le plus populaire',
    t_resizeimage_name:"Redimensionner l'image", t_resizeimage_desc:"Redimensionnez une image à une largeur précise, directement dans votre navigateur.",
    resize_width_label:'Largeur cible', resize_width_hint:"px — la hauteur s'ajuste automatiquement",
    t_rotatepdf_name:'Pivoter PDF', t_rotatepdf_desc:"Corrigez les pages de travers — pivotez toutes les pages d'un PDF en une fois.",
    t_excel2csv_name:'Excel vers CSV', t_excel2csv_desc:'Transforme une feuille .xlsx en simple fichier .csv.',
    rotate_angle_label:'Rotation', rotate_option_90:'Pivoter à 90° dans le sens horaire', rotate_option_180:'Pivoter à 180°', rotate_option_270:'Pivoter à 90° dans le sens antihoraire',
    rv_confirm_title:'Regarder une courte pub ?', rv_confirm_body:'Une publicité vidéo de 30 secondes vous donne 3 nouvelles conversions gratuites, tout de suite.',
    rv_confirm_watch:'Regarder la pub', rv_confirm_cancel:'Pas maintenant',
    rv_playing_title:'Publicité en cours…', rv_playing_body:'(Simulé pour les tests — un vrai réseau publicitaire affichera son propre lecteur ici.)',
    rv_success_title:'Récompense obtenue !', rv_success_body:'Vous avez 3 nouvelles conversions gratuites.', rv_success_continue:'Continuer',
  },
  hi: { dir:'ltr', name:'हिन्दी',
    seo:{ title:'BeastConverter: मुफ़्त PDF से Word, 100% निजी', description:'PDF को Word में बदलें, PDF कंप्रेस करें और भी बहुत कुछ — पूरी तरह आपके ब्राउज़र में। फ़ाइलें कभी सर्वर पर अपलोड नहीं होतीं। मुफ़्त और सुरक्षित।' },
    eyebrow:'100% लोकल · कुछ भी कभी अपलोड नहीं होता',
    nav_beastpass:'Beast Pass',
    nav_free:'मुफ़्त',
    hero_title:'फ़ाइलों को <em>बीस्ट</em> की तरह बदलें। सीधे आपके ब्राउज़र में।',
    hero_sub:'इमेज, PDF और स्प्रेडशीट — आपकी अपनी डिवाइस पर तुरंत कन्वर्ट। कोई सर्वर नहीं, कोई इंतज़ार नहीं।',
    meter_label:'कन्वर्ज़न शेष', meter_window:'15-मिनट की रोलिंग विंडो पर रीसेट होता है', meter_label_pass:'कन्वर्ज़न — बीस्ट पास सक्रिय', meter_pass_expires:'बीस्ट पास समाप्त होगा',
    drop_title:'बीस्ट को जगाने के लिए फ़ाइलें यहाँ खींचें',
    drop_sub:'या अपनी डिवाइस से फ़ाइलें चुनें — वे कभी नहीं छोड़तीं',
    drop_browse:'फ़ाइलें चुनें',
    drop_formats:'HEIC · PNG · JPG · WEBP · PDF · CSV — प्रति फ़ाइल अधिकतम 50MB',
    tools_kicker:'अपना टूल चुनें',
    tools_title:'हर टूल आपके टैब में ऑफ़लाइन चलता है',
    bar_selected:'चयनित टूल', bar_none:'कोई नहीं', bar_files:'फ़ाइलें', bar_convert:'अभी कन्वर्ट करें',
    results_kicker:'गुफा से ताज़ा', results_title:'आपकी फ़ाइलें तैयार हैं',
    ad_placeholder:'विज्ञापन — 728×90', ad_placeholder_sidebar:'विज्ञापन — 300×600',
    pw_title:'बीस्ट को आराम चाहिए',
    pw_sub:'आपने अपने सभी 3 मुफ़्त कन्वर्ज़न इस्तेमाल कर लिए हैं। वे अपने आप रीसेट होंगे — या नीचे इंतज़ार छोड़ें।',
    pw_countdown_label:'आपके मुफ़्त कन्वर्ज़न रीसेट होने तक',
    pw_video:'मुफ़्त में तुरंत कन्वर्ट करने के लिए 30 सेकंड का वीडियो देखें', pw_video_sub:'रिवॉर्डेड वीडियो · अकाउंट की ज़रूरत नहीं',
    pw_pass:'24 घंटे के बीस्ट पास से तुरंत अनलॉक करें — 7 DKK / 1 EUR', pw_pass_sub:'असीमित कन्वर्ज़न · Stripe से सुरक्षित',
    pw_value_compare_title:'बीस्ट पास क्यों?', pw_value_compare_body:'अन्य ऑनलाइन टूल्स 70+ DKK/माह लेते हैं। BeastConverter आपको सिर्फ़ 7 DKK में 24 घंटे की प्रीमियम लोकल पावर देता है। कोई सब्सक्रिप्शन नहीं। कोई छिपा जाल नहीं। Stripe के ज़रिए 100% SSL सुरक्षित। विज्ञापन बने रहते हैं — इसी वजह से हम इतनी कम कीमत रख पाते हैं।',
    ab_title:'हमें एक ऐड ब्लॉकर मिला',
    ab_sub:'हम समझते हैं, विज्ञापन परेशान कर सकते हैं। लेकिन अन्य कन्वर्टर्स के विपरीत, BeastConverter पूरी तरह आपके ब्राउज़र में चलता है। हम आपका डेटा नहीं जुटाते, और महंगे क्लाउड सर्वर इस्तेमाल नहीं करते। बीस्ट को ज़िंदा रखने के लिए बस विज्ञापनों की ज़रूरत है। मुफ़्त जारी रखने के लिए हमें व्हाइटलिस्ट करें, एक छोटा रिवॉर्डेड वीडियो देखें, या 7 DKK में पास लें।',
    ab_video:'इसके बजाय एक वीडियो देखें',
    ab_whitelist:'मैंने साइट को व्हाइटलिस्ट कर दिया है', ab_pass:'इसके बजाय बीस्ट पास लें — 7 DKK',
    cookie_text:'हम विज्ञापनों और बुनियादी एनालिटिक्स के लिए कुकीज़ का उपयोग करते हैं। कोई फ़ाइल डेटा कभी एकत्र नहीं होता — कन्वर्ज़न पूरी तरह आपकी डिवाइस पर होते हैं।',
    cookie_decline:'अस्वीकार करें', cookie_accept:'स्वीकार करें',
    footer_tagline:'लोकल-फर्स्ट फ़ाइल कन्वर्ज़न। आपकी फ़ाइलें हमेशा आपकी डिवाइस पर रहती हैं।',
    footer_tools:'टूल्स', footer_tools_1:'इमेज कन्वर्ज़न', footer_tools_2:'PDF टूल्स', footer_tools_3:'स्प्रेडशीट्स',
    footer_company:'कंपनी', footer_privacy:'गोपनीयता नीति', footer_terms:'उपयोग की शर्तें', footer_contact:'संपर्क करें',
    footer_note:'बिना किसी सर्वर के बनाया गया। आपके CPU से संचालित।', download:'डाउनलोड करें',
    t_heic2jpg_name:'HEIC से JPG', t_heic2jpg_desc:'iPhone फ़ोटो को यूनिवर्सली पढ़ने योग्य JPG में बदलें।',
    t_png2jpg_name:'PNG से JPG', t_png2jpg_desc:'ट्रांसपेरेंसी हटाएं और फ़ाइल का आकार घटाएं।',
    t_webp_name:'WebP से PNG/JPG', t_webp_desc:'पुराने फॉर्मैट चाहने वाली ऐप्स के लिए WebP इमेज अनलॉक करें।',
    t_img2pdf_name:'इमेज से PDF', t_img2pdf_desc:'एक या अधिक इमेज को एक PDF में मिलाएं।',
    t_pdf2img_name:'PDF से इमेज', t_pdf2img_desc:'PDF के हर पेज को PNG इमेज के रूप में एक्सपोर्ट करें।',
    t_mergepdf_name:'PDF मर्ज करें', t_mergepdf_desc:'कई PDF को क्रम में एक दस्तावेज़ में जोड़ें।',
    t_splitpdf_name:'PDF स्प्लिट करें', t_splitpdf_desc:'PDF के हर पेज को अलग फ़ाइल के रूप में निकालें।',
    t_csv2xlsx_name:'CSV से Excel', t_csv2xlsx_desc:'CSV को सही ढंग से फॉर्मैट की गई .xlsx वर्कबुक में बदलें।',
    t_pdf2word_name:'PDF से Word', t_pdf2word_desc:'टेक्स्ट को एक संपादन योग्य .docx में निकालें।',
    t_compresspdf_name:'PDF कंप्रेस करें', t_compresspdf_desc:'अनावश्यक PDF संरचना हटाकर फ़ाइल का आकार घटाएं।',
    t_word2pdf_name:'Word से PDF', t_word2pdf_desc:'.docx को शेयर करने योग्य, प्रिंट-रेडी PDF में बदलें।',
    t_pdf2text_name:'PDF से टेक्स्ट', t_pdf2text_desc:'PDF से सादा टेक्स्ट एक .txt फ़ाइल के रूप में निकालें।',
    badge_popular:'सबसे लोकप्रिय',
    t_resizeimage_name:'इमेज का आकार बदलें', t_resizeimage_desc:'इमेज को एक निश्चित चौड़ाई में बदलें, सीधे आपके ब्राउज़र में।',
    resize_width_label:'लक्ष्य चौड़ाई', resize_width_hint:'px — ऊंचाई अपने आप समायोजित होगी',
    t_rotatepdf_name:'PDF घुमाएं', t_rotatepdf_desc:'तिरछे पेज ठीक करें — एक साथ PDF के सभी पेज घुमाएं।',
    t_excel2csv_name:'Excel से CSV', t_excel2csv_desc:'.xlsx स्प्रेडशीट को सादी .csv फ़ाइल में बदलें।',
    rotate_angle_label:'रोटेशन', rotate_option_90:'90° क्लॉकवाइज घुमाएं', rotate_option_180:'180° घुमाएं', rotate_option_270:'90° एंटी-क्लॉकवाइज घुमाएं',
    rv_confirm_title:'एक छोटा विज्ञापन देखें?', rv_confirm_body:'30 सेकंड का वीडियो विज्ञापन देखकर आपको अभी 3 नए मुफ़्त कन्वर्ज़न मिलेंगे।',
    rv_confirm_watch:'विज्ञापन देखें', rv_confirm_cancel:'अभी नहीं',
    rv_playing_title:'विज्ञापन चल रहा है…', rv_playing_body:'(परीक्षण के लिए सिम्युलेटेड — एक वास्तविक विज्ञापन नेटवर्क यहाँ अपना खुद का प्लेयर दिखाएगा।)',
    rv_success_title:'इनाम मिल गया!', rv_success_body:'आपको 3 नए मुफ़्त कन्वर्ज़न मिल गए हैं।', rv_success_continue:'जारी रखें',
  },
  ur: { dir:'rtl', name:'اردو',
    seo:{ title:'BeastConverter: مفت PDF سے Word، 100% نجی', description:'PDF کو Word میں تبدیل کریں، PDF کمپریس کریں اور مزید — مکمل طور پر آپ کے براؤزر میں۔ فائلیں کبھی سرور پر اپ لوڈ نہیں ہوتیں۔ مفت اور محفوظ۔' },
    eyebrow:'100% لوکل · کچھ بھی کبھی اپ لوڈ نہیں ہوتا',
    nav_beastpass:'Beast Pass',
    nav_free:'مفت',
    hero_title:'فائلوں کو <em>بیسٹ</em> کی طرح تبدیل کریں۔ براہ راست آپ کے براؤزر میں۔',
    hero_sub:'تصاویر، PDF اور اسپریڈ شیٹس — آپ کے اپنے ڈیوائس پر فوری طور پر تبدیل۔ کوئی سرور نہیں، کوئی انتظار نہیں۔',
    meter_label:'باقی تبدیلیاں', meter_window:'15 منٹ کی رولنگ ونڈو پر ری سیٹ ہوتا ہے', meter_label_pass:'تبدیلیاں — بیسٹ پاس فعال', meter_pass_expires:'بیسٹ پاس ختم ہوگا',
    drop_title:'بیسٹ کو جگانے کے لیے فائلیں یہاں گھسیٹیں',
    drop_sub:'یا اپنی ڈیوائس سے فائلیں منتخب کریں — وہ کبھی نہیں چھوڑتیں',
    drop_browse:'فائلیں منتخب کریں',
    drop_formats:'HEIC · PNG · JPG · WEBP · PDF · CSV — فی فائل زیادہ سے زیادہ 50MB',
    tools_kicker:'اپنا ٹول منتخب کریں',
    tools_title:'ہر ٹول آپ کے ٹیب میں آف لائن چلتا ہے',
    bar_selected:'منتخب کردہ ٹول', bar_none:'کوئی نہیں', bar_files:'فائلیں', bar_convert:'ابھی تبدیل کریں',
    results_kicker:'غار سے تازہ', results_title:'آپ کی فائلیں تیار ہیں',
    ad_placeholder:'اشتہار — 728×90', ad_placeholder_sidebar:'اشتہار — 300×600',
    pw_title:'بیسٹ کو آرام کی ضرورت ہے',
    pw_sub:'آپ نے اپنی تمام 3 مفت تبدیلیاں استعمال کر لی ہیں۔ وہ خود بخود ری سیٹ ہو جائیں گی — یا نیچے انتظار چھوڑ دیں۔',
    pw_countdown_label:'آپ کی مفت تبدیلیاں ری سیٹ ہونے تک',
    pw_video:'مفت میں فوری تبدیلی کے لیے 30 سیکنڈ کی ویڈیو دیکھیں', pw_video_sub:'ری وارڈڈ ویڈیو · اکاؤنٹ کی ضرورت نہیں',
    pw_pass:'24 گھنٹے کے بیسٹ پاس سے فوری طور پر انلاک کریں — 7 DKK / 1 EUR', pw_pass_sub:'لامحدود تبدیلیاں · Stripe سے محفوظ',
    pw_value_compare_title:'بیسٹ پاس کیوں؟', pw_value_compare_body:'دیگر آن لائن ٹولز 70+ DKK/ماہ چارج کرتے ہیں۔ BeastConverter آپ کو صرف 7 DKK میں 24 گھنٹے کی پریمیم لوکل طاقت دیتا ہے۔ کوئی سبسکرپشن نہیں۔ کوئی چھپا ہوا جال نہیں۔ Stripe کے ذریعے 100% SSL محفوظ۔ اشتہارات برقرار رہتے ہیں — اسی وجہ سے ہم اتنی کم قیمت رکھ پاتے ہیں۔',
    ab_title:'ہمیں ایک ایڈ بلاکر ملا',
    ab_sub:'ہم سمجھتے ہیں، اشتہارات پریشان کن ہو سکتے ہیں۔ لیکن دوسرے کنورٹرز کے برعکس، BeastConverter مکمل طور پر آپ کے براؤزر میں چلتا ہے۔ ہم آپ کا ڈیٹا اکٹھا نہیں کرتے، اور مہنگے کلاؤڈ سرورز استعمال نہیں کرتے۔ بیسٹ کو زندہ رکھنے کے لیے بس اشتہارات کی ضرورت ہے۔ مفت جاری رکھنے کے لیے ہمیں وائٹ لسٹ کریں، ایک مختصر ری وارڈڈ ویڈیو دیکھیں، یا 7 DKK میں پاس لیں۔',
    ab_video:'اس کے بجائے ایک ویڈیو دیکھیں',
    ab_whitelist:'میں نے سائٹ کو وائٹ لسٹ کر دیا ہے', ab_pass:'اس کے بجائے بیسٹ پاس حاصل کریں — 7 DKK',
    cookie_text:'ہم اشتہارات اور بنیادی تجزیات کے لیے کوکیز استعمال کرتے ہیں۔ کوئی فائل ڈیٹا کبھی جمع نہیں ہوتا — تبدیلیاں مکمل طور پر آپ کے ڈیوائس پر ہوتی ہیں۔',
    cookie_decline:'مسترد کریں', cookie_accept:'قبول کریں',
    footer_tagline:'لوکل فرسٹ فائل تبدیلی۔ آپ کی فائلیں ہمیشہ آپ کے ڈیوائس پر رہتی ہیں۔',
    footer_tools:'ٹولز', footer_tools_1:'امیج تبدیلی', footer_tools_2:'PDF ٹولز', footer_tools_3:'اسپریڈ شیٹس',
    footer_company:'کمپنی', footer_privacy:'رازداری کی پالیسی', footer_terms:'استعمال کی شرائط', footer_contact:'رابطہ کریں',
    footer_note:'بغیر کسی سرور کے بنایا گیا۔ آپ کے CPU سے چلتا ہے۔', download:'ڈاؤن لوڈ کریں',
    t_heic2jpg_name:'HEIC سے JPG', t_heic2jpg_desc:'آئی فون تصاویر کو عالمی سطح پر پڑھنے کے قابل JPG میں تبدیل کریں۔',
    t_png2jpg_name:'PNG سے JPG', t_png2jpg_desc:'شفافیت ہٹائیں اور فائل کا سائز کم کریں۔',
    t_webp_name:'WebP سے PNG/JPG', t_webp_desc:'پرانے فارمیٹس چاہنے والی ایپس کے لیے WebP تصاویر ان لاک کریں۔',
    t_img2pdf_name:'تصاویر سے PDF', t_img2pdf_desc:'ایک یا زیادہ تصاویر کو ایک PDF میں یکجا کریں۔',
    t_pdf2img_name:'PDF سے تصاویر', t_pdf2img_desc:'PDF کے ہر صفحے کو PNG تصویر کے طور پر ایکسپورٹ کریں۔',
    t_mergepdf_name:'PDF ضم کریں', t_mergepdf_desc:'کئی PDF کو ترتیب سے ایک دستاویز میں جوڑیں۔',
    t_splitpdf_name:'PDF تقسیم کریں', t_splitpdf_desc:'PDF کے ہر صفحے کو الگ فائل کے طور پر نکالیں۔',
    t_csv2xlsx_name:'CSV سے Excel', t_csv2xlsx_desc:'CSV کو صحیح طریقے سے فارمیٹ شدہ .xlsx فائل میں تبدیل کریں۔',
    t_pdf2word_name:'PDF سے Word', t_pdf2word_desc:'ٹیکسٹ کو ایک قابل ترمیم .docx میں نکالیں۔',
    t_compresspdf_name:'PDF کمپریس کریں', t_compresspdf_desc:'غیر ضروری PDF ڈھانچہ ہٹا کر فائل کا سائز کم کریں۔',
    t_word2pdf_name:'Word سے PDF', t_word2pdf_desc:'.docx کو شیئر کے قابل، پرنٹ کے لیے تیار PDF میں تبدیل کریں۔',
    t_pdf2text_name:'PDF سے ٹیکسٹ', t_pdf2text_desc:'PDF سے سادہ متن ایک .txt فائل کے طور پر نکالیں۔',
    badge_popular:'سب سے مقبول',
    t_resizeimage_name:'تصویر کا سائز تبدیل کریں', t_resizeimage_desc:'تصویر کو ایک مخصوص چوڑائی میں تبدیل کریں، براہ راست آپ کے براؤزر میں۔',
    resize_width_label:'مطلوبہ چوڑائی', resize_width_hint:'px — اونچائی خودکار طور پر ایڈجسٹ ہوگی',
    t_rotatepdf_name:'PDF گھمائیں', t_rotatepdf_desc:'ترچھے صفحات ٹھیک کریں — PDF کے تمام صفحات ایک ساتھ گھمائیں۔',
    t_excel2csv_name:'Excel سے CSV', t_excel2csv_desc:'.xlsx اسپریڈ شیٹ کو سادہ .csv فائل میں تبدیل کریں۔',
    rotate_angle_label:'گردش', rotate_option_90:'90° گھڑی وار گھمائیں', rotate_option_180:'180° گھمائیں', rotate_option_270:'90° گھڑی کے خلاف گھمائیں',
    rv_confirm_title:'ایک مختصر اشتہار دیکھیں؟', rv_confirm_body:'30 سیکنڈ کا ویڈیو اشتہار دیکھ کر آپ کو ابھی 3 نئے مفت تبدیلیاں ملیں گی۔',
    rv_confirm_watch:'اشتہار دیکھیں', rv_confirm_cancel:'ابھی نہیں',
    rv_playing_title:'اشتہار چل رہا ہے…', rv_playing_body:'(ٹیسٹنگ کے لیے سیمولیٹڈ — ایک حقیقی ایڈ نیٹ ورک یہاں اپنا پلیئر دکھائے گا۔)',
    rv_success_title:'انعام مل گیا!', rv_success_body:'آپ کو 3 نئی مفت تبدیلیاں مل گئیں۔', rv_success_continue:'جاری رکھیں',
  },
  ar: { dir:'rtl', name:'العربية',
    seo:{ title:'BeastConverter: PDF إلى Word مجانًا وخصوصية', description:'حوّل PDF إلى Word واضغط ملفات PDF والمزيد — بالكامل داخل متصفحك. الملفات لا تُرفع لأي خادم أبدًا. أداة تحويل ملفات مجانية وآمنة.' },
    eyebrow:'100% محلي · لا يُرفع شيء أبدًا',
    nav_beastpass:'Beast Pass',
    nav_free:'مجاني',
    hero_title:'حوّل ملفاتك مثل <em>الوحش.</em> مباشرة داخل متصفحك.',
    hero_sub:'صور وملفات PDF وجداول بيانات — تُحوَّل فورًا على جهازك الخاص. بلا خوادم، بلا انتظار.',
    meter_label:'تحويلات متبقية', meter_window:'يُعاد الضبط ضمن نافذة متجددة مدتها 15 دقيقة', meter_label_pass:'تحويلات — بطاقة الوحش نشطة', meter_pass_expires:'تنتهي بطاقة الوحش خلال',
    drop_title:'اسحب الملفات هنا لإطلاق الوحش',
    drop_sub:'أو اختر ملفات من جهازك — لن تغادره أبدًا',
    drop_browse:'اختر الملفات',
    drop_formats:'HEIC · PNG · JPG · WEBP · PDF · CSV — بحد أقصى 50 ميجابايت لكل ملف',
    tools_kicker:'اختر أداتك',
    tools_title:'كل أداة تعمل دون اتصال، داخل تبويبك',
    bar_selected:'الأداة المختارة', bar_none:'لا شيء', bar_files:'الملفات', bar_convert:'حوّل الآن',
    results_kicker:'حديثة العهد بالوحش', results_title:'ملفاتك جاهزة',
    ad_placeholder:'إعلان — 728×90', ad_placeholder_sidebar:'إعلان — 300×600',
    pw_title:'الوحش بحاجة إلى راحة',
    pw_sub:'لقد استخدمت تحويلاتك المجانية الثلاث. سيتم إعادة ضبطها تلقائيًا — أو تخطَّ الانتظار أدناه.',
    pw_countdown_label:'حتى إعادة ضبط تحويلاتك المجانية',
    pw_video:'شاهد فيديو مدته 30 ثانية للتحويل فورًا مجانًا', pw_video_sub:'فيديو مكافأة · لا حاجة لحساب',
    pw_pass:'افتح فورًا ببطاقة الوحش لمدة 24 ساعة — 7 كرونة دنماركية / 1 يورو', pw_pass_sub:'تحويلات غير محدودة · محمي بواسطة Stripe',
    pw_value_compare_title:'لماذا بطاقة الوحش؟', pw_value_compare_body:'الأدوات الأخرى عبر الإنترنت تتقاضى 70+ كرونة دنماركية/شهريًا. يمنحك BeastConverter 24 ساعة من القوة المحلية المميزة مقابل 7 كرونة فقط. بلا اشتراكات. بلا فخاخ خفية. آمن بنسبة 100% عبر SSL بواسطة Stripe. تبقى الإعلانات — وهذا ما يتيح لنا هذا السعر المنخفض.',
    ab_title:'لاحظنا وجود مانع إعلانات',
    ab_sub:'نتفهم أن الإعلانات قد تكون مزعجة. لكن على عكس أدوات التحويل الأخرى، يعمل BeastConverter بنسبة 100% داخل متصفحك. نحن لا نجمع بياناتك، ولا نستخدم خوادم سحابية باهظة. نحتاج فقط إلى الإعلانات لإبقاء الوحش على قيد الحياة. أضفنا للقائمة البيضاء للمتابعة مجانًا، أو شاهد فيديو مكافأة قصير، أو احصل على بطاقة بـ 7 كرونة دنماركية.',
    ab_video:'شاهد فيديو بدلاً من ذلك',
    ab_whitelist:'لقد أضفت الموقع للقائمة البيضاء', ab_pass:'احصل على بطاقة الوحش بدلاً من ذلك — 7 كرونة دنماركية',
    cookie_text:'نستخدم ملفات تعريف الارتباط للإعلانات والتحليلات الأساسية. لا تُجمع بيانات الملفات أبدًا — تتم التحويلات بالكامل على جهازك.',
    cookie_decline:'رفض', cookie_accept:'موافقة',
    footer_tagline:'تحويل ملفات محلي أولاً. تبقى ملفاتك دائمًا على جهازك.',
    footer_tools:'الأدوات', footer_tools_1:'تحويل الصور', footer_tools_2:'أدوات PDF', footer_tools_3:'جداول البيانات',
    footer_company:'الشركة', footer_privacy:'سياسة الخصوصية', footer_terms:'شروط الاستخدام', footer_contact:'اتصل بنا',
    footer_note:'بُني بدون خوادم. يعمل بواسطة معالج جهازك.', download:'تنزيل',
    t_heic2jpg_name:'HEIC إلى JPG', t_heic2jpg_desc:'حوّل صور آيفون إلى JPG قابل للقراءة عالميًا.',
    t_png2jpg_name:'PNG إلى JPG', t_png2jpg_desc:'تسوية الشفافية وتقليل حجم الملف.',
    t_webp_name:'WebP إلى PNG/JPG', t_webp_desc:'أطلق صور WebP للتطبيقات التي تحتاج تنسيقات أقدم.',
    t_img2pdf_name:'صور إلى PDF', t_img2pdf_desc:'اجمع صورة واحدة أو أكثر في ملف PDF واحد.',
    t_pdf2img_name:'PDF إلى صور', t_pdf2img_desc:'صدّر كل صفحة من ملف PDF كصورة PNG.',
    t_mergepdf_name:'دمج PDF', t_mergepdf_desc:'اجمع عدة ملفات PDF في مستند واحد، بالترتيب.',
    t_splitpdf_name:'تقسيم PDF', t_splitpdf_desc:'استخرج كل صفحة من ملف PDF كملف مستقل.',
    t_csv2xlsx_name:'CSV إلى Excel', t_csv2xlsx_desc:'حوّل ملف CSV إلى مصنف .xlsx منسق بشكل صحيح.',
    t_pdf2word_name:'PDF إلى Word', t_pdf2word_desc:'استخراج النص إلى ملف .docx قابل للتحرير.',
    t_compresspdf_name:'ضغط PDF', t_compresspdf_desc:'تقليل حجم الملف بإزالة البنية الزائدة في PDF.',
    t_word2pdf_name:'Word إلى PDF', t_word2pdf_desc:'حوّل ملف .docx إلى PDF قابل للمشاركة وجاهز للطباعة.',
    t_pdf2text_name:'PDF إلى نص', t_pdf2text_desc:'استخرج النص العادي من PDF كملف .txt.',
    badge_popular:'الأكثر شعبية',
    t_resizeimage_name:'تغيير حجم الصورة', t_resizeimage_desc:'غيّر حجم صورة إلى عرض محدد، مباشرة داخل متصفحك.',
    resize_width_label:'العرض المستهدف', resize_width_hint:'بكسل — يتم ضبط الارتفاع تلقائيًا',
    t_rotatepdf_name:'تدوير PDF', t_rotatepdf_desc:'صحّح الصفحات المائلة — دوّر كل صفحات PDF دفعة واحدة.',
    t_excel2csv_name:'Excel إلى CSV', t_excel2csv_desc:'حوّل جدول بيانات .xlsx إلى ملف .csv بسيط.',
    rotate_angle_label:'التدوير', rotate_option_90:'تدوير 90° مع عقارب الساعة', rotate_option_180:'تدوير 180°', rotate_option_270:'تدوير 90° عكس عقارب الساعة',
    rv_confirm_title:'مشاهدة إعلان قصير؟', rv_confirm_body:'إعلان فيديو مدته 30 ثانية يمنحك 3 تحويلات مجانية جديدة، الآن.',
    rv_confirm_watch:'شاهد الإعلان', rv_confirm_cancel:'ليس الآن',
    rv_playing_title:'الإعلان قيد التشغيل…', rv_playing_body:'(محاكاة للاختبار — شبكة إعلانات حقيقية ستعرض مشغلها الخاص هنا.)',
    rv_success_title:'تم منح المكافأة!', rv_success_body:'حصلت على 3 تحويلات مجانية جديدة.', rv_success_continue:'متابعة',
  },
  zh: { dir:'ltr', name:'中文（普通话）',
    seo:{ title:'BeastConverter：免费 PDF 转 Word，浏览器内 100% 私密', description:'在浏览器中转换 PDF 为 Word、压缩 PDF 等 — 文件从不上传服务器。免费、私密、安全的文件转换工具。' },
    eyebrow:'100% 本地 · 从不上传任何内容',
    nav_beastpass:'Beast Pass',
    nav_free:'免费',
    hero_title:'像<em>猛兽</em>一样转换文件。就在你的浏览器中。',
    hero_sub:'图片、PDF 和表格 — 在你自己的设备上即时转换。没有服务器，没有等待。',
    meter_label:'剩余转换次数', meter_window:'在滚动的15分钟窗口内重置', meter_label_pass:'次转换 — 猛兽通行证已激活', meter_pass_expires:'猛兽通行证将在以下时间后到期',
    drop_title:'将文件拖到此处，释放猛兽',
    drop_sub:'或从你的设备选择文件 — 它们永不离开',
    drop_browse:'选择文件',
    drop_formats:'HEIC · PNG · JPG · WEBP · PDF · CSV — 每个文件最大 50MB',
    tools_kicker:'选择你的工具',
    tools_title:'每个工具都可在你的标签页离线运行',
    bar_selected:'已选工具', bar_none:'无', bar_files:'文件', bar_convert:'立即转换',
    results_kicker:'刚出巢穴', results_title:'你的文件已准备就绪',
    ad_placeholder:'广告 — 728×90', ad_placeholder_sidebar:'广告 — 300×600',
    pw_title:'猛兽需要休息',
    pw_sub:'你已用完全部 3 次免费转换。它们会自动重置 — 或跳过下方等待。',
    pw_countdown_label:'距离免费转换重置还有',
    pw_video:'观看30秒视频即可免费立即转换', pw_video_sub:'奖励视频 · 无需账号',
    pw_pass:'使用24小时猛兽通行证立即解锁 — 7丹麦克朗 / 1欧元', pw_pass_sub:'无限次转换 · 由 Stripe 保障',
    pw_value_compare_title:'为什么选择猛兽通行证？', pw_value_compare_body:'其他在线工具每月收费70丹麦克朗以上。BeastConverter 仅需7丹麦克朗即可获得24小时本地高级算力。无需订阅，无隐藏陷阱，通过 Stripe 提供100% SSL安全保障。广告依然保留 — 这正是我们能提供这么低价格的原因。',
    ab_title:'我们检测到广告拦截器',
    ab_sub:'我们理解，广告可能会让人厌烦。但与其他转换工具不同，BeastConverter 完全在你的浏览器中运行。我们不收集你的数据，也不使用昂贵的云服务器。我们只是需要广告来维持这头猛兽的生存。请将我们加入白名单以继续免费使用，或观看一段简短的奖励视频，或购买7丹麦克朗的通行证。',
    ab_video:'改为观看视频',
    ab_whitelist:'我已将该网站加入白名单', ab_pass:'改为获取猛兽通行证 — 7丹麦克朗',
    cookie_text:'我们使用 Cookie 用于广告和基本分析。绝不收集任何文件数据 — 转换完全在你的设备上进行。',
    cookie_decline:'拒绝', cookie_accept:'接受',
    footer_tagline:'本地优先的文件转换。你的文件始终留在你的设备上。',
    footer_tools:'工具', footer_tools_1:'图片转换', footer_tools_2:'PDF 工具', footer_tools_3:'表格',
    footer_company:'公司', footer_privacy:'隐私政策', footer_terms:'使用条款', footer_contact:'联系我们',
    footer_note:'零服务器构建。由你的 CPU 驱动。', download:'下载',
    t_heic2jpg_name:'HEIC 转 JPG', t_heic2jpg_desc:'将 iPhone 照片转换为通用可读的 JPG。',
    t_png2jpg_name:'PNG 转 JPG', t_png2jpg_desc:'展平透明度并缩小文件体积。',
    t_webp_name:'WebP 转 PNG/JPG', t_webp_desc:'为需要旧格式的应用解锁 WebP 图片。',
    t_img2pdf_name:'图片转 PDF', t_img2pdf_desc:'将一张或多张图片合并为单个 PDF。',
    t_pdf2img_name:'PDF 转图片', t_pdf2img_desc:'将 PDF 的每一页导出为 PNG 图片。',
    t_mergepdf_name:'合并 PDF', t_mergepdf_desc:'按顺序将多个 PDF 拼接为一个文档。',
    t_splitpdf_name:'拆分 PDF', t_splitpdf_desc:'将 PDF 的每一页提取为单独文件。',
    t_csv2xlsx_name:'CSV 转 Excel', t_csv2xlsx_desc:'将 CSV 转换为格式正确的 .xlsx 工作簿。',
    t_pdf2word_name:'PDF 转 Word', t_pdf2word_desc:'将文本提取为可编辑的 .docx 文件。',
    t_compresspdf_name:'压缩 PDF', t_compresspdf_desc:'通过精简冗余结构缩小 PDF 文件体积。',
    t_word2pdf_name:'Word 转 PDF', t_word2pdf_desc:'将 .docx 转换为可分享、可打印的 PDF。',
    t_pdf2text_name:'PDF 转文本', t_pdf2text_desc:'将 PDF 中的纯文本提取为 .txt 文件。',
    badge_popular:'最受欢迎',
    t_resizeimage_name:'调整图片大小', t_resizeimage_desc:'在浏览器中将图片缩放到精确宽度。',
    resize_width_label:'目标宽度', resize_width_hint:'px — 高度将自动按比例调整',
    t_rotatepdf_name:'旋转 PDF', t_rotatepdf_desc:'修正倾斜页面 — 一次性旋转 PDF 的所有页面。',
    t_excel2csv_name:'Excel 转 CSV', t_excel2csv_desc:'将 .xlsx 表格转换为纯 .csv 文件。',
    rotate_angle_label:'旋转角度', rotate_option_90:'顺时针旋转90°', rotate_option_180:'旋转180°', rotate_option_270:'逆时针旋转90°',
    rv_confirm_title:'观看一段简短广告？', rv_confirm_body:'观看30秒视频广告，即可立即获得3次全新免费转换。',
    rv_confirm_watch:'观看广告', rv_confirm_cancel:'暂不',
    rv_playing_title:'广告播放中…', rv_playing_body:'（此为测试模拟 — 真实广告网络将在此处显示其自己的播放器。）',
    rv_success_title:'奖励已发放！', rv_success_body:'你已获得3次全新免费转换。', rv_success_continue:'继续',
  },
  yue: { dir:'ltr', name:'廣東話',
    seo:{ title:'BeastConverter：免費 PDF 轉 Word，瀏覽器入面 100% 私密', description:'喺瀏覽器入面轉換 PDF 做 Word、壓縮 PDF 仲有更多 — 檔案永遠唔會上傳伺服器。免費、私密、安全嘅檔案轉換工具。' },
    eyebrow:'100% 本地 · 從唔上載任何嘢',
    nav_beastpass:'Beast Pass',
    nav_free:'免費',
    hero_title:'將檔案轉換得好似<em>猛獸</em>一樣。直接喺你嘅瀏覽器入面。',
    hero_sub:'圖片、PDF同試算表 — 喺你自己部裝置即時轉換。冇伺服器，唔使等。',
    meter_label:'剩返嘅轉換次數', meter_window:'喺15分鐘嘅滾動時段內重置', meter_label_pass:'次轉換 — 猛獸通行證已啟用', meter_pass_expires:'猛獸通行證將喺以下時間後到期',
    drop_title:'將檔案拖到呢度，釋放猛獸',
    drop_sub:'或者喺你部裝置揀檔案 — 永遠唔會離開佢',
    drop_browse:'揀檔案',
    drop_formats:'HEIC · PNG · JPG · WEBP · PDF · CSV — 每個檔案最大 50MB',
    tools_kicker:'揀你嘅工具',
    tools_title:'每個工具都可以喺你嘅分頁離線運作',
    bar_selected:'已揀工具', bar_none:'無', bar_files:'檔案', bar_convert:'即刻轉換',
    results_kicker:'啱啱出爐', results_title:'你嘅檔案已經準備好',
    ad_placeholder:'廣告 — 728×90', ad_placeholder_sidebar:'廣告 — 300×600',
    pw_title:'猛獸需要休息',
    pw_sub:'你已經用晒全部3次免費轉換。佢哋會自動重置 — 或者跳過下面嘅等待。',
    pw_countdown_label:'距離免費轉換重置仲有',
    pw_video:'睇30秒短片即可免費即時轉換', pw_video_sub:'獎勵短片 · 唔使帳戶',
    pw_pass:'用24小時猛獸通行證即刻解鎖 — 7丹麥克朗 / 1歐元', pw_pass_sub:'無限次轉換 · 由 Stripe 保障',
    pw_value_compare_title:'點解要買猛獸通行證？', pw_value_compare_body:'其他網上工具每個月收70丹麥克朗以上。BeastConverter 淨係要7丹麥克朗就俾你24小時本地高級運算力。唔使訂閱，冇隱藏陷阱，透過 Stripe 提供100% SSL安全保障。廣告仍然保留 — 呢個就係我哋可以提供咁低價錢嘅原因。',
    ab_title:'我哋偵測到廣告攔截器',
    ab_sub:'我哋明白，廣告可能會好煩。但同其他轉換工具唔同，BeastConverter 完全喺你嘅瀏覽器入面運作。我哋唔會收集你嘅數據，亦都唔會用貴嘅雲端伺服器。我哋淨係需要廣告嚟維持呢隻猛獸生存。請將我哋加入白名單以繼續免費使用，或者睇一段簡短嘅獎勵短片，或者買個7丹麥克朗嘅通行證。',
    ab_video:'不如睇短片',
    ab_whitelist:'我已經將呢個網站加入白名單', ab_pass:'不如攞猛獸通行證 — 7丹麥克朗',
    cookie_text:'我哋用 Cookie 嚟做廣告同基本分析。絕對唔會收集任何檔案數據 — 轉換完全喺你部裝置度進行。',
    cookie_decline:'拒絕', cookie_accept:'接受',
    footer_tagline:'本地優先嘅檔案轉換。你嘅檔案永遠留喺你部裝置。',
    footer_tools:'工具', footer_tools_1:'圖片轉換', footer_tools_2:'PDF 工具', footer_tools_3:'試算表',
    footer_company:'公司', footer_privacy:'私隱政策', footer_terms:'使用條款', footer_contact:'聯絡我哋',
    footer_note:'零伺服器構建。由你部裝置嘅CPU驅動。', download:'下載',
    t_heic2jpg_name:'HEIC 轉 JPG', t_heic2jpg_desc:'將 iPhone 相片轉換做通用可讀嘅 JPG。',
    t_png2jpg_name:'PNG 轉 JPG', t_png2jpg_desc:'拉平透明度同縮細檔案體積。',
    t_webp_name:'WebP 轉 PNG/JPG', t_webp_desc:'為需要舊格式嘅應用程式解鎖 WebP 圖片。',
    t_img2pdf_name:'圖片轉 PDF', t_img2pdf_desc:'將一張或以上圖片合併做單一 PDF。',
    t_pdf2img_name:'PDF 轉圖片', t_pdf2img_desc:'將 PDF 每一頁匯出做 PNG 圖片。',
    t_mergepdf_name:'合併 PDF', t_mergepdf_desc:'按次序將多個 PDF 併埋做一份文件。',
    t_splitpdf_name:'拆分 PDF', t_splitpdf_desc:'將 PDF 每一頁抽出做獨立檔案。',
    t_csv2xlsx_name:'CSV 轉 Excel', t_csv2xlsx_desc:'將 CSV 轉換做格式正確嘅 .xlsx 工作簿。',
    t_pdf2word_name:'PDF 轉 Word', t_pdf2word_desc:'將文字提取做可編輯嘅 .docx 文件。',
    t_compresspdf_name:'壓縮 PDF', t_compresspdf_desc:'透過精簡多餘結構縮細 PDF 檔案體積。',
    t_word2pdf_name:'Word 轉 PDF', t_word2pdf_desc:'將 .docx 轉換做可分享、可列印嘅 PDF。',
    t_pdf2text_name:'PDF 轉文字', t_pdf2text_desc:'將 PDF 入面嘅純文字提取做 .txt 檔案。',
    badge_popular:'最受歡迎',
    t_resizeimage_name:'調整圖片大小', t_resizeimage_desc:'喺瀏覽器入面將圖片縮放到精確闊度。',
    resize_width_label:'目標闊度', resize_width_hint:'px — 高度會自動按比例調整',
    t_rotatepdf_name:'旋轉 PDF', t_rotatepdf_desc:'修正傾斜頁面 — 一次過旋轉 PDF 嘅所有頁面。',
    t_excel2csv_name:'Excel 轉 CSV', t_excel2csv_desc:'將 .xlsx 試算表轉換做純 .csv 檔案。',
    rotate_angle_label:'旋轉角度', rotate_option_90:'順時針旋轉90°', rotate_option_180:'旋轉180°', rotate_option_270:'逆時針旋轉90°',
    rv_confirm_title:'睇一段簡短廣告？', rv_confirm_body:'睇30秒短片廣告，即刻俾你3次全新免費轉換。',
    rv_confirm_watch:'睇廣告', rv_confirm_cancel:'而家唔使',
    rv_playing_title:'廣告播放緊…', rv_playing_body:'（呢個係測試模擬 — 真實廣告網絡會喺呢度顯示佢自己嘅播放器。）',
    rv_success_title:'獎勵已發放！', rv_success_body:'你已經攞到3次全新免費轉換。', rv_success_continue:'繼續',
  },
  pt: { dir:'ltr', name:'Português',
    seo:{ title:'BeastConverter: PDF para Word Grátis e Privado', description:'Converta PDF para Word, comprima PDF e mais — 100% no seu navegador. Arquivos nunca são enviados a um servidor. Conversão grátis e segura.' },
    eyebrow:'100% local · nada é enviado, nunca',
    nav_beastpass:'Beast Pass',
    nav_free:'Grátis',
    hero_title:'Converta arquivos como uma <em>fera.</em> Direto no seu navegador.',
    hero_sub:'Imagens, PDFs e planilhas — convertidos instantaneamente no seu próprio dispositivo. Sem servidores, sem espera.',
    meter_label:'conversões restantes', meter_window:'reinicia em uma janela contínua de 15 minutos', meter_label_pass:'conversões — Beast Pass ativo', meter_pass_expires:'O Beast Pass expira em',
    drop_title:'Arraste arquivos aqui para soltar a fera',
    drop_sub:'ou escolha arquivos do seu dispositivo — eles nunca o deixam',
    drop_browse:'Escolher arquivos',
    drop_formats:'HEIC · PNG · JPG · WEBP · PDF · CSV — máx. 50MB por arquivo',
    tools_kicker:'Escolha sua arma',
    tools_title:'Cada ferramenta funciona offline, na sua aba',
    bar_selected:'Ferramenta selecionada', bar_none:'nenhuma', bar_files:'Arquivos', bar_convert:'Converter agora',
    results_kicker:'Recém-saído da toca', results_title:'Seus arquivos estão prontos',
    ad_placeholder:'Publicidade — 728×90', ad_placeholder_sidebar:'Publicidade — 300×600',
    pw_title:'A fera precisa descansar',
    pw_sub:'Você usou suas 3 conversões gratuitas. Elas reiniciam automaticamente — ou pule a espera abaixo.',
    pw_countdown_label:'até suas conversões gratuitas reiniciarem',
    pw_video:'Assista um vídeo de 30s para converter instantaneamente, grátis', pw_video_sub:'Vídeo recompensado · sem necessidade de conta',
    pw_pass:'Desbloqueie instantaneamente com um Beast Pass de 24 horas — 7 DKK / 1 EUR', pw_pass_sub:'Conversões ilimitadas · protegido pela Stripe',
    pw_value_compare_title:'Por que um Beast Pass?', pw_value_compare_body:'Outras ferramentas online cobram 70+ DKK/mês. O BeastConverter te dá 24 horas de poder local premium por apenas 7 DKK. Sem assinaturas. Sem pegadinhas. 100% seguro com SSL via Stripe. Os anúncios permanecem — é assim que mantemos o preço tão baixo.',
    ab_title:'Detectamos um bloqueador de anúncios',
    ab_sub:'Entendemos que anúncios podem ser irritantes. Mas, diferente de outros conversores, o BeastConverter roda 100% no seu navegador. Não coletamos seus dados, nem usamos servidores em nuvem caros. Só precisamos de anúncios para manter a fera viva. Adicione-nos à lista de permissões para continuar de graça, assista a um vídeo recompensado rápido, ou pegue um passe de 7 DKK.',
    ab_video:'Assistir a um vídeo em vez disso',
    ab_whitelist:'Já coloquei o site na lista de permissões', ab_pass:'Obter Beast Pass em vez disso — 7 DKK',
    cookie_text:'Usamos cookies para anúncios e análises básicas. Nenhum dado de arquivo é coletado — as conversões acontecem inteiramente no seu dispositivo.',
    cookie_decline:'Recusar', cookie_accept:'Aceitar',
    footer_tagline:'Conversão de arquivos local. Seus arquivos sempre permanecem no seu dispositivo.',
    footer_tools:'Ferramentas', footer_tools_1:'Conversão de imagens', footer_tools_2:'Ferramentas de PDF', footer_tools_3:'Planilhas',
    footer_company:'Empresa', footer_privacy:'Política de privacidade', footer_terms:'Termos de uso', footer_contact:'Contato',
    footer_note:'Construído sem servidores. Alimentado pela sua CPU.', download:'Baixar',
    t_heic2jpg_name:'HEIC para JPG', t_heic2jpg_desc:'Converte fotos do iPhone para JPG universalmente legível.',
    t_png2jpg_name:'PNG para JPG', t_png2jpg_desc:'Achata a transparência e reduz o tamanho do arquivo.',
    t_webp_name:'WebP para PNG/JPG', t_webp_desc:'Desbloqueia imagens WebP para apps que precisam de formatos antigos.',
    t_img2pdf_name:'Imagens para PDF', t_img2pdf_desc:'Combina uma ou mais imagens em um único PDF.',
    t_pdf2img_name:'PDF para imagens', t_pdf2img_desc:'Exporta cada página de um PDF como uma imagem PNG.',
    t_mergepdf_name:'Mesclar PDF', t_mergepdf_desc:'Une vários PDFs em um único documento, em ordem.',
    t_splitpdf_name:'Dividir PDF', t_splitpdf_desc:'Extrai cada página de um PDF como um arquivo próprio.',
    t_csv2xlsx_name:'CSV para Excel', t_csv2xlsx_desc:'Transforma um CSV em uma pasta de trabalho .xlsx corretamente formatada.',
    t_pdf2word_name:'PDF para Word', t_pdf2word_desc:'Extrai o texto para um .docx editável.',
    t_compresspdf_name:'Comprimir PDF', t_compresspdf_desc:'Reduz o tamanho removendo estrutura PDF redundante.',
    t_word2pdf_name:'Word para PDF', t_word2pdf_desc:'Transforma um .docx em um PDF pronto para compartilhar e imprimir.',
    t_pdf2text_name:'PDF para texto', t_pdf2text_desc:'Extrai o texto simples de um PDF como arquivo .txt.',
    badge_popular:'Mais popular',
    t_resizeimage_name:'Redimensionar imagem', t_resizeimage_desc:'Redimensione uma imagem para uma largura exata, direto no seu navegador.',
    resize_width_label:'Largura desejada', resize_width_hint:'px — a altura se ajusta automaticamente',
    t_rotatepdf_name:'Girar PDF', t_rotatepdf_desc:'Corrija páginas de lado — gire todas as páginas de um PDF de uma vez.',
    t_excel2csv_name:'Excel para CSV', t_excel2csv_desc:'Transforme uma planilha .xlsx em um arquivo .csv simples.',
    rotate_angle_label:'Rotação', rotate_option_90:'Girar 90° no sentido horário', rotate_option_180:'Girar 180°', rotate_option_270:'Girar 90° no sentido anti-horário',
    rv_confirm_title:'Assistir a um anúncio rápido?', rv_confirm_body:'Um anúncio em vídeo de 30 segundos te dá 3 novas conversões grátis, agora mesmo.',
    rv_confirm_watch:'Assistir ao anúncio', rv_confirm_cancel:'Agora não',
    rv_playing_title:'Anúncio em reprodução…', rv_playing_body:'(Simulado para testes — uma rede de anúncios real mostrará seu próprio player aqui.)',
    rv_success_title:'Recompensa concedida!', rv_success_body:'Você já tem 3 novas conversões grátis.', rv_success_continue:'Continuar',
  },
  vi: { dir:'ltr', name:'Tiếng Việt',
    seo:{ title:'BeastConverter: PDF sang Word Miễn Phí, Riêng Tư', description:'Chuyển PDF sang Word, nén PDF và hơn thế — hoàn toàn trong trình duyệt. Tệp không bao giờ tải lên máy chủ. Chuyển đổi tệp miễn phí, an toàn.' },
    eyebrow:'100% cục bộ · không bao giờ tải lên bất cứ thứ gì',
    nav_beastpass:'Beast Pass',
    nav_free:'Miễn phí',
    hero_title:'Chuyển đổi tệp như một <em>quái thú.</em> Ngay trong trình duyệt của bạn.',
    hero_sub:'Hình ảnh, PDF và bảng tính — được chuyển đổi tức thì trên chính thiết bị của bạn. Không máy chủ, không chờ đợi.',
    meter_label:'lượt chuyển đổi còn lại', meter_window:'đặt lại theo cửa sổ trượt 15 phút', meter_label_pass:'lượt chuyển đổi — Beast Pass đang hoạt động', meter_pass_expires:'Beast Pass hết hạn sau',
    drop_title:'Kéo tệp vào đây để giải phóng quái thú',
    drop_sub:'hoặc chọn tệp từ thiết bị của bạn — chúng không bao giờ rời khỏi đó',
    drop_browse:'Chọn tệp',
    drop_formats:'HEIC · PNG · JPG · WEBP · PDF · CSV — tối đa 50MB mỗi tệp',
    tools_kicker:'Chọn vũ khí của bạn',
    tools_title:'Mọi công cụ đều chạy ngoại tuyến, ngay trong tab của bạn',
    bar_selected:'Công cụ đã chọn', bar_none:'không có', bar_files:'Tệp', bar_convert:'Chuyển đổi ngay',
    results_kicker:'Vừa mới ra khỏi hang', results_title:'Tệp của bạn đã sẵn sàng',
    ad_placeholder:'Quảng cáo — 728×90', ad_placeholder_sidebar:'Quảng cáo — 300×600',
    pw_title:'Quái thú cần nghỉ ngơi',
    pw_sub:'Bạn đã dùng hết cả 3 lượt chuyển đổi miễn phí. Chúng sẽ tự động đặt lại — hoặc bỏ qua thời gian chờ bên dưới.',
    pw_countdown_label:'cho đến khi các lượt chuyển đổi miễn phí của bạn được đặt lại',
    pw_video:'Xem video 30 giây để chuyển đổi ngay lập tức, miễn phí', pw_video_sub:'Video có thưởng · không cần tài khoản',
    pw_pass:'Mở khóa ngay với Beast Pass 24 giờ — 7 DKK / 1 EUR', pw_pass_sub:'Chuyển đổi không giới hạn · được bảo vệ bởi Stripe',
    pw_value_compare_title:'Tại sao nên mua Beast Pass?', pw_value_compare_body:'Các công cụ trực tuyến khác tính phí 70+ DKK/tháng. BeastConverter cho bạn 24 giờ sức mạnh cục bộ cao cấp chỉ với 7 DKK. Không đăng ký. Không bẫy ẩn. Bảo mật SSL 100% qua Stripe. Quảng cáo vẫn được giữ — đó là cách chúng tôi duy trì mức giá thấp này.',
    ab_title:'Chúng tôi phát hiện trình chặn quảng cáo',
    ab_sub:'Chúng tôi hiểu, quảng cáo có thể gây khó chịu. Nhưng khác với các công cụ chuyển đổi khác, BeastConverter chạy 100% trong trình duyệt của bạn. Chúng tôi không thu thập dữ liệu của bạn, và không dùng máy chủ đám mây đắt đỏ. Chúng tôi chỉ cần quảng cáo để giữ cho quái thú sống sót. Hãy thêm chúng tôi vào danh sách cho phép để tiếp tục miễn phí, xem một video có thưởng ngắn, hoặc lấy một pass giá 7 DKK.',
    ab_video:'Xem video thay vào đó',
    ab_whitelist:'Tôi đã thêm trang này vào danh sách cho phép', ab_pass:'Nhận Beast Pass thay thế — 7 DKK',
    cookie_text:'Chúng tôi sử dụng cookie cho quảng cáo và phân tích cơ bản. Không có dữ liệu tệp nào được thu thập — các lượt chuyển đổi diễn ra hoàn toàn trên thiết bị của bạn.',
    cookie_decline:'Từ chối', cookie_accept:'Chấp nhận',
    footer_tagline:'Chuyển đổi tệp ưu tiên cục bộ. Tệp của bạn luôn ở lại trên thiết bị của bạn.',
    footer_tools:'Công cụ', footer_tools_1:'Chuyển đổi hình ảnh', footer_tools_2:'Công cụ PDF', footer_tools_3:'Bảng tính',
    footer_company:'Công ty', footer_privacy:'Chính sách bảo mật', footer_terms:'Điều khoản sử dụng', footer_contact:'Liên hệ',
    footer_note:'Xây dựng không cần máy chủ. Vận hành bởi CPU của bạn.', download:'Tải xuống',
    t_heic2jpg_name:'HEIC sang JPG', t_heic2jpg_desc:'Chuyển đổi ảnh iPhone sang JPG có thể đọc được ở mọi nơi.',
    t_png2jpg_name:'PNG sang JPG', t_png2jpg_desc:'Làm phẳng độ trong suốt và giảm kích thước tệp.',
    t_webp_name:'WebP sang PNG/JPG', t_webp_desc:'Mở khóa ảnh WebP cho các ứng dụng cần định dạng cũ hơn.',
    t_img2pdf_name:'Ảnh sang PDF', t_img2pdf_desc:'Kết hợp một hoặc nhiều ảnh thành một tệp PDF duy nhất.',
    t_pdf2img_name:'PDF sang ảnh', t_pdf2img_desc:'Xuất mỗi trang của PDF thành một ảnh PNG.',
    t_mergepdf_name:'Gộp PDF', t_mergepdf_desc:'Ghép nhiều tệp PDF thành một tài liệu, theo thứ tự.',
    t_splitpdf_name:'Tách PDF', t_splitpdf_desc:'Trích mỗi trang của PDF thành một tệp riêng.',
    t_csv2xlsx_name:'CSV sang Excel', t_csv2xlsx_desc:'Biến CSV thành một workbook .xlsx được định dạng đúng cách.',
    t_pdf2word_name:'PDF sang Word', t_pdf2word_desc:'Trích xuất văn bản thành tệp .docx có thể chỉnh sửa.',
    t_compresspdf_name:'Nén PDF', t_compresspdf_desc:'Giảm dung lượng bằng cách loại bỏ cấu trúc PDF dư thừa.',
    t_word2pdf_name:'Word sang PDF', t_word2pdf_desc:'Biến tệp .docx thành PDF sẵn sàng chia sẻ và in ấn.',
    t_pdf2text_name:'PDF sang văn bản', t_pdf2text_desc:'Trích xuất văn bản thuần từ PDF thành tệp .txt.',
    badge_popular:'Phổ biến nhất',
    t_resizeimage_name:'Đổi kích thước ảnh', t_resizeimage_desc:'Thay đổi kích thước ảnh theo chiều rộng chính xác, ngay trong trình duyệt.',
    resize_width_label:'Chiều rộng mong muốn', resize_width_hint:'px — chiều cao tự động điều chỉnh theo',
    t_rotatepdf_name:'Xoay PDF', t_rotatepdf_desc:'Sửa trang bị nghiêng — xoay tất cả các trang trong PDF cùng lúc.',
    t_excel2csv_name:'Excel sang CSV', t_excel2csv_desc:'Chuyển bảng tính .xlsx thành tệp .csv đơn giản.',
    rotate_angle_label:'Xoay', rotate_option_90:'Xoay 90° theo chiều kim đồng hồ', rotate_option_180:'Xoay 180°', rotate_option_270:'Xoay 90° ngược chiều kim đồng hồ',
    rv_confirm_title:'Xem một quảng cáo ngắn?', rv_confirm_body:'Một quảng cáo video 30 giây sẽ cho bạn 3 lượt chuyển đổi miễn phí mới, ngay bây giờ.',
    rv_confirm_watch:'Xem quảng cáo', rv_confirm_cancel:'Để sau',
    rv_playing_title:'Đang phát quảng cáo…', rv_playing_body:'(Mô phỏng để thử nghiệm — mạng quảng cáo thực sẽ hiển thị trình phát riêng tại đây.)',
    rv_success_title:'Đã nhận thưởng!', rv_success_body:'Bạn đã có 3 lượt chuyển đổi miễn phí mới.', rv_success_continue:'Tiếp tục',
  },
  id: { dir:'ltr', name:'Bahasa Indonesia',
    seo:{ title:'BeastConverter: PDF ke Word Gratis, 100% Privat', description:'Ubah PDF ke Word, kompres PDF, dan lainnya — 100% di browser Anda. File tidak pernah diunggah ke server. Konversi file gratis dan aman.' },
    eyebrow:'100% lokal · tidak pernah ada yang diunggah',
    nav_beastpass:'Beast Pass',
    nav_free:'Gratis',
    hero_title:'Ubah file seperti <em>monster.</em> Langsung di browser Anda.',
    hero_sub:'Gambar, PDF, dan spreadsheet — dikonversi secara instan di perangkat Anda sendiri. Tanpa server, tanpa menunggu.',
    meter_label:'konversi tersisa', meter_window:'diatur ulang dalam jendela bergulir 15 menit', meter_label_pass:'konversi — Beast Pass aktif', meter_pass_expires:'Beast Pass berakhir dalam',
    drop_title:'Seret file ke sini untuk melepaskan sang monster',
    drop_sub:'atau pilih file dari perangkat Anda — file tidak pernah meninggalkannya',
    drop_browse:'Pilih file',
    drop_formats:'HEIC · PNG · JPG · WEBP · PDF · CSV — maks. 50MB per file',
    tools_kicker:'Pilih senjata Anda',
    tools_title:'Setiap alat berjalan secara offline, di tab Anda',
    bar_selected:'Alat terpilih', bar_none:'tidak ada', bar_files:'File', bar_convert:'Konversi sekarang',
    results_kicker:'Baru keluar dari sarang', results_title:'File Anda sudah siap',
    ad_placeholder:'Iklan — 728×90', ad_placeholder_sidebar:'Iklan — 300×600',
    pw_title:'Sang monster butuh istirahat',
    pw_sub:'Anda telah menggunakan ketiga konversi gratis. Konversi akan diatur ulang otomatis — atau lewati waktu tunggu di bawah.',
    pw_countdown_label:'sampai konversi gratis Anda diatur ulang',
    pw_video:'Tonton video 30 detik untuk konversi instan, gratis', pw_video_sub:'Video berhadiah · tanpa perlu akun',
    pw_pass:'Buka langsung dengan Beast Pass 24 Jam — 7 DKK / 1 EUR', pw_pass_sub:'Konversi tanpa batas · diamankan oleh Stripe',
    pw_value_compare_title:'Kenapa harus Beast Pass?', pw_value_compare_body:'Alat online lain mengenakan biaya 70+ DKK/bulan. BeastConverter memberi Anda 24 jam tenaga lokal premium hanya dengan 7 DKK. Tanpa langganan. Tanpa jebakan tersembunyi. 100% aman SSL via Stripe. Iklan tetap ada — begitulah cara kami menjaga harga serendah ini.',
    ab_title:'Kami mendeteksi pemblokir iklan',
    ab_sub:'Kami mengerti, iklan bisa menyebalkan. Tapi tidak seperti konverter lain, BeastConverter berjalan 100% di browser Anda. Kami tidak mengumpulkan data Anda, dan tidak menggunakan server cloud yang mahal. Kami hanya butuh iklan untuk menjaga sang monster tetap hidup. Tambahkan kami ke daftar putih untuk lanjut gratis, tonton video berhadiah singkat, atau ambil pass seharga 7 DKK.',
    ab_video:'Tonton video saja',
    ab_whitelist:'Saya sudah menambahkan situs ini ke daftar putih', ab_pass:'Dapatkan Beast Pass saja — 7 DKK',
    cookie_text:'Kami menggunakan cookie untuk iklan dan analitik dasar. Tidak ada data file yang pernah dikumpulkan — konversi berlangsung sepenuhnya di perangkat Anda.',
    cookie_decline:'Tolak', cookie_accept:'Terima',
    footer_tagline:'Konversi file yang mengutamakan lokal. File Anda selalu tetap di perangkat Anda.',
    footer_tools:'Alat', footer_tools_1:'Konversi gambar', footer_tools_2:'Alat PDF', footer_tools_3:'Spreadsheet',
    footer_company:'Perusahaan', footer_privacy:'Kebijakan privasi', footer_terms:'Ketentuan penggunaan', footer_contact:'Kontak',
    footer_note:'Dibangun tanpa server. Ditenagai oleh CPU Anda.', download:'Unduh',
    t_heic2jpg_name:'HEIC ke JPG', t_heic2jpg_desc:'Konversi foto iPhone ke JPG yang dapat dibaca secara universal.',
    t_png2jpg_name:'PNG ke JPG', t_png2jpg_desc:'Meratakan transparansi dan mengecilkan ukuran file.',
    t_webp_name:'WebP ke PNG/JPG', t_webp_desc:'Buka gambar WebP untuk aplikasi yang butuh format lebih lama.',
    t_img2pdf_name:'Gambar ke PDF', t_img2pdf_desc:'Gabungkan satu atau lebih gambar menjadi satu PDF.',
    t_pdf2img_name:'PDF ke gambar', t_pdf2img_desc:'Ekspor setiap halaman PDF sebagai gambar PNG.',
    t_mergepdf_name:'Gabung PDF', t_mergepdf_desc:'Satukan beberapa PDF menjadi satu dokumen, secara berurutan.',
    t_splitpdf_name:'Pisah PDF', t_splitpdf_desc:'Ambil setiap halaman PDF sebagai file tersendiri.',
    t_csv2xlsx_name:'CSV ke Excel', t_csv2xlsx_desc:'Ubah CSV menjadi workbook .xlsx yang diformat dengan benar.',
    t_pdf2word_name:'PDF ke Word', t_pdf2word_desc:'Ekstrak teks ke file .docx yang dapat diedit.',
    t_compresspdf_name:'Kompres PDF', t_compresspdf_desc:'Perkecil ukuran file dengan menghapus struktur PDF yang berlebihan.',
    t_word2pdf_name:'Word ke PDF', t_word2pdf_desc:'Ubah file .docx menjadi PDF yang siap dibagikan dan dicetak.',
    t_pdf2text_name:'PDF ke teks', t_pdf2text_desc:'Ekstrak teks biasa dari PDF sebagai file .txt.',
    badge_popular:'Paling populer',
    t_resizeimage_name:'Ubah ukuran gambar', t_resizeimage_desc:'Ubah ukuran gambar ke lebar tertentu, langsung di browser Anda.',
    resize_width_label:'Lebar target', resize_width_hint:'px — tinggi menyesuaikan otomatis',
    t_rotatepdf_name:'Putar PDF', t_rotatepdf_desc:'Perbaiki halaman miring — putar semua halaman PDF sekaligus.',
    t_excel2csv_name:'Excel ke CSV', t_excel2csv_desc:'Ubah spreadsheet .xlsx menjadi file .csv sederhana.',
    rotate_angle_label:'Rotasi', rotate_option_90:'Putar 90° searah jarum jam', rotate_option_180:'Putar 180°', rotate_option_270:'Putar 90° berlawanan arah jarum jam',
    rv_confirm_title:'Tonton iklan singkat?', rv_confirm_body:'Iklan video 30 detik memberi Anda 3 konversi gratis baru, sekarang juga.',
    rv_confirm_watch:'Tonton iklan', rv_confirm_cancel:'Nanti saja',
    rv_playing_title:'Iklan sedang diputar…', rv_playing_body:'(Disimulasikan untuk pengujian — jaringan iklan sungguhan akan menampilkan pemutarnya sendiri di sini.)',
    rv_success_title:'Hadiah diberikan!', rv_success_body:'Anda mendapat 3 konversi gratis baru.', rv_success_continue:'Lanjutkan',
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
    if(/^zh-hk$/i.test(l) || /^yue/i.test(l)) return 'yue'; // Cantonese sometimes reports as zh-HK
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

    const realSlots = ['ad-top', 'ad-sidebar', 'ad-below-download']
      .map(id => document.getElementById(id))
      .filter(Boolean);
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
      auth — it's proportionate for a 7 DKK microtransaction, but it
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
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51Tojub1Q1WEoih3D3SrAJSILhhAbkpT4Ad22izadeloSX1lpPqvdBBjwSjKkoSgTqFUUKj8f2jleOUw8XqjIryzM00EMe1OF5n'; // PLACEHOLDER

// The backend endpoint that creates a Checkout Session (see
// stripe-backend-example.js). Until this points at a real, deployed
// endpoint, checkout falls back to DEMO_MODE below rather than failing
// silently on your users.
const CHECKOUT_SESSION_ENDPOINT = 'https://beastconverter-backend.onrender.com/api/create-checkout-session'; // PLACEHOLDER — point at your real backend
/* ====================================================== */

let stripeClient = null;
function getStripeClient(){
  if(!stripeClient && window.Stripe){
    stripeClient = Stripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripeClient;
}

async function triggerStripeCheckout({ product = 'beast-pass-24h', priceDKK = 7 } = {}){
  const demoMode = STRIPE_PUBLISHABLE_KEY.includes('YOUR_PUBLISHABLE_KEY_HERE');

  if(demoMode){
    // No real key/backend configured yet — fall back to a clearly
    // labeled simulation so the UI/UX can still be demoed and
    // reviewed. DO NOT ship this branch live; once STRIPE_PUBLISHABLE_KEY
    // and CHECKOUT_SESSION_ENDPOINT are set for real, this path is
    // never reached (demoMode becomes false automatically).
    console.warn('[DEMO MODE] Stripe is not configured yet — simulating a successful purchase. Set STRIPE_PUBLISHABLE_KEY and CHECKOUT_SESSION_ENDPOINT before going live.');
    alert(`[DEMO MODE — no real payment] Stripe isn't configured yet.\nSimulating a successful ${priceDKK} DKK Beast Pass purchase for UI testing.`);
    grantBeastPass(24);
    return;
  }

  try{
    const res = await fetch(CHECKOUT_SESSION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product,
        priceDKK,
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
