// الوظائف الأساسية للتطبيق

// متغيرات التطبيق
let count = 0;
let currentDhikr = "";
let isVibrationEnabled = true;
let isDarkMode = false;
let stats = { total: 0, daily: 0, weekly: 0 };
let soundEnabled = true;
let audioContext;

// تحميل البيانات
function loadData() {
  count = parseInt(localStorage.getItem("count") || "0");
  currentDhikr = localStorage.getItem("currentDhikr") || "";
  isVibrationEnabled = localStorage.getItem("vibration") !== "false";
  isDarkMode = localStorage.getItem("darkMode") === "true";
  soundEnabled = localStorage.getItem("soundEnabled") !== "false";
  stats = JSON.parse(localStorage.getItem("stats") || '{"total":0,"daily":0,"weekly":0}');
  
  updateDisplay();
  
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
  }
  
  updateVibrationButton();
}

// حفظ البيانات
function saveData() {
  localStorage.setItem("count", count);
  localStorage.setItem("currentDhikr", currentDhikr);
  localStorage.setItem("vibration", isVibrationEnabled);
  localStorage.setItem("darkMode", isDarkMode);
  localStorage.setItem("soundEnabled", soundEnabled);
  localStorage.setItem("stats", JSON.stringify(stats));
}

// تحديث العرض
function updateDisplay() {
  document.getElementById("counter").textContent = count;
  document.getElementById("totalCount").textContent = stats.total;
  document.getElementById("todayCount").textContent = stats.daily;
  document.getElementById("weekCount").textContent = stats.weekly;
  
  const indicator = document.getElementById("milestoneIndicator");
  if (count === 33) {
    indicator.textContent = "🎉 تم إكمال 33 تسبيحة!";
  } else if (count === 66) {
    indicator.textContent = "⭐ تم إكمال 66 تسبيحة!";
  } else if (count === 99) {
    indicator.textContent = "🏆 مبروك! تم إكمال 99 تسبيحة!";
    setTimeout(() => {
      count = 0;
      updateDisplay();
      saveData();
    }, 3000);
  } else {
    indicator.textContent = "";
  }
}

// التسبيح
function increment() {
  count++;
  stats.total++;
  stats.daily++;
  stats.weekly++;
  
  const counter = document.getElementById("counter");
  counter.classList.add("counter-pulse");
  setTimeout(() => counter.classList.remove("counter-pulse"), 300);
  
  updateDisplay();
  saveData();
  
  // الاهتزاز
  if (isVibrationEnabled && navigator.vibrate) {
    navigator.vibrate(50);
  }
  
  // الصوت
  if (soundEnabled) {
    playTasbihSound();
  }
}

// إعادة تعيين
function reset() {
  if (count > 0 && confirm("هل تريد إعادة تعيين العداد؟")) {
    count = 0;
    updateDisplay();
    saveData();
  }
}

// تشغيل صوت التسبيح
function playTasbihSound() {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    setTimeout(() => {
      try {
        oscillator.stop();
      } catch (e) {}
    }, 100);
  } catch (e) {
    console.log("لا يمكن تشغيل الصوت");
  }
}

// الوضع الليلي
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  isDarkMode = document.body.classList.contains("dark-mode");
  
  const btn = document.getElementById("darkModeBtn");
  const iconElement = document.getElementById("darkModeIcon");
  
  if (btn && iconElement) {
    iconElement.style.animation = "rotateIcon 0.5s ease forwards";
    
    setTimeout(() => {
      iconElement.textContent = isDarkMode ? "🌙" : "☀️";
      iconElement.style.animation = "";
      btn.title = isDarkMode ? "الوضع النهاري" : "الوضع الليلي";
    }, 250);
  }
  
  localStorage.setItem("darkMode", isDarkMode);
  
  const modeText = isDarkMode ? "الوضع الليلي" : "الوضع النهاري";
  showModeChangeMessage(modeText);
}

// عرض رسالة تغيير الوضع
function showModeChangeMessage(mode) {
  const message = document.createElement("div");
  message.className = "mode-change-message";
  
  const icon = mode === "الوضع الليلي" ? "🌙" : "☀️";
  message.innerHTML = `${icon} تم تفعيل ${mode}`;
  
  const bgColor = mode === "الوضع الليلي" ? "rgba(25, 118, 210, 0.9)" : "rgba(76, 175, 80, 0.9)";
  
  message.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${bgColor};
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    font-weight: bold;
    z-index: 9999;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    font-size: 16px;
  `;
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.style.opacity = "0";
    message.style.transform = "translateX(-50%) translateY(-20px)";
    message.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    setTimeout(() => message.remove(), 500);
  }, 2000);
}

// الاهتزاز
function toggleVibration() {
  if (!navigator.vibrate) {
    alert("⚠️ الاهتزاز غير مدعوم على هذا الجهاز\nيعمل الاهتزاز فقط على الهواتف المحمولة والأجهزة اللوحية");
    return;
  }
  
  isVibrationEnabled = !isVibrationEnabled;
  updateVibrationButton();
  saveData();
  
  if (isVibrationEnabled) {
    navigator.vibrate(100);
  }
}

function updateVibrationButton() {
  const btn = document.getElementById("vibrationToggle");
  if (!navigator.vibrate) {
    btn.textContent = "📵";
    btn.title = "الاهتزاز غير مدعوم على هذا الجهاز";
    btn.style.opacity = "0.5";
  } else {
    btn.textContent = isVibrationEnabled ? "📳" : "📴";
    btn.title = isVibrationEnabled ? "إيقاف الاهتزاز" : "تفعيل الاهتزاز";
    btn.style.opacity = "1";
  }
}

// تغيير الخلفية
function changeBackground() {
  const backgrounds = [
    "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=1920&auto=format&fit=crop"
  ];
  
  const currentBg = localStorage.getItem("currentBackground") || "0";
  const nextBg = (parseInt(currentBg) + 1) % backgrounds.length;
  
  document.body.style.setProperty("background-image", `url('${backgrounds[nextBg]}')`, "important");
  document.body.style.setProperty("background-size", "cover", "important");
  document.body.style.setProperty("background-position", "center", "important");
  document.body.style.setProperty("background-attachment", "fixed", "important");
  
  localStorage.setItem("currentBackground", nextBg.toString());
  
  const message = document.createElement("div");
  message.textContent = "🎨 تم تغيير الخلفية بنجاح";
  message.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(76, 175, 80, 0.9);
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    font-weight: bold;
    z-index: 9999;
    animation: fadeInOut 2s ease forwards;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  `;
  
  document.body.appendChild(message);
  setTimeout(() => message.remove(), 2000);
}

// اختيار الذكر
function setDhikr(dhikr, buttonElement = null) {
  currentDhikr = dhikr;
  count = 0;
  updateDisplay();
  saveData();
  
  document.querySelectorAll(".tasbeeh-btn").forEach(btn => {
    btn.style.backgroundColor = "";
  });
  
  if (buttonElement) {
    buttonElement.style.backgroundColor = "#e84393";
  } else {
    document.querySelectorAll(".tasbeeh-btn").forEach(btn => {
      if (btn.textContent === dhikr) {
        btn.style.backgroundColor = "#e84393";
      }
    });
  }
  
  document.getElementById("focusDhikr").textContent = dhikr;
}

// إضافة ذكر مخصص
function addCustomDhikr() {
  const input = document.getElementById("customDhikr");
  const dhikrText = input.value.trim();
  
  if (!dhikrText) {
    alert("يرجى إدخال نص الذكر");
    return;
  }
  
  const button = document.createElement("button");
  button.className = "tasbeeh-btn";
  button.textContent = dhikrText;
  button.onclick = function() {
    setDhikr(dhikrText, this);
  };
  
  const deleteBtn = document.createElement("span");
  deleteBtn.textContent = " ❌";
  deleteBtn.style.cursor = "pointer";
  deleteBtn.style.fontSize = "12px";
  deleteBtn.onclick = function(e) {
    e.stopPropagation();
    if (confirm("هل تريد حذف هذا الذكر؟")) {
      button.remove();
    }
  };
  
  button.appendChild(deleteBtn);
  
  const buttonsContainer = document.querySelector(".tasbeeh-buttons");
  buttonsContainer.appendChild(button);
  
  input.value = "";
}

// تحميل الخلفية المحفوظة
function loadSavedBackground() {
  const savedBg = localStorage.getItem("currentBackground");
  if (savedBg) {
    const backgrounds = [
      "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=1920&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564769625905-50e93615e769?q=80&w=1920&auto=format&fit=crop"
    ];
    
    const bgIndex = parseInt(savedBg);
    if (bgIndex >= 0 && bgIndex < backgrounds.length) {
      document.body.style.setProperty("background-image", `url('${backgrounds[bgIndex]}')`, "important");
      document.body.style.setProperty("background-size", "cover", "important");
      document.body.style.setProperty("background-position", "center", "important");
      document.body.style.setProperty("background-attachment", "fixed", "important");
    }
  }
}

// تهيئة التطبيق
function initApp() {
  loadData();
  loadSavedBackground();
  
  // تهيئة الصوت
  document.addEventListener('click', function() {
    if (!audioContext) {
      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
      } catch (e) {
        console.log("لا يمكن تفعيل الصوت");
      }
    }
  }, { once: true });
}

// تشغيل التطبيق عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function() {
  initApp();
});