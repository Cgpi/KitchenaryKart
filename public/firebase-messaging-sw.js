// /* eslint-env serviceworker */
// /* global firebase */
// /* eslint-disable no-restricted-globals */

// importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// firebase.initializeApp({
//   apiKey: "AIzaSyAlPzen5Jybv5W1Vg5WafvDNxBixJfhiik",
//   authDomain: "kitchenary-kart.firebaseapp.com",
//   projectId: "kitchenary-kart",
//   storageBucket: "kitchenary-kart.firebasestorage.app",
//   messagingSenderId: "847875685331",
//   appId: "1:847875685331:web:1c5aa5384996b875604d26"
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function (payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body
//   };
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
