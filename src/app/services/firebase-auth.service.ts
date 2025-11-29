import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, Auth } from 'firebase/auth';

// Simple mapping from Firebase auth error codes to user-friendly Spanish messages
const AUTH_ERROR_MAP: Record<string, string> = {
  'auth/network-request-failed': 'Fallo de red. Verifica conexión, proxy o modo offline.',
  'auth/invalid-email': 'Email inválido.',
  'auth/user-disabled': 'Usuario deshabilitado.',
  'auth/user-not-found': 'Usuario no encontrado.',
  'auth/wrong-password': 'Contraseña incorrecta.',
  'auth/email-already-in-use': 'El email ya está registrado.',
  'auth/weak-password': 'La contraseña es demasiado débil.'
};

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
    return createUserWithEmailAndPassword(this.auth, email, password)
      .catch(err => {
        throw this.mapAuthError(err);
      });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .catch(err => {
        throw this.mapAuthError(err);
      });
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

  private mapAuthError(err: any): Error {
    const code = err?.code;
    if (code && AUTH_ERROR_MAP[code]) {
      return new Error(AUTH_ERROR_MAP[code]);
    }
    return new Error(err?.message || 'Error desconocido en autenticación');
  }
}
