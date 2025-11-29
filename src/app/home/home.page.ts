import { Component } from '@angular/core';
import { FirebaseAuthService } from '../services/firebase-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  email = '';
  password = '';
  user: any = null;

  constructor(private auth: FirebaseAuthService) {
    this.auth.onAuthStateChanged(user => this.user = user);
  }

  async demoRegister() {
    if (!this.email || !this.password) { return; }
    await this.auth.register(this.email, this.password);
  }

  async demoLogin() {
    if (!this.email || !this.password) { return; }
    await this.auth.login(this.email, this.password);
  }

  async demoLogout() {
    await this.auth.logout();
  }
}
