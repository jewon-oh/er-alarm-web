importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    messagingSenderId: "...",
    appId: "..."
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[SW] 백그라운드 메시지 수신:", payload);
    const { title, body } = payload.notification;
    self.registration.showNotification(title, { body });
});
