document.addEventListener("DOMContentLoaded", function () {
  const languageContent = {
    en: {
      mainTitle: "The Puranic Path",
      subTitle: "An Authentic Pilgrimage Experience",
      navVision: "Vision",
      navPhilosophy: "Philosophy",
      navDifference: "Our Difference",
      navSacredSites: "Sacred Sites",
      navTirthaKathas: "Tirtha Kathas",
      navOurYatras: "Our Yatras",
      navKathaPustika: "Katha Pustika",
      navAboutUs: "About Us",
      navContact: "Contact",
      visionText: `"The Puranic Path" is a specialized religious tourism agency created to restore the traditional, scripturally-mandated form of Hindu pilgrimage (*tīrthayātrā*). Our purpose is not merely to offer a tour, but to facilitate a holistic, immersive, and transformative spiritual experience aligned with the deepest tenets of Sanatana Dharma, centered on authenticity and simplicity over modern comforts.`,
      philosophyTitle: "The Philosophical Foundation of Our Journey",
      philosophyIntro:
        "Every decision we make is inspired by the scriptures. We view pilgrimage not as tourism, but as a spiritual discipline (*tapas*). This section explains the core principles that shape every experience we offer, transforming a simple journey into a profound *yātrā*.",
      tabTirtha: "The Essence of a Tīrtha",
      tabPurpose: "Purpose of Pilgrimage",
      tabYatri: "The Ideal Pilgrim",
      tirthaTitle: "A Place of Crossing Over",
      tirthaText: `The Sanskrit word *tīrtha* literally means a "ford" or a "crossing place." It is a sacred junction where the mundane and divine worlds intersect. Its purpose is to help the pilgrim cross the great ocean of *saṃsāra*—the cycle of birth and rebirth. Our services are designed around the three types of *tīrthas* described in the Skanda Purāṇa:`,
      sthavaraTitle: "Sthāvara Tīrtha",
      sthavaraText:
        "(Immovable) The physical holy places like Kashi, Haridwar, and the Ganga river. Our journeys are centered on these sacred geographies.",
      jangamaTitle: "Jaṅgama Tīrtha",
      jangamaText:
        "(Movable) A holy person—a true Guru, sage, or saint. We provide opportunities for guidance from learned Pandits and revered saints.",
      manasaTitle: "Mānasa Tīrtha",
      manasaText: `(Mental) The virtues within the mind—truth, forgiveness, compassion, and self-control. Our entire journey is designed to cultivate this "inner tīrtha."`,
      purposeTitle: "Why We Undertake a Yātrā",
      purposeText:
        "A *tīrthayātrā* is undertaken for profound reasons that transcend tourism. Our services are designed to help pilgrims achieve these scripturally-sanctioned goals:",
      purpose1:
        "<strong>Accumulation of Merit (*Puṇya*):</strong> To perform actions that lead to favorable circumstances in this life and the next.",
      purpose2:
        "<strong>Atonement for Sins (*Prāyaścitta*):</strong> The hardships of the journey serve as a purificatory austerity for past misdeeds.",
      purpose3:
        "<strong>Spiritual Purification (*Citta Śuddhi*):</strong> The ultimate goal—to cleanse the mind of impurities like greed and ego, bringing one closer to liberation (*mokṣa*).",
      purpose4:
        "<strong>Ancestral Rites (*Piṇḍa Dāna*):</strong> To fulfill one's sacred duty to the ancestors at powerful designated sites.",
      yatriTitle: "Conduct of an Ideal Pilgrim (*Yātrī*)",
      yatriText1:
        "The Puranas emphasize that the benefits of a pilgrimage depend on the pilgrim's inner state and conduct. We actively promote this prescribed code of conduct.",
      yatriQuote: `"A successful pilgrim is one whose hands, feet and mind are well controlled, who is free from vanity, and content with what little he gets."`,
      yatriText2: `The journey is meant to involve a degree of hardship (*tapas*). This is not a flaw but a central feature, intensifying one's faith (*śraddhā*) and focus. This principle informs our choice of simple accommodations and unhurried pacing.`,
      differenceTitle: "The Puranic Path Difference",
      differenceIntro:
        "Our approach is a complete rejection of the modern tourism model. We have built our service on four pillars of authenticity, ensuring an experience that is unavailable anywhere else.",
      pillar1Title: "1. Sacred Itineraries",
      pillar1Text:
        "Our routes are not designed for speed or convenience, but to follow the spiritual logic of the Puranic scriptures (*Kṣetra Māhātmya*). The journey's flow mirrors the sacred stories, creating a cohesive and meaningful experience at an unhurried pace, allowing time for reflection and ritual.",
      pillar2Title: "2. The Dharmśālā Ecosystem",
      pillar2Text:
        "We exclusively use traditional *dharmśālās*—accommodations built for pilgrims. This is a non-negotiable principle. Staying in a clean, vetted *dharmśālā* fosters an environment of simplicity, community, and humility, free from the commercial distractions of hotels.",
      pillar3Title: "3. Authentic Guidance",
      pillar3Text:
        "Our guides are not just tour managers; they are spiritual facilitators and storytellers (*Yātrī Paṇḍās*). They bring each sacred site to life by narrating its Puranic stories (*kathā*). We also manage a network of qualified, reputable *Paṇḍitas* for the correct performance of all rituals.",
      pillar4Title: "4. The Power of Kathā",
      exploreTitle: "Explore Sacred Bharatavarsha",
      exploreIntro:
        "Discover the timeless stories and spiritual vibrations of India's most sacred Tirthas. Select a region to begin your journey.",
      regions: "Regions",
      regionNorth: "North India",
      stateUP: "Uttar Pradesh",
      stateUK: "Uttarakhand",
      stateJK: "Jammu & Kashmir",
      regionWest: "West India",
      stateGUJ: "Gujarat",
      stateMAH: "Maharashtra",
      stateRAJ: "Rajasthan",
      regionSouth: "South India",
      stateTN: "Tamil Nadu",
      stateAP: "Andhra Pradesh",
      stateKER: "Kerala",
      regionEast: "East India",
      stateODI: "Odisha",
      stateWB: "West Bengal",
      stateASSAM: "Assam",
      clearFilters: "Clear All",
      discoverMore: "Discover More Yatras",
      showLess: "Show Less",
      contactTitle: "Inquire & Begin Your Journey",
      contactIntro:
        "Take the first step towards a truly transformative spiritual experience. Reach out to us to learn more about our curated yatras and how we can facilitate your sacred journey.",
      formName: "Full Name",
      formEmail: "Email Address",
      formYatra: "Select a Yatra Circuit",
      optionTriveni: "Triveni Sangam Circuit (Ayodhya-Prayagraj-Varanasi)",
      optionCharDham: "Char Dham Yatra (Coming Soon)",
      optionJyotirlinga: "Dvādaśa Jyotirliṅga Yatra (Coming Soon)",
      optionInquiry: "General Inquiry",
      formMessage: "Your Message",
      formSubmit: "Send Inquiry",
      ctaTitle: "Your Path Awaits...",
      ctaIntro:
        "The sacred call of the Tirthas is timeless. A journey of a thousand miles begins with a single step. We are meticulously preparing the way for you to begin your authentic, scripture-guided pilgrimage. Soon, you will be able to place your yatra request and lift your spiritual journey.",
      ctaButton: "Book Your Yatra",
      newsletterTitle: "Blog / Puranic Wisdom (Gyan Ganga)",
      newsletterIntro:
        "Stay connected to the source. Sign up for our monthly newsletter to receive new stories, scriptural insights, and updates on our sacred yatras directly in your inbox.",
      newsletterPlaceholder: "Enter your email address",
      newsletterButton: "Sign Up",
      footerTerms: "Terms & Condition",
      footerPrivacy: "Privacy Policy",
      footerRights: "© 2025 The Puranic Path. All Rights Reserved.",
      footerDisclaimer: "This is a conceptual presentation.",
    },
    hi: {
      mainTitle: "पौराणिक पथ",
      subTitle: "एक प्रामाणिक तीर्थयात्रा अनुभव",
      navVision: "परिकल्पना",
      navPhilosophy: "दर्शन",
      navDifference: "हमारी विशेषता",
      navSacredSites: "पवित्र स्थल",
      navTirthaKathas: "तीर्थ कथाएँ",
      navOurYatras: "हमारी यात्राएँ",
      navKathaPustika: "कथा पुस्तिका",
      navAboutUs: "हमारे बारे में",
      navContact: "संपर्क",
      visionText: `"पौराणिक पथ" एक विशेष धार्मिक पर्यटन एजेंसी है जिसे हिंदू तीर्थयात्रा (*तीर्थयात्रा*) के पारंपरिक, शास्त्र-सम्मत स्वरूप को पुनर्स्थापित करने के लिए बनाया गया है। हमारा उद्देश्य केवल एक यात्रा प्रदान करना नहीं है, बल्कि सनातन धर्म के गहरे सिद्धांतों के अनुरूप एक समग्र, गहन और परिवर्तनकारी आध्यात्मिक अनुभव प्रदान करना है, जो आधुनिक सुविधाओं के बजाय प्रामाणिकता और सादगी पर केंद्रित है।`,
      philosophyTitle: "हमारी यात्रा का दार्शनिक आधार",
      philosophyIntro:
        "हमारा हर निर्णय शास्त्रों से प्रेरित है। हम तीर्थयात्रा को पर्यटन नहीं, बल्कि एक आध्यात्मिक साधना (*तप*) मानते हैं। यह खंड उन मूल सिद्धांतों की व्याख्या करता है जो हमारे द्वारा प्रदान किए जाने वाले हर अनुभव को आकार देते हैं, और एक साधारण यात्रा को एक गहन *यात्रा* में बदल देते हैं।",
      tabTirtha: "तीर्थ का सार",
      tabPurpose: "तीर्थयात्रा का उद्देश्य",
      tabYatri: "आदर्श तीर्थयात्री",
      tirthaTitle: "पार करने का स्थान",
      tirthaText: `संस्कृत शब्द *तीर्थ* का शाब्दिक अर्थ है "घाट" या "पार करने का स्थान"। यह एक पवित्र संगम है जहाँ लौकिक और दिव्य संसार मिलते हैं। इसका उद्देश्य तीर्थयात्री को *संसार* के विशाल सागर - जन्म और पुनर्जन्म के चक्र - को पार करने में मदद करना है। हमारी सेवाएं स्कंद पुराण में वर्णित तीन प्रकार के *तीर्थों* के आसपास डिज़ाइन की गई हैं:`,
      sthavaraTitle: "स्थावर तीर्थ",
      sthavaraText:
        "(अचल) भौतिक पवित्र स्थान जैसे काशी, हरिद्वार और गंगा नदी। हमारी यात्राएँ इन पवित्र भूगोलों पर केंद्रित हैं।",
      jangamaTitle: "जंगम तीर्थ",
      jangamaText:
        "(चल) एक पवित्र व्यक्ति - एक सच्चा गुरु, ऋषि या संत। हम विद्वान पंडितों और श्रद्धेय संतों से मार्गदर्शन के अवसर प्रदान करते हैं।",
      manasaTitle: "मानस तीर्थ",
      manasaText: `(मानसिक) मन के भीतर के गुण - सत्य, क्षमा, करुणा और आत्म-नियंत्रण। हमारी पूरी यात्रा इस "आंतरिक तीर्थ" को विकसित करने के लिए डिज़ाइन की गई है।`,
      purposeTitle: "हम यात्रा क्यों करते हैं",
      purposeText:
        "एक *तीर्थयात्रा* पर्यटन से परे गहरे कारणों के लिए की जाती है। हमारी सेवाएं तीर्थयात्रियों को इन शास्त्र-स्वीकृत लक्ष्यों को प्राप्त करने में मदद करने के लिए डिज़ाइन की गई हैं:",
      purpose1:
        "<strong>पुण्य का संचय:</strong> इस जीवन और अगले जीवन में अनुकूल परिस्थितियों को जन्म देने वाले कर्म करना।",
      purpose2:
        "<strong>पापों का प्रायश्चित:</strong> यात्रा की कठिनाइयाँ पिछले दुष्कर्मों के लिए एक शुद्धिकारक तपस्या के रूप में काम करती हैं।",
      purpose3:
        "<strong>चित्त शुद्धि:</strong> अंतिम लक्ष्य - मन को लोभ और अहंकार जैसी अशुद्धियों से साफ करना, जिससे व्यक्ति मोक्ष के करीब आता है।",
      purpose4:
        "<strong>पितृ अनुष्ठान (*पिंड दान*):</strong> शक्तिशाली निर्दिष्ट स्थलों पर पूर्वजों के प्रति अपने पवित्र कर्तव्य को पूरा करना।",
      yatriTitle: "एक आदर्श तीर्थयात्री का आचरण",
      yatriText1:
        "पुराण इस बात पर जोर देते हैं कि तीर्थयात्रा का लाभ तीर्थयात्री की आंतरिक स्थिति और आचरण पर निर्भर करता है। हम इस निर्धारित आचार संहिता को सक्रिय रूप से बढ़ावा देते हैं।",
      yatriQuote: `"एक सफल तीर्थयात्री वह है जिसके हाथ, पैर और मन अच्छी तरह से नियंत्रित हों, जो घमंड से मुक्त हो, और जो कुछ भी उसे मिलता है उससे संतुष्ट हो।"`,
      yatriText2: `यात्रा का उद्देश्य कुछ हद तक कठिनाई (*तप*) को शामिल करना है। यह कोई दोष नहीं बल्कि एक केंद्रीय विशेषता है, जो व्यक्ति की आस्था (*श्रद्धा*) और ध्यान को तीव्र करती है। यह सिद्धांत साधारण आवास और धीमी गति की हमारी पसंद को सूचित करता है।`,
      differenceTitle: "पौराणिक पथ की विशेषता",
      differenceIntro:
        "हमारा दृष्टिकोण आधुनिक पर्यटन मॉडल का पूर्ण अस्वीकरण है। हमने अपनी सेवा को प्रामाणिकता के चार स्तंभों पर बनाया है, जो एक ऐसा अनुभव सुनिश्चित करता है जो कहीं और उपलब्ध नहीं है।",
      pillar1Title: "1. पवित्र यात्रा कार्यक्रम",
      pillar1Text:
        "हमारे मार्ग गति या सुविधा के लिए नहीं, बल्कि पौराणिक शास्त्रों (*क्षेत्र महात्म्य*) के आध्यात्मिक तर्क का पालन करने के लिए डिज़ाइन किए गए हैं। यात्रा का प्रवाह पवित्र कहानियों को दर्शाता है, जो चिंतन और अनुष्ठान के लिए समय देते हुए एक सुसंगत और सार्थक अनुभव बनाता है।",
      pillar2Title: "2. धर्मशाला पारिस्थितिकी तंत्र",
      pillar2Text:
        "हम विशेष रूप से पारंपरिक *धर्मशालाओं* का उपयोग करते हैं - जो तीर्थयात्रियों के लिए बनाए गए आवास हैं। यह एक गैर-परक्राम्य सिद्धांत है। एक स्वच्छ, जाँची-परखी *धर्मशाला* में रहना सादगी, समुदाय और विनम्रता का वातावरण बनाता है, जो होटलों के व्यावसायिक विकर्षणों से मुक्त है।",
      pillar3Title: "3. प्रामाणिक मार्गदर्शन",
      pillar3Text:
        "हमारे गाइड केवल टूर मैनेजर नहीं हैं; वे आध्यात्मिक सूत्रधार और कथावाचक (*यात्री पांडा*) हैं। वे प्रत्येक पवित्र स्थल को उसकी पौराणिक कहानियों (*कथा*) का वर्णन करके जीवंत करते हैं। हम सभी अनुष्ठानों के सही प्रदर्शन के लिए योग्य, प्रतिष्ठित *पंडितों* का एक नेटवर्क भी प्रबंधित करते हैं।",
      pillar4Title: "4. कथा की शक्ति",
      pillar4Text:
        "प्रत्येक तीर्थयात्री को पुराणों से सावधानीपूर्वक शोध की गई एक कस्टम-प्रकाशित गाइडबुक मिलती है। इस साथी में आपकी विशिष्ट यात्रा के लिए कहानियाँ, महिमा (*महात्म्य*), और अनुष्ठान प्रक्रियाएं शामिल हैं, जो कहानियों को सुनने (*कथा श्रवण*) को आपके अनुभव का एक मुख्य हिस्सा बनाती हैं।",
      exploreTitle: "पवित्र भारतवर्ष का अन्वेषण करें",
      exploreIntro:
        "भारत के सबसे पवित्र तीर्थों की कालातीत कहानियों और आध्यात्मिक स्पंदनों की खोज करें। अपनी यात्रा शुरू करने के लिए एक क्षेत्र चुनें।",
      regions: "क्षेत्र",
      regionNorth: "उत्तर भारत",
      stateUP: "उत्तर प्रदेश",
      stateUK: "उत्तराखंड",
      stateJK: "जम्मू और कश्मीर",
      regionWest: "पश्चिम भारत",
      stateGUJ: "गुजरात",
      stateMAH: "महाराष्ट्र",
      stateRAJ: "राजस्थान",
      regionSouth: "दक्षिण भारत",
      stateTN: "तमिलनाडु",
      stateAP: "आंध्र प्रदेश",
      stateKER: "केरल",
      regionEast: "पूर्वी भारत",
      stateODI: "ओडिशा",
      stateWB: "पश्चिम बंगाल",
      stateASSAM: "असम",
      clearFilters: "सभी साफ़ करें",
      discoverMore: "और यात्राएं खोजें",
      showLess: "कम दिखाएं",
      contactTitle: "पूछताछ करें और अपनी यात्रा शुरू करें",
      contactIntro:
        "एक सच्चे परिवर्तनकारी आध्यात्मिक अनुभव की दिशा में पहला कदम उठाएं। हमारी क्यूरेटेड यात्राओं के बारे में और जानने के लिए और हम आपकी पवित्र यात्रा को कैसे सुगम बना सकते हैं, इसके लिए हमसे संपर्क करें।",
      formName: "पूरा नाम",
      formEmail: "ईमेल पता",
      formYatra: "एक यात्रा सर्किट चुनें",
      optionTriveni: "त्रिवेणी संगम सर्किट (अयोध्या-प्रयागराज-वाराणसी)",
      optionCharDham: "चार धाम यात्रा (जल्द आ रही है)",
      optionJyotirlinga: "द्वादश ज्योतिर्लिंग यात्रा (जल्द आ रही है)",
      optionInquiry: "सामान्य पूछताछ",
      formMessage: "आपका संदेश",
      formSubmit: "पूछताछ भेजें",
      ctaTitle: "आपका पथ प्रतीक्षा कर रहा है...",
      ctaIntro:
        "तीर्थों का पवित्र आह्वान कालातीत है। हजारों मील की यात्रा एक ही कदम से शुरू होती है। हम आपके लिए अपनी प्रामाणिक, शास्त्र-निर्देशित तीर्थयात्रा शुरू करने का मार्ग सावधानीपूर्वक तैयार कर रहे हैं। शीघ्र ही, आप अपनी यात्रा का अनुरोध कर सकेंगे और अपनी आध्यात्मिक यात्रा को उन्नत कर सकेंगे।",
      ctaButton: "अपनी यात्रा बुक करें",
      newsletterTitle: "ब्लॉग / पौराणिक ज्ञान (ज्ञान गंगा)",
      newsletterIntro:
        "स्रोत से जुड़े रहें। नई कहानियाँ, शास्त्रीय अंतर्दृष्टि और हमारी पवित्र यात्राओं पर अपडेट सीधे अपने इनबॉक्स में प्राप्त करने के लिए हमारे मासिक न्यूज़लेटर के लिए साइन अप करें।",
      newsletterPlaceholder: "अपना ईमेल पता दर्ज करें",
      newsletterButton: "साइन अप करें",
      footerTerms: "नियम एवं शर्तें",
      footerPrivacy: "गोपनीयता नीति",
      footerRights: "© 2025 पौराणिक पथ। सर्वाधिकार सुरक्षित।",
      footerDisclaimer: "यह एक वैचारिक प्रस्तुति है।",
    },
  };

  // Add mobile keys by copying desktop keys
  languageContent.en.navVisionMobile = languageContent.en.navVision;
  languageContent.en.navPhilosophyMobile = languageContent.en.navPhilosophy;
  languageContent.en.navDifferenceMobile = languageContent.en.navDifference;
  languageContent.en.navSacredSitesMobile = languageContent.en.navSacredSites;
  languageContent.en.navContactMobile = languageContent.en.navContact;
  languageContent.hi.navVisionMobile = languageContent.hi.navVision;
  languageContent.hi.navPhilosophyMobile = languageContent.hi.navPhilosophy;
  languageContent.hi.navDifferenceMobile = languageContent.hi.navDifference;
  languageContent.hi.navSacredSitesMobile = languageContent.hi.navSacredSites;
  languageContent.hi.navContactMobile = languageContent.hi.navContact;

  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const langEnBtn = document.getElementById("lang-en");
  const langHiBtn = document.getElementById("lang-hi");
  const langEnMobileBtn = document.getElementById("lang-en-mobile");
  const langHiMobileBtn = document.getElementById("lang-hi-mobile");

  function updateLanguage(lang) {
    document.documentElement.lang = lang;
    const content = languageContent[lang];
    document.querySelectorAll("[data-lang-key]").forEach((element) => {
      const key = element.getAttribute("data-lang-key");
      if (content[key]) {
        element.innerHTML = content[key];
      }
    });

    if (lang === "hi") {
      langHiBtn.classList.add("bg-[#8C3B2A]", "text-white");
      langEnBtn.classList.remove("bg-[#8C3B2A]", "text-white");
      langHiMobileBtn.classList.add("bg-[#8C3B2A]", "text-white");
      langEnMobileBtn.classList.remove("bg-[#8C3B2A]", "text-white");
    } else {
      langEnBtn.classList.add("bg-[#8C3B2A]", "text-white");
      langHiBtn.classList.remove("bg-[#8C3B2A]", "text-white");
      langEnMobileBtn.classList.add("bg-[#8C3B2A]", "text-white");
      langHiMobileBtn.classList.remove("bg-[#8C3B2A]", "text-white");
    }
  }

  langEnBtn.addEventListener("click", () => updateLanguage("en"));
  langHiBtn.addEventListener("click", () => updateLanguage("hi"));
  langEnMobileBtn.addEventListener("click", () => updateLanguage("en"));
  langHiMobileBtn.addEventListener("click", () => updateLanguage("hi"));

  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
      }
    });
  });

  const tabs = document.querySelectorAll(".tab-button");
  const panes = document.querySelectorAll(".tab-pane");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      panes.forEach((pane) => pane.classList.add("hidden"));
      document.getElementById(tab.dataset.tab).classList.remove("hidden");
    });
  });

  const sections = document.querySelectorAll("main section");
  const headerNavLinks = document.querySelectorAll("header .nav-link");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.4,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        headerNavLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Set initial language
  updateLanguage("en");
});
