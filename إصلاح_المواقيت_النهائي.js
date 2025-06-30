// إصلاح المواقيت النهائي - ربط لوحة التحكم بالتطبيق

// متغير عام للمواقيت
let currentPrayerTimes = {
    fajr: { hour: 5, minute: 15 },
    dhuhr: { hour: 12, minute: 15 },
    asr: { hour: 15, minute: 30 },
    maghrib: { hour: 17, minute: 45 },
    isha: { hour: 19, minute: 15 }
};

// تحميل المواقيت المحفوظة
function loadSavedPrayerTimes() {
    const saved = localStorage.getItem('manualPrayerTimes');
    if (saved) {
        currentPrayerTimes = JSON.parse(saved);
        console.log('تم تحميل المواقيت المحفوظة:', currentPrayerTimes);
    }
}

// حفظ المواقيت من لوحة التحكم
function saveManualPrayerTimes() {
    const fajr = document.getElementById('fajrTime')?.value;
    const dhuhr = document.getElementById('dhuhrTime')?.value;
    const asr = document.getElementById('asrTime')?.value;
    const maghrib = document.getElementById('maghribTime')?.value;
    const isha = document.getElementById('ishaTime')?.value;
    
    if (fajr && dhuhr && asr && maghrib && isha) {
        currentPrayerTimes = {
            fajr: parseTimeInput(fajr),
            dhuhr: parseTimeInput(dhuhr),
            asr: parseTimeInput(asr),
            maghrib: parseTimeInput(maghrib),
            isha: parseTimeInput(isha)
        };
        
        localStorage.setItem('manualPrayerTimes', JSON.stringify(currentPrayerTimes));
        
        // تحديث العرض فوراً
        updateAllPrayerDisplays();
        
        alert('✅ تم حفظ مواقيت الصلاة وتحديث التطبيق');
        console.log('تم حفظ المواقيت الجديدة:', currentPrayerTimes);
    } else {
        alert('⚠️ يرجى ملء جميع الحقول');
    }
}

// تحويل وقت الإدخال
function parseTimeInput(timeStr) {
    const [hour, minute] = timeStr.split(':').map(Number);
    return { hour, minute };
}

// تحديث جميع عروض المواقيت
function updateAllPrayerDisplays() {
    // تحديث جدول المواقيت
    updatePrayerTimesTable();
    
    // تحديث الصلاة القادمة
    updateNextPrayerDisplay();
    
    console.log('تم تحديث جميع عروض المواقيت');
}

// تحديث جدول المواقيت
function updatePrayerTimesTable() {
    Object.keys(currentPrayerTimes).forEach(prayer => {
        const element = document.getElementById(`${prayer}-time`);
        if (element && currentPrayerTimes[prayer]) {
            const timeStr = formatTime(currentPrayerTimes[prayer].hour, currentPrayerTimes[prayer].minute);
            element.textContent = timeStr;
        }
    });
    
    // تحديث الشروق (بعد الفجر بساعة ونصف)
    const sunriseElement = document.getElementById('sunrise-time');
    if (sunriseElement && currentPrayerTimes.fajr) {
        const sunriseHour = currentPrayerTimes.fajr.hour + 1;
        const sunriseMinute = currentPrayerTimes.fajr.minute + 30;
        const timeStr = formatTime(sunriseHour, sunriseMinute);
        sunriseElement.textContent = timeStr;
    }
}

// تحديث الصلاة القادمة
function updateNextPrayerDisplay() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
        { name: 'الفجر', key: 'fajr', time: currentPrayerTimes.fajr },
        { name: 'الظهر', key: 'dhuhr', time: currentPrayerTimes.dhuhr },
        { name: 'العصر', key: 'asr', time: currentPrayerTimes.asr },
        { name: 'المغرب', key: 'maghrib', time: currentPrayerTimes.maghrib },
        { name: 'العشاء', key: 'isha', time: currentPrayerTimes.isha }
    ];

    let nextPrayer = null;
    
    // البحث عن الصلاة القادمة
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
    updateCountdownDisplay(nextPrayer);
    
    console.log(`الصلاة القادمة: ${nextPrayer.name} في ${formatTime(nextPrayer.time.hour, nextPrayer.time.minute)}`);
}

// تحديث العد التنازلي
function updateCountdownDisplay(nextPrayer) {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    const prayerTimeInMinutes = nextPrayer.time.hour * 60 + nextPrayer.time.minute;
    
    let remainingMinutes = prayerTimeInMinutes - currentTimeInMinutes;
    
    // إذا كانت الصلاة غداً
    if (remainingMinutes <= 0) {
        remainingMinutes += 24 * 60;
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

// تنسيق الوقت
function formatTime(hour, minute) {
    const period = hour >= 12 ? 'م' : 'ص';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
}

// تحميل المواقيت الحالية في لوحة التحكم
function loadCurrentPrayerTimes() {
    loadSavedPrayerTimes();
    
    // ملء الحقول في لوحة التحكم
    if (document.getElementById('fajrTime')) {
        document.getElementById('fajrTime').value = `${currentPrayerTimes.fajr.hour.toString().padStart(2, '0')}:${currentPrayerTimes.fajr.minute.toString().padStart(2, '0')}`;
        document.getElementById('dhuhrTime').value = `${currentPrayerTimes.dhuhr.hour.toString().padStart(2, '0')}:${currentPrayerTimes.dhuhr.minute.toString().padStart(2, '0')}`;
        document.getElementById('asrTime').value = `${currentPrayerTimes.asr.hour.toString().padStart(2, '0')}:${currentPrayerTimes.asr.minute.toString().padStart(2, '0')}`;
        document.getElementById('maghribTime').value = `${currentPrayerTimes.maghrib.hour.toString().padStart(2, '0')}:${currentPrayerTimes.maghrib.minute.toString().padStart(2, '0')}`;
        document.getElementById('ishaTime').value = `${currentPrayerTimes.isha.hour.toString().padStart(2, '0')}:${currentPrayerTimes.isha.minute.toString().padStart(2, '0')}`;
    }
}

// العودة للمواقيت التلقائية
function disableManualPrayerTimes() {
    localStorage.removeItem('manualPrayerTimes');
    
    // إعادة تعيين المواقيت الافتراضية
    currentPrayerTimes = {
        fajr: { hour: 5, minute: 15 },
        dhuhr: { hour: 12, minute: 15 },
        asr: { hour: 15, minute: 30 },
        maghrib: { hour: 17, minute: 45 },
        isha: { hour: 19, minute: 15 }
    };
    
    // تحديث العرض
    updateAllPrayerDisplays();
    loadCurrentPrayerTimes();
    
    alert('✅ تم العودة للمواقيت التلقائية');
}

// تهيئة المواقيت
function initializePrayerTimes() {
    console.log('🕌 تهيئة نظام المواقيت...');
    
    // تحميل المواقيت المحفوظة
    loadSavedPrayerTimes();
    
    // تحديث العرض الأولي
    updateAllPrayerDisplays();
    
    // تحديث كل ثانية للعد التنازلي
    setInterval(() => {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const prayers = [
            { name: 'الفجر', key: 'fajr', time: currentPrayerTimes.fajr },
            { name: 'الظهر', key: 'dhuhr', time: currentPrayerTimes.dhuhr },
            { name: 'العصر', key: 'asr', time: currentPrayerTimes.asr },
            { name: 'المغرب', key: 'maghrib', time: currentPrayerTimes.maghrib },
            { name: 'العشاء', key: 'isha', time: currentPrayerTimes.isha }
        ];

        let nextPrayer = null;
        for (const prayer of prayers) {
            const prayerTime = prayer.time.hour * 60 + prayer.time.minute;
            if (prayerTime > currentTime) {
                nextPrayer = prayer;
                break;
            }
        }

        if (!nextPrayer) {
            nextPrayer = { ...prayers[0], name: 'الفجر (غداً)' };
        }

        updateCountdownDisplay(nextPrayer);
    }, 1000);
    
    // تحديث كل دقيقة للصلاة القادمة
    setInterval(updateNextPrayerDisplay, 60000);
    
    console.log('✅ تم تهيئة نظام المواقيت بنجاح');
}

// تشغيل التهيئة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePrayerTimes);
} else {
    initializePrayerTimes();
}

console.log('🔧 تم تحميل إصلاح المواقيت النهائي');