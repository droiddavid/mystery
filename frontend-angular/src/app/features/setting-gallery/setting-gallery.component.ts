import { Component, EventEmitter, Output } from '@angular/core';
import { Setting } from '../../models/setting.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-setting-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './setting-gallery.component.html',
  styleUrl: './setting-gallery.component.scss'
})
export class SettingGalleryComponent {
  @Output() settingSelected = new EventEmitter<Setting>();
  settings: Setting[] = [
    {
      name: 'The Hollow Raven Inn',
      description: 'The air is thick with the scent of old ale and woodsmoke.',
      locationType: 'Inn'
    },
    {
      name: 'Neon Bazaar',
      description: 'A pulsing marketplace of shadows, tech, and temptation.',
      locationType: 'Cyber City'
    },
    {
      name: 'Shrouded Marshes',
      description: 'Misty wetlands where footsteps vanish in seconds.',
      locationType: 'Wilderness'
    }
  ];

  selectedSetting?: Setting;

  selectSetting(setting: Setting) {
    this.selectedSetting = setting;
    this.settingSelected.emit(setting);
  }
}

