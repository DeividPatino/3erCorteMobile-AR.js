import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: FirebaseAuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const user = this.auth.currentUser();
    if (user) return true;
    return this.router.createUrlTree(['/login']);
  }
}
