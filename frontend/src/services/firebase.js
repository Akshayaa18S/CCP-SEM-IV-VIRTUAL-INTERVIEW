// 🔥 Import Firebase Modules
import { initializeApp } from "firebase/app";
import { 
  getAuth, GoogleAuthProvider, GithubAuthProvider, 
  signInWithPopup, signOut, onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, collection, doc, setDoc, getDoc, getDocs, 
  addDoc, serverTimestamp 
} from "firebase/firestore";

// 🔥 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUrAVyIl18ZB73hgtVpCi1oMzB8f29-pw",
  authDomain: "virtual-interviewer-410ad.firebaseapp.com",
  projectId: "virtual-interviewer-410ad",
  storageBucket: "virtual-interviewer-410ad.appspot.com",
  messagingSenderId: "402846122724",
  appId: "1:402846122724:web:2bf21343ff45ac637662f1",
  measurementId: "G-7GN95C3VC7"
};

// 🔥 Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// 🔹 Sign in with Google & Save User
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("✅ Google Login Success:", result.user);
    await saveUserToFirestore(result.user);
  } catch (error) {
    console.error("❌ Google Login Error:", error.message);
  }
};

// 🔹 Sign in with GitHub & Save User
const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    console.log("✅ GitHub Login Success:", result.user);
    await saveUserToFirestore(result.user);
  } catch (error) {
    console.error("❌ GitHub Login Error:", error.message);
  }
};

// 🔹 Save User Data to Firestore
const saveUserToFirestore = async (user) => {
  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email || "No email",
        photoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
      });
      console.log("✅ User saved to Firestore!");
    } else {
      console.log("ℹ️ User already exists in Firestore.");
    }
  } catch (error) {
    console.error("❌ Error saving user to Firestore:", error);
  }
};

// 🔹 Get Firebase ID Token (For Backend)
const getIdToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch (error) {
    console.error("❌ Error getting ID token:", error);
    return null;
  }
};

// 🔹 Save Interview Report (Stored under /users/{userId}/reports/)
const saveInterviewReport = async (userId, reportData) => {
  if (!userId) {
    console.error("❌ No userId provided!");
    return;
  }

  try {
    const reportsRef = collection(db, `users/${userId}/reports`);
    await addDoc(reportsRef, {
      ...reportData,
      createdAt: serverTimestamp(),
    });

    console.log("✅ Interview report saved successfully!");
  } catch (error) {
    console.error("❌ Error saving interview report:", error);
  }
};

// 🔹 Get User's Interview Reports
const getUserReports = async (userId) => {
  if (!userId) return [];

  try {
    const reportsRef = collection(db, `users/${userId}/reports`);
    const reportsSnapshot = await getDocs(reportsRef);

    const reports = reportsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("✅ Fetched reports:", reports);
    return reports;
  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    return [];
  }
};

// 🔹 Logout function
const logout = async () => {
  try {
    await signOut(auth);
    console.log("✅ Successfully logged out.");
  } catch (error) {
    console.error("❌ Logout Error:", error.message);
  }
};

// 🔹 Listen for Authentication State Changes
const listenForAuthChanges = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Export functions for use in other parts of the app
export { 
  auth, db, 
  saveInterviewReport, getUserReports, 
  signInWithGoogle, signInWithGithub, logout, 
  getIdToken, listenForAuthChanges 
};
