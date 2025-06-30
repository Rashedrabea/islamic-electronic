// إصلاح شامل ونهائي للوحة التحكم مع نظام متعدد المستخدمين

// === نظام إدارة المستخدمين ===
const DEFAULT_USERS = [
    { id: 1, username: 'admin', password: '123456', role: 'admin', name: 'المدير الرئيسي' },
    { id: 2, username: 'user', password: '123456', role: 'user', name: 'مستخدم عادي' }
];

// تهيئة المستخدمين الافتراضيين
function initializeUsers() {
    const existingUsers = localStorage.getItem('systemUsers');
    if (!existingUsers) {
        localStorage.setItem('systemUsers', JSON.stringify(DEFAULT_USERS));
    }
}

// تسجيل الدخول
function attemptLogin() {
    const username = document.getElementById('adminUsername')?.value.trim();
    const password = document.getElementById('adminPassword')?.value;
    
    if (!username || !password) {
        alert('⚠️ يرجى إدخال اسم المستخدم وكلمة المرور');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        closeLoginPanel();
        showControlPanel();
        alert(`✅ مرحباً ${user.name}!`);
    } else {
        alert('❌ اسم المستخدم أو كلمة المرور غير صحيحة');
    }
}

// عرض لوحة التحكم
function showControlPanel() {
    const overlay = document.getElementById('controlPanelOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        loadControlPanelData();
    }
}

// إغلاق لوحة التحكم
function closeControlPanel() {
    const overlay = document.getElementById('controlPanelOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    localStorage.removeItem('currentUser');
}

// عرض نافذة تسجيل الدخول
function showLoginPanel() {
    const overlay = document.getElementById('loginOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        // مسح الحقول
        const usernameField = document.getElementById('adminUsername');
        const passwordField = document.getElementById('adminPassword');
        if (usernameField) usernameField.value = '';
        if (passwordField) passwordField.value = '';
    }
}

// إغلاق نافذة تسجيل الدخول
function closeLoginPanel() {
    const overlay = document.getElementById('loginOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// === إدارة التبويبات ===
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
    
    // تحميل بيانات التبويب
    loadTabData(tabName);
}

// تحميل بيانات التبويب
function loadTabData(tabName) {
    switch(tabName) {
        case 'azkar':
            loadAzkarForEdit();
            break;
        case 'logo':
            loadCurrentLogo();
            break;
        case 'prayers':
            loadPrayerSettings();
            break;
        case 'adhan':
            loadAdhanSettings();
            break;
        case 'security':
            loadUsersList();
            break;
    }
}

// === إدارة الأذكار ===
function addNewAzkar() {
    const category = document.getElementById('newAzkarCategory')?.value;
    const text = document.getElementById('newAzkarText')?.value.trim();
    const count = parseInt(document.getElementById('newAzkarCount')?.value) || 1;
    
    if (!text) {
        alert('⚠️ يرجى إدخال نص الذكر');
        return;
    }
    
    // إضافة الذكر للبيانات
    if (!azkarData[category]) {
        azkarData[category] = [];
    }
    
    azkarData[category].push({ text, count });
    
    // حفظ في التخزين المحلي
    localStorage.setItem('customAzkarData', JSON.stringify(azkarData));
    
    // مسح الحقول
    document.getElementById('newAzkarText').value = '';
    document.getElementById('newAzkarCount').value = '1';
    
    alert('✅ تم إضافة الذكر بنجاح');
    
    // تحديث قائمة التعديل
    loadAzkarForEdit();
}

function loadAzkarForEdit() {
    const category = document.getElementById('editAzkarCategory')?.value;
    const listContainer = document.getElementById('azkarEditList');
    
    if (!listContainer || !category) return;
    
    const azkar = azkarData[category] || [];
    
    if (azkar.length === 0) {
        listContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">لا توجد أذكار في هذا التصنيف</div>';
        return;
    }
    
    listContainer.innerHTML = azkar.map((zikr, index) => `
        <div class="azkar-edit-item" style="background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 8px; border: 1px solid #ddd;">
            <div style="margin-bottom: 10px;"><strong>النص:</strong> ${zikr.text}</div>
            <div style="margin-bottom: 10px;"><strong>العدد:</strong> ${zikr.count}</div>
            <div>
                <button class="control-btn secondary" onclick="editAzkar('${category}', ${index})" style="margin-right: 10px;">✏️ تعديل</button>
                <button class="control-btn danger" onclick="deleteAzkar('${category}', ${index})">🗑️ حذف</button>
            </div>
        </div>
    `).join('');
}

function editAzkar(category, index) {
    const zikr = azkarData[category][index];
    const newText = prompt('تعديل نص الذكر:', zikr.text);
    
    if (newText === null) return; // إلغاء
    
    const newCount = prompt('تعديل العدد:', zikr.count);
    
    if (newCount === null) return; // إلغاء
    
    if (newText.trim() && newCount) {
        azkarData[category][index] = {
            text: newText.trim(),
            count: parseInt(newCount) || 1
        };
        
        localStorage.setItem('customAzkarData', JSON.stringify(azkarData));
        loadAzkarForEdit();
        alert('✅ تم تعديل الذكر بنجاح');
    }
}

function deleteAzkar(category, index) {
    if (confirm('هل تريد حذف هذا الذكر؟')) {
        azkarData[category].splice(index, 1);
        localStorage.setItem('customAzkarData', JSON.stringify(azkarData));
        loadAzkarForEdit();
        alert('✅ تم حذف الذكر بنجاح');
    }
}

function previewAzkar() {
    const category = document.getElementById('newAzkarCategory')?.value;
    const text = document.getElementById('newAzkarText')?.value.trim();
    const count = document.getElementById('newAzkarCount')?.value;
    
    if (!text) {
        alert('⚠️ يرجى إدخال نص الذكر أولاً');
        return;
    }
    
    const categoryNames = {
        morning: 'أذكار الصباح',
        evening: 'أذكار المساء',
        sleep: 'أذكار النوم',
        prayer: 'أذكار الصلاة',
        travel: 'أذكار السفر',
        food: 'أذكار الطعام',
        general: 'أذكار عامة'
    };
    
    alert(`📿 معاينة الذكر:\n\nالفئة: ${categoryNames[category]}\nالنص: ${text}\nالعدد: ${count}`);
}

function saveAzkarChanges() {
    localStorage.setItem('customAzkarData', JSON.stringify(azkarData));
    alert('✅ تم حفظ جميع التغييرات');
}

function resetAzkarCategory() {
    const category = document.getElementById('editAzkarCategory')?.value;
    
    if (confirm(`هل تريد استعادة ${category} إلى الحالة الافتراضية؟`)) {
        // إعادة تحميل البيانات الافتراضية
        const defaultData = getDefaultAzkarData();
        azkarData[category] = defaultData[category] || [];
        
        localStorage.setItem('customAzkarData', JSON.stringify(azkarData));
        loadAzkarForEdit();
        alert('✅ تم استعادة الأذكار الافتراضية');
    }
}

// === إدارة الشعار ===
function loadCurrentLogo() {
    const logoImg = document.getElementById('currentLogo');
    const savedLogo = localStorage.getItem('customLogoImage');
    
    if (logoImg && savedLogo) {
        logoImg.src = savedLogo;
    }
}

function selectIcon(icon, button) {
    // إزالة التحديد من جميع الأزرار
    document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // تحديد الزر المضغوط
    if (button) {
        button.classList.add('selected');
    }
    
    // تحديث معاينة الشعار
    const logoImg = document.getElementById('currentLogo');
    if (logoImg) {
        logoImg.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${icon}</text></svg>`;
    }
}

function previewLogo() {
    const fileInput = document.getElementById('logoUpload');
    const file = fileInput?.files[0];
    
    if (file && file.type.startsWith('image/')) {
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

function previewLogoFromUrl() {
    const url = document.getElementById('logoUrl')?.value.trim();
    if (url) {
        const logoImg = document.getElementById('currentLogo');
        if (logoImg) {
            logoImg.src = url;
            logoImg.onerror = function() {
                alert('❌ لا يمكن تحميل الصورة من هذا الرابط');
            };
        }
    }
}

function applyNewLogo() {
    const logoImg = document.getElementById('currentLogo');
    if (logoImg && logoImg.src) {
        // حفظ الشعار الجديد
        localStorage.setItem('customLogoImage', logoImg.src);
        
        // تطبيق الشعار على التطبيق
        const bannerEmoji = document.querySelector('.banner-emoji');
        if (bannerEmoji) {
            if (logoImg.src.startsWith('data:image/svg+xml')) {
                // إيموجي
                const match = logoImg.src.match(/font-size='90'>([^<]+)</);
                if (match) {
                    bannerEmoji.textContent = match[1];
                }
            } else {
                // صورة
                bannerEmoji.innerHTML = `<img src="${logoImg.src}" style="width: 60px; height: 60px; border-radius: 10px; object-fit: cover;">`;
            }
        }
        
        alert('✅ تم تطبيق الشعار الجديد بنجاح');
    } else {
        alert('⚠️ يرجى اختيار شعار أولاً');
    }
}

function resetLogo() {
    const defaultLogo = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📿</text></svg>';
    
    localStorage.setItem('customLogoImage', defaultLogo);
    
    const logoImg = document.getElementById('currentLogo');
    if (logoImg) {
        logoImg.src = defaultLogo;
    }
    
    const bannerEmoji = document.querySelector('.banner-emoji');
    if (bannerEmoji) {
        bannerEmoji.textContent = '📿';
    }
    
    alert('🔄 تم استعادة الشعار الافتراضي');
}

// === إدارة المواقيت ===
function loadPrayerSettings() {
    const savedLocation = localStorage.getItem('prayerLocation');
    if (savedLocation) {
        const location = JSON.parse(savedLocation);
        const cityInput = document.getElementById('cityName');
        const countryInput = document.getElementById('countryName');
        const latInput = document.getElementById('latitude');
        const lngInput = document.getElementById('longitude');
        
        if (cityInput) cityInput.value = location.city || '';
        if (countryInput) countryInput.value = location.country || '';
        if (latInput) latInput.value = location.lat || '';
        if (lngInput) lngInput.value = location.lng || '';
    }
}

function updatePrayerLocation() {
    const city = document.getElementById('cityName')?.value.trim();
    const country = document.getElementById('countryName')?.value.trim();
    const lat = document.getElementById('latitude')?.value;
    const lng = document.getElementById('longitude')?.value;
    
    if (!city || !country) {
        alert('⚠️ يرجى إدخال اسم المدينة والبلد');
        return;
    }
    
    const locationData = { city, country, lat, lng };
    localStorage.setItem('prayerLocation', JSON.stringify(locationData));
    
    alert(`✅ تم تحديث الموقع إلى: ${city}, ${country}`);
    
    // تحديث المواقيت
    if (typeof updatePrayerTimes === 'function') {
        updatePrayerTimes();
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude.toFixed(6);
                const lng = position.coords.longitude.toFixed(6);
                
                const latInput = document.getElementById('latitude');
                const lngInput = document.getElementById('longitude');
                
                if (latInput) latInput.value = lat;
                if (lngInput) lngInput.value = lng;
                
                alert('✅ تم الحصول على الموقع الجغرافي بنجاح');
            },
            function(error) {
                alert('❌ تعذر الحصول على الموقع الجغرافي');
            }
        );
    } else {
        alert('❌ المتصفح لا يدعم تحديد الموقع الجغرافي');
    }
}

function saveManualPrayerTimes() {
    const manualTimes = {
        fajr: document.getElementById('fajrTime')?.value,
        sunrise: document.getElementById('sunriseTime')?.value,
        dhuhr: document.getElementById('dhuhrTime')?.value,
        asr: document.getElementById('asrTime')?.value,
        maghrib: document.getElementById('maghribTime')?.value,
        isha: document.getElementById('ishaTime')?.value
    };
    
    // التحقق من وجود جميع المواقيت
    const missingTimes = Object.entries(manualTimes).filter(([key, value]) => !value);
    if (missingTimes.length > 0) {
        alert('⚠️ يرجى ملء جميع مواقيت الصلاة');
        return;
    }
    
    localStorage.setItem('manualPrayerTimes', JSON.stringify(manualTimes));
    localStorage.setItem('manualPrayerTimesActive', 'true');
    
    alert('💾 تم حفظ المواقيت اليدوية بنجاح');
}

function loadCurrentPrayerTimes() {
    // تحميل المواقيت الحالية في الحقول
    const currentTimes = {
        fajr: document.getElementById('fajr-time')?.textContent,
        sunrise: document.getElementById('sunrise-time')?.textContent,
        dhuhr: document.getElementById('dhuhr-time')?.textContent,
        asr: document.getElementById('asr-time')?.textContent,
        maghrib: document.getElementById('maghrib-time')?.textContent,
        isha: document.getElementById('isha-time')?.textContent
    };
    
    // تحويل الأوقات إلى تنسيق 24 ساعة
    Object.entries(currentTimes).forEach(([prayer, time]) => {
        if (time) {
            const input = document.getElementById(prayer + 'Time');
            if (input) {
                // تحويل من 12 ساعة إلى 24 ساعة
                const convertedTime = convertTo24Hour(time);
                input.value = convertedTime;
            }
        }
    });
    
    alert('✅ تم تحميل المواقيت الحالية');
}

function disableManualPrayerTimes() {
    localStorage.removeItem('manualPrayerTimesActive');
    alert('🌐 تم العودة للمواقيت التلقائية');
    
    // تحديث المواقيت
    if (typeof updatePrayerTimes === 'function') {
        updatePrayerTimes();
    }
}

// === إدارة الأذان ===
function loadAdhanSettings() {
    const volume = localStorage.getItem('adhanVolume') || '80';
    const volumeSlider = document.getElementById('adhanVolume');
    const volumeDisplay = document.getElementById('volumeValue');
    
    if (volumeSlider) volumeSlider.value = volume;
    if (volumeDisplay) volumeDisplay.textContent = volume + '%';
}

function showSelectedFile() {
    const fileInput = document.getElementById('adhanFileUpload');
    const fileName = document.getElementById('selectedFileName');
    
    if (fileInput?.files[0] && fileName) {
        fileName.textContent = `تم اختيار: ${fileInput.files[0].name}`;
        fileName.style.color = '#4CAF50';
    }
}

function addAdhanUrl() {
    const url = document.getElementById('adhanUrlInput')?.value.trim();
    if (url) {
        localStorage.setItem('customAdhanUrl', url);
        alert('✅ تم إضافة رابط الأذان');
        document.getElementById('adhanUrlInput').value = '';
    } else {
        alert('⚠️ يرجى إدخال رابط صحيح');
    }
}

function updateAdhanVolume() {
    const volume = document.getElementById('adhanVolume')?.value || 80;
    const volumeDisplay = document.getElementById('volumeValue');
    if (volumeDisplay) {
        volumeDisplay.textContent = volume + '%';
    }
    localStorage.setItem('adhanVolume', volume);
}

function togglePrayerAdhan(prayer) {
    const checkbox = document.getElementById(prayer + 'AdhanEnabled');
    if (checkbox) {
        const adhanSettings = JSON.parse(localStorage.getItem('adhanSettings') || '{}');
        adhanSettings[prayer] = checkbox.checked;
        localStorage.setItem('adhanSettings', JSON.stringify(adhanSettings));
    }
}

function testAdhan() {
    const customUrl = localStorage.getItem('customAdhanUrl');
    const volume = (localStorage.getItem('adhanVolume') || 80) / 100;
    
    let adhanUrl = customUrl || './sounds/الاذان 1.mp3';
    
    try {
        const audio = new Audio(adhanUrl);
        audio.volume = volume;
        audio.play().then(() => {
            alert('🎵 يتم تشغيل الأذان...');
            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
            }, 10000); // إيقاف بعد 10 ثوان
        }).catch(() => {
            alert('❌ تعذر تشغيل الأذان');
        });
    } catch (error) {
        alert('❌ خطأ في تشغيل الأذان');
    }
}

function stopAdhan() {
    document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    alert('⏹️ تم إيقاف الأذان');
}

function saveAdhanSettings() {
    const fileInput = document.getElementById('adhanFileUpload');
    const urlInput = document.getElementById('adhanUrlInput');
    const volume = document.getElementById('adhanVolume')?.value || 80;
    
    localStorage.setItem('adhanVolume', volume);
    
    if (fileInput?.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem('customAdhanFile', e.target.result);
            alert('✅ تم حفظ ملف الأذان بنجاح');
        };
        reader.readAsDataURL(file);
    } else if (urlInput?.value.trim()) {
        localStorage.setItem('customAdhanUrl', urlInput.value.trim());
        alert('✅ تم حفظ رابط الأذان بنجاح');
    } else {
        alert('✅ تم حفظ إعدادات الأذان');
    }
}

// === إدارة الأقسام ===
function updateSectionsManager() {
    const container = document.getElementById('sectionsManager');
    if (!container) return;
    
    const sections = [
        { id: 'counter-section', name: 'قسم التسبيح', visible: true },
        { id: 'stats-section', name: 'قسم الإحصائيات', visible: true },
        { id: 'radio-section', name: 'قسم الراديو', visible: true },
        { id: 'prayer-times-section', name: 'قسم مواقيت الصلاة', visible: true },
        { id: 'azkar-section', name: 'قسم الأذكار', visible: true },
        { id: 'social-share', name: 'قسم المشاركة', visible: true }
    ];
    
    container.innerHTML = sections.map(section => `
        <div class="section-item">
            <span class="section-name">${section.name}</span>
            <div class="section-controls">
                <label style="margin-left: 10px;">
                    <input type="checkbox" ${section.visible ? 'checked' : ''} 
                           onchange="toggleSection('${section.id}', this.checked)"> مرئي
                </label>
                <button class="control-btn small secondary" onclick="editSection('${section.id}')">تعديل</button>
            </div>
        </div>
    `).join('');
}

function toggleSection(sectionId, visible) {
    const section = document.querySelector(`.${sectionId}`);
    if (section) {
        section.style.display = visible ? 'block' : 'none';
        
        // حفظ الحالة
        const sectionStates = JSON.parse(localStorage.getItem('sectionStates') || '{}');
        sectionStates[sectionId] = visible;
        localStorage.setItem('sectionStates', JSON.stringify(sectionStates));
    }
}

function addNewSection() {
    const sectionName = prompt('اسم القسم الجديد:');
    if (sectionName) {
        alert(`سيتم إضافة قسم: ${sectionName}`);
        // يمكن تطوير هذه الوظيفة لاحقاً
    }
}

// === إدارة المحتوى ===
function updateAppContent() {
    const title = document.getElementById('appTitle')?.value.trim();
    const description = document.getElementById('appDescription')?.value.trim();
    const welcome = document.getElementById('welcomeMessage')?.value.trim();
    
    if (title) {
        const titleElement = document.querySelector('.banner h1');
        if (titleElement) {
            titleElement.textContent = title;
            localStorage.setItem('appTitle', title);
        }
    }
    
    if (description) {
        localStorage.setItem('appDescription', description);
    }
    
    if (welcome) {
        localStorage.setItem('welcomeMessage', welcome);
    }
    
    alert('✅ تم تحديث محتوى التطبيق بنجاح');
}

function previewContent() {
    const title = document.getElementById('appTitle')?.value.trim();
    const description = document.getElementById('appDescription')?.value.trim();
    
    alert(`📝 معاينة المحتوى:\n\nالعنوان: ${title || 'المسبحة الإلكترونية'}\nالوصف: ${description || 'تطبيق إسلامي شامل'}`);
}

function applyTheme() {
    const primaryColor = document.getElementById('primaryColor')?.value || '#4CAF50';
    const backgroundColor = document.getElementById('backgroundColor')?.value || '#f0f8ff';
    const textColor = document.getElementById('textColor')?.value || '#333333';
    
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--background-color', backgroundColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    
    localStorage.setItem('themeColors', JSON.stringify({ primaryColor, backgroundColor, textColor }));
    alert('✅ تم تطبيق الثيم الجديد');
}

function resetTheme() {
    document.documentElement.style.removeProperty('--primary-color');
    document.documentElement.style.removeProperty('--background-color');
    document.documentElement.style.removeProperty('--text-color');
    
    localStorage.removeItem('themeColors');
    alert('✅ تم استعادة الثيم الافتراضي');
}

function toggleAnimations() {
    const toggle = document.getElementById('animationsToggle');
    if (toggle) {
        const enabled = !toggle.classList.contains('active');
        toggle.classList.toggle('active', enabled);
        document.body.classList.toggle('no-animations', !enabled);
        localStorage.setItem('animationsEnabled', enabled);
    }
}

function toggleSounds() {
    const toggle = document.getElementById('soundsToggle');
    if (toggle) {
        const enabled = !toggle.classList.contains('active');
        toggle.classList.toggle('active', enabled);
        localStorage.setItem('soundEnabled', enabled);
    }
}

function toggleAutoSave() {
    const toggle = document.getElementById('autoSaveToggle');
    if (toggle) {
        const enabled = !toggle.classList.contains('active');
        toggle.classList.toggle('active', enabled);
        localStorage.setItem('autoSaveEnabled', enabled);
    }
}

function toggleDevMode() {
    const toggle = document.getElementById('devModeToggle');
    if (toggle) {
        const enabled = !toggle.classList.contains('active');
        toggle.classList.toggle('active', enabled);
        localStorage.setItem('devModeEnabled', enabled);
        
        if (enabled) {
            alert('🔧 تم تفعيل وضع المطور');
        } else {
            alert('🔧 تم إلغاء وضع المطور');
        }
    }
}

// === إدارة الأمان والمستخدمين ===
function loadUsersList() {
    const users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    const container = document.getElementById('usersList');
    
    if (container) {
        container.innerHTML = users.map(user => `
            <div class="user-item" style="background: #f9f9f9; padding: 15px; margin: 10px 0; border-radius: 8px; border: 1px solid #ddd;">
                <div><strong>الاسم:</strong> ${user.name}</div>
                <div><strong>اسم المستخدم:</strong> ${user.username}</div>
                <div><strong>الدور:</strong> ${user.role === 'admin' ? 'مدير' : 'مستخدم'}</div>
                <div style="margin-top: 10px;">
                    <button class="control-btn secondary" onclick="editUser(${user.id})">تعديل</button>
                    ${user.id !== 1 ? `<button class="control-btn danger" onclick="deleteUser(${user.id})">حذف</button>` : ''}
                </div>
            </div>
        `).join('');
    }
}

function addNewUser() {
    const name = prompt('اسم المستخدم الجديد:');
    if (!name) return;
    
    const username = prompt('اسم تسجيل الدخول:');
    if (!username) return;
    
    const password = prompt('كلمة المرور:');
    if (!password || password.length < 6) {
        alert('⚠️ كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
    }
    
    const role = confirm('هل تريد جعل هذا المستخدم مديراً؟') ? 'admin' : 'user';
    
    const users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    
    // التحقق من عدم تكرار اسم المستخدم
    if (users.find(u => u.username === username)) {
        alert('❌ اسم المستخدم موجود بالفعل');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name,
        username,
        password,
        role
    };
    
    users.push(newUser);
    localStorage.setItem('systemUsers', JSON.stringify(users));
    
    alert('✅ تم إضافة المستخدم الجديد بنجاح');
    loadUsersList();
}

function editUser(userId) {
    const users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (!user) return;
    
    const newName = prompt('الاسم الجديد:', user.name);
    if (newName === null) return;
    
    const newPassword = prompt('كلمة المرور الجديدة (اتركها فارغة للاحتفاظ بالحالية):');
    
    if (newName.trim()) {
        user.name = newName.trim();
    }
    
    if (newPassword && newPassword.length >= 6) {
        user.password = newPassword;
    } else if (newPassword && newPassword.length < 6) {
        alert('⚠️ كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
    }
    
    localStorage.setItem('systemUsers', JSON.stringify(users));
    alert('✅ تم تعديل بيانات المستخدم');
    loadUsersList();
}

function deleteUser(userId) {
    if (userId === 1) {
        alert('❌ لا يمكن حذف المدير الرئيسي');
        return;
    }
    
    if (confirm('هل تريد حذف هذا المستخدم؟')) {
        const users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
        const filteredUsers = users.filter(u => u.id !== userId);
        localStorage.setItem('systemUsers', JSON.stringify(filteredUsers));
        
        alert('✅ تم حذف المستخدم');
        loadUsersList();
    }
}

function changeAdminCredentials() {
    const newUsername = document.getElementById('newAdminUsername')?.value.trim();
    const newPassword = document.getElementById('newAdminPassword')?.value;
    
    if (!newUsername || !newPassword) {
        alert('⚠️ يرجى ملء جميع الحقول');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('⚠️ كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('systemUsers') || '[]');
    const adminUser = users.find(u => u.id === 1);
    
    if (adminUser) {
        adminUser.username = newUsername;
        adminUser.password = newPassword;
        localStorage.setItem('systemUsers', JSON.stringify(users));
        
        document.getElementById('newAdminUsername').value = '';
        document.getElementById('newAdminPassword').value = '';
        
        alert('✅ تم تغيير بيانات المدير الرئيسي بنجاح');
    }
}

function resetToDefault() {
    if (confirm('هل تريد إعادة تعيين بيانات الدخول إلى القيم الافتراضية؟')) {
        localStorage.setItem('systemUsers', JSON.stringify(DEFAULT_USERS));
        alert('✅ تم إعادة تعيين بيانات الدخول الافتراضية');
        loadUsersList();
    }
}

// === وظائف مساعدة ===
function convertTo24Hour(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
        hours = '00';
    }
    
    if (modifier === 'م' || modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

function getDefaultAzkarData() {
    // إرجاع البيانات الافتراضية للأذكار
    return {
        morning: [
            { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ", count: 1 },
            { text: "اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ", count: 1 },
            { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 }
        ],
        evening: [
            { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ", count: 1 },
            { text: "اللَّهُمَّ أَنْتَ رَبِّي لا إِلَهَ إِلا أَنْتَ", count: 1 },
            { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100 }
        ]
        // يمكن إضافة باقي الأذكار هنا
    };
}

function loadControlPanelData() {
    // تحميل بيانات لوحة التحكم عند فتحها
    setTimeout(() => {
        showAdminTab('azkar'); // عرض تبويب الأذكار افتراضياً
        updateSectionsManager();
    }, 100);
}

function exportAppSettings() {
    const settings = {
        version: '3.0',
        timestamp: new Date().toISOString(),
        customAzkarData: localStorage.getItem('customAzkarData'),
        customLogoImage: localStorage.getItem('customLogoImage'),
        prayerLocation: localStorage.getItem('prayerLocation'),
        manualPrayerTimes: localStorage.getItem('manualPrayerTimes'),
        adhanSettings: localStorage.getItem('adhanSettings'),
        themeColors: localStorage.getItem('themeColors'),
        systemUsers: localStorage.getItem('systemUsers'),
        sectionStates: localStorage.getItem('sectionStates')
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasbih-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    alert('✅ تم تصدير إعدادات التطبيق بنجاح');
}

function importAppSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const settings = JSON.parse(e.target.result);
                    
                    // استيراد الإعدادات
                    Object.keys(settings).forEach(key => {
                        if (key !== 'version' && key !== 'timestamp' && settings[key]) {
                            localStorage.setItem(key, settings[key]);
                        }
                    });
                    
                    alert('✅ تم استيراد الإعدادات بنجاح. سيتم إعادة تحميل الصفحة.');
                    setTimeout(() => location.reload(), 1000);
                } catch (error) {
                    alert('❌ خطأ في ملف الإعدادات');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function resetAllSettings() {
    if (confirm('⚠️ هذا سيعيد تعيين جميع الإعدادات إلى القيم الافتراضية!\n\nهل أنت متأكد؟')) {
        localStorage.clear();
        alert('✅ تم إعادة تعيين جميع الإعدادات!\n\nسيتم إعادة تحميل الصفحة.');
        setTimeout(() => location.reload(), 1000);
    }
}

// === تهيئة النظام ===
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة المستخدمين
    initializeUsers();
    
    // إضافة قسم إدارة المستخدمين إلى تبويب الأمان
    const securityTab = document.getElementById('security-tab');
    if (securityTab) {
        const usersSection = document.createElement('div');
        usersSection.className = 'control-section';
        usersSection.innerHTML = `
            <h3>👥 إدارة المستخدمين</h3>
            <div id="usersList"></div>
            <div class="control-buttons">
                <button class="control-btn" onclick="addNewUser()">➕ إضافة مستخدم جديد</button>
                <button class="control-btn secondary" onclick="loadUsersList()">🔄 تحديث القائمة</button>
            </div>
        `;
        securityTab.insertBefore(usersSection, securityTab.firstChild);
    }
    
    console.log('✅ تم تحميل إصلاح لوحة التحكم النهائي مع نظام متعدد المستخدمين');
});