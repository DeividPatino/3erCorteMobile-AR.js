import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppButtonComponent } from './components/app-button/app-button.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';

@NgModule({
  declarations: [AppButtonComponent, AuthFormComponent],
  imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [AppButtonComponent, AuthFormComponent, RouterModule]
})
export class SharedModule {}
