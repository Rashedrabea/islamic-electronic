// أصوات بديلة في حالة عدم وجود ملفات MP3
function createBackupSounds() {
  // إنشاء أصوات بديلة باستخدام Web Audio API
  if (!window.audioContext) {
    try {
      window.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('المتصفح لا يدعم Web Audio API');
      return;
    }
  }

  // صوت النقر
  window.createClickSound = function() {
    try {
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
    } catch (e) {
      console.log('تعذر إنشاء صوت النقر');
    }
  };

  // صوت الإنجاز
  window.createMilestoneSound = function() {
    try {
      const frequencies = [523, 659, 784]; // نوتات موسيقية
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
        }, index * 100);
      });
    } catch (e) {
      console.log('تعذر إنشاء صوت الإنجاز');
    }
  };
}

// تفعيل الأصوات البديلة عند النقر الأول
document.addEventListener('click', function() {
  createBackupSounds();
}, { once: true });