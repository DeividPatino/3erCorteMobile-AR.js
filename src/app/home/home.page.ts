import { Component, OnInit } from '@angular/core';
import { TargetsService } from '../services/targets.service';
import { NavController } from '@ionic/angular';
import { FirebaseAuthService } from '../services/firebase-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  targets: any[] = [];
  loading = true;
  filterMine = false;
  uid: string | null = null;

  constructor(private targetsService: TargetsService, private navCtrl: NavController, private auth: FirebaseAuthService) {}

  async ngOnInit() {
    this.uid = this.auth.currentUser()?.uid || null;
    await this.loadTargets();
  }

  async loadTargets() {
    this.loading = true;
    if (this.filterMine && this.uid) {
      this.targets = await this.targetsService.getTargetsByUser(this.uid);
    } else {
      this.targets = await this.targetsService.getTargets();
    }
    this.loading = false;
  }

  toggleFilterMine() {
    if (!this.uid) return; // no filtrar si no logueado
    this.filterMine = !this.filterMine;
    this.loadTargets();
  }

  openAR(target: any) {
    if (!target?.id) return;
    this.navCtrl.navigateForward(`/ar?id=${target.id}`); // deep link por id
  }
}
