// إصلاح إضافة الشروق في لوحة التحكم

// تحديث حفظ المواقيت لتشمل الشروق
function saveManualPrayerTimes() {
    const fajr = document.getElementById('fajrTime')?.value;
    const sunrise = document.getElementById('sunriseTime')?.value;
    const dhuhr = document.getElementById('dhuhrTime')?.value;
    const asr = document.getElementById('asrTime')?.value;
    const maghrib = document.getElementById('maghribTime')?.value;
    const isha = document.getElementById('ishaTime')?.value;
    
    if (fajr && sunrise && dhuhr && asr && maghrib && isha) {
        const times = {
            fajr: parseTimeInput(fajr),
            sunrise: parseTimeInput(sunrise),
            dhuhr: parseTimeInput(dhuhr),
            asr: parseTimeInput(asr),
            maghrib: parseTimeInput(maghrib),
            isha: parseTimeInput(isha)
        };
        
        localStorage.setItem('manualPrayerTimes', JSON.stringify(times));
        isManualMode = true;
        
        // تحديث العرض
        updateAllPrayerDisplays();
        updatePrayerModeIndicator();
        disableAutomaticFunctions();
        
        alert('✅ تم حفظ جميع المواقيت بما في ذلك الشروق');
        console.log('تم حفظ المواقيت مع الشروق:', times);
    } else {
        alert('⚠️ يرجى ملء جميع الحقول بما في ذلك الشروق');
    }
}

// تحديث تحميل المواقيت لتشمل الشروق
function loadCurrentPrayerTimes() {
    loadSavedPrayerTimes();
    
    // ملء الحقول في لوحة التحكم
    if (document.getElementById('fajrTime')) {
        document.getElementById('fajrTime').value = `${currentPrayerTimes.fajr.hour.toString().padStart(2, '0')}:${currentPrayerTimes.fajr.minute.toString().padStart(2, '0')}`;
        
        // إضافة الشروق
        if (currentPrayerTimes.sunrise) {
            document.getElementById('sunriseTime').value = `${currentPrayerTimes.sunrise.hour.toString().padStart(2, '0')}:${currentPrayerTimes.sunrise.minute.toString().padStart(2, '0')}`;
        } else {
            // حساب الشروق تلقائياً (بعد الفجر بساعة ونصف)
            const sunriseHour = currentPrayerTimes.fajr.hour + 1;
            const sunriseMinute = currentPrayerTimes.fajr.minute + 30;
            document.getElementById('sunriseTime').value = `${sunriseHour.toString().padStart(2, '0')}:${sunriseMinute.toString().padStart(2, '0')}`;
        }
        
        document.getElementById('dhuhrTime').value = `${currentPrayerTimes.dhuhr.hour.toString().padStart(2, '0')}:${currentPrayerTimes.dhuhr.minute.toString().padStart(2, '0')}`;
        document.getElementById('asrTime').value = `${currentPrayerTimes.asr.hour.toString().padStart(2, '0')}:${currentPrayerTimes.asr.minute.toString().padStart(2, '0')}`;
        document.getElementById('maghribTime').value = `${currentPrayerTimes.maghrib.hour.toString().padStart(2, '0')}:${currentPrayerTimes.maghrib.minute.toString().padStart(2, '0')}`;
        document.getElementById('ishaTime').value = `${currentPrayerTimes.isha.hour.toString().padStart(2, '0')}:${currentPrayerTimes.isha.minute.toString().padStart(2, '0')}`;
    }
}

// تحديث المواقيت الافتراضية لتشمل الشروق
function getDefaultPrayerTimes() {
    return {
        fajr: { hour: 5, minute: 15 },
        sunrise: { hour: 6, minute: 45 },
        dhuhr: { hour: 12, minute: 15 },
        asr: { hour: 15, minute: 30 },
        maghrib: { hour: 17, minute: 45 },
        isha: { hour: 19, minute: 15 }
    };
}

// تحديث تحميل المواقيت المحفوظة
function loadSavedPrayerTimes() {
    const saved = localStorage.getItem('manualPrayerTimes');
    if (saved) {
        currentPrayerTimes = JSON.parse(saved);
        
        // التأكد من وجود الشروق
        if (!currentPrayerTimes.sunrise) {
            currentPrayerTimes.sunrise = { 
                hour: currentPrayerTimes.fajr.hour + 1, 
                minute: currentPrayerTimes.fajr.minute + 30 
            };
        }
        
        console.log('تم تحميل المواقيت مع الشروق:', currentPrayerTimes);
    } else {
        currentPrayerTimes = getDefaultPrayerTimes();
    }
}

console.log('🌅 تم تحميل إصلاح الشروق');