import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, Auth } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  private auth: Auth;

  constructor() {
    // Uses the default app initialized in main.ts
    this.auth = getAuth();
  }

  // Auth state observable-like subscription
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  currentUser() {
    return this.auth.currentUser;
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
