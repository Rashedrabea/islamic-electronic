// إصلاح صوت التسبيح

// متغيرات الصوت
let audioContext;
let soundEnabled = true;

// إنشاء صوت تسبيح بديل
function createTasbihSound() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        
        console.log('تم تشغيل صوت التسبيح');
    } catch (error) {
        console.log('خطأ في تشغيل الصوت:', error);
    }
}

// تشغيل صوت التسبيح
function playTasbihSound() {
    if (!soundEnabled) return;
    
    // محاولة تشغيل الملف الصوتي أولاً
    try {
        if (window.clickSound && typeof window.clickSound.play === 'function') {
            window.clickSound.currentTime = 0;
            window.clickSound.play().catch(() => {
                // في حالة فشل الملف، استخدم الصوت البديل
                createTasbihSound();
            });
        } else {
            // استخدام الصوت البديل مباشرة
            createTasbihSound();
        }
    } catch (error) {
        // استخدام الصوت البديل
        createTasbihSound();
    }
}

// تحديث وظيفة increment لتشمل الصوت
function increment() {
    count++;
    totalCount++;
    todayCount++;
    weekCount++;

    updateDisplay();
    saveData();

    // تشغيل الصوت
    playTasbihSound();

    // الاهتزاز
    if (isVibrationEnabled && navigator.vibrate) {
        navigator.vibrate(50);
    }

    // تأثير بصري
    const counter = document.getElementById('counter');
    if (counter) {
        counter.classList.add('counter-pulse');
        setTimeout(() => counter.classList.remove('counter-pulse'), 300);
    }

    // فحص المعالم
    checkMilestones();
}

// تفعيل الصوت عند أول تفاعل
function enableAudio() {
    document.addEventListener('click', function() {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            console.log('تم تفعيل الصوت');
        } catch (error) {
            console.log('خطأ في تفعيل الصوت:', error);
        }
    }, { once: true });
}

// اختبار صوت التسبيح
function testTasbihSound() {
    console.log('اختبار صوت التسبيح...');
    playTasbihSound();
    alert('🔊 تم تشغيل صوت التسبيح');
}

// تبديل تفعيل الصوت
function toggleSound() {
    soundEnabled = !soundEnabled;
    localStorage.setItem('soundEnabled', soundEnabled);
    
    const message = soundEnabled ? '🔊 تم تفعيل الصوت' : '🔇 تم إيقاف الصوت';
    alert(message);
    
    if (soundEnabled) {
        testTasbihSound();
    }
}

// تهيئة النظام الصوتي
function initializeSoundSystem() {
    console.log('🔊 تهيئة النظام الصوتي...');
    
    // تحميل إعدادات الصوت
    const savedSound = localStorage.getItem('soundEnabled');
    if (savedSound !== null) {
        soundEnabled = JSON.parse(savedSound);
    }
    
    // تفعيل الصوت عند التفاعل
    enableAudio();
    
    console.log('✅ تم تهيئة النظام الصوتي');
}

// تشغيل التهيئة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSoundSystem);
} else {
    initializeSoundSystem();
}

console.log('🔊 تم تحميل إصلاح صوت التسبيح');