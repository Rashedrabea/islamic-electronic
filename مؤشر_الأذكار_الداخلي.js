// نظام المؤشر الداخلي للأذكار والأدعية
// يعرض ذكر واحد في كل مرة مع التنقل الداخلي

let currentAzkarIndex = 0;
let currentAzkarCategory = 'morning';
let azkarInternalCounters = {};

// تحديث عرض الأذكار مع المؤشر الداخلي
function displayAzkarWithInternalCursor(category) {
    currentAzkarCategory = category;
    currentAzkarIndex = 0;
    
    const content = document.getElementById("azkarContent");
    const azkarList = azkarData[category] || [];
    
    if (azkarList.length === 0) {
        content.innerHTML = '<p style="text-align: center; color: #666;">لا توجد أذكار في هذا التصنيف</p>';
        return;
    }
    
    // إنشاء واجهة المؤشر الداخلي
    content.innerHTML = `
        <div class="azkar-internal-navigator">
            <!-- مؤشر التقدم -->
            <div class="azkar-progress-header">
                <div class="progress-info">
                    <span class="current-position">${currentAzkarIndex + 1}</span>
                    <span class="separator">/</span>
                    <span class="total-count">${azkarList.length}</span>
                    <span class="category-name">${getCategoryDisplayName(category)}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((currentAzkarIndex + 1) / azkarList.length) * 100}%"></div>
                </div>
            </div>
            
            <!-- عرض الذكر الحالي -->
            <div class="current-azkar-display">
                <div class="azkar-text-large" id="currentAzkarText">
                    ${azkarList[currentAzkarIndex].text}
                </div>
                <div class="azkar-count-info">
                    يُقال <span class="required-count">${azkarList[currentAzkarIndex].count}</span> 
                    ${azkarList[currentAzkarIndex].count === 1 ? "مرة" : "مرات"}
                </div>
                
                <!-- عداد الذكر الحالي -->
                <div class="azkar-counter-large">
                    <button class="counter-btn-large decrease" onclick="decrementCurrentAzkar()">-</button>
                    <div class="counter-display-large" id="currentAzkarCounter">0</div>
                    <button class="counter-btn-large increase" onclick="incrementCurrentAzkar()">+</button>
                </div>
                
                <!-- حالة الإكمال -->
                <div class="completion-status" id="completionStatus" style="display: none;">
                    ✅ تم إكمال هذا الذكر
                </div>
            </div>
            
            <!-- أزرار التنقل -->
            <div class="navigation-controls">
                <button class="nav-btn prev" onclick="goToPreviousAzkar()" ${currentAzkarIndex === 0 ? 'disabled' : ''}>
                    ⬅️ السابق
                </button>
                
                <div class="quick-actions">
                    <button class="action-btn reset" onclick="resetCurrentAzkar()" title="إعادة تعيين العداد">
                        🔄
                    </button>
                    <button class="action-btn complete" onclick="markAsComplete()" title="تمييز كمكتمل">
                        ✅
                    </button>
                    <button class="action-btn overview" onclick="showAzkarOverview()" title="عرض شامل">
                        📋
                    </button>
                </div>
                
                <button class="nav-btn next" onclick="goToNextAzkar()" ${currentAzkarIndex === azkarList.length - 1 ? 'disabled' : ''}>
                    التالي ➡️
                </button>
            </div>
            
            <!-- مؤشرات سريعة -->
            <div class="quick-indicators">
                ${azkarList.map((_, index) => `
                    <div class="indicator-dot ${index === currentAzkarIndex ? 'active' : ''} ${isAzkarCompleted(category, index) ? 'completed' : ''}" 
                         onclick="jumpToAzkar(${index})" 
                         title="الذكر ${index + 1}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // تحميل العداد المحفوظ
    loadCurrentAzkarCounter();
    updateNavigationState();
}

// الانتقال للذكر التالي
function goToNextAzkar() {
    const azkarList = azkarData[currentAzkarCategory] || [];
    if (currentAzkarIndex < azkarList.length - 1) {
        currentAzkarIndex++;
        updateCurrentAzkarDisplay();
        saveCurrentPosition();
    }
}

// الانتقال للذكر السابق
function goToPreviousAzkar() {
    if (currentAzkarIndex > 0) {
        currentAzkarIndex--;
        updateCurrentAzkarDisplay();
        saveCurrentPosition();
    }
}

// القفز لذكر محدد
function jumpToAzkar(index) {
    const azkarList = azkarData[currentAzkarCategory] || [];
    if (index >= 0 && index < azkarList.length) {
        currentAzkarIndex = index;
        updateCurrentAzkarDisplay();
        saveCurrentPosition();
    }
}

// تحديث عرض الذكر الحالي
function updateCurrentAzkarDisplay() {
    const azkarList = azkarData[currentAzkarCategory] || [];
    const currentAzkar = azkarList[currentAzkarIndex];
    
    if (!currentAzkar) return;
    
    // تحديث النص
    document.getElementById('currentAzkarText').textContent = currentAzkar.text;
    document.querySelector('.required-count').textContent = currentAzkar.count;
    document.querySelector('.azkar-count-info').innerHTML = `
        يُقال <span class="required-count">${currentAzkar.count}</span> 
        ${currentAzkar.count === 1 ? "مرة" : "مرات"}
    `;
    
    // تحديث مؤشر التقدم
    document.querySelector('.current-position').textContent = currentAzkarIndex + 1;
    document.querySelector('.progress-fill').style.width = `${((currentAzkarIndex + 1) / azkarList.length) * 100}%`;
    
    // تحديث المؤشرات السريعة
    document.querySelectorAll('.indicator-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentAzkarIndex);
        dot.classList.toggle('completed', isAzkarCompleted(currentAzkarCategory, index));
    });
    
    // تحميل العداد
    loadCurrentAzkarCounter();
    updateNavigationState();
    updateCompletionStatus();
}

// زيادة عداد الذكر الحالي
function incrementCurrentAzkar() {
    const key = `${currentAzkarCategory}-${currentAzkarIndex}`;
    azkarInternalCounters[key] = (azkarInternalCounters[key] || 0) + 1;
    
    document.getElementById('currentAzkarCounter').textContent = azkarInternalCounters[key];
    saveAzkarInternalCounters();
    updateCompletionStatus();
    
    // تشغيل صوت التسبيح
    try {
        if (typeof playSound === 'function') {
            playSound();
        } else if (window.mainClickSound) {
            window.mainClickSound.currentTime = 0;
            window.mainClickSound.play().catch(() => {});
        }
    } catch (e) {}
    
    // الاهتزاز
    if (typeof isVibrationEnabled !== 'undefined' && isVibrationEnabled && navigator.vibrate) {
        navigator.vibrate(50);
    }
    
    // تحديث المؤشر السريع
    updateQuickIndicator();
}

// تقليل عداد الذكر الحالي
function decrementCurrentAzkar() {
    const key = `${currentAzkarCategory}-${currentAzkarIndex}`;
    if (azkarInternalCounters[key] > 0) {
        azkarInternalCounters[key]--;
        document.getElementById('currentAzkarCounter').textContent = azkarInternalCounters[key];
        saveAzkarInternalCounters();
        updateCompletionStatus();
        updateQuickIndicator();
    }
}

// إعادة تعيين العداد الحالي
function resetCurrentAzkar() {
    if (confirm('هل تريد إعادة تعيين عداد هذا الذكر؟')) {
        const key = `${currentAzkarCategory}-${currentAzkarIndex}`;
        azkarInternalCounters[key] = 0;
        document.getElementById('currentAzkarCounter').textContent = '0';
        saveAzkarInternalCounters();
        updateCompletionStatus();
        updateQuickIndicator();
    }
}

// تمييز كمكتمل
function markAsComplete() {
    const azkarList = azkarData[currentAzkarCategory] || [];
    const currentAzkar = azkarList[currentAzkarIndex];
    const key = `${currentAzkarCategory}-${currentAzkarIndex}`;
    
    azkarInternalCounters[key] = currentAzkar.count;
    document.getElementById('currentAzkarCounter').textContent = currentAzkar.count;
    saveAzkarInternalCounters();
    updateCompletionStatus();
    updateQuickIndicator();
    
    // الانتقال التلقائي للذكر التالي
    setTimeout(() => {
        if (currentAzkarIndex < azkarList.length - 1) {
            goToNextAzkar();
        }
    }, 1000);
}

// تحديث حالة الإكمال
function updateCompletionStatus() {
    const azkarList = azkarData[currentAzkarCategory] || [];
    const currentAzkar = azkarList[currentAzkarIndex];
    const key = `${currentAzkarCategory}-${currentAzkarIndex}`;
    const currentCount = azkarInternalCounters[key] || 0;
    
    const statusElement = document.getElementById('completionStatus');
    if (currentCount >= currentAzkar.count) {
        statusElement.style.display = 'block';
        statusElement.textContent = '✅ تم إكمال هذا الذكر';
        statusElement.className = 'completion-status completed';
    } else {
        statusElement.style.display = 'none';
    }
}

// تحديث حالة أزرار التنقل
function updateNavigationState() {
    const azkarList = azkarData[currentAzkarCategory] || [];
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    
    if (prevBtn) {
        prevBtn.disabled = currentAzkarIndex === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentAzkarIndex === azkarList.length - 1;
    }
}

// تحديث المؤشر السريع
function updateQuickIndicator() {
    const dots = document.querySelectorAll('.indicator-dot');
    if (dots[currentAzkarIndex]) {
        dots[currentAzkarIndex].classList.toggle('completed', 
            isAzkarCompleted(currentAzkarCategory, currentAzkarIndex));
    }
}

// فحص إكمال الذكر
function isAzkarCompleted(category, index) {
    const key = `${category}-${index}`;
    const azkarList = azkarData[category] || [];
    const requiredCount = azkarList[index]?.count || 0;
    const currentCount = azkarInternalCounters[key] || 0;
    return currentCount >= requiredCount;
}

// عرض نظرة شاملة
function showAzkarOverview() {
    const azkarList = azkarData[currentAzkarCategory] || [];
    const content = document.getElementById("azkarContent");
    
    const overviewHTML = `
        <div class="azkar-overview">
            <div class="overview-header">
                <h3>📋 نظرة شاملة - ${getCategoryDisplayName(currentAzkarCategory)}</h3>
                <button class="btn secondary" onclick="displayAzkarWithInternalCursor('${currentAzkarCategory}')">
                    🔙 العودة للمؤشر
                </button>
            </div>
            
            <div class="overview-stats">
                <div class="stat-item">
                    <span class="stat-label">إجمالي الأذكار:</span>
                    <span class="stat-value">${azkarList.length}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">مكتملة:</span>
                    <span class="stat-value">${azkarList.filter((_, index) => isAzkarCompleted(currentAzkarCategory, index)).length}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">متبقية:</span>
                    <span class="stat-value">${azkarList.filter((_, index) => !isAzkarCompleted(currentAzkarCategory, index)).length}</span>
                </div>
            </div>
            
            <div class="overview-list">
                ${azkarList.map((zikr, index) => {
                    const key = `${currentAzkarCategory}-${index}`;
                    const currentCount = azkarInternalCounters[key] || 0;
                    const isCompleted = currentCount >= zikr.count;
                    const progress = Math.min((currentCount / zikr.count) * 100, 100);
                    
                    return `
                        <div class="overview-item ${isCompleted ? 'completed' : ''}">
                            <div class="item-header">
                                <span class="item-number">${index + 1}</span>
                                <span class="item-status">${isCompleted ? '✅' : '⏳'}</span>
                                <button class="btn small" onclick="jumpToAzkar(${index}); displayAzkarWithInternalCursor('${currentAzkarCategory}')">
                                    انتقال
                                </button>
                            </div>
                            <div class="item-text">${zikr.text}</div>
                            <div class="item-progress">
                                <div class="progress-bar-small">
                                    <div class="progress-fill-small" style="width: ${progress}%"></div>
                                </div>
                                <span class="progress-text">${currentCount}/${zikr.count}</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    content.innerHTML = overviewHTML;
}

// الحصول على اسم الفئة للعرض
function getCategoryDisplayName(category) {
    const names = {
        'morning': 'أذكار الصباح',
        'evening': 'أذكار المساء',
        'sleep': 'أذكار النوم',
        'prayer': 'أذكار الصلاة',
        'travel': 'أذكار السفر',
        'food': 'أذكار الطعام',
        'general': 'الأذكار العامة'
    };
    return names[category] || category;
}

// حفظ العدادات الداخلية
function saveAzkarInternalCounters() {
    localStorage.setItem('azkarInternalCounters', JSON.stringify(azkarInternalCounters));
}

// تحميل العدادات الداخلية
function loadAzkarInternalCounters() {
    const saved = localStorage.getItem('azkarInternalCounters');
    if (saved) {
        azkarInternalCounters = JSON.parse(saved);
    }
}

// تحميل عداد الذكر الحالي
function loadCurrentAzkarCounter() {
    const key = `${currentAzkarCategory}-${currentAzkarIndex}`;
    const count = azkarInternalCounters[key] || 0;
    const counterElement = document.getElementById('currentAzkarCounter');
    if (counterElement) {
        counterElement.textContent = count;
    }
}

// حفظ الموضع الحالي
function saveCurrentPosition() {
    localStorage.setItem('currentAzkarPosition', JSON.stringify({
        category: currentAzkarCategory,
        index: currentAzkarIndex
    }));
}

// تحميل الموضع المحفوظ
function loadCurrentPosition() {
    const saved = localStorage.getItem('currentAzkarPosition');
    if (saved) {
        const position = JSON.parse(saved);
        currentAzkarCategory = position.category || 'morning';
        currentAzkarIndex = position.index || 0;
    }
}

// تعديل دالة عرض فئة الأذكار لاستخدام المؤشر الداخلي
const originalShowAzkarCategory = window.showAzkarCategory;
window.showAzkarCategory = function(category) {
    currentAzkarCategory = category;
    currentAzkarIndex = 0;
    
    // تحديث الأزرار
    document.querySelectorAll(".azkar-category-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    
    // تفعيل الزر المحدد
    document.querySelectorAll(".azkar-category-btn").forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes(category)) {
            btn.classList.add("active");
        }
    });
    
    // عرض الأذكار مع المؤشر الداخلي
    displayAzkarWithInternalCursor(category);
};

// تهيئة النظام
function initInternalAzkarCursor() {
    console.log('🎯 تهيئة المؤشر الداخلي للأذكار...');
    
    loadAzkarInternalCounters();
    loadCurrentPosition();
    
    // إضافة الأنماط
    addInternalCursorStyles();
    
    console.log('✅ تم تهيئة المؤشر الداخلي للأذكار');
}

// إضافة الأنماط المطلوبة
function addInternalCursorStyles() {
    const styles = `
        <style>
        .azkar-internal-navigator {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .dark-mode .azkar-internal-navigator {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        }
        
        .dark-mode .azkar-progress-header {
            background: rgba(76, 175, 80, 0.2);
            border-color: rgba(76, 175, 80, 0.4);
        }
        
        .dark-mode .overview-stats {
            background: rgba(76, 175, 80, 0.2);
        }
        
        .azkar-progress-header {
            text-align: center;
            margin-bottom: 25px;
            padding: 15px;
            background: rgba(76, 175, 80, 0.1);
            border-radius: 10px;
            border: 1px solid rgba(76, 175, 80, 0.3);
        }
        
        .progress-info {
            font-size: 18px;
            font-weight: bold;
            color: #2e7d32;
            margin-bottom: 10px;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(76, 175, 80, 0.2);
            border-radius: 4px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4CAF50, #66BB6A);
            transition: width 0.3s ease;
        }
        
        .current-azkar-display {
            text-align: center;
            margin-bottom: 25px;
        }
        
        .azkar-text-large {
            font-size: 24px;
            font-weight: bold;
            color: #1b5e20;
            line-height: 1.6;
            margin-bottom: 15px;
            padding: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-right: 4px solid #4CAF50;
        }
        
        .dark-mode .azkar-text-large {
            background: #2d2d2d !important;
            color: #e0e0e0 !important;
            border-right-color: #66BB6A !important;
        }
        
        .azkar-count-info {
            font-size: 16px;
            color: #666;
            margin-bottom: 20px;
        }
        
        .required-count {
            color: #4CAF50;
            font-weight: bold;
        }
        
        .azkar-counter-large {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .counter-btn-large {
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .counter-btn-large.decrease {
            background: linear-gradient(135deg, #f44336, #e57373);
            color: white;
        }
        
        .counter-btn-large.increase {
            background: linear-gradient(135deg, #4CAF50, #66BB6A);
            color: white;
        }
        
        .counter-btn-large:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .counter-display-large {
            font-size: 32px;
            font-weight: bold;
            color: #2e7d32;
            min-width: 80px;
            padding: 10px;
            background: white;
            border-radius: 10px;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .dark-mode .counter-display-large {
            background: #2d2d2d !important;
            color: #66BB6A !important;
        }
        
        .completion-status {
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .completion-status.completed {
            background: linear-gradient(135deg, #4CAF50, #66BB6A);
            color: white;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .navigation-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            gap: 15px;
        }
        
        .nav-btn {
            padding: 12px 20px;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            background: linear-gradient(135deg, #2196F3, #42A5F5);
            color: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .nav-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        
        .nav-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .quick-actions {
            display: flex;
            gap: 10px;
        }
        
        .action-btn {
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 50%;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .action-btn.reset {
            background: linear-gradient(135deg, #FF9800, #FFB74D);
            color: white;
        }
        
        .action-btn.complete {
            background: linear-gradient(135deg, #4CAF50, #66BB6A);
            color: white;
        }
        
        .action-btn.overview {
            background: linear-gradient(135deg, #9C27B0, #BA68C8);
            color: white;
        }
        
        .action-btn:hover {
            transform: scale(1.1);
        }
        
        .quick-indicators {
            display: flex;
            justify-content: center;
            gap: 8px;
            flex-wrap: wrap;
        }
        
        .indicator-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ddd;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .indicator-dot.active {
            background: #2196F3;
            transform: scale(1.3);
        }
        
        .indicator-dot.completed {
            background: #4CAF50;
        }
        
        .indicator-dot.completed::after {
            content: '✓';
            position: absolute;
            top: -2px;
            left: -1px;
            font-size: 10px;
            color: white;
            font-weight: bold;
        }
        
        .azkar-overview {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .overview-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 15px;
            background: linear-gradient(135deg, #4CAF50, #66BB6A);
            color: white;
            border-radius: 10px;
        }
        
        .overview-stats {
            display: flex;
            justify-content: space-around;
            margin-bottom: 25px;
            padding: 15px;
            background: rgba(76, 175, 80, 0.1);
            border-radius: 10px;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-label {
            display: block;
            font-size: 14px;
            color: #666;
            margin-bottom: 5px;
        }
        
        .stat-value {
            font-size: 24px;
            font-weight: bold;
            color: #2e7d32;
        }
        
        .overview-list {
            display: grid;
            gap: 15px;
        }
        
        .overview-item {
            padding: 15px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-right: 4px solid #ddd;
            transition: all 0.3s ease;
        }
        
        .dark-mode .overview-item {
            background: #2d2d2d;
            color: #e0e0e0;
            border-right-color: #555;
        }
        
        .overview-item.completed {
            border-right-color: #4CAF50;
            background: rgba(76, 175, 80, 0.05);
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .item-number {
            font-weight: bold;
            color: #2e7d32;
        }
        
        .item-text {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 10px;
            color: #333;
        }
        
        .item-progress {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .progress-bar-small {
            flex: 1;
            height: 6px;
            background: #eee;
            border-radius: 3px;
            overflow: hidden;
        }
        
        .progress-fill-small {
            height: 100%;
            background: linear-gradient(90deg, #4CAF50, #66BB6A);
            transition: width 0.3s ease;
        }
        
        .progress-text {
            font-size: 14px;
            color: #666;
            min-width: 50px;
        }
        
        @media (max-width: 768px) {
            .azkar-internal-navigator {
                padding: 15px;
            }
            
            .azkar-text-large {
                font-size: 20px;
                padding: 15px;
            }
            
            .navigation-controls {
                flex-direction: column;
                gap: 10px;
            }
            
            .nav-btn {
                width: 100%;
            }
            
            .overview-stats {
                flex-direction: column;
                gap: 15px;
            }
        }
        </style>
    `;
    
    if (!document.getElementById('internal-cursor-styles')) {
        const styleElement = document.createElement('div');
        styleElement.id = 'internal-cursor-styles';
        styleElement.innerHTML = styles;
        document.head.appendChild(styleElement);
    }
}

// تشغيل التهيئة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInternalAzkarCursor);
} else {
    initInternalAzkarCursor();
}

console.log('🎯 تم تحميل نظام المؤشر الداخلي للأذكار');