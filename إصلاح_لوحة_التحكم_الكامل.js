// إصلاح شامل للوحة التحكم

// وظائف إدارة المواقيت
function updatePrayerTime(prayer) {
    const input = document.getElementById(`${prayer}Time`);
    if (input && input.value) {
        const [hour, minute] = input.value.split(':');
        if (typeof PRAYER_TIMES !== 'undefined') {
            PRAYER_TIMES[prayer] = {
                hour: parseInt(hour),
                minute: parseInt(minute),
                name: PRAYER_TIMES[prayer]?.name || prayer
            };
            savePrayerTimes();
            if (typeof updatePrayerTimesTable === 'function') updatePrayerTimesTable();
            if (typeof updateNextPrayerDisplay === 'function') updateNextPrayerDisplay();
        }
    }
}

function savePrayerTimes() {
    if (typeof PRAYER_TIMES !== 'undefined') {
        localStorage.setItem('customPrayerTimes', JSON.stringify(PRAYER_TIMES));
        alert('✅ تم حفظ مواقيت الصلاة');
    }
}

function resetPrayerTimes() {
    if (confirm('هل تريد إعادة تعيين مواقيت الصلاة للقيم الافتراضية؟')) {
        if (typeof PRAYER_TIMES !== 'undefined') {
            PRAYER_TIMES.fajr = { hour: 4, minute: 12, name: 'الفجر' };
            PRAYER_TIMES.dhuhr = { hour: 12, minute: 59, name: 'الظهر' };
            PRAYER_TIMES.asr = { hour: 16, minute: 33, name: 'العصر' };
            PRAYER_TIMES.maghrib = { hour: 19, minute: 59, name: 'المغرب' };
            PRAYER_TIMES.isha = { hour: 21, minute: 32, name: 'العشاء' };
            
            // تحديث الحقول
            Object.keys(PRAYER_TIMES).forEach(prayer => {
                const input = document.getElementById(`${prayer}Time`);
                if (input) {
                    const time = PRAYER_TIMES[prayer];
                    input.value = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
                }
            });
            
            savePrayerTimes();
            if (typeof updatePrayerTimesTable === 'function') updatePrayerTimesTable();
            if (typeof updateNextPrayerDisplay === 'function') updateNextPrayerDisplay();
        }
    }
}

// وظائف إدارة الأذان
function togglePrayerAdhan(prayer) {
    const checkbox = document.getElementById(`${prayer}AdhanEnabled`);
    if (checkbox) {
        const isEnabled = checkbox.checked;
        localStorage.setItem(`${prayer}AdhanEnabled`, isEnabled);
        console.log(`تم ${isEnabled ? 'تفعيل' : 'إيقاف'} أذان ${prayer}`);
    }
}

function testAdhan() {
    try {
        const adhan = new Audio('sounds/الاذان 1.mp3');
        adhan.volume = 0.8;
        adhan.play().catch(() => {
            alert('❌ لا يمكن تشغيل الأذان. تأكد من وجود ملف الصوت');
        });
    } catch (e) {
        alert('❌ خطأ في تشغيل الأذان');
    }
}

function saveAdhanSettings() {
    alert('✅ تم حفظ إعدادات الأذان');
}

function stopAdhan() {
    // إيقاف جميع الأصوات
    document.querySelectorAll('audio').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    alert('⏹️ تم إيقاف الأذان');
}

// وظائف إدارة الأذكار
function addNewAzkar() {
    const category = document.getElementById('newAzkarCategory')?.value;
    const text = document.getElementById('newAzkarText')?.value?.trim();
    const count = parseInt(document.getElementById('newAzkarCount')?.value) || 1;
    
    if (!text) {
        alert('⚠️ يرجى إدخال نص الذكر');
        return;
    }
    
    if (typeof azkarData !== 'undefined') {
        if (!azkarData[category]) azkarData[category] = [];
        azkarData[category].push({ text, count });
        localStorage.setItem('customAzkarData', JSON.stringify(azkarData));
        
        // تنظيف النموذج
        document.getElementById('newAzkarText').value = '';
        document.getElementById('newAzkarCount').value = '1';
        
        alert('✅ تم إضافة الذكر بنجاح');
    }
}

function previewAzkar() {
    const category = document.getElementById('newAzkarCategory')?.value;
    const text = document.getElementById('newAzkarText')?.value?.trim();
    const count = document.getElementById('newAzkarCount')?.value;
    
    if (!text) {
        alert('⚠️ يرجى إدخال نص الذكر أولاً');
        return;
    }
    
    alert(`معاينة الذكر:\n\nالفئة: ${category}\nالنص: ${text}\nالعدد: ${count}`);
}

function loadAzkarForEdit() {
    const category = document.getElementById('editAzkarCategory')?.value;
    const listContainer = document.getElementById('azkarEditList');
    
    if (!listContainer || typeof azkarData === 'undefined') return;
    
    const azkar = azkarData[category] || [];
    listContainer.innerHTML = azkar.map((zikr, index) => `
        <div class="azkar-edit-item" style="margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
            <div style="margin-bottom: 5px;"><strong>الذكر ${index + 1}:</strong></div>
            <div style="margin-bottom: 5px;">${zikr.text}</div>
            <div style="margin-bottom: 10px;">العدد: ${zikr.count}</div>
            <button onclick="editAzkar('${category}', ${index})" style="margin-right: 5px; padding: 5px 10px; background: #2196F3; color: white; border: none; border-radius: 3px;">✏️ تعديل</button>
            <button onclick="deleteAzkar('${category}', ${index})" style="padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 3px;">🗑️ حذف</button>
        </div>
    `).join('');
}

function editAzkar(category, index) {
    if (typeof azkarData === 'undefined') return;
    
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
    if (typeof azkarData === 'undefined') return;
    
    if (confirm('هل تريد حذف هذا الذكر؟')) {
        azkarData[category].splice(index, 1);
        localStorage.setItem('customAzkarData', JSON.stringify(azkarData));
        loadAzkarForEdit();
        alert('✅ تم حذف الذكر بنجاح');
    }
}

// وظائف إدارة الشعار
function previewLogo() {
    const fileInput = document.getElementById('logoUpload');
    const file = fileInput?.files[0];
    
    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('❌ يرجى اختيار ملف صورة صحيح');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const currentLogo = document.getElementById('currentLogo');
            if (currentLogo) {
                currentLogo.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }
}

function previewLogoFromUrl() {
    const logoUrl = document.getElementById('logoUrl')?.value?.trim();
    if (logoUrl) {
        const currentLogo = document.getElementById('currentLogo');
        if (currentLogo) {
            currentLogo.src = logoUrl;
        }
    }
}

function selectIcon(icon, button) {
    document.querySelectorAll('.icon-btn').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    
    const currentLogo = document.getElementById('currentLogo');
    if (currentLogo) {
        currentLogo.src = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${icon}</text></svg>`;
    }
}

function applyNewLogo() {
    const currentLogo = document.getElementById('currentLogo');
    if (currentLogo && currentLogo.src) {
        const bannerEmoji = document.querySelector('.banner-emoji');
        if (bannerEmoji) {
            if (currentLogo.src.includes('data:image/svg+xml')) {
                const match = currentLogo.src.match(/>([^<]+)</);
                if (match) {
                    bannerEmoji.textContent = match[1];
                }
            } else {
                bannerEmoji.innerHTML = `<img src="${currentLogo.src}" alt="شعار" style="width: 40px; height: 40px; border-radius: 5px;">`;
            }
            localStorage.setItem('customLogo', currentLogo.src);
            alert('✅ تم تطبيق الشعار بنجاح!');
        }
    }
}

function resetLogo() {
    const bannerEmoji = document.querySelector('.banner-emoji');
    const currentLogo = document.getElementById('currentLogo');
    
    if (bannerEmoji) {
        bannerEmoji.textContent = '📿';
        localStorage.removeItem('customLogo');
    }
    
    if (currentLogo) {
        currentLogo.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📿</text></svg>";
    }
    
    alert('✅ تم استعادة الشعار الافتراضي');
}

// وظائف إدارة المحتوى
function updateAppContent() {
    const title = document.getElementById('appTitle')?.value;
    const description = document.getElementById('appDescription')?.value;
    
    if (title) {
        const titleElement = document.querySelector('.banner h1');
        if (titleElement) titleElement.textContent = title;
        localStorage.setItem('appTitle', title);
    }
    
    if (description) {
        localStorage.setItem('appDescription', description);
    }
    
    alert('✅ تم حفظ التغييرات');
}

function previewContent() {
    const title = document.getElementById('appTitle')?.value;
    const description = document.getElementById('appDescription')?.value;
    
    alert(`معاينة المحتوى:\n\nالعنوان: ${title}\nالوصف: ${description}`);
}

// وظائف الأمان
function changeAdminCredentials() {
    const newUsername = document.getElementById('newAdminUsername')?.value?.trim();
    const newPassword = document.getElementById('newAdminPassword')?.value;
    
    if (!newUsername || !newPassword) {
        alert('⚠️ يرجى ملء جميع الحقول');
        return;
    }
    
    localStorage.setItem('adminCredentials', JSON.stringify({
        username: newUsername,
        password: newPassword
    }));
    
    alert('✅ تم تغيير بيانات الدخول بنجاح');
    
    // تنظيف الحقول
    document.getElementById('newAdminUsername').value = '';
    document.getElementById('newAdminPassword').value = '';
}

function resetToDefault() {
    if (confirm('هل تريد إعادة تعيين بيانات الدخول للقيم الافتراضية؟')) {
        localStorage.removeItem('adminCredentials');
        alert('✅ تم إعادة تعيين بيانات الدخول للقيم الافتراضية');
    }
}

// تهيئة لوحة التحكم
function initControlPanel() {
    // تحميل الإعدادات المحفوظة
    setTimeout(() => {
        // تحميل إعدادات الأذان
        ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(prayer => {
            const checkbox = document.getElementById(`${prayer}AdhanEnabled`);
            const saved = localStorage.getItem(`${prayer}AdhanEnabled`);
            if (checkbox && saved !== null) {
                checkbox.checked = JSON.parse(saved);
            } else if (checkbox) {
                checkbox.checked = true; // افتراضي مفعل
            }
        });
        
        // تحميل المحتوى المحفوظ
        const savedTitle = localStorage.getItem('appTitle');
        if (savedTitle) {
            const titleInput = document.getElementById('appTitle');
            if (titleInput) titleInput.value = savedTitle;
        }
        
        const savedDescription = localStorage.getItem('appDescription');
        if (savedDescription) {
            const descInput = document.getElementById('appDescription');
            if (descInput) descInput.value = savedDescription;
        }
    }, 1000);
}

// تشغيل التهيئة
document.addEventListener('DOMContentLoaded', initControlPanel);

console.log('✅ تم تحميل إصلاحات لوحة التحكم الكاملة');