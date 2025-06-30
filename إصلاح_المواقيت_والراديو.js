// إصلاح مواقيت الصلاة والراديو

// إصلاح 1: مواقيت الصلاة الصحيحة حسب الوقت الحالي
function getCorrectPrayerTimes() {
    const now = new Date();
    const currentHour = now.getHours();
    
    // مواقيت تقريبية (يمكن تعديلها حسب المنطقة)
    return {
        fajr: { hour: 5, minute: 15 },
        sunrise: { hour: 6, minute: 45 },
        dhuhr: { hour: 12, minute: 15 },
        asr: { hour: 15, minute: 30 },
        maghrib: { hour: 17, minute: 45 }, // وقت المغرب الصحيح
        isha: { hour: 19, minute: 15 }
    };
}

// إصلاح 2: تحديد الصلاة القادمة بدقة
function updateNextPrayer() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
        { name: 'الفجر', key: 'fajr', time: { hour: 5, minute: 15 } },
        { name: 'الظهر', key: 'dhuhr', time: { hour: 12, minute: 15 } },
        { name: 'العصر', key: 'asr', time: { hour: 15, minute: 30 } },
        { name: 'المغرب', key: 'maghrib', time: { hour: 17, minute: 45 } },
        { name: 'العشاء', key: 'isha', time: { hour: 19, minute: 15 } }
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
    updateCountdown(nextPrayer);
    
    console.log(`الصلاة القادمة: ${nextPrayer.name} في ${formatTime(nextPrayer.time.hour, nextPrayer.time.minute)}`);
}

// إصلاح 3: العد التنازلي الدقيق
function updateCountdown(nextPrayer) {
    if (!nextPrayer) return;
    
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

// إصلاح 4: تحديث مواقيت الصلاة
function updatePrayerTimes() {
    const times = getCorrectPrayerTimes();
    
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

// إصلاح 5: الراديو - متغيرات عامة
let radioAudio = null;
let isRadioPlaying = false;

// إصلاح 6: تشغيل الراديو
function toggleRadio() {
    const playBtn = document.getElementById('playRadio');
    const stationSelect = document.getElementById('radioStation');
    
    if (!playBtn || !stationSelect) {
        console.log('عناصر الراديو غير موجودة');
        return;
    }

    if (!isRadioPlaying) {
        // تشغيل الراديو
        const stationUrl = stationSelect.value;
        console.log('محاولة تشغيل:', stationUrl);
        
        // إيقاف الراديو السابق إن وجد
        if (radioAudio) {
            radioAudio.pause();
            radioAudio = null;
        }
        
        radioAudio = new Audio(stationUrl);
        radioAudio.volume = document.getElementById('volumeSlider')?.value / 100 || 0.5;
        radioAudio.crossOrigin = "anonymous";
        
        radioAudio.play().then(() => {
            isRadioPlaying = true;
            playBtn.textContent = '⏸️ إيقاف مؤقت';
            console.log('تم تشغيل الراديو بنجاح');
        }).catch((error) => {
            console.log('خطأ في تشغيل الراديو:', error);
            // جرب محطة بديلة
            tryAlternativeStation();
        });
    } else {
        // إيقاف مؤقت
        pauseRadio();
    }
}

// إصلاح 7: محطات راديو بديلة تعمل
function tryAlternativeStation() {
    const alternativeStations = [
        'https://live.mp3quran.net:8006/stream',
        'https://live.mp3quran.net:8002/stream',
        'https://live.mp3quran.net:8004/stream'
    ];
    
    let stationIndex = 0;
    
    function tryNext() {
        if (stationIndex >= alternativeStations.length) {
            alert('❌ تعذر الاتصال بمحطات الراديو. تحقق من الاتصال بالإنترنت.');
            return;
        }
        
        const stationUrl = alternativeStations[stationIndex];
        console.log(`جاري تجربة المحطة البديلة ${stationIndex + 1}:`, stationUrl);
        
        radioAudio = new Audio(stationUrl);
        radioAudio.volume = 0.5;
        
        radioAudio.play().then(() => {
            isRadioPlaying = true;
            const playBtn = document.getElementById('playRadio');
            if (playBtn) playBtn.textContent = '⏸️ إيقاف مؤقت';
            console.log('تم تشغيل المحطة البديلة بنجاح');
        }).catch(() => {
            stationIndex++;
            tryNext();
        });
    }
    
    tryNext();
}

// إصلاح 8: إيقاف مؤقت للراديو
function pauseRadio() {
    const playBtn = document.getElementById('playRadio');
    
    if (radioAudio && isRadioPlaying) {
        radioAudio.pause();
        isRadioPlaying = false;
        if (playBtn) {
            playBtn.textContent = '▶️ تشغيل';
        }
        console.log('تم إيقاف الراديو مؤقتاً');
    }
}

// إصلاح 9: إيقاف الراديو نهائياً
function stopRadio() {
    const playBtn = document.getElementById('playRadio');
    
    if (radioAudio) {
        radioAudio.pause();
        radioAudio.currentTime = 0;
        radioAudio = null;
    }
    
    isRadioPlaying = false;
    if (playBtn) {
        playBtn.textContent = '▶️ تشغيل';
    }
    console.log('تم إيقاف الراديو نهائياً');
}

// إصلاح 10: تعديل مستوى الصوت
function setVolume(value) {
    if (radioAudio) {
        radioAudio.volume = value / 100;
        console.log('تم تعديل مستوى الصوت إلى:', value + '%');
    }
}

// إصلاح 11: تنسيق الوقت
function formatTime(hour, minute) {
    const period = hour >= 12 ? 'م' : 'ص';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
}

// إصلاح 12: تهيئة المواقيت والراديو
function initializePrayerAndRadio() {
    console.log('🕌 تهيئة مواقيت الصلاة والراديو...');
    
    // تحديث فوري للمواقيت
    updatePrayerTimes();
    
    // تحديث كل ثانية للعد التنازلي
    setInterval(() => {
        const nextPrayerName = document.getElementById('nextPrayerName')?.textContent;
        if (nextPrayerName) {
            const prayers = [
                { name: 'الفجر', time: { hour: 5, minute: 15 } },
                { name: 'الظهر', time: { hour: 12, minute: 15 } },
                { name: 'العصر', time: { hour: 15, minute: 30 } },
                { name: 'المغرب', time: { hour: 17, minute: 45 } },
                { name: 'العشاء', time: { hour: 19, minute: 15 } }
            ];
            
            const currentPrayer = prayers.find(p => nextPrayerName.includes(p.name));
            if (currentPrayer) {
                updateCountdown(currentPrayer);
            }
        }
    }, 1000);
    
    // تحديث المواقيت كل دقيقة
    setInterval(updatePrayerTimes, 60000);
    
    console.log('✅ تم تهيئة المواقيت والراديو بنجاح');
}

// تشغيل التهيئة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePrayerAndRadio);
} else {
    initializePrayerAndRadio();
}

console.log('📻🕌 تم تحميل إصلاحات المواقيت والراديو');