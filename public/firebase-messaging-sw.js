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
    // payload가 notification일 경우 자동으로 표시됨.
    // 그래서 아래의 코드를 작성하면 중복 알림 뜸
    //const { title, body } = payload.notification;
    // self.registration.showNotification(title, { body });
});
