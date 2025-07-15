// إصلاح مؤشر الصعود والهبوط لقسم الأذكار

// إضافة أزرار التحكم لقسم الأذكار
function addAzkarControls() {
    const azkarSection = document.querySelector('.section h2');
    if (azkarSection && azkarSection.textContent.includes('الأذكار')) {
        const parentSection = azkarSection.parentElement;
        
        // إنشاء شريط التحكم
        const controlBar = document.createElement('div');
        controlBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 10px;
            background: rgba(76, 175, 80, 0.1);
            border-radius: 10px;
            border: 1px solid rgba(76, 175, 80, 0.3);
        `;
        
        controlBar.innerHTML = `
            <h2 style="margin: 0;">📿 الأذكار والأدعية</h2>
            <div style="display: flex; gap: 10px;">
                <button class="btn secondary" onclick="scrollToAzkarTop()" title="العودة لأعلى الأذكار" style="padding: 8px 12px; font-size: 14px;">⬆️ أعلى</button>
                <button class="btn secondary" onclick="scrollToAzkarBottom()" title="الذهاب لأسفل الأذكار" style="padding: 8px 12px; font-size: 14px;">⬇️ أسفل</button>
                <button class="btn secondary" onclick="toggleAzkarSection()" id="azkarToggleBtn" title="طي/فتح القسم" style="padding: 8px 12px; font-size: 14px;">📁 طي</button>
                <button class="btn" onclick="addQuickAzkar()" title="إضافة ذكر سريع" style="padding: 8px 12px; font-size: 14px;">➕ إضافة</button>
            </div>
        `;
        
        // استبدال العنوان الأصلي بشريط التحكم
        azkarSection.replaceWith(controlBar);
        
        // إضافة ID للقسم
        parentSection.id = 'azkar-main-section';
    }
}

// التمرير لأعلى قسم الأذكار
function scrollToAzkarTop() {
    const azkarSection = document.getElementById('azkar-main-section');
    if (azkarSection) {
        azkarSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // تأثير بصري
        azkarSection.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.5)';
        setTimeout(() => {
            azkarSection.style.boxShadow = '';
        }, 2000);
    }
}

// التمرير لأسفل قسم الأذكار
function scrollToAzkarBottom() {
    const azkarContent = document.getElementById('azkarContent');
    if (azkarContent) {
        azkarContent.scrollIntoView({ behavior: 'smooth', block: 'end' });
        
        // تأثير بصري
        azkarContent.style.border = '2px solid #4CAF50';
        setTimeout(() => {
            azkarContent.style.border = '';
        }, 2000);
    }
}

// طي/فتح قسم الأذكار
function toggleAzkarSection() {
    const azkarCategories = document.querySelector('.azkar-categories');
    const azkarContent = document.getElementById('azkarContent');
    const toggleBtn = document.getElementById('azkarToggleBtn');
    
    if (azkarCategories && azkarContent && toggleBtn) {
        const isHidden = azkarCategories.style.display === 'none';
        
        if (isHidden) {
            // فتح القسم
            azkarCategories.style.display = 'flex';
            azkarContent.style.display = 'block';
            toggleBtn.textContent = '📁 طي';
            toggleBtn.title = 'طي القسم';
            
            // حفظ الحالة
            localStorage.setItem('azkarSectionCollapsed', 'false');
        } else {
            // طي القسم
            azkarCategories.style.display = 'none';
            azkarContent.style.display = 'none';
            toggleBtn.textContent = '📂 فتح';
            toggleBtn.title = 'فتح القسم';
            
            // حفظ الحالة
            localStorage.setItem('azkarSectionCollapsed', 'true');
        }
    }
}

// إضافة ذكر سريع
function addQuickAzkar() {
    const text = prompt('أدخل نص الذكر الجديد:');
    if (!text) return;
    
    const count = prompt('أدخل عدد التكرار:', '1');
    const category = prompt('اختر الفئة:\n1- morning (الصباح)\n2- evening (المساء)\n3- general (عامة)', 'general');
    
    if (text && count && category) {
        // إضافة الذكر
        if (!azkarData[category]) {
            azkarData[category] = [];
        }
        
        azkarData[category].push({
            text: text.trim(),
            count: parseInt(count) || 1
        });
        
        // حفظ البيانات
        localStorage.setItem('customAzkarData', JSON.stringify(azkarData));
        
        // تحديث العرض
        displayAzkar(category);
        
        // رسالة نجاح
        alert('✅ تم إضافة الذكر بنجاح!');
        
        // التمرير للذكر الجديد
        setTimeout(() => {
            scrollToAzkarBottom();
        }, 500);
    }
}

// إضافة مؤشر التقدم للأذكار
function addAzkarProgressIndicator() {
    const azkarSection = document.getElementById('azkar-main-section');
    if (!azkarSection) return;
    
    // إنشاء مؤشر التقدم
    const progressBar = document.createElement('div');
    progressBar.id = 'azkarProgressBar';
    progressBar.style.cssText = `
        position: sticky;
        top: 0;
        background: rgba(76, 175, 80, 0.9);
        color: white;
        padding: 8px 15px;
        border-radius: 0 0 10px 10px;
        font-size: 14px;
        text-align: center;
        z-index: 100;
        margin-bottom: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    `;
    
    progressBar.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span id="azkarProgress">📊 التقدم: 0/0</span>
            <div style="display: flex; gap: 10px;">
                <button onclick="resetAllAzkarCounters()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">🔄 إعادة تعيين</button>
                <button onclick="exportAzkarProgress()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">📤 تصدير</button>
            </div>
        </div>
    `;
    
    // إدراج مؤشر التقدم
    const azkarCategories = document.querySelector('.azkar-categories');
    if (azkarCategories) {
        azkarCategories.parentNode.insertBefore(progressBar, azkarCategories);
    }
}

// تحديث مؤشر التقدم
function updateAzkarProgress() {
    const progressElement = document.getElementById('azkarProgress');
    if (!progressElement) return;
    
    let totalAzkar = 0;
    let completedAzkar = 0;
    
    // حساب التقدم لجميع الفئات
    Object.keys(azkarData).forEach(category => {
        azkarData[category].forEach((zikr, index) => {
            totalAzkar++;
            const counterId = `azkar-${category}-${index}`;
            const counter = document.getElementById(counterId);
            if (counter) {
                const currentCount = parseInt(counter.textContent) || 0;
                if (currentCount >= zikr.count) {
                    completedAzkar++;
                }
            }
        });
    });
    
    const percentage = totalAzkar > 0 ? Math.round((completedAzkar / totalAzkar) * 100) : 0;
    progressElement.textContent = `📊 التقدم: ${completedAzkar}/${totalAzkar} (${percentage}%)`;
    
    // تغيير لون المؤشر حسب التقدم
    const progressBar = document.getElementById('azkarProgressBar');
    if (progressBar) {
        if (percentage === 100) {
            progressBar.style.background = 'rgba(76, 175, 80, 0.9)';
        } else if (percentage >= 50) {
            progressBar.style.background = 'rgba(255, 152, 0, 0.9)';
        } else {
            progressBar.style.background = 'rgba(33, 150, 243, 0.9)';
        }
    }
}

// إعادة تعيين جميع عدادات الأذكار
function resetAllAzkarCounters() {
    if (confirm('هل تريد إعادة تعيين جميع عدادات الأذكار؟')) {
        Object.keys(azkarData).forEach(category => {
            azkarData[category].forEach((_, index) => {
                const counterId = `azkar-${category}-${index}`;
                const counter = document.getElementById(counterId);
                if (counter) {
                    counter.textContent = '0';
                    localStorage.removeItem(`azkar-${category}-${index}`);
                }
            });
        });
        
        updateAzkarProgress();
        alert('✅ تم إعادة تعيين جميع العدادات');
    }
}

// تصدير تقدم الأذكار
function exportAzkarProgress() {
    const progress = {};
    
    Object.keys(azkarData).forEach(category => {
        progress[category] = {};
        azkarData[category].forEach((zikr, index) => {
            const counterId = `azkar-${category}-${index}`;
            const counter = document.getElementById(counterId);
            const currentCount = counter ? parseInt(counter.textContent) || 0 : 0;
            
            progress[category][index] = {
                text: zikr.text,
                required: zikr.count,
                completed: currentCount,
                percentage: Math.round((currentCount / zikr.count) * 100)
            };
        });
    });
    
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `azkar-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('📤 تم تصدير تقدم الأذكار');
}

// تحميل حالة القسم المحفوظة
function loadAzkarSectionState() {
    const isCollapsed = localStorage.getItem('azkarSectionCollapsed') === 'true';
    if (isCollapsed) {
        setTimeout(() => {
            toggleAzkarSection();
        }, 500);
    }
}

// تحديث عداد الأذكار مع تحديث التقدم
const originalIncrementAzkar = window.incrementAzkar;
window.incrementAzkar = function(category, index) {
    if (originalIncrementAzkar) {
        originalIncrementAzkar(category, index);
    }
    setTimeout(updateAzkarProgress, 100);
};

// تهيئة مؤشرات الأذكار
function initializeAzkarIndicators() {
    console.log('📊 تهيئة مؤشرات الأذكار...');
    
    // إضافة أزرار التحكم
    setTimeout(() => {
        addAzkarControls();
        addAzkarProgressIndicator();
        loadAzkarSectionState();
        updateAzkarProgress();
    }, 1000);
    
    console.log('✅ تم تهيئة مؤشرات الأذكار');
}

// تشغيل التهيئة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAzkarIndicators);
} else {
    initializeAzkarIndicators();
}

console.log('📊 تم تحميل مؤشرات الأذكار');