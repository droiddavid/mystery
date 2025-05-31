import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MysteryInputBuilderService } from '../../services/mystery-input.service';
import { MysteryService } from '../../services/mystery.service';
import { Mystery } from '../../models/mystery.model';
import { SettingGalleryComponent } from '../setting-gallery/setting-gallery.component';
import { Setting } from '../../models/setting.model';

import { MysteryResultComponent } from './mystery-result.component';

@Component({
  selector: 'app-mystery-seed-form',
  standalone: true,
  imports: [CommonModule, FormsModule, SettingGalleryComponent, MysteryResultComponent],
  templateUrl: './mystery-seed-form.component.html'
})
export class MysterySeedFormComponent {
  mystery?: Mystery;
  formData = {
    playerName: '',
    mysteryType: 'crime',
    mood: ''
  };

  // Handle the selected setting from the gallery
  selectedSetting?: Setting;

  constructor(
    private seedLogic: MysteryInputBuilderService,
    private mysteryService: MysteryService
  ) {}

  // Handle the response from the mystery generation
  onSubmit(form: NgForm) {
    if (form.invalid || !this.selectedSetting) return;

    const seedInput = this.seedLogic.mysteryInputBuilder({
      ...this.formData,
      setting: this.selectedSetting
    });
    // const seedInput = this.seedLogic.mysteryInputBuilder(this.formData);


    this.mysteryService.generateMystery(seedInput).subscribe((retrievedMystery: Mystery) => {
      this.mystery = retrievedMystery;
      debugger;
    });
  }

  onSettingSelected(setting: Setting) {
    this.selectedSetting = setting;
  }
}
