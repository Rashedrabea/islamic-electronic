// إصلاح شامل لمواقيت الصلاة والعد التنازلي

// متغيرات المواقيت
let currentPrayerTimes = {};
let nextPrayerInfo = {};
let prayerUpdateInterval;
let countdownInterval;

// أسماء الصلوات
const prayerNames = {
    fajr: 'الفجر',
    sunrise: 'الشروق', 
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء'
};

// ترتيب الصلوات
const prayerOrder = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

// تحديث مواقيت الصلاة
function updatePrayerTimes() {
    const manualTimes = localStorage.getItem('manualPrayerTimesActive');
    
    if (manualTimes === 'true') {
        loadManualPrayerTimes();
    } else {
        loadAutomaticPrayerTimes();
    }
    
    updatePrayerDisplay();
    updateNextPrayer();
}

// تحميل المواقيت اليدوية
function loadManualPrayerTimes() {
    const savedTimes = localStorage.getItem('manualPrayerTimes');
    if (savedTimes) {
        const times = JSON.parse(savedTimes);
        currentPrayerTimes = {
            fajr: times.fajr || '05:15',
            sunrise: times.sunrise || '06:45', 
            dhuhr: times.dhuhr || '12:15',
            asr: times.asr || '15:30',
            maghrib: times.maghrib || '17:45',
            isha: times.isha || '19:15'
        };
    } else {
        // مواقيت افتراضية
        currentPrayerTimes = {
            fajr: '05:15',
            sunrise: '06:45',
            dhuhr: '12:15', 
            asr: '15:30',
            maghrib: '17:45',
            isha: '19:15'
        };
    }
}

// تحميل المواقيت التلقائية
function loadAutomaticPrayerTimes() {
    const location = JSON.parse(localStorage.getItem('prayerLocation') || '{}');
    const city = location.city || 'القاهرة';
    
    // حساب المواقيت بناءً على التوقيت الحالي
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // مواقيت تقريبية للقاهرة (يمكن تحسينها لاحقاً)
    const baseHour = now.getHours();
    currentPrayerTimes = {
        fajr: '05:15',
        sunrise: '06:45',
        dhuhr: '12:15',
        asr: '15:30', 
        maghrib: '17:45',
        isha: '19:15'
    };
    
    // تعديل المواقيت حسب الفصل (تقريبي)
    const month = now.getMonth() + 1;
    if (month >= 6 && month <= 8) { // الصيف
        currentPrayerTimes.fajr = '04:30';
        currentPrayerTimes.sunrise = '06:00';
        currentPrayerTimes.maghrib = '18:30';
        currentPrayerTimes.isha = '20:00';
    } else if (month >= 12 || month <= 2) { // الشتاء
        currentPrayerTimes.fajr = '05:45';
        currentPrayerTimes.sunrise = '07:15';
        currentPrayerTimes.maghrib = '17:15';
        currentPrayerTimes.isha = '18:45';
    }
}

// تحديث عرض المواقيت
function updatePrayerDisplay() {
    Object.keys(currentPrayerTimes).forEach(prayer => {
        const timeElement = document.getElementById(prayer + '-time');
        if (timeElement) {
            const time24 = currentPrayerTimes[prayer];
            const time12 = convertTo12Hour(time24);
            timeElement.textContent = time12;
        }
    });
    
    // تحديث الصلاة الحالية والقادمة
    highlightCurrentAndNextPrayer();
}

// تحويل من 24 ساعة إلى 12 ساعة
function convertTo12Hour(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'م' : 'ص';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${hour12}:${minutes} ${ampm}`;
}

// تحويل من 12 ساعة إلى 24 ساعة
function convertTo24Hour(time12) {
    const [time, period] = time12.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    
    if (period === 'م' && hour !== 12) {
        hour += 12;
    } else if (period === 'ص' && hour === 12) {
        hour = 0;
    }
    
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
}

// تحديد الصلاة القادمة
function updateNextPrayer() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    let nextPrayer = null;
    let nextPrayerTime = null;
    
    // البحث عن الصلاة القادمة
    for (const prayer of prayerOrder) {
        const prayerTime = currentPrayerTimes[prayer];
        if (prayerTime > currentTime) {
            nextPrayer = prayer;
            nextPrayerTime = prayerTime;
            break;
        }
    }
    
    // إذا لم نجد صلاة اليوم، فالصلاة القادمة هي فجر الغد
    if (!nextPrayer) {
        nextPrayer = 'fajr';
        nextPrayerTime = currentPrayerTimes.fajr;
    }
    
    nextPrayerInfo = {
        name: nextPrayer,
        time: nextPrayerTime,
        displayName: prayerNames[nextPrayer]
    };
    
    updateNextPrayerDisplay();
}

// تحديث عرض الصلاة القادمة
function updateNextPrayerDisplay() {
    const nameElement = document.getElementById('nextPrayerName');
    const timeElement = document.getElementById('nextPrayerTime');
    const countdownElement = document.getElementById('nextPrayerCountdown');
    
    if (nameElement && nextPrayerInfo.displayName) {
        nameElement.textContent = nextPrayerInfo.displayName;
    }
    
    if (timeElement && nextPrayerInfo.time) {
        timeElement.textContent = convertTo12Hour(nextPrayerInfo.time);
    }
    
    if (countdownElement) {
        updateCountdown();
    }
}

// تحديث العد التنازلي
function updateCountdown() {
    if (!nextPrayerInfo.time) return;
    
    const now = new Date();
    const [hours, minutes] = nextPrayerInfo.time.split(':');
    
    // إنشاء تاريخ الصلاة القادمة
    let prayerDate = new Date();
    prayerDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // إذا كان وقت الصلاة قد مضى اليوم، فهي غداً
    if (prayerDate <= now) {
        prayerDate.setDate(prayerDate.getDate() + 1);
    }
    
    const timeDiff = prayerDate - now;
    
    if (timeDiff <= 0) {
        // وقت الصلاة حان، تحديث للصلاة التالية
        updateNextPrayer();
        return;
    }
    
    // حساب الساعات والدقائق والثواني
    const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    // تحديث العرض
    const countdownElement = document.getElementById('nextPrayerCountdown');
    if (countdownElement) {
        countdownElement.textContent = `${hoursLeft.toString().padStart(2, '0')}:${minutesLeft.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
    }
}

// تمييز الصلاة الحالية والقادمة
function highlightCurrentAndNextPrayer() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // إزالة جميع التمييزات
    document.querySelectorAll('.prayer-item').forEach(item => {
        item.classList.remove('current', 'next');
    });
    
    let currentPrayer = null;
    let nextPrayer = null;
    
    // تحديد الصلاة الحالية
    for (let i = prayerOrder.length - 1; i >= 0; i--) {
        const prayer = prayerOrder[i];
        const prayerTime = currentPrayerTimes[prayer];
        
        if (currentTime >= prayerTime) {
            currentPrayer = prayer;
            break;
        }
    }
    
    // تحديد الصلاة القادمة
    for (const prayer of prayerOrder) {
        const prayerTime = currentPrayerTimes[prayer];
        if (prayerTime > currentTime) {
            nextPrayer = prayer;
            break;
        }
    }
    
    // إذا لم نجد صلاة قادمة اليوم، فالقادمة هي الفجر
    if (!nextPrayer) {
        nextPrayer = 'fajr';
    }
    
    // تطبيق التمييز
    if (currentPrayer) {
        const currentElement = document.querySelector(`[data-prayer="${currentPrayer}"]`);
        if (currentElement) {
            currentElement.classList.add('current');
        }
    }
    
    if (nextPrayer) {
        const nextElement = document.querySelector(`[data-prayer="${nextPrayer}"]`);
        if (nextElement) {
            nextElement.classList.add('next');
        }
    }
}

// إضافة خاصية data-prayer للعناصر
function addPrayerDataAttributes() {
    const prayerItems = document.querySelectorAll('.prayer-item');
    prayerItems.forEach((item, index) => {
        if (index < prayerOrder.length) {
            item.setAttribute('data-prayer', prayerOrder[index]);
        }
    });
}

// تشغيل الأذان
function playAdhanSound() {
    try {
        const customAdhan = localStorage.getItem('customAdhanUrl') || localStorage.getItem('customAdhanFile');
        const volume = (localStorage.getItem('adhanVolume') || 80) / 100;
        
        let adhanUrl = customAdhan || './sounds/الاذان 1.mp3';
        
        const audio = new Audio(adhanUrl);
        audio.volume = volume;
        audio.play().catch(error => {
            console.log('لا يمكن تشغيل الأذان:', error);
        });
        
        // إظهار مؤشر تشغيل الأذان
        const indicator = document.getElementById('adhanIndicator');
        if (indicator) {
            indicator.style.display = 'block';
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 5000);
        }
        
    } catch (error) {
        console.log('خطأ في تشغيل الأذان:', error);
    }
}

// فحص مواقيت الصلاة للأذان
function checkPrayerTimes() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // فحص إذا كان الوقت الحالي يطابق وقت صلاة
    Object.keys(currentPrayerTimes).forEach(prayer => {
        if (prayer !== 'sunrise') { // لا نؤذن للشروق
            const prayerTime = currentPrayerTimes[prayer];
            if (currentTime === prayerTime) {
                const adhanSettings = JSON.parse(localStorage.getItem('adhanSettings') || '{}');
                if (adhanSettings[prayer] !== false) { // افتراضياً مفعل
                    playAdhanSound();
                    
                    // إشعار
                    if (Notification.permission === 'granted') {
                        new Notification(`حان وقت ${prayerNames[prayer]}`, {
                            body: `الوقت الآن ${convertTo12Hour(prayerTime)}`,
                            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🕌</text></svg>'
                        });
                    }
                }
            }
        }
    });
}

// طلب إذن الإشعارات
function requestNotificationPermission() {
    if ('Notification' in window) {
        if (Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    alert('✅ تم تفعيل إشعارات الصلاة بنجاح');
                } else {
                    alert('❌ لم يتم تفعيل الإشعارات');
                }
            });
        } else if (Notification.permission === 'granted') {
            alert('✅ الإشعارات مفعلة بالفعل');
        } else {
            alert('❌ الإشعارات محظورة في المتصفح');
        }
    } else {
        alert('❌ المتصفح لا يدعم الإشعارات');
    }
}

// تهيئة المواقيت
function initializePrayerTimes() {
    // إضافة خصائص البيانات للعناصر
    addPrayerDataAttributes();
    
    // تحديث المواقيت
    updatePrayerTimes();
    
    // تشغيل التحديث كل دقيقة
    if (prayerUpdateInterval) {
        clearInterval(prayerUpdateInterval);
    }
    prayerUpdateInterval = setInterval(() => {
        updatePrayerTimes();
        checkPrayerTimes();
    }, 60000); // كل دقيقة
    
    // تشغيل العد التنازلي كل ثانية
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    countdownInterval = setInterval(updateCountdown, 1000);
}

// تحديث الموقع الجغرافي للمواقيت
function updatePrayerLocation() {
    const city = document.getElementById('cityName')?.value.trim();
    const country = document.getElementById('countryName')?.value.trim();
    const lat = document.getElementById('latitude')?.value;
    const lng = document.getElementById('longitude')?.value;
    
    if (city && country) {
        const locationData = { city, country, lat, lng };
        localStorage.setItem('prayerLocation', JSON.stringify(locationData));
        
        // إعادة تحميل المواقيت
        updatePrayerTimes();
        
        alert(`✅ تم تحديث الموقع إلى: ${city}, ${country}`);
    } else {
        alert('⚠️ يرجى إدخال اسم المدينة والبلد');
    }
}

// حفظ المواقيت اليدوية
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
    
    // إعادة تحميل المواقيت
    updatePrayerTimes();
    
    alert('💾 تم حفظ المواقيت اليدوية بنجاح');
}

// إلغاء المواقيت اليدوية
function disableManualPrayerTimes() {
    localStorage.removeItem('manualPrayerTimesActive');
    
    // إعادة تحميل المواقيت التلقائية
    updatePrayerTimes();
    
    alert('🌐 تم العودة للمواقيت التلقائية');
}

// تحميل المواقيت الحالية في حقول التعديل
function loadCurrentPrayerTimes() {
    Object.keys(currentPrayerTimes).forEach(prayer => {
        const input = document.getElementById(prayer + 'Time');
        if (input) {
            input.value = currentPrayerTimes[prayer];
        }
    });
    
    alert('✅ تم تحميل المواقيت الحالية');
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تأخير قصير للتأكد من تحميل جميع العناصر
    setTimeout(() => {
        initializePrayerTimes();
    }, 1000);
});

// إعادة تهيئة عند تغيير الإعدادات
window.addEventListener('storage', function(e) {
    if (e.key === 'manualPrayerTimes' || e.key === 'manualPrayerTimesActive' || e.key === 'prayerLocation') {
        updatePrayerTimes();
    }
});

console.log('✅ تم تحميل إصلاح المواقيت النهائي');