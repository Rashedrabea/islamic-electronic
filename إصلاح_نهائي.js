// إصلاح نهائي - مواقيت الصلاة ولوحة التحكم

// إصلاح 1: مواقيت الصلاة الصحيحة
function getCurrentPrayerTimes() {
  // منطق دقيق لتحديد الصلاة القادمة بناءً على الوقت الكامل
  // استخدم نفس مواقيت app.js الافتراضية (يمكنك تعديلها حسب الحاجة)
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const times = {
    fajr: { name: "الفجر", hour: 4, minute: 12 },
    sunrise: { name: "الشروق", hour: 5, minute: 58 },
    dhuhr: { name: "الظهر", hour: 12, minute: 59 },
    asr: { name: "العصر", hour: 16, minute: 33 },
    maghrib: { name: "المغرب", hour: 19, minute: 59 },
    isha: { name: "العشاء", hour: 21, minute: 32 },
  };
  const order = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];
  let next = null;
  let current = null;
  for (let i = 0; i < order.length; i++) {
    const t = times[order[i]];
    const tMinutes = t.hour * 60 + t.minute;
    if (currentTime < tMinutes) {
      next = { name: t.name, time: { hour: t.hour, minute: t.minute } };
      // الصلاة الحالية هي السابقة
      const prevIdx = (i - 1 + order.length) % order.length;
      current = times[order[prevIdx]].name;
      break;
    }
  }
  // إذا انتهت كل الصلوات اليوم، القادمة فجر الغد
  if (!next) {
    next = {
      name: times.fajr.name + " (غداً)",
      time: { hour: times.fajr.hour, minute: times.fajr.minute },
    };
    current = times.isha.name;
  }
  return { current, next };
}

// إصلاح 2: تحديث الصلاة القادمة بدقة
function updateNextPrayerCorrect() {
  const prayerInfo = getCurrentPrayerTimes();
  const nextPrayer = prayerInfo.next;

  // تحديث العرض
  const nameElement = document.getElementById("nextPrayerName");
  const timeElement = document.getElementById("nextPrayerTime");

  if (nameElement) nameElement.textContent = nextPrayer.name;
  if (timeElement) {
    const timeStr = formatTime(nextPrayer.time.hour, nextPrayer.time.minute);
    timeElement.textContent = timeStr;
  }

  // تحديث العد التنازلي
  updateCountdownCorrect(nextPrayer);

  console.log(
    `الصلاة الحالية: ${prayerInfo.current}, القادمة: ${nextPrayer.name}`
  );
}

// إصلاح 3: العد التنازلي الصحيح
function updateCountdownCorrect(nextPrayer) {
  // جلب المواقيت الفعلية من الصفحة أو localStorage (أو متغير global)
  // إذا كان لديك متغير global مثل currentPrayerTimes استخدمه هنا
  // إذا لم يوجد، استخدم المواقيت الافتراضية
  let prayerTimes = null;
  if (typeof currentPrayerTimes !== "undefined" && currentPrayerTimes) {
    prayerTimes = currentPrayerTimes;
  } else {
    prayerTimes = {
      fajr: { hour: 4, minute: 12 },
      sunrise: { hour: 5, minute: 58 },
      dhuhr: { hour: 12, minute: 59 },
      asr: { hour: 16, minute: 33 },
      maghrib: { hour: 19, minute: 59 },
      isha: { hour: 21, minute: 32 },
    };
  }

  // تحديد وقت الصلاة القادمة بدقة
  const now = new Date();
  let nextPrayerDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    nextPrayer.time.hour,
    nextPrayer.time.minute,
    0,
    0
  );
  // إذا كان الوقت الحالي بعد وقت الصلاة القادمة (أي الصلاة القادمة غداً)
  if (now >= nextPrayerDate) {
    nextPrayerDate.setDate(nextPrayerDate.getDate() + 1);
  }

  // حساب الفرق بالثواني
  let diffMs = nextPrayerDate - now;
  if (diffMs < 0) diffMs = 0;
  let totalSeconds = Math.floor(diffMs / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  const countdownElement = document.getElementById("nextPrayerCountdown");
  if (countdownElement) {
    const hoursStr = hours.toString().padStart(2, "0");
    const minutesStr = minutes.toString().padStart(2, "0");
    const secondsStr = seconds.toString().padStart(2, "0");
    countdownElement.textContent = `${hoursStr}:${minutesStr}:${secondsStr}`;
  }
}

// إصلاح 4: ربط لوحة التحكم - تغيير الشعار
function changeLogo() {
  const newLogo = document.getElementById("logoInput")?.value.trim();
  if (newLogo) {
    const bannerEmoji = document.querySelector(".banner-emoji");
    if (bannerEmoji) {
      bannerEmoji.textContent = newLogo;
      localStorage.setItem("customLogo", newLogo);
      alert("✅ تم تغيير الشعار بنجاح");
    }
  } else {
    alert("⚠️ يرجى إدخال شعار جديد");
  }
}

// إصلاح 5: ربط لوحة التحكم - تغيير الخلفية
function changeBackground() {
  const bgUrl = document.getElementById("backgroundInput")?.value.trim();
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

// إصلاح 6: ربط لوحة التحكم - حفظ مواقيت الصلاة يدوياً
function saveManualPrayerTimes() {
  const fajr = document.getElementById("fajrTime")?.value;
  const dhuhr = document.getElementById("dhuhrTime")?.value;
  const asr = document.getElementById("asrTime")?.value;
  const maghrib = document.getElementById("maghribTime")?.value;
  const isha = document.getElementById("ishaTime")?.value;

  if (fajr && dhuhr && asr && maghrib && isha) {
    const times = {
      fajr: parseTimeInput(fajr),
      dhuhr: parseTimeInput(dhuhr),
      asr: parseTimeInput(asr),
      maghrib: parseTimeInput(maghrib),
      isha: parseTimeInput(isha),
      sunrise: {
        hour: parseTimeInput(fajr).hour + 1,
        minute: parseTimeInput(fajr).minute + 30,
      },
    };

    localStorage.setItem("manualPrayerTimes", JSON.stringify(times));

    // تحديث العرض فوراً
    updatePrayerTimesDisplay(times);
    updateNextPrayerCorrect();

    alert("✅ تم حفظ مواقيت الصلاة بنجاح");
  } else {
    alert("⚠️ يرجى ملء جميع الحقول");
  }
}

// إصلاح 7: تحويل وقت الإدخال
function parseTimeInput(timeStr) {
  const [hour, minute] = timeStr.split(":").map(Number);
  return { hour, minute };
}

// إصلاح 8: تحديث عرض المواقيت
function updatePrayerTimesDisplay(times) {
  Object.keys(times).forEach((prayer) => {
    const element = document.getElementById(`${prayer}-time`);
    if (element && times[prayer]) {
      const timeStr = formatTime(times[prayer].hour, times[prayer].minute);
      element.textContent = timeStr;
    }
  });
}

// إصلاح 9: تحميل المواقيت الحالية في لوحة التحكم
function loadCurrentPrayerTimes() {
  const saved = localStorage.getItem("manualPrayerTimes");
  const times = saved
    ? JSON.parse(saved)
    : {
        fajr: { hour: 5, minute: 15 },
        dhuhr: { hour: 12, minute: 15 },
        asr: { hour: 15, minute: 30 },
        maghrib: { hour: 17, minute: 45 },
        isha: { hour: 19, minute: 15 },
      };

  // ملء الحقول في لوحة التحكم
  if (document.getElementById("fajrTime")) {
    document.getElementById("fajrTime").value = `${times.fajr.hour
      .toString()
      .padStart(2, "0")}:${times.fajr.minute.toString().padStart(2, "0")}`;
    document.getElementById("dhuhrTime").value = `${times.dhuhr.hour
      .toString()
      .padStart(2, "0")}:${times.dhuhr.minute.toString().padStart(2, "0")}`;
    document.getElementById("asrTime").value = `${times.asr.hour
      .toString()
      .padStart(2, "0")}:${times.asr.minute.toString().padStart(2, "0")}`;
    document.getElementById("maghribTime").value = `${times.maghrib.hour
      .toString()
      .padStart(2, "0")}:${times.maghrib.minute.toString().padStart(2, "0")}`;
    document.getElementById("ishaTime").value = `${times.isha.hour
      .toString()
      .padStart(2, "0")}:${times.isha.minute.toString().padStart(2, "0")}`;
  }
}

// إصلاح 10: إضافة ذكر جديد من لوحة التحكم
function addNewAzkar() {
  const category = document.getElementById("newAzkarCategory")?.value;
  const text = document.getElementById("newAzkarText")?.value.trim();
  const count = parseInt(document.getElementById("newAzkarCount")?.value) || 1;

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
  displayAzkar(category);
}

// إصلاح 11: تغيير بيانات تسجيل الدخول
function changeAdminCredentials() {
  const newUsername = document.getElementById("newAdminUsername")?.value.trim();
  const newPassword = document.getElementById("newAdminPassword")?.value;

  if (!newUsername || !newPassword) {
    alert("⚠️ يرجى ملء جميع الحقول");
    return;
  }

  const credentials = { username: newUsername, password: newPassword };
  localStorage.setItem("adminCredentials", JSON.stringify(credentials));

  alert("✅ تم تغيير بيانات تسجيل الدخول بنجاح");

  // تنظيف الحقول
  document.getElementById("newAdminUsername").value = "";
  document.getElementById("newAdminPassword").value = "";
}

// إصلاح 12: إعادة تعيين بيانات الدخول للافتراضي
function resetToDefault() {
  localStorage.removeItem("adminCredentials");
  alert("✅ تم إعادة تعيين بيانات الدخول للافتراضي (admin / 123456)");
}

// إصلاح 13: تحديث عنوان التطبيق
function updateAppContent() {
  const title = document.getElementById("appTitle")?.value.trim();
  const description = document.getElementById("appDescription")?.value.trim();

  if (title) {
    const titleElement = document.querySelector(".banner h1");
    if (titleElement) {
      titleElement.textContent = title;
      localStorage.setItem("appTitle", title);
    }
  }

  if (description) {
    localStorage.setItem("appDescription", description);
  }

  alert("✅ تم تحديث محتوى التطبيق بنجاح");
}

// إصلاح 14: تهيئة لوحة التحكم عند فتحها
function initializeControlPanel() {
  // تحميل المواقيت الحالية
  loadCurrentPrayerTimes();

  // تحميل الشعار الحالي
  const savedLogo = localStorage.getItem("customLogo");
  if (savedLogo && document.getElementById("logoInput")) {
    document.getElementById("logoInput").value = savedLogo;
  }

  // تحميل الخلفية الحالية
  const savedBg = localStorage.getItem("selectedBackground");
  if (savedBg && document.getElementById("backgroundInput")) {
    document.getElementById("backgroundInput").value = savedBg;
  }

  // تحميل عنوان التطبيق
  const savedTitle = localStorage.getItem("appTitle");
  if (savedTitle && document.getElementById("appTitle")) {
    document.getElementById("appTitle").value = savedTitle;
  }
}

// إصلاح 15: تحديث openControlPanel لتشمل التهيئة
function openControlPanel() {
  const overlay = document.getElementById("controlPanelOverlay");
  if (overlay) {
    overlay.style.display = "flex";
    showAdminTab("azkar");

    // تهيئة لوحة التحكم
    setTimeout(initializeControlPanel, 100);
  }
}

// إصلاح 16: تهيئة التطبيق الكاملة
function initializeCompleteApp() {
  console.log("🚀 تهيئة التطبيق الكاملة...");

  // تحميل الشعار المخصص
  const savedLogo = localStorage.getItem("customLogo");
  if (savedLogo) {
    const bannerEmoji = document.querySelector(".banner-emoji");
    if (bannerEmoji) bannerEmoji.textContent = savedLogo;
  }

  // تحميل العنوان المخصص
  const savedTitle = localStorage.getItem("appTitle");
  if (savedTitle) {
    const titleElement = document.querySelector(".banner h1");
    if (titleElement) titleElement.textContent = savedTitle;
  }

  // تحميل الخلفية المخصصة
  const savedBg = localStorage.getItem("selectedBackground");
  if (savedBg) {
    document.body.style.setProperty(
      "background-image",
      `url('${savedBg}')`,
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
  }

  // تحديث المواقيت
  updateNextPrayerCorrect();

  // تحديث كل ثانية
  setInterval(() => {
    const prayerInfo = getCurrentPrayerTimes();
    updateCountdownCorrect(prayerInfo.next);
  }, 1000);

  // تحديث كل دقيقة
  setInterval(updateNextPrayerCorrect, 60000);

  console.log("✅ تم تهيئة التطبيق بنجاح");
}

// تشغيل التهيئة
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCompleteApp);
} else {
  initializeCompleteApp();
}

console.log("🔧 تم تحميل الإصلاح النهائي");
