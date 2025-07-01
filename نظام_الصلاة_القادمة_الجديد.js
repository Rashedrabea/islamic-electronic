// نظام الصلاة القادمة الجديد - مبني من الصفر

// مواقيت الصلاة الثابتة
const PRAYER_TIMES = {
    fajr: { hour: 4, minute: 12, name: 'الفجر' },
    dhuhr: { hour: 12, minute: 59, name: 'الظهر' },
    asr: { hour: 16, minute: 33, name: 'العصر' },
    maghrib: { hour: 19, minute: 59, name: 'المغرب' },
    isha: { hour: 21, minute: 32, name: 'العشاء' }
};

// حساب الصلاة القادمة
function calculateNextPrayer() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    // تحويل مواقيت الصلاة إلى دقائق
    const prayerMinutes = [
        { key: 'fajr', minutes: PRAYER_TIMES.fajr.hour * 60 + PRAYER_TIMES.fajr.minute, name: PRAYER_TIMES.fajr.name },
        { key: 'dhuhr', minutes: PRAYER_TIMES.dhuhr.hour * 60 + PRAYER_TIMES.dhuhr.minute, name: PRAYER_TIMES.dhuhr.name },
        { key: 'asr', minutes: PRAYER_TIMES.asr.hour * 60 + PRAYER_TIMES.asr.minute, name: PRAYER_TIMES.asr.name },
        { key: 'maghrib', minutes: PRAYER_TIMES.maghrib.hour * 60 + PRAYER_TIMES.maghrib.minute, name: PRAYER_TIMES.maghrib.name },
        { key: 'isha', minutes: PRAYER_TIMES.isha.hour * 60 + PRAYER_TIMES.isha.minute, name: PRAYER_TIMES.isha.name }
    ];
    
    // البحث عن الصلاة القادمة
    for (const prayer of prayerMinutes) {
        if (prayer.minutes > currentMinutes) {
            return {
                name: prayer.name,
                hour: Math.floor(prayer.minutes / 60),
                minute: prayer.minutes % 60,
                isToday: true
            };
        }
    }
    
    // إذا لم توجد صلاة اليوم، الصلاة القادمة هي الفجر غداً
    return {
        name: 'الفجر (غداً)',
        hour: PRAYER_TIMES.fajr.hour,
        minute: PRAYER_TIMES.fajr.minute,
        isToday: false
    };
}

// حساب العد التنازلي
function calculateCountdown(nextPrayer) {
    const now = new Date();
    const target = new Date();
    
    target.setHours(nextPrayer.hour, nextPrayer.minute, 0, 0);
    
    // إذا كانت الصلاة غداً
    if (!nextPrayer.isToday) {
        target.setDate(target.getDate() + 1);
    }
    
    const diff = target - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    };
}

// تنسيق الوقت للعرض
function formatPrayerTime(hour, minute) {
    const period = hour >= 12 ? 'م' : 'ص';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

// تحديث عرض الصلاة القادمة
function updateNextPrayerDisplay() {
    const nextPrayer = calculateNextPrayer();
    const countdown = calculateCountdown(nextPrayer);
    
    // تحديث العناصر
    const nameElement = document.getElementById('nextPrayerName');
    const timeElement = document.getElementById('nextPrayerTime');
    const countdownElement = document.getElementById('nextPrayerCountdown');
    
    if (nameElement) {
        nameElement.textContent = nextPrayer.name;
    }
    
    if (timeElement) {
        timeElement.textContent = formatPrayerTime(nextPrayer.hour, nextPrayer.minute);
    }
    
    if (countdownElement) {
        countdownElement.textContent = countdown.formatted;
    }
}

// تحديث مواقيت الصلاة في الجدول
function updatePrayerTimesTable() {
    Object.keys(PRAYER_TIMES).forEach(prayer => {
        const element = document.getElementById(`${prayer}-time`);
        if (element) {
            const time = PRAYER_TIMES[prayer];
            element.textContent = formatPrayerTime(time.hour, time.minute);
        }
    });
    
    // تحديث الشروق
    const sunriseElement = document.getElementById('sunrise-time');
    if (sunriseElement) {
        sunriseElement.textContent = formatPrayerTime(5, 58);
    }
}

// تهيئة النظام
function initNewPrayerSystem() {
    console.log('🕌 تهيئة نظام الصلاة القادمة الجديد...');
    
    // تحديث فوري
    updatePrayerTimesTable();
    updateNextPrayerDisplay();
    
    // تحديث كل ثانية
    setInterval(updateNextPrayerDisplay, 1000);
    
    console.log('✅ تم تهيئة نظام الصلاة القادمة بنجاح');
}

// تشغيل النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initNewPrayerSystem, 1000);
});

console.log('📿 تم تحميل نظام الصلاة القادمة الجديد');