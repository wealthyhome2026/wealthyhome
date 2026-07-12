// ============================================================
// backend.js
// Backend for the Wealthy Home / Angel One referral page.
// Loaded by referral.html as: <script type="module" src="backend.js"></script>
//
// This uses the Firebase Web SDK (modular, v9+) so Firestore acts
// as the backend directly — there's no separate server process to run.
// Firebase Hosting serves referral.html + backend.js as static files,
// and this script talks to your Firestore database in the cloud.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Your web app's Firebase configuration.
// Safe to keep public — this just points the browser at your project.
// Actual protection comes from your Firestore security rules (see below).
const firebaseConfig = {
  apiKey: "AIzaSyDk9-8qK6zCByxy9afoiEmQJtWxGdkplo4",
  authDomain: "wealthyhome-76f57.firebaseapp.com",
  projectId: "wealthyhome-76f57",
  storageBucket: "wealthyhome-76f57.firebasestorage.app",
  messagingSenderId: "435425821876",
  appId: "1:435425821876:web:ee411158105dc7d27b83e1",
  measurementId: "G-BBZVPCWTHG"
};

const app = initializeApp(firebaseConfig);

let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // Analytics can fail silently on some browsers/ad-blockers — safe to ignore.
}

const db = getFirestore(app);

/**
 * Saves one referral submission to the "referrals" collection in Firestore.
 * Called by referral.html when the "Save Referral & Open WhatsApp" button is clicked.
 *
 * @param {Object} data
 * @param {string} data.referrerName
 * @param {string} data.referrerPhone
 * @param {string} data.referrerClientCode
 * @param {string} data.friendName
 * @param {string} data.friendPhone
 * @param {string} data.subBrokerCode
 * @param {string} data.source
 * @returns {Promise<void>}
 */
window.saveReferral = async function (data) {
  await addDoc(collection(db, "referrals"), {
    ...data,
    createdAt: serverTimestamp()
  });
};

// ============================================================
// Firestore security rules (paste into Firebase Console ->
// Firestore Database -> Rules). This is what actually keeps
// the "referrals" data safe — it lets anyone ADD a referral,
// but nobody can read, list, edit, or delete existing ones
// from the browser:
//
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /referrals/{docId} {
//       allow create: if request.resource.data.referrerName is string
//                      && request.resource.data.friendName is string;
//       allow read, update, delete: if false;
//     }
//   }
// }
//
// To view submissions: Firebase Console -> Firestore Database ->
// "referrals" collection. A protected admin page (with Firebase
// Auth) is the next step if you want to browse them in-app.
// ============================================================
