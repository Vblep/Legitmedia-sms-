// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDI2ssjxwjpinnazqL3HLWOZSZG9Dhcmuc",
    authDomain: "legitmedia-sms.firebaseapp.com",
    projectId: "legitmedia-sms",
    storageBucket: "legitmedia-sms.firebasestorage.app",
    messagingSenderId: "515600323626",
    appId: "1:515600323626:web:583cecc3d1e3c6c9165f53"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background notification packet handling:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/assets/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
