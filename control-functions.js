// وظائف لوحة التحكم المفقودة

// إدارة التبويبات
function showAdminTab(tabName) {
  // إخفاء جميع التبويبات
  const tabs = document.querySelectorAll('.admin-tab-content');
  tabs.forEach(tab => {
    tab.style.display = 'none';
    tab.classList.remove('active');
  });

  // إزالة الفئة النشطة من جميع أزرار التبويبات
  const tabButtons = document.querySelectorAll('.admin-tab');
  tabButtons.forEach(btn => btn.classList.remove('active'));

  // عرض التبويب المحدد
  const selectedTab = document.getElementById(tabName + '-tab');
  if (selectedTab) {
    selectedTab.style.display = 'block';
    selectedTab.classList.add('active');
  }

  // تفعيل زر التبويب المحدد
  const activeButton = document.querySelector(`[onclick="showAdminTab('${tabName}')"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }
}

// إدارة الأذكار
function addNewAzkar() {
  const category = document.getElementById('newAzkarCategory').value;
  const text = document.getElementById('newAzkarText').value.trim();
  const count = parseInt(document.getElementById('newAzkarCount').value) || 1;

  if (!text) {
    alert('⚠️ يرجى إدخال نص الذكر');
    return;
  }

  const customAzkar = JSON.parse(localStorage.getItem('customAzkar') || '{}');
  if (!customAzkar[category]) {
    customAzkar[category] = [];
  }

  customAzkar[category].push({
    id: Date.now(),
    text: text,
    count: count
  });

  localStorage.setItem('customAzkar', JSON.stringify(customAzkar));
  
  document.getElementById('newAzkarText').value = '';
  document.getElementById('newAzkarCount').value = '1';
  
  alert('✅ تم إضافة الذكر بنجاح');
}

function previewAzkar() {
  const text = document.getElementById('newAzkarText').value.trim();
  const count = document.getElementById('newAzkarCount').value;
  
  if (!text) {
    alert('⚠️ يرجى إدخال نص الذكر أولاً');
    return;
  }
  
  alert(`📿 معاينة الذكر:\n\n${text}\n\n🔢 عدد التكرار: ${count}`);
}

// إدارة الشعار
function previewLogo() {
  const fileInput = document.getElementById('logoUpload');
  const file = fileInput.files[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const logoImg = document.getElementById('currentLogo');
      if (logoImg) {
        logoImg.src = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}

function selectIcon(icon, element) {
  document.querySelectorAll('.icon-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  
  if (element) {
    element.classList.add('selected');
  }
  
  const logoImg = document.getElementById('currentLogo');
  if (logoImg) {
    logoImg.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${icon}</text></svg>`;
  }
}

function applyNewLogo() {
  const logoImg = document.getElementById('currentLogo');
  if (logoImg) {
    localStorage.setItem('appLogo', logoImg.src);
    alert('✅ تم تطبيق الشعار الجديد بنجاح');
  }
}

function resetLogo() {
  const defaultLogo = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📿</text></svg>';
  localStorage.setItem('appLogo', defaultLogo);
  
  const logoImg = document.getElementById('currentLogo');
  if (logoImg) {
    logoImg.src = defaultLogo;
  }
  
  alert('🔄 تم استعادة الشعار الافتراضي');
}

// إدارة مواقيت الصلاة
function updatePrayerLocation() {
  const city = document.getElementById('cityName').value.trim();
  const country = document.getElementById('countryName').value.trim();
  
  if (!city || !country) {
    alert('⚠️ يرجى إدخال اسم المدينة والبلد');
    return;
  }
  
  const locationData = { city, country };
  localStorage.setItem('prayerLocation', JSON.stringify(locationData));
  
  alert(`✅ تم تحديث الموقع إلى: ${city}, ${country}`);
}

function saveManualPrayerTimes() {
  const manualTimes = {
    fajr: document.getElementById('fajrTime').value,
    dhuhr: document.getElementById('dhuhrTime').value,
    asr: document.getElementById('asrTime').value,
    maghrib: document.getElementById('maghribTime').value,
    isha: document.getElementById('ishaTime').value
  };
  
  if (!manualTimes.fajr || !manualTimes.dhuhr || !manualTimes.asr || !manualTimes.maghrib || !manualTimes.isha) {
    alert('⚠️ يرجى ملء جميع مواقيت الصلاة');
    return;
  }
  
  localStorage.setItem('manualPrayerTimes', JSON.stringify(manualTimes));
  localStorage.setItem('manualPrayerTimesActive', 'true');
  
  alert('💾 تم حفظ المواقيت اليدوية بنجاح');
}

// إدارة الأذان
function testAdhan() {
  alert('🎵 جاري تشغيل الأذان للتجربة...');
  // يمكن إضافة تشغيل الأذان هنا
}

function saveAdhanSettings() {
  const volume = document.getElementById('adhanVolume').value;
  localStorage.setItem('adhanVolume', volume);
  alert('💾 تم حفظ إعدادات الأذان بنجاح');
}

// إدارة المحتوى
function updateAppContent() {
  const appTitle = document.getElementById('appTitle').value.trim();
  
  if (appTitle) {
    document.title = appTitle;
    const titleElements = document.querySelectorAll('.app-title, h1');
    titleElements.forEach(el => el.textContent = appTitle);
    
    localStorage.setItem('appTitle', appTitle);
  }
  
  alert('✅ تم تحديث محتوى التطبيق بنجاح');
}

function toggleAnimations() {
  const toggle = document.getElementById('animationsToggle');
  const enabled = !toggle.classList.contains('active');
  
  toggle.classList.toggle('active', enabled);
  document.body.classList.toggle('no-animations', !enabled);
  
  localStorage.setItem('animationsEnabled', enabled);
}

function toggleSounds() {
  const toggle = document.getElementById('soundsToggle');
  const enabled = !toggle.classList.contains('active');
  
  toggle.classList.toggle('active', enabled);
  localStorage.setItem('soundEnabled', enabled);
}

function toggleAutoSave() {
  const toggle = document.getElementById('autoSaveToggle');
  const enabled = !toggle.classList.contains('active');
  
  toggle.classList.toggle('active', enabled);
  localStorage.setItem('autoSaveEnabled', enabled);
}

function exportAppSettings() {
  const settings = {
    version: '2.0',
    timestamp: new Date().toISOString(),
    settings: {
      darkMode: document.body.classList.contains('dark-mode'),
      animations: localStorage.getItem('animationsEnabled') !== 'false',
      sound: localStorage.getItem('soundEnabled') !== 'false',
      autoSave: localStorage.getItem('autoSaveEnabled') !== 'false'
    }
  };
  
  const dataStr = JSON.stringify(settings, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `app-settings-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
  alert('✅ تم تصدير إعدادات التطبيق بنجاح');
}

function resetAllSettings() {
  if (confirm('⚠️ هذا سيعيد تعيين جميع الإعدادات إلى القيم الافتراضية!\n\nهل أنت متأكد؟')) {
    localStorage.clear();
    alert('✅ تم إعادة تعيين جميع الإعدادات!\n\nسيتم إعادة تحميل الصفحة.');
    setTimeout(() => location.reload(), 1000);
  }
}

// تهيئة لوحة التحكم
document.addEventListener('DOMContentLoaded', function() {
  // عرض تبويب الأذكار افتراضياً عند فتح لوحة التحكم
  setTimeout(() => {
    if (document.getElementById('azkar-tab')) {
      showAdminTab('azkar');
    }
  }, 500);
});