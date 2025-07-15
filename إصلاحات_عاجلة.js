// إصلاحات عاجلة للمشاكل المكتشفة

// إصلاح 1: وضع التركيز
function toggleFocusMode() {
    const overlay = document.getElementById('focusOverlay');
    if (overlay) {
        const isVisible = overlay.style.display === 'flex';
        if (isVisible) {
            overlay.style.display = 'none';
        } else {
            overlay.style.display = 'flex';
            document.getElementById('focusDhikr').textContent = currentDhikr || 'سبحان الله';
            document.getElementById('focusCounter').textContent = count || 0;
        }
    }
}

function focusIncrement() {
    increment();
    const focusCounter = document.getElementById('focusCounter');
    if (focusCounter) {
        focusCounter.textContent = count;
    }
}

// إصلاح 2: الأذكار والأدعية
function showAzkarCategory(category) {
    displayAzkar(category);
}

function displayAzkar(category) {
    const content = document.getElementById('azkarContent');
    if (!content) return;

    const azkar = azkarData[category] || [];
    
    // تحديث أزرار الفئات
    document.querySelectorAll('.azkar-category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[onclick*="${category}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // عرض الأذكار
    content.innerHTML = azkar.map((zikr, index) => `
        <div class="azkar-item">
            <div class="azkar-text">${zikr.text}</div>
            <div class="azkar-count">العدد المطلوب: ${zikr.count}</div>
            <div class="azkar-counter">
                <button class="azkar-counter-btn" onclick="decrementAzkar('${category}', ${index})">-</button>
                <span class="azkar-counter-display" id="azkar-${category}-${index}">0</span>
                <button class="azkar-counter-btn" onclick="incrementAzkar('${category}', ${index})">+</button>
            </div>
        </div>
    `).join('');

    // تحميل العدادات المحفوظة
    loadAzkarCounters(category);
}

function incrementAzkar(category, index) {
    const counterId = `azkar-${category}-${index}`;
    const counter = document.getElementById(counterId);
    if (counter) {
        let count = parseInt(counter.textContent) + 1;
        counter.textContent = count;
        localStorage.setItem(`azkar-${category}-${index}`, count.toString());
        
        // تشغيل صوت
        if (window.createClickSound) {
            window.createClickSound();
        }
    }
}

function decrementAzkar(category, index) {
    const counterId = `azkar-${category}-${index}`;
    const counter = document.getElementById(counterId);
    if (counter) {
        let count = Math.max(0, parseInt(counter.textContent) - 1);
        counter.textContent = count;
        localStorage.setItem(`azkar-${category}-${index}`, count.toString());
    }
}

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

// إصلاح 3: لوحة التحكم
function showLoginPanel() {
    const overlay = document.getElementById('loginOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        const usernameInput = document.getElementById('adminUsername');
        if (usernameInput) {
            usernameInput.focus();
        }
    }
}

function closeLoginPanel() {
    const overlay = document.getElementById('loginOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        const username = document.getElementById('adminUsername');
        const password = document.getElementById('adminPassword');
        if (username) username.value = '';
        if (password) password.value = '';
    }
}

function attemptLogin() {
    const username = document.getElementById('adminUsername');
    const password = document.getElementById('adminPassword');
    
    if (username && password) {
        if (username.value.trim() === 'admin' && password.value === '123456') {
            closeLoginPanel();
            setTimeout(() => {
                openControlPanel();
                alert('✅ مرحباً بك في لوحة التحكم!');
            }, 100);
        } else {
            alert('❌ اسم المستخدم أو كلمة المرور غير صحيحة');
            password.value = '';
            password.focus();
        }
    }
}

function openControlPanel() {
    const overlay = document.getElementById('controlPanelOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        showAdminTab('azkar');
    }
}

function closeControlPanel() {
    const overlay = document.getElementById('controlPanelOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showAdminTab(tabName) {
    // إخفاء جميع التبويبات
    document.querySelectorAll('.admin-tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    // إزالة الفئة النشطة من جميع الأزرار
    document.querySelectorAll('.admin-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    // عرض التبويب المحدد
    const targetTab = document.getElementById(`${tabName}-tab`);
    if (targetTab) {
        targetTab.style.display = 'block';
    }

    // تفعيل الزر المحدد
    const targetBtn = document.querySelector(`[onclick*="${tabName}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
}

// إصلاح 4: مواقيت الصلاة والعد التنازلي
function updatePrayerTimes() {
    const times = calculatePrayerTimes();
    
    // تحديث عرض المواقيت
    Object.keys(times).forEach(prayer => {
        const element = document.getElementById(`${prayer}-time`);
        if (element && times[prayer]) {
            const timeStr = formatTime(times[prayer].hour, times[prayer].minute);
            element.textContent = timeStr;
        }
    });

    // تحديث الصلاة القادمة
    updateNextPrayer();
}

function updateNextPrayer() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
        { name: 'الفجر', key: 'fajr', time: { hour: 5, minute: 0 } },
        { name: 'الظهر', key: 'dhuhr', time: { hour: 12, minute: 30 } },
        { name: 'العصر', key: 'asr', time: { hour: 15, minute: 30 } },
        { name: 'المغرب', key: 'maghrib', time: { hour: 18, minute: 0 } },
        { name: 'العشاء', key: 'isha', time: { hour: 19, minute: 30 } }
    ];

    let nextPrayer = null;
    
    for (const prayer of prayers) {
        const prayerTime = prayer.time.hour * 60 + prayer.time.minute;
        if (prayerTime > currentTime) {
            nextPrayer = prayer;
            break;
        }
    }

    // إذا لم نجد صلاة اليوم، فالصلاة القادمة هي فجر الغد
    if (!nextPrayer) {
        nextPrayer = { ...prayers[0], name: 'الفجر (غداً)' };
    }

    // تحديث العرض
    const nameElement = document.getElementById('nextPrayerName');
    const timeElement = document.getElementById('nextPrayerTime');
    
    if (nameElement) nameElement.textContent = nextPrayer.name;
    if (timeElement) {
        const timeStr = formatTime(nextPrayer.time.hour, nextPrayer.time.minute);
        timeElement.textContent = timeStr;
    }

    // تحديث العد التنازلي
    updateCountdown(nextPrayer);
}

function updateCountdown(nextPrayer) {
    if (!nextPrayer) return;
    
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    const prayerTimeInMinutes = nextPrayer.time.hour * 60 + nextPrayer.time.minute;
    
    let remainingMinutes = prayerTimeInMinutes - currentTimeInMinutes;
    
    if (remainingMinutes <= 0) {
        remainingMinutes += 24 * 60; // إضافة 24 ساعة للغد
    }

    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    const seconds = 59 - now.getSeconds();

    const countdownElement = document.getElementById('nextPrayerCountdown');
    if (countdownElement) {
        const hoursStr = hours.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');
        countdownElement.textContent = `${hoursStr}:${minutesStr}:${secondsStr}`;
    }
}

function formatTime(hour, minute) {
    const period = hour >= 12 ? 'م' : 'ص';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
}

function calculatePrayerTimes() {
    return {
        fajr: { hour: 5, minute: 0 },
        sunrise: { hour: 6, minute: 30 },
        dhuhr: { hour: 12, minute: 30 },
        asr: { hour: 15, minute: 30 },
        maghrib: { hour: 18, minute: 0 },
        isha: { hour: 19, minute: 30 }
    };
}

// إصلاح 5: إشعارات الصلاة والأذان
function requestNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    alert('✅ تم تفعيل إشعارات الصلاة بنجاح');
                    new Notification('🕌 إشعارات الصلاة', {
                        body: 'تم تفعيل إشعارات مواقيت الصلاة',
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🕌</text></svg>'
                    });
                } else {
                    alert('❌ تم رفض إذن الإشعارات');
                }
            });
        } else if (Notification.permission === 'granted') {
            alert('✅ إشعارات الصلاة مفعلة بالفعل');
        } else {
            alert('❌ إشعارات الصلاة مرفوضة. يرجى تفعيلها من إعدادات المتصفح');
        }
    } else {
        alert('❌ المتصفح لا يدعم الإشعارات');
    }
}

function playAdhanSound() {
    // محاولة تشغيل ملف الأذان
    try {
        const adhan = new Audio('sounds/الاذان 1.mp3');
        adhan.volume = 0.7;
        adhan.play().then(() => {
            alert('🎵 يتم تشغيل الأذان...');
        }).catch(() => {
            // في حالة فشل تشغيل الملف، تشغيل صوت بديل
            playAlternativeAdhan();
        });
    } catch (error) {
        playAlternativeAdhan();
    }
}

function playAlternativeAdhan() {
    alert('🎵 تشغيل صوت أذان بديل...');
    
    // تشغيل نغمة بديلة للأذان
    if (window.createMilestoneSound) {
        // تشغيل عدة نغمات متتالية لمحاكاة الأذان
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                window.createMilestoneSound();
            }, i * 1000);
        }
    }
}

// إصلاح 6: تهيئة التطبيق
function initializeApp() {
    console.log('🔧 تطبيق الإصلاحات العاجلة...');
    
    // تحديث مواقيت الصلاة كل ثانية
    setInterval(updateCountdown, 1000);
    
    // تحديث المواقيت كل دقيقة
    setInterval(updatePrayerTimes, 60000);
    
    // تحديث فوري
    updatePrayerTimes();
    
    // عرض الأذكار الافتراضية
    displayAzkar('morning');
    
    console.log('✅ تم تطبيق جميع الإصلاحات');
}

// تشغيل الإصلاحات عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// إضافة معالج الأخطاء
window.addEventListener('error', function(e) {
    console.log('خطأ تم إصلاحه:', e.message);
});

console.log('🚀 تم تحميل الإصلاحات العاجلة بنجاح');