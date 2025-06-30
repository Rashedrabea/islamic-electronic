// المتغيرات العامة
let count = 0;
let totalCount = 0;
let todayCount = 0;
let weekCount = 0;
let currentDhikr = "سبحان الله";
let isVibrationEnabled = true;
let isDarkMode = false;
let isFocusMode = false;

// الأصوات
let clickSound, milestoneSound, completeSound;
let currentAdhanAudio = null;

// بيانات الأذكار
const azkarData = {
  morning: [
    { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ", count: 1 },
    { text: "اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ", count: 1 },
    { text: "أَصْبَحْنَا عَلَى فِطْرَةِ الإِسْلامِ", count: 1 },
    {
      text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ وَرَحْمَتِكَ",
      count: 1,
    },
    { text: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالإِسْلامِ دِينًا", count: 3 },
    { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
    { text: "لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ", count: 10 },
    { text: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ", count: 100 },
    {
      text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
      count: 10,
    },
    { text: "حَسْبِيَ اللَّهُ لا إِلَهَ إِلا هُوَ", count: 7 },
  ],
  evening: [
    { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ", count: 1 },
    { text: "اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ", count: 1 },
    { text: "أَمْسَيْنَا عَلَى فِطْرَةِ الإِسْلامِ", count: 1 },
    {
      text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ وَرَحْمَتِكَ",
      count: 1,
    },
    { text: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالإِسْلامِ دِينًا", count: 3 },
    { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
    { text: "لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ", count: 10 },
    { text: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ", count: 100 },
    {
      text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
      count: 10,
    },
    { text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ", count: 3 },
  ],
  sleep: [
    { text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", count: 1 },
    { text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", count: 3 },
    { text: "سُبْحَانَ اللَّهِ", count: 33 },
    { text: "الْحَمْدُ لِلَّهِ", count: 33 },
    { text: "اللَّهُ أَكْبَرُ", count: 34 },
    { text: "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ", count: 1 },
    { text: "أَسْتَغْفِرُ اللَّهَ الَّذِي لا إِلَهَ إِلا هُوَ", count: 3 },
    { text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي", count: 3 },
    { text: "رَبِّ أَعِنِّي وَلا تُعِنْ عَلَيَّ", count: 1 },
    {
      text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
      count: 1,
    },
  ],
  prayer: [
    { text: "سُبْحَانَ رَبِّيَ الْعَظِيمِ", count: 3 },
    { text: "سُبْحَانَ رَبِّيَ الأَعْلَى", count: 3 },
    { text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", count: 1 },
    {
      text: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
      count: 1,
    },
    { text: "أَسْتَغْفِرُ اللَّهَ", count: 3 },
    { text: "سُبْحَانَ اللَّهِ", count: 33 },
    { text: "الْحَمْدُ لِلَّهِ", count: 33 },
    { text: "اللَّهُ أَكْبَرُ", count: 34 },
    { text: "لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ", count: 1 },
    { text: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ", count: 1 },
  ],
  travel: [
    { text: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا", count: 1 },
    { text: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا", count: 1 },
    { text: "اللَّهُمَّ اطْوِ لَنَا الأَرْضَ", count: 1 },
    { text: "اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ", count: 1 },
    { text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ", count: 3 },
    { text: "لا إِلَهَ إِلا اللَّهُ وَحْدَهُ لا شَرِيكَ لَهُ", count: 10 },
    { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 },
    { text: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ", count: 100 },
    { text: "اللَّهُمَّ بَلِّغْنَا مَقْصِدَنَا", count: 1 },
    { text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً", count: 1 },
  ],
  food: [
    { text: "بِسْمِ اللَّهِ", count: 1 },
    { text: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا", count: 1 },
    { text: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا", count: 1 },
    { text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", count: 3 },
    { text: "اللَّهُمَّ أَطْعِمْ مَنْ أَطْعَمَنِي", count: 1 },
    { text: "بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ", count: 1 },
    { text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ", count: 1 },
    { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 10 },
    { text: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ", count: 10 },
    { text: "لا إِلَهَ إِلا اللَّهُ", count: 10 },
  ],
  general: [
    { text: "سُبْحَانَ اللَّهِ", count: 33 },
    { text: "الْحَمْدُ لِلَّهِ", count: 33 },
    { text: "اللَّهُ أَكْبَرُ", count: 34 },
    { text: "لا إِلَهَ إِلا اللَّهُ", count: 100 },
    { text: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ", count: 100 },
    {
      text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
      count: 10,
    },
    { text: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ", count: 100 },
    { text: "حَسْبِيَ اللَّهُ لا إِلَهَ إِلا هُوَ", count: 7 },
    {
      text: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
      count: 1,
    },
    {
      text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً",
      count: 1,
    },
  ],
};

// تهيئة التطبيق
function initApp() {
  loadData();
  loadCustomDhikrs();
  initAudio();
  requestNotificationPermission();
  updatePrayerTimes();
  updateDailyStats();
  initDarkMode();
  loadSavedBackground();
  loadSavedLogo();
  updateVibrationIcon();
  // عرض أذكار الصباح بالمؤشر الداخلي
  setTimeout(() => {
    if (typeof displayAzkarWithInternalCursor === "function") {
      displayAzkarWithInternalCursor("morning");
    } else {
      displayAzkar("morning");
    }
  }, 1000);

  // تحديث مواقيت الصلاة كل دقيقة
  setInterval(updatePrayerTimes, 60000);
  setInterval(checkPrayerTimes, 60000);
  setInterval(updateDailyStats, 3600000);

  // تحديث العد التنازلي كل ثانية
  setInterval(updateCountdown, 1000);
}

// تحميل البيانات المحفوظة
function loadData() {
  const saved = localStorage.getItem("tasbihData");
  if (saved) {
    const data = JSON.parse(saved);
    count = data.count || 0;
    totalCount = data.totalCount || 0;
    todayCount = data.todayCount || 0;
    weekCount = data.weekCount || 0;
    currentDhikr = data.currentDhikr || "سبحان الله";
    isVibrationEnabled = data.isVibrationEnabled !== false;
  }
  updateDisplay();
}

// حفظ البيانات
function saveData() {
  const data = {
    count,
    totalCount,
    todayCount,
    weekCount,
    currentDhikr,
    isVibrationEnabled,
    lastSaved: new Date().toISOString(),
  };
  localStorage.setItem("tasbihData", JSON.stringify(data));
}

// تحديث العرض
function updateDisplay() {
  document.getElementById("counter").textContent = count;
  document.getElementById("totalCount").textContent = totalCount;
  document.getElementById("todayCount").textContent = todayCount;
  document.getElementById("weekCount").textContent = weekCount;
}

// زيادة العداد
function increment() {
  count++;
  totalCount++;
  todayCount++;
  weekCount++;

  updateDisplay();
  saveData();

  // تشغيل الصوت
  playTasbihSound("normal");

  // الاهتزاز
  vibrate(50);

  // تأثير بصري
  const counter = document.getElementById("counter");
  counter.classList.add("counter-pulse");
  setTimeout(() => counter.classList.remove("counter-pulse"), 300);

  // فحص المعالم
  checkMilestones();
}

// إعادة تعيين العداد
function reset() {
  if (confirm("هل تريد إعادة تعيين العداد؟")) {
    count = 0;
    updateDisplay();
    saveData();
    document.getElementById("milestoneIndicator").textContent = "";
  }
}

// فحص المعالم
function checkMilestones() {
  const milestones = [33, 99, 100, 500, 1000];
  const indicator = document.getElementById("milestoneIndicator");

  if (milestones.includes(count)) {
    indicator.textContent = `🎉 مبروك! وصلت إلى ${count} تسبيحة`;

    // تشغيل صوت الإنجاز
    playTasbihSound("milestone");

    // اهتزاز خاص للإنجازات
    if (isVibrationEnabled && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    setTimeout(() => {
      indicator.textContent = "";
    }, 3000);
  }
}

// تعيين الذكر
function setDhikr(dhikr, button) {
  currentDhikr = dhikr;
  saveData();

  // إزالة التحديد من جميع الأزرار
  document.querySelectorAll(".tasbeeh-btn").forEach((btn) => {
    btn.style.background = "#e91e63";
  });

  // تحديد الزر المختار
  if (button) {
    button.style.background = "#4CAF50";
  }
}

// إضافة ذكر مخصص
function addCustomDhikr() {
  const input = document.getElementById("customDhikr");
  const dhikr = input.value.trim();

  if (dhikr) {
    const customDhikrs = JSON.parse(
      localStorage.getItem("customDhikrs") || "[]"
    );
    if (!customDhikrs.includes(dhikr)) {
      customDhikrs.push(dhikr);
      localStorage.setItem("customDhikrs", JSON.stringify(customDhikrs));
      loadCustomDhikrs();
    }
    input.value = "";
  }
}

// تحميل الأذكار المخصصة
function loadCustomDhikrs() {
  const customDhikrs = JSON.parse(localStorage.getItem("customDhikrs") || "[]");
  const container = document.querySelector(".tasbeeh-buttons");

  // إزالة الأذكار المخصصة السابقة
  container.querySelectorAll(".custom-dhikr").forEach((btn) => btn.remove());

  // إضافة الأذكار المخصصة
  customDhikrs.forEach((dhikr) => {
    const button = document.createElement("button");
    button.className = "tasbeeh-btn custom-dhikr";
    button.textContent = dhikr;
    button.onclick = () => setDhikr(dhikr, button);
    container.appendChild(button);
  });
}

// وضع التركيز
function toggleFocusMode() {
  const overlay = document.getElementById("focusOverlay");
  isFocusMode = !isFocusMode;

  if (isFocusMode) {
    overlay.style.display = "flex";
    document.getElementById("focusDhikr").textContent = currentDhikr;
    document.getElementById("focusCounter").textContent = count;
  } else {
    overlay.style.display = "none";
  }
}

// زيادة العداد في وضع التركيز
function focusIncrement() {
  increment();
  document.getElementById("focusCounter").textContent = count;
}

// تهيئة الأصوات
function initAudio() {
  try {
    clickSound = new Audio("sounds/click.mp3");
    milestoneSound = new Audio("sounds/milestone.mp3");
    completeSound = new Audio("sounds/complete.mp3");

    // تعيين مستوى الصوت
    [clickSound, milestoneSound, completeSound].forEach((audio) => {
      if (audio) {
        audio.volume = 0.5;
        audio.preload = "auto";
        // تحميل الصوت مسبقاً
        audio.load();
      }
    });

    console.log("✅ تم تحميل الأصوات بنجاح");
  } catch (error) {
    console.log("❌ تعذر تحميل الأصوات:", error);
  }
}

// تشغيل صوت التسبيح
function playTasbihSound(type = "normal") {
  try {
    if (type === "milestone" && milestoneSound) {
      milestoneSound.currentTime = 0;
      milestoneSound.play().catch(() => {
        console.log("تعذر تشغيل صوت الإنجاز");
      });
    } else if (type === "complete" && completeSound) {
      completeSound.currentTime = 0;
      completeSound.play().catch(() => {
        console.log("تعذر تشغيل صوت الإكمال");
      });
    } else if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {
        console.log("تعذر تشغيل صوت النقر");
      });
    }
  } catch (error) {
    console.log("خطأ في تشغيل الصوت:", error);
  }
}

// الوضع الليلي
function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle("dark-mode", isDarkMode);
  localStorage.setItem("darkMode", isDarkMode);

  // تحديث أيقونة الوضع الليلي
  updateDarkModeIcon();
}

// تهيئة الوضع الليلي
function initDarkMode() {
  const saved = localStorage.getItem("darkMode");
  if (saved !== null) {
    isDarkMode = JSON.parse(saved);
    document.body.classList.toggle("dark-mode", isDarkMode);
  }
  updateDarkModeIcon();
}

// تحديث أيقونة الوضع الليلي
function updateDarkModeIcon() {
  const btn = document.getElementById("darkModeBtn");
  if (btn) {
    btn.textContent = isDarkMode ? "☀️" : "🌙";
    btn.title = isDarkMode ? "الوضع النهاري" : "الوضع الليلي";
  }
}

// عرض الأذكار مع المؤشر الداخلي
function displayAzkar(category) {
  // استخدام المؤشر الداخلي الجديد
  if (typeof displayAzkarWithInternalCursor === "function") {
    displayAzkarWithInternalCursor(category);
    return;
  }

  // الكود القديم كاحتياطي
  const content = document.getElementById("azkarContent");
  const azkar = azkarData[category] || [];

  // تحديث أزرار الفئات
  document.querySelectorAll(".azkar-category-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document
    .querySelector(`[onclick="displayAzkar('${category}')"]`)
    ?.classList.add("active");

  // عرض الأذكار
  content.innerHTML = azkar
    .map(
      (zikr, index) => `
    <div class="azkar-item">
      <div class="azkar-text">${zikr.text}</div>
      <div class="azkar-count">العدد المطلوب: ${zikr.count}</div>
      <div class="azkar-counter">
        <button class="azkar-counter-btn" onclick="decrementAzkar('${category}', ${index})">-</button>
        <span class="azkar-counter-display" id="azkar-${category}-${index}">0</span>
        <button class="azkar-counter-btn" onclick="incrementAzkar('${category}', ${index})">+</button>
      </div>
    </div>
  `
    )
    .join("");

  // تحميل العدادات المحفوظة
  loadAzkarCounters(category);
}

// زيادة عداد الذكر
function incrementAzkar(category, index) {
  const counterId = `azkar-${category}-${index}`;
  const counter = document.getElementById(counterId);
  let count = parseInt(counter.textContent) + 1;
  counter.textContent = count;

  // حفظ العداد
  saveAzkarCounter(category, index, count);

  // تشغيل الصوت والاهتزاز
  playTasbihSound("normal");

  if (isVibrationEnabled && navigator.vibrate) {
    navigator.vibrate(30);
  }
}

// تقليل عداد الذكر
function decrementAzkar(category, index) {
  const counterId = `azkar-${category}-${index}`;
  const counter = document.getElementById(counterId);
  let count = Math.max(0, parseInt(counter.textContent) - 1);
  counter.textContent = count;

  // حفظ العداد
  saveAzkarCounter(category, index, count);
}

// حفظ عداد الذكر
function saveAzkarCounter(category, index, count) {
  const key = `azkar-${category}-${index}`;
  localStorage.setItem(key, count.toString());
}

// تحميل عدادات الأذكار
function loadAzkarCounters(category) {
  const azkar = azkarData[category] || [];
  azkar.forEach((_, index) => {
    const key = `azkar-${category}-${index}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const counter = document.getElementById(`azkar-${category}-${index}`);
      if (counter) counter.textContent = saved;
    }
  });
}

// === نظام مواقيت الصلاة المتقدم ===

// متغيرات مواقيت الصلاة
let currentPrayerTimes = {};
let nextPrayerInfo = {};

// حساب مواقيت الصلاة
function calculatePrayerTimes() {
  // التحقق من وجود مواقيت يدوية أولاً
  const manualTimes = localStorage.getItem("manualPrayerTimes");
  if (manualTimes) {
    currentPrayerTimes = JSON.parse(manualTimes);
    return currentPrayerTimes;
  }

  const now = new Date();
  const today = now.toDateString();

  // التحقق من وجود مواقيت محفوظة لليوم الحالي
  const savedTimes = localStorage.getItem(`prayerTimes_${today}`);
  if (savedTimes) {
    currentPrayerTimes = JSON.parse(savedTimes);
    return currentPrayerTimes;
  }

  // حساب مواقيت تقريبية بناءً على الوقت الحالي
  const times = calculateBasicPrayerTimes(now);

  // حفظ المواقيت لليوم الحالي
  localStorage.setItem(`prayerTimes_${today}`, JSON.stringify(times));
  currentPrayerTimes = times;

  return times;
}

// حساب مواقيت أساسية
function calculateBasicPrayerTimes(date) {
  // مواقيت افتراضية تتطابق مع ما يظهر في الصورة
  const month = date.getMonth() + 1;

  // مواقيت ثابتة تتطابق مع الصورة
  return {
    fajr: { hour: 5, minute: 45 }, // 5:45 ص
    sunrise: { hour: 7, minute: 15 }, // 7:15 ص
    dhuhr: { hour: 12, minute: 15 }, // 12:15 م
    asr: { hour: 16, minute: 30 }, // 4:30 م
    maghrib: { hour: 19, minute: 59 }, // 7:59 م
    isha: { hour: 21, minute: 32 }, // 9:32 م
  };
}

// تحديث عرض مواقيت الصلاة
function updatePrayerTimes() {
  const times = calculatePrayerTimes();

  // تحديث عرض المواقيت
  Object.keys(times).forEach((prayer) => {
    const element = document.getElementById(`${prayer}-time`);
    if (element) {
      const timeStr = formatTime(times[prayer].hour, times[prayer].minute);
      element.textContent = timeStr;
    }
  });

  // تحديث الصلاة القادمة
  updateNextPrayer();
}

// تنسيق الوقت
function formatTime(hour, minute) {
  const period = hour >= 12 ? "م" : "ص";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const displayMinute = minute.toString().padStart(2, "0");
  return `${displayHour}:${displayMinute} ${period}`;
}

// تحديث الصلاة القادمة
function updateNextPrayer() {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { name: "الفجر", key: "fajr", arabicName: "الفجر" },
    { name: "الظهر", key: "dhuhr", arabicName: "الظهر" },
    { name: "العصر", key: "asr", arabicName: "العصر" },
    { name: "المغرب", key: "maghrib", arabicName: "المغرب" },
    { name: "العشاء", key: "isha", arabicName: "العشاء" },
  ];

  let nextPrayer = null;

  // البحث عن الصلاة القادمة
  for (const prayer of prayers) {
    if (currentPrayerTimes[prayer.key]) {
      const prayerTime =
        currentPrayerTimes[prayer.key].hour * 60 +
        currentPrayerTimes[prayer.key].minute;

      if (prayerTime > currentTime) {
        nextPrayer = {
          ...prayer,
          time: currentPrayerTimes[prayer.key],
          timeInMinutes: prayerTime,
        };
        break;
      }
    }
  }

  // إذا لم نجد صلاة اليوم، فالصلاة القادمة هي فجر الغد
  if (!nextPrayer && currentPrayerTimes.fajr) {
    nextPrayer = {
      name: "الفجر",
      key: "fajr",
      arabicName: "الفجر (غداً)",
      time: currentPrayerTimes.fajr,
      timeInMinutes:
        currentPrayerTimes.fajr.hour * 60 +
        currentPrayerTimes.fajr.minute +
        24 * 60,
    };
  }

  if (nextPrayer) {
    nextPrayerInfo = nextPrayer;
    updateNextPrayerDisplay();
  }
}

// تحديث عرض الصلاة القادمة
function updateNextPrayerDisplay() {
  if (!nextPrayerInfo.time) return;

  const nameElement = document.getElementById("nextPrayerName");
  const countdownElement = document.getElementById("nextPrayerCountdown");
  const timeElement = document.getElementById("nextPrayerTime");

  if (nameElement) nameElement.textContent = nextPrayerInfo.arabicName;
  if (timeElement) {
    const timeStr = formatTime(
      nextPrayerInfo.time.hour,
      nextPrayerInfo.time.minute
    );
    timeElement.textContent = timeStr;
  }

  // حساب العد التنازلي
  updateCountdown();
}

// تحديث العد التنازلي
function updateCountdown() {
  if (!nextPrayerInfo.timeInMinutes) return;

  const now = new Date();
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

  let remainingMinutes = nextPrayerInfo.timeInMinutes - currentTimeInMinutes;

  // إذا كانت الصلاة غداً
  if (remainingMinutes <= 0) {
    remainingMinutes += 24 * 60;
  }

  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;
  const seconds = now.getSeconds() === 0 ? 0 : 60 - now.getSeconds();

  const countdownElement = document.getElementById("nextPrayerCountdown");
  if (countdownElement) {
    const hoursStr = hours.toString().padStart(2, "0");
    const minutesStr = minutes.toString().padStart(2, "0");
    const secondsStr = seconds.toString().padStart(2, "0");
    countdownElement.textContent = `${hoursStr}:${minutesStr}:${secondsStr}`;
  }
}

// فحص مواقيت الصلاة للإشعارات
function checkPrayerTimes() {
  const now = new Date();
  const currentTime = `${now.getHours()}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  // التحقق من وقت الصلاة
  Object.keys(currentPrayerTimes).forEach((prayer) => {
    const prayerTime = currentPrayerTimes[prayer];
    const prayerTimeStr = `${prayerTime.hour}:${prayerTime.minute
      .toString()
      .padStart(2, "0")}`;

    if (currentTime === prayerTimeStr) {
      showPrayerNotification(prayer);
    }
  });
}

// عرض إشعار الصلاة
function showPrayerNotification(prayer) {
  const prayerNames = {
    fajr: "الفجر",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء",
  };

  const prayerName = prayerNames[prayer] || prayer;

  // إشعار المتصفح
  if (Notification.permission === "granted") {
    new Notification(`حان وقت صلاة ${prayerName}`, {
      body: `حان الآن وقت صلاة ${prayerName}`,
      icon: "icon.png",
    });
  }

  // تشغيل الأذان مباشرة بدون تأكيد
  playAdhanSound();
}

// طلب إذن الإشعارات
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    if (typeof Notification.requestPermission === "function") {
      // للمتصفحات الحديثة
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            // تم منح إذن الإشعارات
          }
        })
        .catch(() => {
          // فشل في طلب الإذن
        });
    }
  }
}

// تشغيل صوت الأذان
function playAdhanSound() {
  try {
    const adhan = new Audio("sounds/الاذان 1.mp3");
    adhan.volume = 0.7;
    adhan.play().catch(() => {
      // تعذر تشغيل الأذان
    });
  } catch (error) {
    // تعذر تحميل ملف الأذان
  }
}

// تحديث الإحصائيات اليومية
function updateDailyStats() {
  const today = new Date().toDateString();
  const lastUpdate = localStorage.getItem("lastStatsUpdate");

  if (lastUpdate !== today) {
    // يوم جديد - إعادة تعيين الإحصائيات اليومية
    todayCount = 0;
    localStorage.setItem("lastStatsUpdate", today);
    saveData();
  }
}

// تصدير الإحصائيات
function exportStats() {
  const data = {
    totalCount,
    todayCount,
    weekCount,
    currentDhikr,
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tasbih-stats-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);

  alert("✅ تم تصدير الإحصائيات بنجاح!");
}

// استيراد الإحصائيات
function importStats() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const data = JSON.parse(e.target.result);

          // التحقق من صحة البيانات
          if (data.totalCount !== undefined) {
            totalCount = data.totalCount || 0;
            todayCount = data.todayCount || 0;
            weekCount = data.weekCount || 0;
            currentDhikr = data.currentDhikr || "سبحان الله";

            // تحديث العرض والحفظ
            updateDisplay();
            updateDailyStats();
            saveData();

            alert("✅ تم استيراد الإحصائيات بنجاح!");
          } else {
            alert("❌ ملف غير صحيح!");
          }
        } catch (error) {
          alert("❌ خطأ في قراءة الملف!");
        }
      };
      reader.readAsText(file);
    }
  };

  input.click();
}

// إعادة تعيين الإحصائيات
function resetStats() {
  if (
    confirm(
      "⚠️ هل أنت متأكد من إعادة تعيين جميع الإحصائيات؟\nسيتم حذف جميع البيانات نهائياً!"
    )
  ) {
    count = 0;
    totalCount = 0;
    todayCount = 0;
    weekCount = 0;

    // مسح البيانات المحفوظة
    localStorage.removeItem("tasbihData");
    localStorage.removeItem("dailyStats");
    localStorage.removeItem("weeklyStats");

    // تحديث العرض
    updateDisplay();
    updateDailyStats();

    alert("✅ تم إعادة تعيين جميع الإحصائيات!");
  }
}

// المشاركة
function shareApp(platform) {
  const text = "تطبيق المسبحة الإلكترونية - تطبيق رائع للتسبيح والأذكار";
  const url = window.location.href;

  switch (platform) {
    case "whatsapp":
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`
      );
      break;
    case "telegram":
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(text)}`
      );
      break;
    case "facebook":
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`
      );
      break;
  }
}

// نسخ رابط التطبيق
function copyAppLink() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => {
      alert("تم نسخ الرابط بنجاح!");
    })
    .catch(() => {
      alert("تعذر نسخ الرابط");
    });
}

// إدارة الأقسام
let appSections = [
  { id: "tasbih", name: "التسبيح", icon: "📿", visible: true, order: 1 },
  {
    id: "azkar",
    name: "الأذكار والأدعية",
    icon: "🤲",
    visible: true,
    order: 2,
  },
  {
    id: "radio",
    name: "الراديو الإسلامي",
    icon: "📻",
    visible: true,
    order: 3,
  },
  { id: "prayers", name: "مواقيت الصلاة", icon: "🕌", visible: true, order: 4 },
  { id: "stats", name: "الإحصائيات", icon: "📊", visible: true, order: 5 },
  { id: "share", name: "المشاركة", icon: "📢", visible: true, order: 6 },
];

// تحديث مدير الأقسام
function updateSectionsManager() {
  const manager = document.getElementById("sectionsManager");
  if (!manager) return;

  manager.innerHTML = "";

  appSections
    .sort((a, b) => a.order - b.order)
    .forEach((section) => {
      const sectionDiv = document.createElement("div");
      sectionDiv.className = "section-item";
      sectionDiv.innerHTML = `
      <div class="section-info">
        <span class="section-icon">${section.icon}</span>
        <span class="section-name">${section.name}</span>
        <span class="section-id">(${section.id})</span>
      </div>
      <div class="section-controls">
        <button class="control-btn small" onclick="moveSectionUp('${
          section.id
        }')" title="تحريك لأعلى">⬆️</button>
        <button class="control-btn small" onclick="moveSectionDown('${
          section.id
        }')" title="تحريك لأسفل">⬇️</button>
        <button class="control-btn small ${
          section.visible ? "active" : ""
        }" onclick="toggleSectionVisibility('${
        section.id
      }')" title="إظهار/إخفاء">
          ${section.visible ? "👁️" : "🙈"}
        </button>
        <button class="control-btn small secondary" onclick="editSection('${
          section.id
        }')" title="تعديل">✏️</button>
        <button class="control-btn small danger" onclick="deleteSection('${
          section.id
        }')" title="حذف">🗑️</button>
      </div>
    `;
      manager.appendChild(sectionDiv);
    });

  // حفظ التغييرات
  localStorage.setItem("appSections", JSON.stringify(appSections));
}

// إضافة قسم جديد
function addNewSection() {
  const name = prompt("اسم القسم الجديد:");
  if (!name) return;

  const icon = prompt("أيقونة القسم (emoji):", "📋");
  if (!icon) return;

  const id = name.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");

  const newSection = {
    id: id,
    name: name,
    icon: icon,
    visible: true,
    order: appSections.length + 1,
  };

  appSections.push(newSection);
  updateSectionsManager();
  alert("✅ تم إضافة القسم بنجاح!");
}

// تحريك القسم لأعلى
function moveSectionUp(sectionId) {
  const index = appSections.findIndex((s) => s.id === sectionId);
  if (index > 0) {
    const temp = appSections[index].order;
    appSections[index].order = appSections[index - 1].order;
    appSections[index - 1].order = temp;
    updateSectionsManager();
  }
}

// تحريك القسم لأسفل
function moveSectionDown(sectionId) {
  const index = appSections.findIndex((s) => s.id === sectionId);
  if (index < appSections.length - 1) {
    const temp = appSections[index].order;
    appSections[index].order = appSections[index + 1].order;
    appSections[index + 1].order = temp;
    updateSectionsManager();
  }
}

// تبديل رؤية القسم
function toggleSectionVisibility(sectionId) {
  const section = appSections.find((s) => s.id === sectionId);
  if (section) {
    section.visible = !section.visible;
    updateSectionsManager();
    applySectionVisibility();
  }
}

// تطبيق رؤية الأقسام
function applySectionVisibility() {
  appSections.forEach((section) => {
    const element = document.getElementById(section.id);
    if (element) {
      element.style.display = section.visible ? "block" : "none";
    }
  });
}

// تعديل القسم
function editSection(sectionId) {
  const section = appSections.find((s) => s.id === sectionId);
  if (!section) return;

  const newName = prompt("اسم القسم:", section.name);
  if (newName && newName !== section.name) {
    section.name = newName;
  }

  const newIcon = prompt("أيقونة القسم:", section.icon);
  if (newIcon && newIcon !== section.icon) {
    section.icon = newIcon;
  }

  updateSectionsManager();
}

// حذف القسم
function deleteSection(sectionId) {
  if (confirm("⚠️ هل أنت متأكد من حذف هذا القسم؟")) {
    appSections = appSections.filter((s) => s.id !== sectionId);
    updateSectionsManager();
    alert("✅ تم حذف القسم بنجاح!");
  }
}

// تحميل الخلفية المحفوظة
function loadSavedBackground() {
  const savedBg = localStorage.getItem("selectedBackground");
  if (savedBg) {
    applyBackgroundImage(savedBg);
  }
}

// تبديل الاهتزاز
function toggleVibration() {
  isVibrationEnabled = !isVibrationEnabled;
  saveData();
  updateVibrationIcon();

  // اختبار الاهتزاز عند التفعيل
  if (isVibrationEnabled) {
    vibrate(200);
  }

  // إشعار للمستخدم
  alert(isVibrationEnabled ? "✅ تم تفعيل الاهتزاز" : "❌ تم إيقاف الاهتزاز");
}

// دالة الاهتزاز
function vibrate(duration = 100) {
  if (isVibrationEnabled && navigator.vibrate) {
    navigator.vibrate(duration);
  }
}

// تحديث أيقونة الاهتزاز
function updateVibrationIcon() {
  const btn = document.getElementById("vibrationToggle");
  if (btn) {
    btn.innerHTML = isVibrationEnabled ? "📳" : "📴";
    btn.title = isVibrationEnabled ? "إيقاف الاهتزاز" : "تفعيل الاهتزاز";
  }
}

// === وظائف لوحة التحكم ===

// بيانات تسجيل الدخول الافتراضية
const DEFAULT_ADMIN = {
  username: "admin",
  password: "123456",
};

// عرض نافذة تسجيل الدخول
function showLoginPanel() {
  const overlay = document.getElementById("loginOverlay");
  if (overlay) {
    overlay.style.display = "flex";
    document.getElementById("adminUsername").focus();
  }
}

// إغلاق نافذة تسجيل الدخول
function closeLoginPanel() {
  const overlay = document.getElementById("loginOverlay");
  if (overlay) {
    overlay.style.display = "none";
    document.getElementById("adminUsername").value = "";
    document.getElementById("adminPassword").value = "";
  }
}

// محاولة تسجيل الدخول
function attemptLogin() {
  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value;

  // الحصول على بيانات الدخول المحفوظة
  const savedAdmin = JSON.parse(
    localStorage.getItem("adminCredentials") || "{}"
  );
  const adminUsername = savedAdmin.username || DEFAULT_ADMIN.username;
  const adminPassword = savedAdmin.password || DEFAULT_ADMIN.password;

  if (username === adminUsername && password === adminPassword) {
    closeLoginPanel();
    setTimeout(() => {
      openControlPanel();
      alert("✅ مرحباً بك في لوحة التحكم!");
    }, 100);
  } else {
    alert("❌ اسم المستخدم أو كلمة المرور غير صحيحة");
    document.getElementById("adminPassword").value = "";
    document.getElementById("adminPassword").focus();
  }
}

// فتح لوحة التحكم
function openControlPanel() {
  const overlay = document.getElementById("controlPanelOverlay");
  if (overlay) {
    overlay.style.display = "flex";
    showAdminTab("azkar"); // عرض تبويب الأذكار افتراضياً
  }
}

// إغلاق لوحة التحكم
function closeControlPanel() {
  const overlay = document.getElementById("controlPanelOverlay");
  if (overlay) {
    overlay.style.display = "none";
  }
}

// عرض تبويب الإدارة
function showAdminTab(tabName) {
  // إخفاء جميع التبويبات
  document.querySelectorAll(".admin-tab-content").forEach((tab) => {
    tab.style.display = "none";
  });

  // إزالة الفئة النشطة من جميع الأزرار
  document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // عرض التبويب المحدد
  const targetTab = document.getElementById(`${tabName}-tab`);
  if (targetTab) {
    targetTab.style.display = "block";
  }

  // تفعيل الزر المحدد
  const targetBtn = document.querySelector(
    `[onclick="showAdminTab('${tabName}')"]`
  );
  if (targetBtn) {
    targetBtn.classList.add("active");
  }
}

// حفظ إعدادات الأذان
function saveAdhanSettings() {
  const fileInput = document.getElementById("adhanFileInput");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // حفظ الملف في localStorage كـ base64
      localStorage.setItem("customAdhan", e.target.result);
      alert("✅ تم حفظ ملف الأذان بنجاح");
      fileInput.value = ""; // مسح الملف المحدد
    };
    reader.readAsDataURL(file);
  } else {
    alert("⚠️ يرجى اختيار ملف أذان أولاً");
  }
}

// متغير لحفظ الشعار المؤقت
let tempLogoData = null;

// معاينة الشعار من رفع الملف
function previewLogo() {
  const fileInput = document.getElementById("logoUpload");
  const file = fileInput.files[0];

  if (file) {
    // التحقق من نوع الملف
    if (!file.type.startsWith("image/")) {
      alert("❌ يرجى اختيار ملف صورة صحيح");
      return;
    }

    // التحقق من حجم الملف (أقل من 2 ميجا)
    if (file.size > 2 * 1024 * 1024) {
      alert("❌ حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 2 ميجابايت");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      tempLogoData = e.target.result;
      const currentLogo = document.getElementById("currentLogo");
      if (currentLogo) {
        currentLogo.src = tempLogoData;
      }
    };
    reader.readAsDataURL(file);
  }
}

// معاينة الشعار من الرابط
function previewLogoFromUrl() {
  const logoUrl = document.getElementById("logoUrl").value.trim();
  if (logoUrl) {
    tempLogoData = logoUrl;
    const currentLogo = document.getElementById("currentLogo");
    if (currentLogo) {
      currentLogo.src = logoUrl;
      currentLogo.onerror = function () {
        alert("❌ لا يمكن تحميل الصورة من هذا الرابط");
        currentLogo.src =
          "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📿</text></svg>";
      };
    }
  }
}

// اختيار أيقونة جاهزة
function selectIcon(icon, button) {
  // إزالة التحديد من جميع الأزرار
  document
    .querySelectorAll(".icon-btn")
    .forEach((btn) => btn.classList.remove("selected"));
  // تحديد الزر المضغوط
  button.classList.add("selected");

  // تحديث المعاينة
  tempLogoData = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${icon}</text></svg>`;
  const currentLogo = document.getElementById("currentLogo");
  if (currentLogo) {
    currentLogo.src = tempLogoData;
  }
}

// تطبيق الشعار الجديد
function applyNewLogo() {
  if (tempLogoData) {
    // تحديث الشعار في التطبيق
    const bannerEmoji = document.querySelector(".banner-emoji");
    if (bannerEmoji) {
      if (
        tempLogoData.startsWith("data:image/svg+xml") &&
        tempLogoData.includes("<text")
      ) {
        // إذا كانت أيقونة نصية، استخرج النص
        const match = tempLogoData.match(/>([^<]+)</);
        if (match) {
          bannerEmoji.textContent = match[1];
        }
      } else {
        // إذا كانت صورة، استبدل بعنصر img
        bannerEmoji.innerHTML = `<img src="${tempLogoData}" alt="شعار" style="width: 40px; height: 40px; border-radius: 5px;">`;
      }

      localStorage.setItem("customLogo", tempLogoData);
      alert("✅ تم تطبيق الشعار بنجاح!");
    }
  } else {
    alert("⚠️ يرجى اختيار شعار أولاً");
  }
}

// استعادة الشعار الافتراضي
function resetLogo() {
  const defaultLogo = "📿";
  const bannerEmoji = document.querySelector(".banner-emoji");
  if (bannerEmoji) {
    bannerEmoji.textContent = defaultLogo;
    localStorage.removeItem("customLogo");

    // تحديث المعاينة
    const currentLogo = document.getElementById("currentLogo");
    if (currentLogo) {
      currentLogo.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${defaultLogo}</text></svg>`;
    }

    tempLogoData = null;
    alert("✅ تم استعادة الشعار الافتراضي");
  }
}

// تحميل الشعار المحفوظ عند بدء التطبيق
function loadSavedLogo() {
  const savedLogo = localStorage.getItem("customLogo");
  if (savedLogo) {
    const bannerEmoji = document.querySelector(".banner-emoji");
    if (bannerEmoji) {
      if (
        savedLogo.startsWith("data:image/svg+xml") &&
        savedLogo.includes("<text")
      ) {
        // إذا كانت أيقونة نصية
        const match = savedLogo.match(/>([^<]+)</);
        if (match) {
          bannerEmoji.textContent = match[1];
        }
      } else if (
        savedLogo.startsWith("data:image/") ||
        savedLogo.startsWith("http")
      ) {
        // إذا كانت صورة
        bannerEmoji.innerHTML = `<img src="${savedLogo}" alt="شعار" style="width: 40px; height: 40px; border-radius: 5px;">`;
      } else {
        // نص عادي
        bannerEmoji.textContent = savedLogo;
      }
    }
  }
}

// تغيير الخلفية
function changeBackground() {
  const bgUrl = document.getElementById("backgroundInput").value.trim();
  if (bgUrl) {
    document.body.style.setProperty(
      "background-image",
      `url('${bgUrl}')`,
      "important"
    );
    document.body.style.setProperty("background-size", "cover", "important");
    document.body.style.setProperty(
      "background-position",
      "center",
      "important"
    );
    document.body.style.setProperty(
      "background-attachment",
      "fixed",
      "important"
    );

    localStorage.setItem("selectedBackground", bgUrl);
    alert("✅ تم تغيير الخلفية بنجاح");
  } else {
    alert("⚠️ يرجى إدخال رابط الخلفية");
  }
}

// تغيير الخلفية السريع من الأيقونة
function quickChangeBackground() {
  // إنشاء نافذة اختيار نوع الخلفية
  const choice = confirm(
    "🎨 تغيير خلفية التطبيق:\n\n✅ موافق = رفع صورة من الجهاز\n❌ إلغاء = إدخال رابط صورة"
  );

  if (choice) {
    // رفع صورة من الجهاز
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    fileInput.onchange = function (event) {
      const file = event.target.files[0];
      if (file) {
        // التحقق من نوع الملف
        if (!file.type.startsWith("image/")) {
          alert("❌ يرجى اختيار ملف صورة صحيح");
          return;
        }

        // التحقق من حجم الملف (أقل من 5 ميجا)
        if (file.size > 5 * 1024 * 1024) {
          alert("❌ حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 5 ميجابايت");
          return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
          const imageData = e.target.result;
          applyBackgroundImage(imageData);
          localStorage.setItem("selectedBackground", imageData);
          alert("✅ تم تغيير الخلفية بنجاح!");
        };
        reader.readAsDataURL(file);
      }
    };

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  } else {
    // إدخال رابط صورة
    const bgUrl = prompt("🔗 أدخل رابط صورة الخلفية:", "");
    if (bgUrl && bgUrl.trim()) {
      applyBackgroundImage(bgUrl.trim());
      localStorage.setItem("selectedBackground", bgUrl.trim());
      alert("✅ تم تغيير الخلفية بنجاح!");
    } else if (bgUrl === "") {
      // إزالة الخلفية المخصصة
      document.body.style.removeProperty("background-image");
      localStorage.removeItem("selectedBackground");
      alert("✅ تم إزالة الخلفية المخصصة!");
    }
  }
}

// دالة مساعدة لتطبيق صورة الخلفية
function applyBackgroundImage(imageSource) {
  document.body.style.setProperty(
    "background-image",
    `url('${imageSource}')`,
    "important"
  );
  document.body.style.setProperty("background-size", "cover", "important");
  document.body.style.setProperty("background-position", "center", "important");
  document.body.style.setProperty(
    "background-attachment",
    "fixed",
    "important"
  );
  document.body.style.setProperty(
    "background-repeat",
    "no-repeat",
    "important"
  );
}

// === وظائف الراديو ===
let radioAudio = null;
let isRadioPlaying = false;

// تشغيل/إيقاف الراديو
function toggleRadio() {
  const playBtn = document.getElementById("playRadio");
  const stationSelect = document.getElementById("radioStation");

  if (!isRadioPlaying) {
    // تشغيل الراديو
    const stationUrl = stationSelect.value;
    radioAudio = new Audio(stationUrl);
    radioAudio.volume = document.getElementById("volumeSlider").value / 100;

    radioAudio
      .play()
      .then(() => {
        isRadioPlaying = true;
        playBtn.textContent = "⏸️ إيقاف مؤقت";
        playBtn.onclick = pauseRadio;
      })
      .catch((error) => {
        alert("تعذر تشغيل الراديو. تحقق من الاتصال بالإنترنت.");
      });
  }
}

// إيقاف مؤقت للراديو
function pauseRadio() {
  const playBtn = document.getElementById("playRadio");

  if (radioAudio && isRadioPlaying) {
    radioAudio.pause();
    isRadioPlaying = false;
    playBtn.textContent = "▶️ تشغيل";
    playBtn.onclick = resumeRadio;
  }
}

// استئناف تشغيل الراديو
function resumeRadio() {
  const playBtn = document.getElementById("playRadio");

  if (radioAudio) {
    radioAudio
      .play()
      .then(() => {
        isRadioPlaying = true;
        playBtn.textContent = "⏸️ إيقاف مؤقت";
        playBtn.onclick = pauseRadio;
      })
      .catch((error) => {
        // إعادة تحميل المحطة
        toggleRadio();
      });
  } else {
    toggleRadio();
  }
}

// إيقاف الراديو نهائياً
function stopRadio() {
  const playBtn = document.getElementById("playRadio");

  if (radioAudio) {
    radioAudio.pause();
    radioAudio.currentTime = 0;
    radioAudio = null;
  }

  isRadioPlaying = false;
  playBtn.textContent = "▶️ تشغيل";
  playBtn.onclick = toggleRadio;
}

// تعديل مستوى الصوت
function setVolume(value) {
  if (radioAudio) {
    radioAudio.volume = value / 100;
  }
}

// === وظائف الأذكار المحسنة ===

// عرض فئة الأذكار مع المؤشر الداخلي
function showAzkarCategory(category) {
  // استخدام المؤشر الداخلي مباشرة
  if (typeof displayAzkarWithInternalCursor === "function") {
    displayAzkarWithInternalCursor(category);
  } else {
    displayAzkar(category);
  }
}

// إضافة ذكر جديد من لوحة التحكم
function addNewAzkar() {
  const category = document.getElementById("newAzkarCategory").value;
  const text = document.getElementById("newAzkarText").value.trim();
  const count = parseInt(document.getElementById("newAzkarCount").value) || 1;

  if (!text) {
    alert("⚠️ يرجى إدخال نص الذكر");
    return;
  }

  // إضافة الذكر إلى البيانات
  if (!azkarData[category]) {
    azkarData[category] = [];
  }

  azkarData[category].push({ text, count });

  // حفظ في localStorage
  localStorage.setItem("customAzkarData", JSON.stringify(azkarData));

  // تنظيف النموذج
  document.getElementById("newAzkarText").value = "";
  document.getElementById("newAzkarCount").value = "1";

  alert("✅ تم إضافة الذكر بنجاح");

  // تحديث العرض إذا كانت الفئة الحالية مفتوحة
  const currentCategory = document
    .querySelector(".azkar-category-btn.active")
    ?.onclick?.toString()
    .match(/'([^']+)'/)?.[1];
  if (currentCategory === category) {
    displayAzkar(category);
  }
}

// تحميل الأذكار للتعديل
function loadAzkarForEdit() {
  const category = document.getElementById("editAzkarCategory").value;
  const listContainer = document.getElementById("azkarEditList");
  const azkar = azkarData[category] || [];

  listContainer.innerHTML = azkar
    .map(
      (zikr, index) => `
    <div class="azkar-edit-item">
      <div class="azkar-edit-text">${zikr.text}</div>
      <div class="azkar-edit-count">العدد: ${zikr.count}</div>
      <div class="azkar-edit-actions">
        <button class="control-btn secondary" onclick="editAzkar('${category}', ${index})">✏️ تعديل</button>
        <button class="control-btn danger" onclick="deleteAzkar('${category}', ${index})">🗑️ حذف</button>
      </div>
    </div>
  `
    )
    .join("");
}

// تعديل ذكر
function editAzkar(category, index) {
  const zikr = azkarData[category][index];
  const newText = prompt("تعديل نص الذكر:", zikr.text);
  const newCount = prompt("تعديل العدد:", zikr.count);

  if (newText && newCount) {
    azkarData[category][index] = {
      text: newText.trim(),
      count: parseInt(newCount) || 1,
    };

    localStorage.setItem("customAzkarData", JSON.stringify(azkarData));
    loadAzkarForEdit();
    alert("✅ تم تعديل الذكر بنجاح");
  }
}

// حذف ذكر
function deleteAzkar(category, index) {
  if (confirm("هل تريد حذف هذا الذكر؟")) {
    azkarData[category].splice(index, 1);
    localStorage.setItem("customAzkarData", JSON.stringify(azkarData));
    loadAzkarForEdit();
    alert("✅ تم حذف الذكر بنجاح");
  }
}

// معاينة الذكر
function previewAzkar() {
  const category = document.getElementById("newAzkarCategory").value;
  const text = document.getElementById("newAzkarText").value.trim();
  const count = document.getElementById("newAzkarCount").value;

  if (!text) {
    alert("⚠️ يرجى إدخال نص الذكر أولاً");
    return;
  }

  alert(
    `معاينة الذكر:\n\nالفئة: ${getCategoryName(
      category
    )}\nالنص: ${text}\nالعدد: ${count}`
  );
}

// الحصول على اسم الفئة بالعربية
function getCategoryName(category) {
  const names = {
    morning: "أذكار الصباح",
    evening: "أذكار المساء",
    sleep: "أذكار النوم",
    prayer: "أذكار الصلاة",
    travel: "أذكار السفر",
    food: "أذكار الطعام",
    general: "أذكار عامة",
  };
  return names[category] || category;
}

// تحميل البيانات المخصصة عند بدء التطبيق
function loadCustomAzkarData() {
  const saved = localStorage.getItem("customAzkarData");
  if (saved) {
    const customData = JSON.parse(saved);
    // دمج البيانات المخصصة مع البيانات الافتراضية
    Object.keys(customData).forEach((category) => {
      if (customData[category] && Array.isArray(customData[category])) {
        azkarData[category] = customData[category];
      }
    });
  }
}

// === وظائف إدارة مواقيت الصلاة من لوحة التحكم ===

// حفظ إعدادات مواقيت الصلاة
function savePrayerSettings() {
  const fajr = document.getElementById("manualFajr").value;
  const dhuhr = document.getElementById("manualDhuhr").value;
  const asr = document.getElementById("manualAsr").value;
  const maghrib = document.getElementById("manualMaghrib").value;
  const isha = document.getElementById("manualIsha").value;

  if (fajr && dhuhr && asr && maghrib && isha) {
    // تحويل الأوقات إلى تنسيق النظام الجديد
    const times = {
      fajr: parseTimeString(fajr),
      dhuhr: parseTimeString(dhuhr),
      asr: parseTimeString(asr),
      maghrib: parseTimeString(maghrib),
      isha: parseTimeString(isha),
      sunrise: calculateSunrise(parseTimeString(fajr)),
    };

    // حفظ المواقيت اليدوية
    localStorage.setItem("manualPrayerTimes", JSON.stringify(times));

    // تحديث المواقيت الحالية
    currentPrayerTimes = times;

    // حفظ للتاريخ الحالي أيضاً
    const today = new Date().toDateString();
    localStorage.setItem(`prayerTimes_${today}`, JSON.stringify(times));

    // تحديث العرض في التطبيق الرئيسي
    updatePrayerTimes();

    alert("✅ تم حفظ مواقيت الصلاة بنجاح");
  } else {
    alert("⚠️ يرجى ملء جميع الحقول");
  }
}

// تحويل نص الوقت إلى كائن ساعة ودقيقة
function parseTimeString(timeStr) {
  const [time, period] = timeStr.split(" ");
  const [hour, minute] = time.split(":").map(Number);

  let finalHour = hour;
  if (period === "م" && hour !== 12) {
    finalHour += 12;
  } else if (period === "ص" && hour === 12) {
    finalHour = 0;
  }

  return { hour: finalHour, minute: minute };
}

// حساب وقت الشروق (بعد الفجر بساعة ونصف تقريباً)
function calculateSunrise(fajrTime) {
  let sunriseHour = fajrTime.hour + 1;
  let sunriseMinute = fajrTime.minute + 30;

  if (sunriseMinute >= 60) {
    sunriseHour += 1;
    sunriseMinute -= 60;
  }

  return { hour: sunriseHour, minute: sunriseMinute };
}

// تحميل المواقيت اليدوية عند بدء التطبيق
function loadManualPrayerTimes() {
  const saved = localStorage.getItem("manualPrayerTimes");
  if (saved) {
    const times = JSON.parse(saved);
    currentPrayerTimes = times;
    return true;
  }
  return false;
}

// إعادة تعيين مواقيت الصلاة (لحل مشاكل المواقيت المحفوظة)
function resetPrayerTimes() {
  // مسح جميع المواقيت المحفوظة
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith("prayerTimes_") || key === "manualPrayerTimes") {
      localStorage.removeItem(key);
    }
  });

  // إعادة حساب المواقيت
  currentPrayerTimes = {};
  calculatePrayerTimes();
  updatePrayerTimes();

  // تم إعادة تعيين مواقيت الصلاة
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {
  loadCustomAzkarData(); // تحميل البيانات المخصصة أولاً
  loadManualPrayerTimes(); // تحميل المواقيت اليدوية
  initApp();
});
