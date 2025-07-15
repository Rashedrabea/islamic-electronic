// بيانات الأذكار والأدعية
const azkarData = {
  morning: [
    { text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", count: 1 },
    { text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ", count: 3 },
    { text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ رَسُولًا", count: 3 },
    { text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ", count: 1 },
    { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 }
  ],
  evening: [
    { text: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", count: 1 },
    { text: "أَمْسَيْنَا وَأَمْسَىٰ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ", count: 1 },
    { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا", count: 1 },
    { text: "أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", count: 3 },
    { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 }
  ],
  sleep: [
    { text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ", count: 1 },
    { text: "اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا", count: 1 },
    { text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", count: 3 },
    { text: "سُبْحَانَ اللَّهِ", count: 33 },
    { text: "الْحَمْدُ لِلَّهِ", count: 33 },
    { text: "اللَّهُ أَكْبَرُ", count: 34 }
  ],
  prayer: [
    { text: "اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ", count: 1 },
    { text: "سُبْحَانَ رَبِّيَ الْعَظِيمِ", count: 3 },
    { text: "سُبْحَانَ رَبِّيَ الْأَعْلَىٰ", count: 3 },
    { text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً", count: 1 },
    { text: "أَسْتَغْفِرُ اللَّهَ", count: 3 }
  ],
  travel: [
    { text: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَىٰ", count: 1 },
    { text: "اللَّهُمَّ اطْوِ لَنَا الْأَرْضَ، وَهَوِّنْ عَلَيْنَا السَّفَرَ", count: 1 },
    { text: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ", count: 1 },
    { text: "اللَّهُمَّ رُدَّنَا إِلَىٰ أَهْلِنَا سَالِمِينَ", count: 1 }
  ],
  food: [
    { text: "بِسْمِ اللَّهِ", count: 1 },
    { text: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا", count: 1 },
    { text: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا", count: 1 },
    { text: "اللَّهُمَّ أَطْعِمْ مَنْ أَطْعَمَنِي، وَاسْقِ مَنْ سَقَانِي", count: 1 }
  ],
  general: [
    { text: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ", count: 100 },
    { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ", count: 100 },
    { text: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ", count: 100 },
    { text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ", count: 100 },
    { text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", count: 100 }
  ]
};

// متغيرات عدادات الأذكار
let azkarCounters = {};
let currentAzkarCategory = "morning";

// عرض تصنيف الأذكار
function showAzkarCategory(category) {
  currentAzkarCategory = category;
  
  // تحديث الأزرار
  document.querySelectorAll(".azkar-category-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  
  // تفعيل الزر المحدد
  document.querySelectorAll(".azkar-category-btn").forEach(btn => {
    if (btn.onclick && btn.onclick.toString().includes(category)) {
      btn.classList.add("active");
    }
  });
  
  // عرض الأذكار
  displayAzkar(category);
}

// عرض الأذكار
function displayAzkar(category) {
  const content = document.getElementById("azkarContent");
  const azkarList = azkarData[category] || [];
  
  if (azkarList.length === 0) {
    content.innerHTML = '<p style="text-align: center; color: #666;">لا توجد أذكار في هذا التصنيف</p>';
    return;
  }
  
  content.innerHTML = azkarList.map((zikr, index) => `
    <div class="azkar-item">
      <div class="azkar-text">${zikr.text}</div>
      <div class="azkar-count">يُقال ${zikr.count} ${zikr.count === 1 ? "مرة" : "مرات"}</div>
      <div class="azkar-counter">
        <button class="azkar-counter-btn" onclick="decrementAzkar('${category}', ${index})">-</button>
        <div class="azkar-counter-display" id="azkar-${category}-${index}">0</div>
        <button class="azkar-counter-btn" onclick="incrementAzkar('${category}', ${index})">+</button>
      </div>
    </div>
  `).join("");
  
  // تحميل العدادات المحفوظة
  loadAzkarCounters(category);
}

// زيادة عداد الذكر
function incrementAzkar(category, index) {
  const key = `${category}-${index}`;
  azkarCounters[key] = (azkarCounters[key] || 0) + 1;
  
  document.getElementById(`azkar-${key}`).textContent = azkarCounters[key];
  saveAzkarCounters();
  
  // تشغيل صوت
  if (soundEnabled) {
    playTasbihSound();
  }
}

// تقليل عداد الذكر
function decrementAzkar(category, index) {
  const key = `${category}-${index}`;
  if (azkarCounters[key] > 0) {
    azkarCounters[key]--;
    document.getElementById(`azkar-${key}`).textContent = azkarCounters[key];
    saveAzkarCounters();
  }
}

// حفظ عدادات الأذكار
function saveAzkarCounters() {
  localStorage.setItem("azkarCounters", JSON.stringify(azkarCounters));
}

// تحميل عدادات الأذكار
function loadAzkarCounters(category) {
  const saved = localStorage.getItem("azkarCounters");
  if (saved) {
    azkarCounters = JSON.parse(saved);
    
    // تحديث العرض
    Object.keys(azkarCounters).forEach(key => {
      const element = document.getElementById(`azkar-${key}`);
      if (element && key.startsWith(category)) {
        element.textContent = azkarCounters[key];
      }
    });
  }
}

// تهيئة قسم الأذكار
function initAzkar() {
  // عرض أذكار الصباح افتراضياً
  displayAzkar("morning");
}

// تشغيل تهيئة الأذكار عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(() => {
    initAzkar();
  }, 500);
});