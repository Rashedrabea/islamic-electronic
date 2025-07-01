// اختبار الوقت الحالي
const now = new Date();
const currentHour = now.getHours();
const currentMinute = now.getMinutes();
const currentTime = currentHour * 60 + currentMinute;

console.log(`الوقت الحالي: ${currentHour}:${currentMinute.toString().padStart(2, '0')}`);
console.log(`بالدقائق: ${currentTime}`);

// مواقيت الصلاة بالدقائق
const prayers = {
    fajr: 4 * 60 + 12,    // 252 دقيقة
    dhuhr: 12 * 60 + 59,  // 779 دقيقة  
    asr: 16 * 60 + 33,    // 993 دقيقة
    maghrib: 19 * 60 + 59, // 1199 دقيقة
    isha: 21 * 60 + 32     // 1292 دقيقة
};

console.log('مواقيت الصلاة:');
Object.keys(prayers).forEach(prayer => {
    const time = prayers[prayer];
    const hour = Math.floor(time / 60);
    const minute = time % 60;
    console.log(`${prayer}: ${hour}:${minute.toString().padStart(2, '0')} (${time} دقيقة)`);
});

// البحث عن الصلاة القادمة
let nextPrayer = null;
for (const [prayer, time] of Object.entries(prayers)) {
    if (time > currentTime) {
        nextPrayer = prayer;
        break;
    }
}

console.log(`الصلاة القادمة: ${nextPrayer || 'الفجر (غداً)'}`);