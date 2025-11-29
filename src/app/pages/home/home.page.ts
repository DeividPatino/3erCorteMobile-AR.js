import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TargetsService } from '../../services/targets.service';
import { NavController } from '@ionic/angular';

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

  constructor(private targetsService: TargetsService, private navCtrl: NavController) {}

  async ngOnInit() {
    this.targets = await this.targetsService.getTargets();
    this.loading = false;
  }

  openAR(target: any) {
    this.navCtrl.navigateForward('/ar', { state: { target } });
  }
}
