import { auth, db } from "./firebase"; // Pastiin path firebase config lo bener
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * Handle User Registration - Enterprise Ready Version
 * Logic: Create Auth User -> Create User Profile -> Assign Default Warehouse
 */
export const handleRegister = async (email, password, fullName = "New User") => {
  try {
    // 1. Create User di Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfileData = {
      uid: user.uid,
      email: email.toLowerCase(),
      fullName: fullName,
      role: "Operator", 
      warehouseId: "WH-001",
      status: "active",
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      license: "Standard-v1.0.0", 
      metadata: {
        appVersion: "1.0.0",
        platform: "SmartWH-Web"
      }
    };

    await setDoc(doc(db, "users", user.uid), userProfileData);

    return { 
      success: true, 
      message: "Account created and assigned to Warehouse WH-001 automatically." 
    };

  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "Email ini sudah terdaftar. Gunakan email lain.";
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "Password terlalu lemah. Gunakan minimal 6 karakter.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Format email tidak valid.";
    }

    console.error("Registration Error:", error.message);
    return { success: false, message: errorMessage };
  }
};