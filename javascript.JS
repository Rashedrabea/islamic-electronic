import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = { /* إعداداتك من Firebase */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// إرسال بيانات إلى الخادم
async function saveData(data) {
  const response = await fetch('https://your-server.com/save', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json();
}

// استبدل بـ firebaseConfig الخاص بك
const firebaseConfig = {
  apiKey: "AIzaSyABCD...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


async function addDhikr(userId, dhikrText) {
  await setDoc(doc(db, "users", userId, "adhkar", Date.now().toString()), {
    text: dhikrText,
    timestamp: new Date()
  });
  console.log("تمت إضافة الذكر!");
}

// مثال: addDhikr("user123", "سبحان الله");


function syncDhikr(userId) {
const q = collection(db, "users", userId, "adhkar");
onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
        console.log("جديد:", change.doc.data());
        // أضف العنصر للواجهة فورًا
      }
      if (change.type === "removed") {
        console.log("تم الحذف:", change.doc.id);
        // احذف العنصر من الواجهة
      }
    });
  });
}

// مثال: syncDhikr("user123");