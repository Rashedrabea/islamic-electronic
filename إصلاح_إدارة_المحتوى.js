// وظائف إدارة محتوى التطبيق

// تحديث محتوى التطبيق
function updateAppContent() {
    const title = document.getElementById('appTitle').value;
    const description = document.getElementById('appDescription').value;
    const welcomeMessage = document.getElementById('welcomeMessage').value;

    // تحديث العنوان
    document.querySelector('.banner h1').textContent = title;
    
    // حفظ البيانات
    localStorage.setItem('appTitle', title);
    localStorage.setItem('appDescription', description);
    localStorage.setItem('welcomeMessage', welcomeMessage);

    // إظهار رسالة نجاح
    showSuccessMessage('تم حفظ النصوص بنجاح ✨');
}

// معاينة المحتوى
function previewContent() {
    const title = document.getElementById('appTitle').value;
    const description = document.getElementById('appDescription').value;
    const welcomeMessage = document.getElementById('welcomeMessage').value;

    alert(`معاينة المحتوى:\n\nالعنوان: ${title}\n\nالوصف: ${description}\n\nرسالة الترحيب: ${welcomeMessage}`);
}

// تطبيق إعدادات الثيم
function applyThemeSettings() {
    const primaryColor = document.getElementById('primaryColor').value;
    const backgroundColor = document.getElementById('backgroundColor').value;
    const textColor = document.getElementById('textColor').value;

    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--background-color', backgroundColor);
    document.documentElement.style.setProperty('--text-color', textColor);

    localStorage.setItem('theme', JSON.stringify({
        primary: primaryColor,
        background: backgroundColor,
        text: textColor
    }));

    showSuccessMessage('تم تطبيق الألوان بنجاح 🎨');
}

// إعادة تعيين الثيم
function resetThemeSettings() {
    document.getElementById('primaryColor').value = '#4CAF50';
    document.getElementById('backgroundColor').value = '#FFFFFF';
    document.getElementById('textColor').value = '#333333';

    applyThemeSettings();
    showSuccessMessage('تم استعادة الألوان الافتراضية 🔄');
}

// حفظ الإعدادات المتقدمة
function saveAdvancedSettings() {
    const font = document.getElementById('arabicFont').value;
    const fontSize = document.getElementById('fontSize').value;
    const animation = document.getElementById('animationStyle').value;

    document.documentElement.style.setProperty('--font-family', font);
    document.documentElement.style.setProperty('--font-size-base', fontSize + 'px');

    // حفظ الإعدادات
    localStorage.setItem('advancedSettings', JSON.stringify({
        font,
        fontSize,
        animation
    }));

    // تطبيق نمط الحركة
    document.body.className = animation === 'none' ? 'no-animations' : '';

    showSuccessMessage('تم حفظ الإعدادات المتقدمة ✨');
}

// إعادة تعيين الإعدادات المتقدمة
function resetAdvancedSettings() {
    document.getElementById('arabicFont').value = 'cairo';
    document.getElementById('fontSize').value = '16';
    document.getElementById('animationStyle').value = 'fade';

    saveAdvancedSettings();
    showSuccessMessage('تم إعادة تعيين الإعدادات المتقدمة 🔄');
}

// تحميل الإعدادات المحفوظة عند بدء التشغيل
function loadSavedSettings() {
    // تحميل النصوص
    const savedTitle = localStorage.getItem('appTitle');
    const savedDesc = localStorage.getItem('appDescription');
    const savedWelcome = localStorage.getItem('welcomeMessage');

    if (savedTitle) document.getElementById('appTitle').value = savedTitle;
    if (savedDesc) document.getElementById('appDescription').value = savedDesc;
    if (savedWelcome) document.getElementById('welcomeMessage').value = savedWelcome;

    // تحميل الثيم
    const savedTheme = JSON.parse(localStorage.getItem('theme'));
    if (savedTheme) {
        document.getElementById('primaryColor').value = savedTheme.primary;
        document.getElementById('backgroundColor').value = savedTheme.background;
        document.getElementById('textColor').value = savedTheme.text;
        applyThemeSettings();
    }

    // تحميل الإعدادات المتقدمة
    const savedAdvanced = JSON.parse(localStorage.getItem('advancedSettings'));
    if (savedAdvanced) {
        document.getElementById('arabicFont').value = savedAdvanced.font;
        document.getElementById('fontSize').value = savedAdvanced.fontSize;
        document.getElementById('animationStyle').value = savedAdvanced.animation;
        saveAdvancedSettings();
    }
}

// تحديث قيمة حجم الخط عند التغيير
document.getElementById('fontSize')?.addEventListener('input', function() {
    document.getElementById('fontSizeValue').textContent = this.value + 'px';
});

// تشغيل عند تحميل الصفحة
window.addEventListener('load', loadSavedSettings);
