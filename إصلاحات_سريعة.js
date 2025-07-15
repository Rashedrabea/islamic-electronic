// إصلاحات سريعة للمسبحة الإلكترونية
// يجب إضافة هذا الكود في نهاية ملف app.js

// إصلاح 1: تحسين تحميل الأصوات
function improvedInitAudio() {
  try {
    // إنشاء الأصوات مع معالجة الأخطاء
    const audioFiles = [
      { name: 'click', file: 'sounds/click.mp3' },
      { name: 'milestone', file: 'sounds/milestone.mp3' },
      { name: 'complete', file: 'sounds/complete.mp3' }
    ];

    audioFiles.forEach(({ name, file }) => {
      try {
        const audio = new Audio(file);
        audio.volume = 0.5;
        audio.preload = 'auto';
        
        // معالجة الأخطاء
        audio.addEventListener('error', () => {
          console.log(`تعذر تحميل ${name} - سيتم استخدام صوت بديل`);
          // إنشاء صوت بديل باستخدام Web Audio API
          createAlternativeSound(name);
        });
        
        // حفظ المرجع
        window[name + 'Sound'] = audio;
      } catch (error) {
        console.log(`خطأ في تحميل ${name}:`, error);
        createAlternativeSound(name);
      }
    });
  } catch (error) {
    console.log("تعذر تهيئة الأصوات:", error);
  }
}

// إصلاح 2: إنشاء أصوات بديلة باستخدام Web Audio API
function createAlternativeSound(type) {
  try {
    if (!window.audioContext) {
      window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const frequencies = {
      click: 800,
      milestone: 1000,
      complete: 1200
    };
    
    window[type + 'Sound'] = {
      play: function() {
        try {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequencies[type] || 800;
          gainNode.gain.value = 0.3;
          
          oscillator.start();
          setTimeout(() => {
            try {
              oscillator.stop();
            } catch (e) {}
          }, type === 'complete' ? 300 : 100);
        } catch (e) {
          console.log('تعذر تشغيل الصوت البديل');
        }
      }
    };
  } catch (error) {
    console.log('تعذر إنشاء صوت بديل:', error);
  }
}

// إصلاح 3: تحسين مواقيت الصلاة مع API خارجي
async function improvedPrayerTimes() {
  try {
    // محاولة الحصول على الموقع الجغرافي
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchPrayerTimesFromAPI(latitude, longitude);
      }, () => {
        // في حالة رفض الموقع، استخدم موقع افتراضي (القاهرة)
        fetchPrayerTimesFromAPI(30.0444, 31.2357);
      });
    } else {
      // المتصفح لا يدعم الموقع الجغرافي
      fetchPrayerTimesFromAPI(30.0444, 31.2357);
    }
  } catch (error) {
    console.log('خطأ في الحصول على مواقيت الصلاة:', error);
    // استخدام المواقيت الافتراضية
    calculatePrayerTimes();
  }
}

// إصلاح 4: جلب مواقيت الصلاة من API
async function fetchPrayerTimesFromAPI(lat, lng) {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=2`
    );
    
    if (response.ok) {
      const data = await response.json();
      const timings = data.data.timings;
      
      // تحويل المواقيت إلى تنسيق التطبيق
      currentPrayerTimes = {
        fajr: parseAPITime(timings.Fajr),
        sunrise: parseAPITime(timings.Sunrise),
        dhuhr: parseAPITime(timings.Dhuhr),
        asr: parseAPITime(timings.Asr),
        maghrib: parseAPITime(timings.Maghrib),
        isha: parseAPITime(timings.Isha)
      };
      
      // حفظ المواقيت
      localStorage.setItem(`prayerTimes_${today.toDateString()}`, JSON.stringify(currentPrayerTimes));
      
      // تحديث العرض
      updatePrayerTimes();
      
      console.log('تم تحديث مواقيت الصلاة من API');
    } else {
      throw new Error('فشل في جلب المواقيت من API');
    }
  } catch (error) {
    console.log('خطأ في API مواقيت الصلاة:', error);
    // استخدام المواقيت المحلية
    calculatePrayerTimes();
  }
}

// إصلاح 5: تحويل وقت API إلى تنسيق التطبيق
function parseAPITime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hour: hours, minute: minutes };
}

// إصلاح 6: تحسين الأداء - تحميل مؤجل للمحتوى
function lazyLoadContent() {
  // تحميل الأذكار عند الحاجة فقط
  const azkarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const category = entry.target.dataset.category;
        if (category && !entry.target.dataset.loaded) {
          displayAzkar(category);
          entry.target.dataset.loaded = 'true';
        }
      }
    });
  });
  
  // مراقبة أقسام الأذكار
  document.querySelectorAll('.azkar-category-btn').forEach(btn => {
    azkarObserver.observe(btn);
  });
}

// إصلاح 7: تحسين حفظ البيانات
function improvedSaveData() {
  try {
    const data = {
      count,
      totalCount,
      todayCount,
      weekCount,
      currentDhikr,
      isVibrationEnabled,
      isDarkMode,
      lastSaved: new Date().toISOString(),
      version: '1.0' // إضافة رقم الإصدار
    };
    
    localStorage.setItem("tasbihData", JSON.stringify(data));
    
    // حفظ نسخة احتياطية
    localStorage.setItem("tasbihData_backup", JSON.stringify(data));
    
    return true;
  } catch (error) {
    console.log('خطأ في حفظ البيانات:', error);
    return false;
  }
}

// إصلاح 8: استعادة البيانات مع معالجة الأخطاء
function improvedLoadData() {
  try {
    let saved = localStorage.getItem("tasbihData");
    
    // إذا فشل التحميل، جرب النسخة الاحتياطية
    if (!saved) {
      saved = localStorage.getItem("tasbihData_backup");
    }
    
    if (saved) {
      const data = JSON.parse(saved);
      
      // التحقق من صحة البيانات
      if (typeof data === 'object' && data !== null) {
        count = Math.max(0, data.count || 0);
        totalCount = Math.max(0, data.totalCount || 0);
        todayCount = Math.max(0, data.todayCount || 0);
        weekCount = Math.max(0, data.weekCount || 0);
        currentDhikr = data.currentDhikr || "سبحان الله";
        isVibrationEnabled = data.isVibrationEnabled !== false;
        isDarkMode = data.isDarkMode === true;
        
        updateDisplay();
        return true;
      }
    }
  } catch (error) {
    console.log('خطأ في تحميل البيانات:', error);
  }
  
  // في حالة الفشل، استخدم القيم الافتراضية
  resetToDefaults();
  return false;
}

// إصلاح 9: إعادة تعيين القيم الافتراضية
function resetToDefaults() {
  count = 0;
  totalCount = 0;
  todayCount = 0;
  weekCount = 0;
  currentDhikr = "سبحان الله";
  isVibrationEnabled = true;
  isDarkMode = false;
  updateDisplay();
}

// إصلاح 10: تحسين معالجة الأخطاء العامة
window.addEventListener('error', function(event) {
  console.log('خطأ في التطبيق:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
  
  // محاولة استعادة التطبيق
  try {
    if (event.message.includes('audio') || event.message.includes('sound')) {
      // مشكلة في الصوت
      createAlternativeSound('click');
    } else if (event.message.includes('prayer') || event.message.includes('time')) {
      // مشكلة في المواقيت
      calculatePrayerTimes();
    } else if (event.message.includes('storage') || event.message.includes('localStorage')) {
      // مشكلة في التخزين
      resetToDefaults();
    }
  } catch (recoveryError) {
    console.log('فشل في استعادة التطبيق:', recoveryError);
  }
});

// إصلاح 11: تحسين الأداء على الأجهزة البطيئة
function optimizePerformance() {
  // تقليل تكرار التحديثات
  let updateTimeout;
  const originalUpdateDisplay = updateDisplay;
  
  updateDisplay = function() {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(originalUpdateDisplay, 100);
  };
  
  // تحسين الرسوم المتحركة
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('no-animations');
  }
  
  // تحسين استهلاك الذاكرة
  setInterval(() => {
    if (window.gc && typeof window.gc === 'function') {
      window.gc();
    }
  }, 300000); // كل 5 دقائق
}

// إصلاح 12: تطبيق جميع الإصلاحات
function applyAllFixes() {
  console.log('🔧 تطبيق الإصلاحات السريعة...');
  
  try {
    // تطبيق الإصلاحات
    improvedInitAudio();
    improvedLoadData();
    optimizePerformance();
    lazyLoadContent();
    
    // استبدال الوظائف الأصلية بالمحسنة
    saveData = improvedSaveData;
    loadData = improvedLoadData;
    
    // تحديث مواقيت الصلاة
    improvedPrayerTimes();
    
    console.log('✅ تم تطبيق جميع الإصلاحات بنجاح');
  } catch (error) {
    console.log('❌ خطأ في تطبيق الإصلاحات:', error);
  }
}

// تطبيق الإصلاحات عند تحميل الصفحة
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyAllFixes);
} else {
  applyAllFixes();
}

// تصدير الوظائف للاستخدام العام
window.applyAllFixes = applyAllFixes;
window.improvedPrayerTimes = improvedPrayerTimes;