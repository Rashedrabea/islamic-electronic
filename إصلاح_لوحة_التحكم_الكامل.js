// إصلاح شامل للوحة التحكم - جميع الوظائف

// === إدارة الأذكار ===
function addNewAzkar() {
    const category = document.getElementById('newAzkarCategory')?.value;
    const text = document.getElementById('newAzkarText')?.value.trim();
    const count = parseInt(document.getElementById('newAzkarCount')?.value) || 1;
    
    if (!text) {
        alert('⚠️ يرجى إدخال نص الذكر');
        return;
    }
    
    if (!azkarData[category]) {
        azkarData[category] = [];
    }
    
    azkarData[category].push({ text, count });
    localStorage.setItem('customAzkarData', JSON.stringify(azkarData));
    
    document.getElementById('newAzkarText').value = '';
    document.getElementById('newAzkarCount').value = '1';
    
    alert('✅ تم إضافة الذكر بنجاح');
    displayAzkar(category);
}

function loadAzkarForEdit() {
    const category = document.getElementById('editAzkarCategory')?.value;
    const listContainer = document.getElementById('azkarEditList');
    
    if (!listContainer) return;
    
    const azkar = azkarData[category] || [];
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
    const newCount = prompt('تعديل العدد:', zikr.count);
    
    if (newText && newCount) {
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
    
    alert(`معاينة الذكر:\n\nالفئة: ${categoryNames[category]}\nالنص: ${text}\nالعدد: ${count}`);
}

// === إدارة الشعار ===
function selectIcon(icon, button) {
    // إزالة التحديد من جميع الأزرار
    document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // تحديد الزر المضغوط
    button.classList.add('selected');
    
    // وضع الأيقونة في حقل الإدخال
    const logoInput = document.getElementById('logoInput');
    if (logoInput) {
        logoInput.value = icon;
    }
}

function previewLogo() {
    const fileInput = document.getElementById('logoUpload');
    const file = fileInput?.files[0];
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('currentLogo');
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
        };
        reader.readAsDataURL(file);
    }
}

function previewLogoFromUrl() {
    const url = document.getElementById('logoUrl')?.value.trim();
    if (url) {
        const preview = document.getElementById('currentLogo');
        if (preview) {
            preview.src = url;
            preview.style.display = 'block';
        }
    }
}

function applyNewLogo() {
    const fileInput = document.getElementById('logoUpload');
    const urlInput = document.getElementById('logoUrl');
    const textInput = document.getElementById('logoInput');
    
    if (fileInput?.files[0]) {
        // رفع صورة
        uploadLogo();
    } else if (urlInput?.value.trim()) {
        // رابط صورة
        const url = urlInput.value.trim();
        const bannerEmoji = document.querySelector('.banner-emoji');
        if (bannerEmoji) {
            bannerEmoji.innerHTML = `<img src="${url}" style="width: 60px; height: 60px; border-radius: 10px; object-fit: cover;">`;
            localStorage.setItem('customLogoImage', url);
            localStorage.setItem('logoType', 'url');
            alert('✅ تم تطبيق الشعار من الرابط');
        }
    } else if (textInput?.value.trim()) {
        // نص أو إيموجي
        changeLogo();
    } else {
        alert('⚠️ يرجى اختيار شعار أولاً');
    }
}

// === إدارة المواقيت ===
function updatePrayerLocation() {
    const city = document.getElementById('cityName')?.value.trim();
    const country = document.getElementById('countryName')?.value.trim();
    const lat = document.getElementById('latitude')?.value;
    const lng = document.getElementById('longitude')?.value;
    
    if (city && country) {
        localStorage.setItem('prayerLocation', JSON.stringify({ city, country, lat, lng }));
        alert(`✅ تم تحديث الموقع إلى: ${city}, ${country}`);
    } else {
        alert('⚠️ يرجى إدخال اسم المدينة والبلد');
    }
}

function getCurrentLocation() {
    if (isManualMode) {
        alert('⚠️ أنت تستخدم المواقيت اليدوية. للحصول على الموقع الجغرافي، اضغط "العودة للمواقيت التلقائية" أولاً.');
        return;
    }
    
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

// === إدارة الأذان ===
function saveAdhanSettings() {
    const fileInput = document.getElementById('adhanFileUpload');
    const urlInput = document.getElementById('adhanUrlInput');
    
    if (fileInput?.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            localStorage.setItem('customAdhan', e.target.result);
            localStorage.setItem('adhanType', 'file');
            alert('✅ تم حفظ ملف الأذان بنجاح');
        };
        reader.readAsDataURL(file);
    } else if (urlInput?.value.trim()) {
        const url = urlInput.value.trim();
        localStorage.setItem('customAdhan', url);
        localStorage.setItem('adhanType', 'url');
        alert('✅ تم حفظ رابط الأذان بنجاح');
    } else {
        alert('⚠️ يرجى اختيار ملف أذان أو إدخال رابط');
    }
}

function addAdhanUrl() {
    const url = document.getElementById('adhanUrlInput')?.value.trim();
    if (url) {
        localStorage.setItem('customAdhan', url);
        localStorage.setItem('adhanType', 'url');
        alert('✅ تم إضافة رابط الأذان');
    } else {
        alert('⚠️ يرجى إدخال رابط صحيح');
    }
}

function testAdhan() {
    const adhanType = localStorage.getItem('adhanType');
    const adhanData = localStorage.getItem('customAdhan');
    
    if (adhanData) {
        try {
            const audio = new Audio(adhanData);
            audio.volume = document.getElementById('adhanVolume')?.value / 100 || 0.8;
            audio.play().then(() => {
                alert('🎵 يتم تشغيل الأذان...');
            }).catch(() => {
                alert('❌ تعذر تشغيل الأذان');
            });
        } catch (error) {
            alert('❌ خطأ في تشغيل الأذان');
        }
    } else {
        // تشغيل الأذان الافتراضي
        playAdhanSound();
    }
}

function stopAdhan() {
    // إيقاف جميع الأصوات
    document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    alert('⏹️ تم إيقاف الأذان');
}

function updateAdhanVolume() {
    const volume = document.getElementById('adhanVolume')?.value || 80;
    const volumeDisplay = document.getElementById('volumeValue');
    if (volumeDisplay) {
        volumeDisplay.textContent = volume + '%';
    }
    localStorage.setItem('adhanVolume', volume);
}

function showSelectedFile() {
    const fileInput = document.getElementById('adhanFileUpload');
    const fileName = document.getElementById('selectedFileName');
    
    if (fileInput?.files[0] && fileName) {
        fileName.textContent = `تم اختيار: ${fileInput.files[0].name}`;
        fileName.style.color = '#4CAF50';
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
    
    alert(`معاينة المحتوى:\n\nالعنوان: ${title || 'المسبحة الإلكترونية'}\nالوصف: ${description || 'تطبيق إسلامي شامل'}`);
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

// === إدارة الأمان ===
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
    
    const credentials = { username: newUsername, password: newPassword };
    localStorage.setItem('adminCredentials', JSON.stringify(credentials));
    
    document.getElementById('newAdminUsername').value = '';
    document.getElementById('newAdminPassword').value = '';
    
    alert('✅ تم تغيير بيانات تسجيل الدخول بنجاح');
}

// === وظائف مساعدة ===
function exportAppSettings() {
    const settings = {
        customLogo: localStorage.getItem('customLogo'),
        customLogoImage: localStorage.getItem('customLogoImage'),
        selectedBackground: localStorage.getItem('selectedBackground'),
        manualPrayerTimes: localStorage.getItem('manualPrayerTimes'),
        customAzkarData: localStorage.getItem('customAzkarData'),
        adminCredentials: localStorage.getItem('adminCredentials'),
        appTitle: localStorage.getItem('appTitle'),
        themeColors: localStorage.getItem('themeColors'),
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasbih-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('✅ تم تصدير الإعدادات بنجاح');
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
                    
                    Object.keys(settings).forEach(key => {
                        if (key !== 'exportDate' && settings[key]) {
                            localStorage.setItem(key, settings[key]);
                        }
                    });
                    
                    alert('✅ تم استيراد الإعدادات بنجاح. سيتم إعادة تحميل الصفحة.');
                    location.reload();
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
    if (confirm('هل تريد حذف جميع الإعدادات والعودة للحالة الافتراضية؟')) {
        localStorage.clear();
        alert('✅ تم حذف جميع الإعدادات. سيتم إعادة تحميل الصفحة.');
        location.reload();
    }
}

console.log('🛠️ تم تحميل إصلاح لوحة التحكم الكامل');