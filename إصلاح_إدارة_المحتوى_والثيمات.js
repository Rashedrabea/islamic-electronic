// إصلاح إدارة المحتوى والثيمات

// إدارة النصوص
function updateAppContent() {
    const title = document.getElementById('appTitle')?.value;
    const description = document.getElementById('appDescription')?.value;
    const welcome = document.getElementById('welcomeMessage')?.value;
    
    if (title) {
        const titleElement = document.querySelector('.banner h1');
        if (titleElement) titleElement.textContent = title;
        localStorage.setItem('appTitle', title);
    }
    
    if (description) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = description;
        localStorage.setItem('appDescription', description);
    }
    
    if (welcome) {
        localStorage.setItem('welcomeMessage', welcome);
    }
    
    alert('✅ تم حفظ التغييرات');
}

function previewContent() {
    const title = document.getElementById('appTitle')?.value;
    const description = document.getElementById('appDescription')?.value;
    const welcome = document.getElementById('welcomeMessage')?.value;
    
    alert(`معاينة المحتوى:\n\nالعنوان: ${title}\nالوصف: ${description}\nالترحيب: ${welcome}`);
}

// إدارة الألوان والثيمات
function applyThemeSettings() {
    const primaryColor = document.getElementById('primaryColor')?.value;
    const backgroundColor = document.getElementById('backgroundColor')?.value;
    const textColor = document.getElementById('textColor')?.value;
    
    if (primaryColor) {
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.querySelectorAll('.btn').forEach(btn => {
            btn.style.background = primaryColor;
        });
        localStorage.setItem('primaryColor', primaryColor);
    }
    
    if (backgroundColor) {
        document.body.style.backgroundColor = backgroundColor;
        localStorage.setItem('backgroundColor', backgroundColor);
    }
    
    if (textColor) {
        document.body.style.color = textColor;
        document.querySelectorAll('.section').forEach(section => {
            section.style.color = textColor;
        });
        localStorage.setItem('textColor', textColor);
    }
    
    alert('✅ تم تطبيق الألوان');
}

function resetThemeSettings() {
    if (confirm('هل تريد استعادة الألوان الافتراضية؟')) {
        document.documentElement.style.removeProperty('--primary-color');
        document.body.style.removeProperty('background-color');
        document.body.style.removeProperty('color');
        
        document.querySelectorAll('.btn').forEach(btn => {
            btn.style.removeProperty('background');
        });
        
        document.querySelectorAll('.section').forEach(section => {
            section.style.removeProperty('color');
        });
        
        localStorage.removeItem('primaryColor');
        localStorage.removeItem('backgroundColor');
        localStorage.removeItem('textColor');
        
        // إعادة تعيين القيم في الحقول
        document.getElementById('primaryColor').value = '#4CAF50';
        document.getElementById('backgroundColor').value = '#FFFFFF';
        document.getElementById('textColor').value = '#333333';
        
        alert('✅ تم استعادة الألوان الافتراضية');
    }
}

// الإعدادات المتقدمة
function saveAdvancedSettings() {
    const arabicFont = document.getElementById('arabicFont')?.value;
    const fontSize = document.getElementById('fontSize')?.value;
    const animationStyle = document.getElementById('animationStyle')?.value;
    
    if (arabicFont) {
        document.body.style.fontFamily = `'${arabicFont}', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
        localStorage.setItem('arabicFont', arabicFont);
    }
    
    if (fontSize) {
        document.body.style.fontSize = fontSize + 'px';
        document.getElementById('fontSizeValue').textContent = fontSize + 'px';
        localStorage.setItem('fontSize', fontSize);
    }
    
    if (animationStyle) {
        document.body.className = document.body.className.replace(/animation-\w+/g, '');
        if (animationStyle !== 'none') {
            document.body.classList.add(`animation-${animationStyle}`);
        }
        localStorage.setItem('animationStyle', animationStyle);
    }
    
    alert('✅ تم حفظ الإعدادات المتقدمة');
}

function resetAdvancedSettings() {
    if (confirm('هل تريد إعادة تعيين الإعدادات المتقدمة؟')) {
        document.body.style.removeProperty('font-family');
        document.body.style.removeProperty('font-size');
        document.body.className = document.body.className.replace(/animation-\w+/g, '');
        
        localStorage.removeItem('arabicFont');
        localStorage.removeItem('fontSize');
        localStorage.removeItem('animationStyle');
        
        // إعادة تعيين القيم
        document.getElementById('arabicFont').value = 'cairo';
        document.getElementById('fontSize').value = '16';
        document.getElementById('fontSizeValue').textContent = '16px';
        document.getElementById('animationStyle').value = 'fade';
        
        alert('✅ تم إعادة تعيين الإعدادات');
    }
}

// تحديث قيمة حجم الخط
function updateFontSizeValue() {
    const fontSize = document.getElementById('fontSize')?.value;
    const fontSizeValue = document.getElementById('fontSizeValue');
    if (fontSizeValue && fontSize) {
        fontSizeValue.textContent = fontSize + 'px';
    }
}

// إضافة مستمع لتحديث حجم الخط
document.addEventListener('DOMContentLoaded', function() {
    const fontSizeSlider = document.getElementById('fontSize');
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', updateFontSizeValue);
    }
});

// تحميل الإعدادات المحفوظة
function loadSavedSettings() {
    // تحميل النصوص
    const savedTitle = localStorage.getItem('appTitle');
    if (savedTitle) {
        const titleInput = document.getElementById('appTitle');
        const titleElement = document.querySelector('.banner h1');
        if (titleInput) titleInput.value = savedTitle;
        if (titleElement) titleElement.textContent = savedTitle;
    }
    
    const savedDescription = localStorage.getItem('appDescription');
    if (savedDescription) {
        const descInput = document.getElementById('appDescription');
        if (descInput) descInput.value = savedDescription;
    }
    
    const savedWelcome = localStorage.getItem('welcomeMessage');
    if (savedWelcome) {
        const welcomeInput = document.getElementById('welcomeMessage');
        if (welcomeInput) welcomeInput.value = savedWelcome;
    }
    
    // تحميل الألوان
    const savedPrimaryColor = localStorage.getItem('primaryColor');
    if (savedPrimaryColor) {
        const primaryInput = document.getElementById('primaryColor');
        if (primaryInput) primaryInput.value = savedPrimaryColor;
        document.documentElement.style.setProperty('--primary-color', savedPrimaryColor);
        document.querySelectorAll('.btn').forEach(btn => {
            btn.style.background = savedPrimaryColor;
        });
    }
    
    const savedBgColor = localStorage.getItem('backgroundColor');
    if (savedBgColor) {
        const bgInput = document.getElementById('backgroundColor');
        if (bgInput) bgInput.value = savedBgColor;
        document.body.style.backgroundColor = savedBgColor;
    }
    
    const savedTextColor = localStorage.getItem('textColor');
    if (savedTextColor) {
        const textInput = document.getElementById('textColor');
        if (textInput) textInput.value = savedTextColor;
        document.body.style.color = savedTextColor;
    }
    
    // تحميل الإعدادات المتقدمة
    const savedFont = localStorage.getItem('arabicFont');
    if (savedFont) {
        const fontSelect = document.getElementById('arabicFont');
        if (fontSelect) fontSelect.value = savedFont;
        document.body.style.fontFamily = `'${savedFont}', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
    }
    
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        const fontSizeInput = document.getElementById('fontSize');
        const fontSizeValue = document.getElementById('fontSizeValue');
        if (fontSizeInput) fontSizeInput.value = savedFontSize;
        if (fontSizeValue) fontSizeValue.textContent = savedFontSize + 'px';
        document.body.style.fontSize = savedFontSize + 'px';
    }
    
    const savedAnimation = localStorage.getItem('animationStyle');
    if (savedAnimation) {
        const animationSelect = document.getElementById('animationStyle');
        if (animationSelect) animationSelect.value = savedAnimation;
        if (savedAnimation !== 'none') {
            document.body.classList.add(`animation-${savedAnimation}`);
        }
    }
}

// تشغيل التحميل عند بدء التطبيق
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadSavedSettings, 1000);
});

console.log('✅ تم تحميل إصلاحات إدارة المحتوى والثيمات');