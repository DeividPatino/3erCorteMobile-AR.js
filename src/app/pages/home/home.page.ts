import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TargetsService } from '../../services/targets.service';
import { NavController } from '@ionic/angular';
import { FirebaseAuthService } from '../../services/firebase-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule]
})
export class HomePage implements OnInit {
  targets: any[] = [];
  loading = true;

  constructor(private targetsService: TargetsService, private navCtrl: NavController, private auth: FirebaseAuthService) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.loading = true;
    try {
      const uid = this.auth.currentUser()?.uid || null;
      this.targets = uid ? await this.targetsService.getTargetsByUser(uid) : await this.targetsService.getTargets();
    } finally {
      this.loading = false;
    }
  }

  refresh() { this.load(); }

  openAR(target: any) {
    // Deep link por id y pasar el objeto en state
    this.navCtrl.navigateForward(['/ar'], { state: { target }, queryParams: { id: target.id } as any });
  }
}
