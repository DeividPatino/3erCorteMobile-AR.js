import { Component } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  loading = false;

  constructor(private firebaseAuth: FirebaseAuthService, private router: Router) {}

  async onSubmit({ email, password }: { email: string; password: string }) {
    this.loading = true;
    try {
      await this.firebaseAuth.login(email, password);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err: any) {
      alert(err.message);
    } finally {
      this.loading = false;
    }
  }
}
