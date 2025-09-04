document.addEventListener("DOMContentLoaded", function () {
  const languageContent = {
    en: {
      mainTitle: "The Puranic Path",
      mainSubtitle: "A Blueprint for an Authentic Dham Yatra Agency",
      navAbout: "About Us",
      navYatras: "Our Yatras",
      navHandbook: "Pilgrim's Handbook",
      navChronicles: "Sacred Chronicles",
      navLogin: "Login",
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
      ctaTitle: "Your Path Awaits...",
      ctaIntro:
        "The sacred call of the Tirthas is timeless. A journey of a thousand miles begins with a single step. We are meticulously preparing the way for you to begin your authentic, scripture-guided pilgrimage. Soon, you will be able to place your yatra request and lift your spiritual journey.",
      ctaButton: "Book Your Yatra",
      footerRights: "&copy; 2025 The Puranic Path. All Rights Reserved.",
      footerTerms: "Terms & Condition",
      footerPrivacy: "Privacy Policy",
    },
    hi: {
      mainTitle: "पौराणिक पथ",
      mainSubtitle: "एक प्रामाणिक धाम यात्रा एजेंसी के लिए एक खाका",
      navAbout: "हमारे बारे में",
      navYatras: "हमारी यात्राएं",
      navHandbook: "तीर्थयात्री दर्शिका",
      navChronicles: "पवित्र वृत्तांत",
      navLogin: "लॉग इन करें",
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
      ctaTitle: "आपका पथ प्रतीक्षा कर रहा है...",
      ctaIntro:
        "तीर्थों का पवित्र आह्वान कालातीत है। हजारों मील की यात्रा एक ही कदम से शुरू होती है। हम आपके लिए अपनी प्रामाणिक, शास्त्र-निर्देशित तीर्थयात्रा शुरू करने का मार्ग सावधानीपूर्वक तैयार कर रहे हैं। शीघ्र ही, आप अपनी यात्रा का अनुरोध कर सकेंगे और अपनी आध्यात्मिक यात्रा को उन्नत कर सकेंगे।",
      ctaButton: "अपनी यात्रा बुक करें",
      footerRights: "&copy; 2025 पौराणिक पथ। सर्वाधिकार सुरक्षित।",
      footerTerms: "नियम एवं शर्तें",
      footerPrivacy: "गोपनीयता नीति",
    },
  };

  const yatraCardData = [
    {
      title_en: "Kashi: The Eternal City",
      title_hi: "काशी: शाश्वत नगरी",
      region: "uttar pradesh",
      description_en:
        "Experience the cosmic dance of life and death in the luminous city of Lord Shiva.",
      description_hi:
        "भगवान शिव की प्रकाशमान नगरी में जीवन और मृत्यु के ब्रह्मांडीय नृत्य का अनुभव करें।",
      image: "pages/images/kashi_hero.jpg",
      link: "pages/kashi.html",
    },
    {
      title_en: "Char Dham: Himalayan Peaks",
      title_hi: "चार धाम: हिमालयी शिखर",
      region: "uttarakhand",
      description_en:
        "Undertake the paramount pilgrimage to the four sacred abodes nestled in the majestic Himalayas.",
      description_hi:
        "राजसी हिमालय में स्थित चार पवित्र धामों की सर्वोपरि तीर्थयात्रा करें।",
      image: "pages/images/card_chardham.jpg",
      link: "pages/Char_Dham.html",
    },
    {
      title_en: "Dwarka: Kingdom of Krishna",
      title_hi: "द्वारका: कृष्ण का राज्य",
      region: "gujarat",
      description_en:
        "Visit the legendary capital of Lord Krishna, a cornerstone of the Char Dham yatra.",
      description_hi:
        "भगवान कृष्ण की पौराणिक राजधानी, चार धाम यात्रा के एक आधार स्तंभ के दर्शन करें।",
      image: "pages/images/dwarkadhish_temple.jpg",
      link: "pages/Dwarika.html",
    },
    {
      title_en: "Rameswaram: Rama's Bridge",
      title_hi: "रामेश्वरम: राम का सेतु",
      region: "tamil nadu",
      description_en:
        "Follow in the footsteps of Lord Rama and worship the Jyotirlinga he established.",
      description_hi:
        "भगवान राम के पदचिन्हों पर चलें और उनके द्वारा स्थापित ज्योतिर्लिंग की पूजा करें।",
      image: "pages/images/rameswaram_hero.jpg",
      link: "pages/Rameswaram.html",
    },
    {
      title_en: "Puri: Abode of Jagannath",
      title_hi: "पुरी: जगन्नाथ का धाम",
      region: "odisha",
      description_en:
        "Witness the spectacular Rath Yatra and feel the divine presence of the Lord of the Universe.",
      description_hi:
        "शानदार रथ यात्रा के साक्षी बनें और ब्रह्मांड के स्वामी की दिव्य उपस्थिति को महसूस करें।",
      image: "pages/images/puri_hero.jpg",
      link: "pages/puri.html",
    },
    {
      title_en: "Braj Bhumi: Land of Divine Love",
      title_hi: "ब्रज भूमि: दिव्य प्रेम की भूमि",
      region: "uttar pradesh",
      description_en:
        "Immerse yourself in the eternal pastimes of Radha and Krishna in the sacred land of Vrindavan.",
      description_hi:
        "वृंदावन की पवित्र भूमि में राधा और कृष्ण की शाश्वत लीलाओं में डूब जाएं।",
      image: "pages/images/card_braj.jpg",
      link: "pages/Braj.html",
    },
    {
      title_en: "Jyotirlingas of Maharashtra",
      title_hi: "महाराष्ट्र के ज्योतिर्लिंग",
      region: "maharashtra",
      description_en:
        "Embark on a powerful journey to the sacred Jyotirlingas of Trimbakeshwar and Bhimashankar.",
      description_hi:
        "त्र्यंबकेश्वर और भीमाशंकर के पवित्र ज्योतिर्लिंगों की शक्तिशाली यात्रा पर निकलें।",
      image: "pages/images/maharashtra_hero.jpg",
      link: "pages/Jyotirlingas.html",
    },
    {
      title_en: "Srisailam: Mallikarjuna's Peak",
      title_hi: "श्रीशैलम: मल्लिकार्जुन का शिखर",
      region: "andhra pradesh",
      description_en:
        "Visit the sacred mountain home to both a Jyotirlinga and a Shakti Pitha.",
      description_hi:
        "एक ज्योतिर्लिंग और एक शक्ति पीठ दोनों के पवित्र पर्वतीय घर के दर्शन करें।",
      image: "pages/images/srisailam1.jpg",
      link: "pages/Srisailam.html",
    },
    {
      title_en: "Kamakhya: The Bleeding Goddess",
      title_hi: "कामाख्या: रक्तस्रावी देवी",
      region: "assam",
      description_en:
        "Visit one of the most potent Shakti Pithas in India, a center of Tantra and divine feminine power.",
      description_hi:
        "भारत के सबसे शक्तिशाली शक्ति पीठों में से एक, तंत्र और दिव्य स्त्री शक्ति के केंद्र के दर्शन करें।",
      image: "pages/images/card_kamakhya.jpg",
      link: "pages/Kamakhya.html",
    },
    {
      title_en: "Vaishno Devi: Mountain Mother",
      title_hi: "वैष्णो देवी: पर्वत माता",
      region: "jammu and kashmir",
      description_en:
        "Undertake the arduous trek to the holy cave shrine of the Divine Mother.",
      description_hi: "दिव्य माता के पवित्र गुफा मंदिर की कठिन यात्रा करें।",
      image: "pages/images/card_vaishnodevi.jpg",
      link: "pages/Vaishno.html",
    },
    {
      title_en: "Golden Temple: Pool of Nectar",
      title_hi: "स्वर्ण मंदिर: अमृत का सरोवर",
      region: "punjab",
      description_en:
        "Experience the serene and universal spirituality of Harmandir Sahib in Amritsar.",
      description_hi:
        "अमृतसर में हरमंदिर साहिब की शांत और सार्वभौमिक आध्यात्मिकता का अनुभव करें।",
      image: "pages/images/card_goldentemple.jpg",
      link: "pages/Golden.html",
    },
    {
      title_en: "Tirupati: Lord of Seven Hills",
      title_hi: "तिरुपति: सात पहाड़ियों के भगवान",
      region: "andhra pradesh",
      description_en:
        "Seek the blessings of Lord Venkateswara at one of the world's most revered pilgrimage sites.",
      description_hi:
        "दुनिया के सबसे प्रतिष्ठित तीर्थ स्थलों में से एक पर भगवान वेंकटेश्वर का आशीर्वाद प्राप्त करें।",
      image: "pages/images/card_tirupati.jpg",
      link: "pages/Tirupati.html",
    },
    {
      title_en: "Madurai: The City of Nectar",
      title_hi: "मदुरै: अमृत की नगरी",
      region: "tamil nadu",
      description_en:
        "Witness the grandeur of the Meenakshi Amman Temple and its magnificent gopurams.",
      description_hi:
        "मीनाक्षी अम्मन मंदिर और उसके शानदार गोपुरमों की भव्यता के साक्षी बनें।",
      image: "pages/images/card_madurai.jpg",
      link: "pages/Madurai.html",
    },
    {
      title_en: "Ujjain: The City of Mahakal",
      title_hi: "उज्जैन: महाकाल की नगरी",
      region: "madhya pradesh",
      description_en:
        "Attend the unique Bhasma Aarti at the Mahakaleshwar Jyotirlinga, a city outside of time.",
      description_hi:
        "समय से परे एक शहर, महाकालेश्वर ज्योतिर्लिंग में अद्वितीय भस्म आरती में भाग लें।",
      image: "pages/images/card_ujjain.jpg",
      link: "pages/Ujjain.html",
    },
    {
      title_en: "Gangasagar: The Great Confluence",
      title_hi: "गंगासागर: महासंगम",
      region: "west bengal",
      description_en:
        "Pilgrimage to the sacred point where the holy Ganga meets the sea.",
      description_hi:
        "उस पवित्र बिंदु पर तीर्थयात्रा करें जहाँ पवित्र गंगा समुद्र से मिलती है।",
      image: "pages/images/card_gangasagar.jpg",
      link: "pages/Gangasagar.html",
    },
    {
      title_en: "Guruvayur: Dwarka of the South",
      title_hi: "गुरुवायुर: दक्षिण की द्वारका",
      region: "kerala",
      description_en:
        "Seek the darshan of Lord Guruvayurappan in this vital pilgrimage center of Kerala.",
      description_hi:
        "केरल के इस महत्वपूर्ण तीर्थ केंद्र में भगवान गुरुवायुरप्पन के दर्शन करें।",
      image: "pages/images/card_guruvayur.jpg",
      link: "pages/Guruvayur.html",
    },
    {
      title_en: "Konark: The Sun Chariot",
      title_hi: "कोणार्क: सूर्य रथ",
      region: "odisha",
      description_en:
        "Marvel at the architectural genius of the Sun Temple, a UNESCO World Heritage site.",
      description_hi:
        "यूनेस्को की विश्व धरोहर स्थल, सूर्य मंदिर की वास्तुकला की प्रतिभा पर आश्चर्यचकित हों।",
      image: "pages/images/card_konark.jpg",
      link: "pages/Konark.html",
    },
    {
      title_en: "Haridwar: Gateway to the Gods",
      title_hi: "हरिद्वार: देवताओं का द्वार",
      region: "uttarakhand",
      description_en:
        "Experience the mesmerizing Ganga Aarti at Har Ki Pauri in the holy city of Haridwar.",
      description_hi:
        "हरिद्वार के पवित्र शहर में हर की पौड़ी पर मंत्रमुग्ध कर देने वाली गंगा आरती का अनुभव करें।",
      image: "pages/images/card_haridwar.jpg",
      link: "pages/Haridwar.html",
    },
    {
      title_en: "Ayodhya: Birthplace of shri Ram",
      title_hi: "अयोध्या: श्री राम की जन्मभूमि",
      region: "uttar pradesh",
      description_en:
        "Step into the sacred city of Lord Rama's birth and witness the heart of Sanatana Dharma.",
      description_hi:
        "भगवान राम के पवित्र जन्मस्थान में कदम रखें और सनातन धर्म के हृदय के साक्षी बनें।",
      image: "pages/images/card_ayodhya.jpg",
      link: "pages/Ayodhya.html",
    },
    {
      title_en: "Prayag: The King of Tirthas",
      title_hi: "प्रयाग: तीर्थों का राजा",
      region: "uttar pradesh",
      description_en:
        "Take a holy dip at the Triveni Sangam, the sacred confluence of Ganga, Yamuna, and Saraswati.",
      description_hi:
        "गंगा, यमुना और सरस्वती के पवित्र संगम, त्रिवेणी संगम पर पवित्र डुबकी लगाएं।",
      image: "pages/images/card_prayag.jpg",
      link: "pages/Prayag.html",
    },
  ];

  const yatraGrid = document.getElementById("yatra-cards-grid");
  const regionFilterButton = document.getElementById("region-filter-button");
  const regionFilterDropdown = document.getElementById(
    "region-filter-dropdown"
  );
  const filterDropdownContent = document.querySelector(
    "#region-filter-dropdown > div"
  );
  const clearFiltersBtn = document.getElementById("clear-filters-btn");
  const discoverMoreBtn = document.getElementById("discover-more-btn");
  let isExpanded = false;

  function renderYatraCards() {
    yatraGrid.innerHTML = "";
    const lang = document.documentElement.lang || "en";

    const selectedRegions = Array.from(
      document.querySelectorAll(".region-checkbox:checked")
    ).map((cb) => cb.value);

    let filteredData = yatraCardData;
    if (selectedRegions.length > 0) {
      filteredData = yatraCardData.filter((card) =>
        selectedRegions.includes(card.region)
      );
    }

    const displayLimit = isExpanded ? filteredData.length : 8;
    const dataToDisplay = filteredData.slice(0, displayLimit);

    dataToDisplay.forEach((card) => {
      const cardEl = document.createElement("a");
      cardEl.href = card.link;
      cardEl.target = "_blank";
      cardEl.className =
        "block bg-black rounded-lg shadow-lg overflow-hidden relative group transform hover:-translate-y-2 transition-transform duration-300";

      const title = lang === "hi" ? card.title_hi : card.title_en;
      const description =
        lang === "hi" ? card.description_hi : card.description_en;

      cardEl.innerHTML = `
                    <img src="${
                      card.image
                    }" alt="${title}" class="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300" onerror="this.onerror=null;this.src='https://placehold.co/400x600/8C3B2A/FFFFFF?text=${encodeURIComponent(
        title
      )}';">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 p-6 text-white yatra-card-content">
                        <div style="text-shadow: 1px 1px 3px rgba(0,0,0,0.8);">
                           <h3 class="text-2xl font-bold">${title}</h3>
                           <p class="mt-1 text-base opacity-95">${description}</p>
                        </div>
                    </div>
                `;
      yatraGrid.appendChild(cardEl);
    });

    if (filteredData.length <= 8) {
      discoverMoreBtn.style.display = "none";
    } else {
      discoverMoreBtn.style.display = "inline-block";
      const buttonTextKey = isExpanded ? "showLess" : "discoverMore";
      discoverMoreBtn.textContent = languageContent[lang][buttonTextKey];
      discoverMoreBtn.setAttribute("data-lang-key", buttonTextKey);
    }
  }

  regionFilterButton.addEventListener("click", () => {
    regionFilterDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", function (event) {
    if (
      !regionFilterButton.contains(event.target) &&
      !regionFilterDropdown.contains(event.target)
    ) {
      regionFilterDropdown.classList.add("hidden");
    }
  });

  function setupFilters() {
    const regionData = [
      {
        title: "regionNorth",
        states: [
          { key: "stateUP", value: "uttar pradesh" },
          { key: "stateUK", value: "uttarakhand" },
          { key: "stateJK", value: "jammu and kashmir" },
        ],
      },
      {
        title: "regionWest",
        states: [
          { key: "stateGUJ", value: "gujarat" },
          { key: "stateMAH", value: "maharashtra" },
          { key: "stateRAJ", value: "rajasthan" },
        ],
      },
      {
        title: "regionSouth",
        states: [
          { key: "stateTN", value: "tamil nadu" },
          { key: "stateAP", value: "andhra pradesh" },
          { key: "stateKER", value: "kerala" },
        ],
      },
      {
        title: "regionEast",
        states: [
          { key: "stateODI", value: "odisha" },
          { key: "stateWB", value: "west bengal" },
          { key: "stateASSAM", value: "assam" },
        ],
      },
    ];

    filterDropdownContent.innerHTML = "";
    regionData.forEach((region) => {
      const regionDiv = document.createElement("div");
      const regionTitle = document.createElement("h3");
      regionTitle.className = "font-bold mb-2";
      regionTitle.setAttribute("data-lang-key", region.title);
      regionDiv.appendChild(regionTitle);

      region.states.forEach((state) => {
        const label = document.createElement("label");
        label.className = "flex items-center space-x-2";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "region-checkbox";
        checkbox.value = state.value;
        checkbox.addEventListener("change", () => {
          isExpanded = false;
          renderYatraCards();
        });

        const span = document.createElement("span");
        span.setAttribute("data-lang-key", state.key);

        label.appendChild(checkbox);
        label.appendChild(span);
        regionDiv.appendChild(label);
      });
      filterDropdownContent.appendChild(regionDiv);
    });
  }

  clearFiltersBtn.addEventListener("click", () => {
    document
      .querySelectorAll(".region-checkbox")
      .forEach((checkbox) => (checkbox.checked = false));
    isExpanded = false;
    renderYatraCards();
  });

  discoverMoreBtn.addEventListener("click", () => {
    isExpanded = !isExpanded;
    renderYatraCards();
  });

  const langEnBtn = document.getElementById("lang-en");
  const langHiBtn = document.getElementById("lang-hi");

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
    } else {
      langEnBtn.classList.add("bg-[#8C3B2A]", "text-white");
      langHiBtn.classList.remove("bg-[#8C3B2A]", "text-white");
    }
    renderYatraCards();
  }

  langEnBtn.addEventListener("click", () => updateLanguage("en"));
  langHiBtn.addEventListener("click", () => updateLanguage("hi"));

  setupFilters();
  updateLanguage("en");
});
