import { Component } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  loading = false;

  constructor(private firebaseAuth: FirebaseAuthService, private router: Router) {}

  async onSubmit({ email, password }: { email: string; password: string }) {
    this.loading = true;
    try {
      await this.firebaseAuth.register(email, password);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err: any) {
      alert(err.message);
    } finally {
      this.loading = false;
    }
  }
}
