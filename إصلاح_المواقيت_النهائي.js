// إصلاح مواقيت الصلاة النهائي

// متغيرات المواقيت
let prayerTimes = {
    fajr: '04:12',
    sunrise: '05:58',
    dhuhr: '12:59', 
    asr: '16:33',
    maghrib: '19:59',
    isha: '21:32'
};

let adhanEnabled = true;
let prayerAdhanSettings = {
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true
};

// تحديث مواقيت الصلاة في الواجهة
function updatePrayerTimesDisplay() {
    const prayerNames = {
        fajr: 'الفجر',
        dhuhr: 'الظهر', 
        asr: 'العصر',
        maghrib: 'المغرب',
        isha: 'العشاء'
    };

    Object.keys(prayerTimes).forEach(prayer => {
        const element = document.getElementById(`${prayer}-time`);
        if (element) {
            element.textContent = formatTime(prayerTimes[prayer]);
        }
    });

    updateNextPrayer();
}

// تنسيق الوقت
function formatTime(timeStr) {
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour);
    const period = h >= 12 ? 'م' : 'ص';
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${minute} ${period}`;
}

// تحديث الصلاة القادمة
function updateNextPrayer() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    console.log(`الوقت الحالي: ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} (بالدقائق: ${currentTime})`);
    
    const prayerNames = {
        fajr: 'الفجر',
        dhuhr: 'الظهر',
        asr: 'العصر', 
        maghrib: 'المغرب',
        isha: 'العشاء'
    };

    // ترتيب الصلوات
    const prayerOrder = [
        {key: 'fajr', time: '04:12'},
        {key: 'dhuhr', time: '12:59'},
        {key: 'asr', time: '16:33'},
        {key: 'maghrib', time: '19:59'},
        {key: 'isha', time: '21:32'}
    ];
    
    let nextPrayer = null;
    let nextTime = null;

    for (const prayer of prayerOrder) {
        const [hour, minute] = prayer.time.split(':');
        const prayerTime = parseInt(hour) * 60 + parseInt(minute);
        
        console.log(`${prayer.key}: ${prayer.time} (بالدقائق: ${prayerTime})`);
        
        if (prayerTime > currentTime) {
            nextPrayer = prayerNames[prayer.key];
            nextTime = prayer.time;
            console.log(`الصلاة القادمة: ${nextPrayer}`);
            break;
        }
    }

    // إذا لم نجد صلاة اليوم
    if (!nextPrayer) {
        nextPrayer = 'الفجر (غداً)';
        nextTime = '04:12';
        console.log('لم توجد صلاة متبقية - القادمة هي فجر الغد');
    }

    // تحديث العرض
    const nameElement = document.getElementById('nextPrayerName');
    const timeElement = document.getElementById('nextPrayerTime');
    
    if (nameElement) nameElement.textContent = nextPrayer;
    if (timeElement) timeElement.textContent = formatTime(nextTime);

    updateCountdown(nextTime);
}

// تحديث العد التنازلي
function updateCountdown(nextTime) {
    const now = new Date();
    const [hour, minute] = nextTime.split(':');
    
    const nextPrayerTime = new Date();
    nextPrayerTime.setHours(parseInt(hour), parseInt(minute), 0, 0);
    
    // إذا كان الوقت قد مضى اليوم، اجعله غداً
    if (nextPrayerTime <= now) {
        nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
    }
    
    const diff = nextPrayerTime - now;
    let hours = Math.floor(diff / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // إصلاح العد التنازلي - إذا كان أكثر من 12 ساعة
    if (hours > 12) {
        hours = hours - 12;
    }
    
    const countdownElement = document.getElementById('nextPrayerCountdown');
    if (countdownElement) {
        countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// فحص مواقيت الصلاة للأذان
function checkPrayerTimes() {
    if (!adhanEnabled) return;
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    Object.keys(prayerTimes).forEach(prayer => {
        if (prayerTimes[prayer] === currentTime && prayerAdhanSettings[prayer]) {
            showPrayerNotification(prayer);
        }
    });
}

// عرض إشعار الصلاة
function showPrayerNotification(prayer) {
    const prayerNames = {
        fajr: 'الفجر',
        dhuhr: 'الظهر',
        asr: 'العصر',
        maghrib: 'المغرب', 
        isha: 'العشاء'
    };
    
    const prayerName = prayerNames[prayer];
    
    if (confirm(`🕌 حان وقت صلاة ${prayerName}\n\nهل تريد تشغيل الأذان؟`)) {
        playAdhanSound();
    }
}

// تشغيل صوت الأذان
function playAdhanSound() {
    try {
        const adhan = new Audio('sounds/الاذان 1.mp3');
        adhan.volume = 0.8;
        adhan.play().catch(() => {});
    } catch (e) {}
}

// وظائف لوحة التحكم
function updatePrayerTime(prayer) {
    const input = document.getElementById(`${prayer}Time`);
    if (input) {
        prayerTimes[prayer] = input.value;
        savePrayerTimes();
        updatePrayerTimesDisplay();
    }
}

function savePrayerTimes() {
    localStorage.setItem('prayerTimes', JSON.stringify(prayerTimes));
    localStorage.setItem('prayerAdhanSettings', JSON.stringify(prayerAdhanSettings));
    alert('✅ تم حفظ مواقيت الصلاة');
    updatePrayerTimesDisplay();
}

function resetPrayerTimes() {
    if (confirm('هل تريد إعادة تعيين مواقيت الصلاة للقيم الافتراضية؟')) {
        prayerTimes = {
            fajr: '04:12',
            sunrise: '05:58',
            dhuhr: '12:59',
            asr: '16:33', 
            maghrib: '19:59',
            isha: '21:32'
        };
        
        // تحديث الحقول في لوحة التحكم
        Object.keys(prayerTimes).forEach(prayer => {
            const input = document.getElementById(`${prayer}Time`);
            if (input) input.value = prayerTimes[prayer];
        });
        
        savePrayerTimes();
    }
}

function toggleAdhan() {
    adhanEnabled = !adhanEnabled;
    const toggle = document.getElementById('adhanToggle');
    if (toggle) {
        toggle.classList.toggle('active', adhanEnabled);
    }
    localStorage.setItem('adhanEnabled', adhanEnabled);
}

function togglePrayerAdhan(prayer) {
    const checkbox = document.getElementById(`${prayer}AdhanEnabled`);
    if (checkbox) {
        prayerAdhanSettings[prayer] = checkbox.checked;
        localStorage.setItem('prayerAdhanSettings', JSON.stringify(prayerAdhanSettings));
    }
}

// تحميل الإعدادات المحفوظة
function loadPrayerSettings() {
    const savedTimes = localStorage.getItem('prayerTimes');
    if (savedTimes) {
        prayerTimes = JSON.parse(savedTimes);
    }
    
    const savedAdhanSettings = localStorage.getItem('prayerAdhanSettings');
    if (savedAdhanSettings) {
        prayerAdhanSettings = JSON.parse(savedAdhanSettings);
    }
    
    const savedAdhanEnabled = localStorage.getItem('adhanEnabled');
    if (savedAdhanEnabled !== null) {
        adhanEnabled = JSON.parse(savedAdhanEnabled);
    }
    
    // تحديث الواجهة
    setTimeout(() => {
        Object.keys(prayerTimes).forEach(prayer => {
            const input = document.getElementById(`${prayer}Time`);
            if (input) input.value = prayerTimes[prayer];
            
            const checkbox = document.getElementById(`${prayer}AdhanEnabled`);
            if (checkbox) checkbox.checked = prayerAdhanSettings[prayer];
        });
        
        const adhanToggle = document.getElementById('adhanToggle');
        if (adhanToggle) {
            adhanToggle.classList.toggle('active', adhanEnabled);
        }
        
        updatePrayerTimesDisplay();
    }, 1000);
}

// تهيئة النظام
document.addEventListener('DOMContentLoaded', function() {
    loadPrayerSettings();
    
    // تحديث كل دقيقة
    setInterval(() => {
        updateNextPrayer();
        checkPrayerTimes();
    }, 60000);
    
    // تحديث العد التنازلي كل ثانية
    setInterval(() => {
        const nextTimeElement = document.getElementById('nextPrayerTime');
        if (nextTimeElement && nextTimeElement.textContent) {
            const timeText = nextTimeElement.textContent.replace(/[صم]/g, '').trim();
            updateCountdown(timeText);
        }
    }, 1000);
});

console.log('✅ تم تحميل نظام مواقيت الصلاة النهائي');