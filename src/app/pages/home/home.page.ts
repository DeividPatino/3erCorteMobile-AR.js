import { Component, OnInit } from '@angular/core';
import { TargetsService } from '../../services/targets.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
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
