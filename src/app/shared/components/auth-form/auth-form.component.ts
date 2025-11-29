import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  standalone: false,
})
export class AuthFormComponent {
  @Input() actionLabel = 'Enviar';
  @Input() altLabel?: string; // e.g. "Ya tengo cuenta"
  @Input() altRoute?: string; // router link
  @Input() loading = false;
  @Output() submitCreds = new EventEmitter<{ email: string; password: string }>();

  email = '';
  password = '';

  doSubmit() {
    if (!this.email || !this.password) return;
    this.submitCreds.emit({ email: this.email, password: this.password });
  }
}
