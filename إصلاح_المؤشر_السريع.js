// إصلاح المؤشر السريع - إضافة مؤشر واضح لقسم الأذكار

// إضافة مؤشر الأذكار فوراً
function addAzkarIndicator() {
    // البحث عن قسم الأذكار
    const azkarSections = document.querySelectorAll('.section');
    let azkarSection = null;
    
    for (let section of azkarSections) {
        const h2 = section.querySelector('h2');
        if (h2 && h2.textContent.includes('الأذكار')) {
            azkarSection = section;
            break;
        }
    }
    
    if (!azkarSection) {
        console.log('❌ لم يتم العثور على قسم الأذكار');
        return;
    }
    
    // إضافة مؤشر التحكم
    const indicator = document.createElement('div');
    indicator.id = 'azkarIndicator';
    indicator.style.cssText = `
        position: sticky;
        top: 10px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 15px;
        border-radius: 15px;
        margin: 10px 0;
        box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
        z-index: 100;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
    `;
    
    indicator.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <span style="font-size: 18px;">📊 مؤشر الأذكار</span>
            <span id="azkarProgress" style="background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 20px; font-size: 14px;">0/0 (0%)</span>
        </div>
        <div style="display: flex; gap: 10px;">
            <button onclick="scrollToAzkarTop()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 14px;" title="العودة للأعلى">⬆️</button>
            <button onclick="scrollToAzkarBottom()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 14px;" title="الذهاب للأسفل">⬇️</button>
            <button onclick="toggleAzkarCollapse()" id="collapseBtn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 14px;" title="طي/فتح">📁</button>
        </div>
    `;
    
    // إدراج المؤشر في بداية قسم الأذكار
    azkarSection.insertBefore(indicator, azkarSection.firstChild);
    
    console.log('✅ تم إضافة مؤشر الأذكار');
}

// التمرير لأعلى الأذكار
function scrollToAzkarTop() {
    const indicator = document.getElementById('azkarIndicator');
    if (indicator) {
        indicator.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // تأثير بصري
        indicator.style.transform = 'scale(1.05)';
        setTimeout(() => {
            indicator.style.transform = 'scale(1)';
        }, 300);
    }
}

// التمرير لأسفل الأذكار
function scrollToAzkarBottom() {
    const azkarContent = document.getElementById('azkarContent');
    if (azkarContent) {
        azkarContent.scrollIntoView({ behavior: 'smooth', block: 'end' });
        
        // تأثير بصري
        azkarContent.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.5)';
        setTimeout(() => {
            azkarContent.style.boxShadow = '';
        }, 2000);
    }
}

// طي/فتح الأذكار
function toggleAzkarCollapse() {
    const categories = document.querySelector('.azkar-categories');
    const content = document.getElementById('azkarContent');
    const btn = document.getElementById('collapseBtn');
    
    if (categories && content && btn) {
        const isHidden = categories.style.display === 'none';
        
        if (isHidden) {
            categories.style.display = 'flex';
            content.style.display = 'block';
            btn.textContent = '📁';
            btn.title = 'طي القسم';
        } else {
            categories.style.display = 'none';
            content.style.display = 'none';
            btn.textContent = '📂';
            btn.title = 'فتح القسم';
        }
        
        localStorage.setItem('azkarCollapsed', !isHidden);
    }
}

// تحديث مؤشر التقدم
function updateAzkarProgressIndicator() {
    const progressElement = document.getElementById('azkarProgress');
    if (!progressElement) return;
    
    let total = 0;
    let completed = 0;
    
    // حساب التقدم
    if (window.azkarData) {
        Object.keys(azkarData).forEach(category => {
            azkarData[category].forEach((zikr, index) => {
                total++;
                const counter = document.getElementById(`azkar-${category}-${index}`);
                if (counter) {
                    const current = parseInt(counter.textContent) || 0;
                    if (current >= zikr.count) {
                        completed++;
                    }
                }
            });
        });
    }
    
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    progressElement.textContent = `${completed}/${total} (${percentage}%)`;
    
    // تغيير لون المؤشر
    const indicator = document.getElementById('azkarIndicator');
    if (indicator) {
        if (percentage === 100) {
            indicator.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        } else if (percentage >= 50) {
            indicator.style.background = 'linear-gradient(135deg, #FF9800, #F57C00)';
        } else {
            indicator.style.background = 'linear-gradient(135deg, #2196F3, #1976D2)';
        }
    }
}

// تحميل حالة الطي المحفوظة
function loadAzkarCollapseState() {
    const isCollapsed = localStorage.getItem('azkarCollapsed') === 'true';
    if (isCollapsed) {
        setTimeout(toggleAzkarCollapse, 500);
    }
}

// مراقبة تغييرات عدادات الأذكار
function monitorAzkarCounters() {
    // مراقبة النقرات على أزرار الأذكار
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('azkar-counter-btn')) {
            setTimeout(updateAzkarProgressIndicator, 100);
        }
    });
    
    // تحديث دوري كل 5 ثوان
    setInterval(updateAzkarProgressIndicator, 5000);
}

// تهيئة المؤشر
function initializeAzkarIndicator() {
    console.log('📊 تهيئة مؤشر الأذكار...');
    
    // انتظار تحميل التطبيق
    setTimeout(() => {
        addAzkarIndicator();
        loadAzkarCollapseState();
        updateAzkarProgressIndicator();
        monitorAzkarCounters();
    }, 2000);
    
    console.log('✅ تم تهيئة مؤشر الأذكار');
}

// تشغيل التهيئة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAzkarIndicator);
} else {
    initializeAzkarIndicator();
}

console.log('📊 تم تحميل المؤشر السريع');