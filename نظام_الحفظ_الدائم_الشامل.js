// نظام الحفظ الدائم الشامل لجميع إعدادات لوحة التحكم
const STORAGE_KEYS = {
    AZKAR: 'admin_azkar_settings',
    LOGO: 'admin_logo_settings', 
    PRAYERS: 'admin_prayer_settings',
    ADHAN: 'admin_adhan_settings',
    CONTENT: 'admin_content_settings',
    THEME: 'admin_theme_settings',
    ANNOUNCEMENT: 'admin_announcement_settings',
    SECTIONS: 'admin_sections_settings',
    SECURITY: 'admin_security_settings'
};

// === 1. نظام حفظ الأذكار ===
function saveAzkarSettings() {
    const azkarData = {
        customAzkar: getAllCustomAzkar(),
        azkarCategories: getAllAzkarCategories(),
        timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.AZKAR, JSON.stringify(azkarData));
}

function loadAzkarSettings() {
    const saved = localStorage.getItem(STORAGE_KEYS.AZKAR);
    if (saved) {
        const data = JSON.parse(saved);
        restoreCustomAzkar(data.customAzkar);
        restoreAzkarCategories(data.azkarCategories);
    }
}

function getAllCustomAzkar() {
    const categories = ['morning', 'evening', 'sleep', 'prayer', 'travel', 'food', 'general'];
    const allAzkar = {};
    
    categories.forEach(category => {
        const categoryAzkar = localStorage.getItem(`azkar_${category}`);
        if (categoryAzkar) {
            allAzkar[category] = JSON.parse(categoryAzkar);
        }
    });
    
    return allAzkar;
}

function restoreCustomAzkar(azkarData) {
    Object.keys(azkarData).forEach(category => {
        localStorage.setItem(`azkar_${category}`, JSON.stringify(azkarData[category]));
    });
}

// === 2. نظام حفظ الشعار ===
function saveLogoSettings() {
    const logoData = {
        logoUrl: document.getElementById('currentLogo')?.src || '',
        logoType: getCurrentLogoType(),
        timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.LOGO, JSON.stringify(logoData));
}

function loadLogoSettings() {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGO);
    if (saved) {
        const data = JSON.parse(saved);
        if (data.logoUrl) {
            applyLogo(data.logoUrl);
        }
    }
}

function getCurrentLogoType() {
    const logoSrc = document.getElementById('currentLogo')?.src || '';
    if (logoSrc.includes('data:image/svg+xml')) return 'emoji';
    if (logoSrc.startsWith('data:')) return 'upload';
    if (logoSrc.startsWith('http')) return 'url';
    return 'default';
}

function applyLogo(logoUrl) {
    // تطبيق الشعار على العنصر الحالي
    const logoElement = document.getElementById('currentLogo');
    if (logoElement) {
        logoElement.src = logoUrl;
    }
    
    // تطبيق الشعار على البانر
    const bannerEmoji = document.querySelector('.banner-emoji');
    if (bannerEmoji && logoUrl.includes('data:image/svg+xml')) {
        // استخراج الإيموجي من SVG
        const emojiMatch = logoUrl.match(/font-size='90'>([^<]+)</);
        if (emojiMatch) {
            bannerEmoji.textContent = emojiMatch[1];
        }
    }
}

// === 3. نظام حفظ مواقيت الصلاة ===
function savePrayerSettings() {
    const prayerData = {
        city: document.getElementById('cityName')?.value || '',
        country: document.getElementById('countryName')?.value || '',
        longitude: document.getElementById('longitude')?.value || '',
        latitude: document.getElementById('latitude')?.value || '',
        manualTimes: {
            fajr: document.getElementById('fajrTime')?.value || '',
            sunrise: document.getElementById('sunriseTime')?.value || '',
            dhuhr: document.getElementById('dhuhrTime')?.value || '',
            asr: document.getElementById('asrTime')?.value || '',
            maghrib: document.getElementById('maghribTime')?.value || '',
            isha: document.getElementById('ishaTime')?.value || ''
        },
        timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.PRAYERS, JSON.stringify(prayerData));
}

function loadPrayerSettings() {
    const saved = localStorage.getItem(STORAGE_KEYS.PRAYERS);
    if (saved) {
        const data = JSON.parse(saved);
        
        // استعادة بيانات الموقع
        if (document.getElementById('cityName')) document.getElementById('cityName').value = data.city || '';
        if (document.getElementById('countryName')) document.getElementById('countryName').value = data.country || '';
        if (document.getElementById('longitude')) document.getElementById('longitude').value = data.longitude || '';
        if (document.getElementById('latitude')) document.getElementById('latitude').value = data.latitude || '';
        
        // استعادة المواقيت اليدوية
        Object.keys(data.manualTimes).forEach(prayer => {
            const element = document.getElementById(prayer + 'Time');
            if (element && data.manualTimes[prayer]) {
                element.value = data.manualTimes[prayer];
                updatePrayerTimeDisplay(prayer, data.manualTimes[prayer]);
            }
        });
    }
}

function updatePrayerTimeDisplay(prayer, time) {
    const displayElement = document.getElementById(prayer + '-time');
    if (displayElement) {
        displayElement.textContent = formatTime(time);
    }
}

function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours < 12 ? 'ص' : 'م';
    return `${hour12}:${minutes} ${ampm}`;
}

// === 4. نظام حفظ إعدادات الأذان ===
function saveAdhanSettings() {
    const adhanData = {
        volume: document.getElementById('adhanVolume')?.value || 80,
        enabledPrayers: {
            fajr: document.getElementById('fajrAdhanEnabled')?.checked || false,
            dhuhr: document.getElementById('dhuhrAdhanEnabled')?.checked || false,
            asr: document.getElementById('asrAdhanEnabled')?.checked || false,
            maghrib: document.getElementById('maghribAdhanEnabled')?.checked || false,
            isha: document.getElementById('ishaAdhanEnabled')?.checked || false
        },
        customAdhanUrl: getCurrentAdhanUrl(),
        timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.ADHAN, JSON.stringify(adhanData));
}

function loadAdhanSettings() {
    const saved = localStorage.getItem(STORAGE_KEYS.ADHAN);
    if (saved) {
        const data = JSON.parse(saved);
        
        // استعادة مستوى الصوت
        if (document.getElementById('adhanVolume')) {
            document.getElementById('adhanVolume').value = data.volume;
            document.getElementById('volumeValue').textContent = data.volume + '%';
        }
        
        // استعادة إعدادات الصلوات
        Object.keys(data.enabledPrayers).forEach(prayer => {
            const checkbox = document.getElementById(prayer + 'AdhanEnabled');
            if (checkbox) {
                checkbox.checked = data.enabledPrayers[prayer];
            }
        });
        
        // استعادة رابط الأذان المخصص
        if (data.customAdhanUrl) {
            applyCustomAdhanUrl(data.customAdhanUrl);
        }
    }
}

function getCurrentAdhanUrl() {
    // استخراج رابط الأذان الحالي من الإعدادات
    return localStorage.getItem('customAdhanUrl') || '';
}

function applyCustomAdhanUrl(url) {
    localStorage.setItem('customAdhanUrl', url);
}

// === 5. نظام حفظ المحتوى والثيمات ===
function saveContentAndThemeSettings() {
    const contentData = {
        appTitle: document.getElementById('appTitle')?.value || '',
        appDescription: document.getElementById('appDescription')?.value || '',
        welcomeMessage: document.getElementById('welcomeMessage')?.value || '',
        announcement: {
            text: document.getElementById('announcementTextAdmin')?.value || '',
            speed: document.getElementById('announcementSpeed')?.value || 40
        },
        theme: {
            primaryColor: document.getElementById('primaryColor')?.value || '#4CAF50',
            backgroundColor: document.getElementById('backgroundColor')?.value || '#FFFFFF',
            textColor: document.getElementById('textColor')?.value || '#333333',
            arabicFont: document.getElementById('arabicFont')?.value || 'cairo',
            fontSize: document.getElementById('fontSize')?.value || 16,
            animationStyle: document.getElementById('animationStyle')?.value || 'fade'
        },
        timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(contentData));
}

function loadContentAndThemeSettings() {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTENT);
    if (saved) {
        const data = JSON.parse(saved);
        
        // استعادة نصوص التطبيق
        if (document.getElementById('appTitle')) document.getElementById('appTitle').value = data.appTitle || '';
        if (document.getElementById('appDescription')) document.getElementById('appDescription').value = data.appDescription || '';
        if (document.getElementById('welcomeMessage')) document.getElementById('welcomeMessage').value = data.welcomeMessage || '';
        
        // استعادة الإعلان
        if (data.announcement) {
            if (document.getElementById('announcementTextAdmin')) {
                document.getElementById('announcementTextAdmin').value = data.announcement.text || '';
            }
            if (document.getElementById('announcementSpeed')) {
                document.getElementById('announcementSpeed').value = data.announcement.speed || 40;
                document.getElementById('speedValue').textContent = data.announcement.speed + 'ث';
            }
            
            // تطبيق الإعلان
            if (data.announcement.text) {
                updateAnnouncementDisplay(data.announcement.text, data.announcement.speed);
            }
        }
        
        // استعادة الثيم
        if (data.theme) {
            Object.keys(data.theme).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.value = data.theme[key];
                }
            });
            
            // تطبيق الثيم
            applyThemeSettings(data.theme);
        }
        
        // تطبيق نصوص التطبيق
        applyContentSettings(data);
    }
}

function updateAnnouncementDisplay(text, speed) {
    const announcementElement = document.getElementById('announcementText');
    if (announcementElement) {
        announcementElement.textContent = text;
        announcementElement.style.animationDuration = speed + 's';
    }
}

function applyThemeSettings(theme) {
    if (!theme) return;
    
    // تطبيق الألوان
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', theme.textColor);
    
    // تطبيق الخط
    if (theme.arabicFont) {
        document.body.style.fontFamily = `'${theme.arabicFont}', Arial, sans-serif`;
    }
    
    // تطبيق حجم الخط
    if (theme.fontSize) {
        document.body.style.fontSize = theme.fontSize + 'px';
    }
}

function applyContentSettings(data) {
    // تطبيق عنوان التطبيق
    if (data.appTitle) {
        document.title = data.appTitle;
        const bannerTitle = document.querySelector('.banner h1');
        if (bannerTitle) bannerTitle.textContent = data.appTitle;
    }
    
    // تطبيق رسالة الترحيب
    if (data.welcomeMessage) {
        const bannerTitle = document.querySelector('.banner h1');
        if (bannerTitle) bannerTitle.textContent = data.welcomeMessage;
    }
}

// === 6. نظام حفظ إعدادات الأمان ===
function saveSecuritySettings() {
    const securityData = {
        lastPasswordChange: new Date().toISOString(),
        loginAttempts: 0,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(securityData));
}

function loadSecuritySettings() {
    const saved = localStorage.getItem(STORAGE_KEYS.SECURITY);
    if (saved) {
        const data = JSON.parse(saved);
        // يمكن استخدام هذه البيانات لتتبع محاولات تسجيل الدخول
        return data;
    }
    return null;
}

// === 7. وظائف الحفظ والتحميل الشاملة ===
function saveAllAdminSettings() {
    try {
        saveAzkarSettings();
        saveLogoSettings();
        savePrayerSettings();
        saveAdhanSettings();
        saveContentAndThemeSettings();
        saveSecuritySettings();
        
        showAdminMessage('تم حفظ جميع الإعدادات بنجاح! ✅', 'success');
        return true;
    } catch (error) {
        console.error('خطأ في حفظ الإعدادات:', error);
        showAdminMessage('حدث خطأ في حفظ الإعدادات! ❌', 'error');
        return false;
    }
}

function loadAllAdminSettings() {
    try {