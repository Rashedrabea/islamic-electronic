// إصلاح تعارض المواقيت - منع تداخل الوظائف

// متغير لمنع التداخل
let isManualMode = false;

// فحص وضع المواقيت عند التحميل
function checkPrayerMode() {
    const manualTimes = localStorage.getItem('manualPrayerTimes');
    isManualMode = !!manualTimes;
    console.log('وضع المواقيت:', isManualMode ? 'يدوي' : 'تلقائي');
}

// إيقاف الوظائف التلقائية عند وجود مواقيت يدوية
function disableAutomaticFunctions() {
    if (isManualMode) {
        // إيقاف جميع الوظائف التلقائية
        window.updatePrayerTimes = function() {
            console.log('الوظائف التلقائية معطلة - يتم استخدام المواقيت اليدوية');
        };
        
        window.calculatePrayerTimes = function() {
            const saved = localStorage.getItem('manualPrayerTimes');
            return saved ? JSON.parse(saved) : null;
        };
        
        window.updateNextPrayer = function() {
            console.log('تم تجاهل التحديث التلقائي');
        };
    }
}

// إعادة تعريف getCurrentLocation لمنع التداخل
function getCurrentLocation() {
    if (isManualMode) {
        alert('⚠️ أنت تستخدم المواقيت اليدوية. للحصول على الموقع الجغرافي، اضغط "العودة للمواقيت التلقائية" أولاً.');
        return;
    }
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                document.getElementById('latitude').value = lat.toFixed(6);
                document.getElementById('longitude').value = lng.toFixed(6);
                
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

// إعادة تعريف updatePrayerLocation لمنع التداخل
function updatePrayerLocation() {
    if (isManualMode) {
        alert('⚠️ أنت تستخدم المواقيت اليدوية. لا يمكن تحديث الموقع في هذا الوضع.');
        return;
    }
    
    const city = document.getElementById('cityName')?.value.trim();
    const country = document.getElementById('countryName')?.value.trim();
    
    if (city && country) {
        alert(`✅ تم تحديث الموقع إلى: ${city}, ${country}`);
        // هنا يمكن إضافة كود لجلب المواقيت من API حسب المدينة
    } else {
        alert('⚠️ يرجى إدخال اسم المدينة والبلد');
    }
}

// تحديث وضع المواقيت في لوحة التحكم
function updatePrayerModeIndicator() {
    const indicator = document.getElementById('prayerModeIndicator');
    if (indicator) {
        if (isManualMode) {
            indicator.textContent = '⚙️ المواقيت اليدوية مفعلة';
            indicator.style.color = '#4CAF50';
        } else {
            indicator.textContent = '🌐 المواقيت التلقائية مفعلة';
            indicator.style.color = '#2196F3';
        }
    }
}

// إعادة تعريف disableManualPrayerTimes
function disableManualPrayerTimes() {
    localStorage.removeItem('manualPrayerTimes');
    isManualMode = false;
    
    alert('✅ تم العودة للمواقيت التلقائية');
    
    // إعادة تفعيل الوظائف التلقائية
    location.reload(); // إعادة تحميل الصفحة لتفعيل الوظائف التلقائية
}

// إعادة تعريف saveManualPrayerTimes مع تحديث الوضع
function saveManualPrayerTimes() {
    const fajr = document.getElementById('fajrTime')?.value;
    const dhuhr = document.getElementById('dhuhrTime')?.value;
    const asr = document.getElementById('asrTime')?.value;
    const maghrib = document.getElementById('maghribTime')?.value;
    const isha = document.getElementById('ishaTime')?.value;
    
    if (fajr && dhuhr && asr && maghrib && isha) {
        const times = {
            fajr: parseTimeInput(fajr),
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
        
        alert('✅ تم حفظ المواقيت اليدوية وإيقاف التحديث التلقائي');
    } else {
        alert('⚠️ يرجى ملء جميع الحقول');
    }
}

// تهيئة النظام
function initializeConflictFix() {
    console.log('🔧 تهيئة إصلاح تعارض المواقيت...');
    
    // فحص الوضع الحالي
    checkPrayerMode();
    
    // تحديث المؤشر
    updatePrayerModeIndicator();
    
    // إيقاف الوظائف التلقائية إذا كان الوضع يدوي
    disableAutomaticFunctions();
    
    console.log('✅ تم إصلاح تعارض المواقيت');
}

// تشغيل الإصلاح
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeConflictFix);
} else {
    initializeConflictFix();
}

console.log('🛠️ تم تحميل إصلاح تعارض المواقيت');