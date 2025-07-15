// نظام الحفظ الدائم الكامل - يحفظ كل شيء ولا يتغير أبداً
const PERMANENT_STORAGE = {
    // مفاتيح التخزين
    KEYS: {
        AZKAR_CUSTOM: 'permanent_custom_azkar',
        AZKAR_CATEGORIES: 'permanent_azkar_categories', 
        LOGO_SETTINGS: 'permanent_logo_settings',
        PRAYER_TIMES: 'permanent_prayer_times',
        ADHAN_SETTINGS: 'permanent_adhan_settings',
        CONTENT_SETTINGS: 'permanent_content_settings',
        THEME_SETTINGS: 'permanent_theme_settings',
        ANNOUNCEMENT: 'permanent_announcement',
        APP_SETTINGS: 'permanent_app_settings',
        COUNTER_SETTINGS: 'permanent_counter_settings',
        DHIKR_BUTTONS: 'permanent_dhikr_buttons'
    },

    // حفظ البيانات
    save: function(key, data) {
        try {
            const saveData = {
                data: data,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            localStorage.setItem(key, JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('خطأ في الحفظ:', error);
            return false;
        }
    },

    // تحميل البيانات
    load: function(key) {
        try {
            const saved = localStorage.getItem(key);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.data;
            }
            return null;
        } catch (error) {
            console.error('خطأ في التحميل:', error);
            return null;
        }
    }
};

// === 1. حفظ وتحميل الأذكار المخصصة ===
function saveCustomAzkarPermanent() {
    // حفظ الأذكار المخصصة من الأزرار
    const customButtons = document.querySelectorAll('.custom-dhikr');
    const customAzkar = Array.from(customButtons).map(btn => ({
        text: btn.textContent,
        dhikr: btn.getAttribute('data-dhikr')
    }));
    
    PERMANENT_STORAGE.save(PERMANENT_STORAGE.KEYS.DHIKR_BUTTONS, customAzkar);
    
    // حفظ جميع فئات الأذكار
    const categories = ['morning', 'evening', 'sleep', 'prayer', 'travel', 'food', 'general'];
    const allAzkar = {};
    
    categories.forEach(category => {
        const categoryData = window.azkarData && window.azkarData[category] ? window.azkarData[category] : [];
        allAzkar[category] = categoryData;
    });
    
    PERMANENT_STORAGE.save(PERMANENT_STORAGE.KEYS.AZKAR_CATEGORIES, allAzkar);
}

function loadCustomAzkarPermanent() {
    // تحميل الأذكار المخصصة
    const customAzkar = PERMANENT_STORAGE.load(PERMANENT_STORAGE.KEYS.DHIKR_BUTTONS);
    if (customAzkar && customAzkar.length > 0) {
        const buttonsContainer = document.querySelector('.tasbeeh-buttons');
        
        customAzkar.forEach(azkar => {
            const newButton = document.createElement('button');
            newButton.className = 'tasbeeh-btn custom-dhikr';
            newButton.textContent = azkar.text;
            newButton.setAttribute('data-dhikr', azkar.dhikr);
            
            newButton.onclick = function() {
                if (window.isDeleteMode) {
                    deleteCustomDhikr(this);
                } else {
                    setDhikr(azkar.dhikr, this);
                }
            };
            
            buttonsContainer.appendChild(newButton);
            if (window.customDhikrButtons) {
                window.customDhikrButtons.push(newButton);
            }
        });
    }
    
    // تحميل فئات الأذكار
    const azkarCategories = PERMANENT_STORAGE.load(PERMANENT_STORAGE.KEYS.AZKAR_CATEGORIES);
    if (azkarCategories) {
        window.azkarData = azkarCategories;
    }
}

// === 2. حفظ وتحميل إعدادات الشعار ===
function saveLogoPermanent() {
    const logoElement = document.getElementById('currentLogo');
    const bannerEmoji = document.querySelector('.banner-emoji');
    
    const logoData = {
        logoSrc: logoElement ? logoElement.src : '',
        bannerEmoji: bannerEmoji ? bannerEmoji.textContent : '📿'
    };
    
    PERMANENT_STORAGE.save(PERMANENT_STORAGE.KEYS.LOGO_SETTINGS, logoData);
}

function loadLogoPermanent() {
    const logoData = PERMANENT_STORAGE.load(PERMANENT_STORAGE.KEYS.LOGO_SETTINGS);
    if (logoData) {
        // تطبيق الشعار
        const logoElement = document.getElementById('currentLogo');
        if (logoElement && logoData.logoSrc) {
            logoElement.src = logoData.logoSrc;
        }
        
        // تطبيق إيموجي البانر
        const bannerEmoji = document.querySelector('.banner-emoji');
        if (bannerEmoji && logoData.bannerEmoji) {
            bannerEmoji.textContent = logoData.bannerEmoji;
        }
    }
}

// === 3. حفظ وتحميل مواقيت الصلاة ===
function savePrayerTimesPermanent() {
    const prayerData = {
        city: document.getElementById('cityName')?.value || '',
        country: document.getElementById('countryName')?.value || '',
        longitude: document.getElementById('longitude')?.value || '',
        latitude: document.getElementById('latitude')?.value || '',
        times: {
            fajr: document.getElementById('fajr-time')?.textContent || '',
            sunrise: document.getElementById('sunrise-time')?.textContent || '',
            dhuhr: document.getElementById('dhuhr-time')?.textContent || '',
            asr: document.getElementById('asr-time')?.textContent || '',
            maghrib: document.getElementById('maghrib-time')?.textContent || '',
            isha: document.getElementById('isha-time')?.textContent || ''
        }
    };
    
    PERMANENT_STORAGE.save(PERMANENT_STORAGE.KEYS.PRAYER_TIMES, prayerData);
}

function loadPrayerTimesPermanent() {
    const prayerData = PERMANENT_STORAGE.load(PERMANENT_STORAGE.KEYS.PRAYER_TIMES);
    if (prayerData) {
        // استعادة بيانات الموقع
        if (document.getElementById('cityName')) document.getElementById('cityName').value = prayerData.city;
        if (document.getElementById('countryName')) document.getElementById('countryName').value = prayerData.country;
        if (document.getElementById('longitude')) document.getElementById('longitude').value = prayerData.longitude;
        if (document.getElementById('latitude')) document.getElementById('latitude').value = prayerData.latitude;
        
        // استعادة أوقات الصلاة
        Object.keys(prayerData.times).forEach(prayer => {
            const timeElement = document.getElementById(prayer + '-time');
            if (timeElement && prayerData.times[prayer]) {
                timeElement.textContent = prayerData.times[prayer];
            }
        });
    }
}

// === 4. حفظ وتحميل إعدادات الأذان ===
function saveAdhanSettingsPermanent() {
    const adhanData = {
        volume: document.getElementById('adhanVolume')?.value || 80,
        enabledPrayers: {
            fajr: document.getElementById('fajrAdhanEnabled')?.checked || false,
            dhuhr: document.getElementById('dhuhrAdhanEnabled')?.checked || false,
            asr: document.getElementById('asrAdhanEnabled')?.checked || false,
            maghrib: document.getElementById('maghribAdhanEnabled')?.checked || false,
            isha: document.getElementById('ishaAdhanEnabled')?.checked || false
        }
    };
    
    PERMANENT_STORAGE.save(PERMANENT_STORAGE.KEYS.ADHAN_SETTINGS, adhanData);
}

function loadAdhanSettingsPermanent() {
    const adhanData = PERMANENT_STORAGE.load(PERMANENT_STORAGE.KEYS.ADHAN_SETTINGS);
    if (adhanData) {
        // استعادة مستوى الصوت
        if (document.getElementById('adhanVolume')) {
            document.getElementById('adhanVolume').value = adhanData.volume;
            if (document.getElementById('volumeValue')) {
                document.getElementById('volumeValue').textContent = adhanData.volume + '%';
            }
        }
        
        // استعادة إعدادات الصلوات
        Object.keys(adhanData.enabledPrayers).forEach(prayer => {
            const checkbox = document.getElementById(prayer + 'AdhanEnabled');
            if (checkbox) {
                checkbox.checked = adhanData.enabledPrayers[prayer];
            }
        });
    }
}

// === 5. حفظ وتحميل المحتوى والثيمات ===
function saveContentPermanent() {
    const contentData = {
        appTitle: document.getElementById('appTitle')?.value || '',
        appDescription: document.getElementById('appDescription')?.value || '',
        welcomeMessage: document.getElementById('welcomeMessage')?.value || '',
        bannerTitle: document.querySelector('.banner h1')?.textContent || '',
        theme: {
            primaryColor: document.getElementById('primaryColor')?.value || '#4CAF50',
            backgroundColor: document.getElementById('backgroundColor')?.value || '#FFFFFF',
            textColor: document.getElementById('textColor')?.value || '#333333',
            arabicFont: document.getElementById('arabicFont')?.value || 'cairo',
            fontSize: document.getElementById('fontSize')?.value || 16
        }
    };
    
    PERMANENT_STORAGE.save(PERMANENT_STORAGE.KEYS.CONTENT_SETTINGS, contentData);
}

function loadContentPermanent() {
    const contentData = PERMANENT_STORAGE.load(PERMANENT_STORAGE.KEYS.CONTENT_SETTINGS);
    if (contentData) {
        // تطبيق عنوان التطبيق
        if (contentData.appTitle) {
            document.title = contentData.appTitle;
        }
        
        // تطبيق عنوان البانر
        if (contentData.bannerTitle) {
            const bannerTitle = document.querySelector('.banner h1');
            if (bannerTitle) bannerTitle.textContent = contentData.bannerTitle;
        }
        
        // تطبيق رسالة الترحيب
        if (contentData.welcomeMessage) {
            const bannerTitle = document.querySelector('.banner h1');
            if (bannerTitle) bannerTitle.textContent = contentData.welcomeMessage;
        }
        
        // استعادة الحقول في لوحة التحكم
        if (document.getElementById('appTitle')) document.getElementById('appTitle').value = contentData.appTitle || '';
        if (document.getElementById('appDescription')) document.getElementById('appDescription').value = contentData.appDescription || '';
        if (document.getElementById('welcomeMessage')) document.getElementById('welcomeMessage').value = contentData.welcomeMessage || '';
        
        // تطبيق الثيم
        if (contentData.theme) {
            applyThemePermanent(contentData.theme);
            
            // استعادة حقول الثيم
            Object.keys(contentData.theme).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    element.value = contentData.theme[key];
                }
            });
        }
    }
}

function applyThemePermanent(theme) {
    // تطبيق الألوان
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    
    // تطبيق الخط
    if (theme.arabicFont) {
        document.body.style.fontFamily = `'${theme.arabicFont}', Arial, sans-serif`;
    }
    
    // تطبيق حجم الخط
    if (theme.fontSize) {
        document.body.style.fontSize = theme.fontSize + 'px';
    }
    
    // تطبيق الألوان على العناصر
    const style = document.createElement('style');
    style.textContent = `
        .btn, .tasbeeh-btn { background: ${theme.primaryColor} !important; }
        .section h2 { color: ${theme.primaryColor} !important; }
        #counter { color: ${theme.primaryColor} !important; }
        .stat-card { border-color: ${theme.primaryColor} !important; }
    `;
    document.head.appendChild(style);
}

// === 6. حفظ وتحميل الإعلان ===
function saveAnnouncementPermanent() {
    const announcementData = {
        text: document.getElementById('announcementTextAdmin')?.value || '',
        speed: document.getElementById('announcementSpeed')?.value || 40,
        currentText: document.getElementById('announcementText')?.textContent || ''
    };
    
    PERMANENT_STORAGE.save(PERMANENT_STORAGE.KEYS.ANNOUNCEMENT, announcementData);
}

function loadAnnouncementPermanent() {
    const announcementData = PERMANENT_STORAGE.load(PERMANENT_STORAGE.KEYS.ANNOUNCEMENT);
    if (announcementData) {
        // تطبيق النص في الشريط
        const announcementElement = document.getElementById('announcementText');
        if (announcementElement) {
            announcementElement.textContent = announcementData.currentText || announcementData.text;
            announcementElement.style.animationDuration = (announcementData.speed || 40) + 's';
        }
        
        // استعادة الحقول في لوحة التحكم
        if (document.getElementById('announcementTextAdmin')) {
            document.getElementById('announcementTextAdmin').value = announcementData.text || '';
        }
        if (document.getElementById('announcementSpeed')) {
            document.getElementById('announcementSpeed').value =