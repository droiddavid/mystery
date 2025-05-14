import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { SeedLogicService } from '../../services/seed-logic.service';
import { MysteryService } from '../../services/mystery.service';
import { CommonModule } from '@angular/common';
import { Mystery } from '../../models/mystery.model';

@Component({
  selector: 'app-mystery-seed-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mystery-seed-form.component.html'
})
export class MysterySeedFormComponent {
  mystery!: Mystery;
  formData = {
    playerName: '',
    mysteryType: 'crime',
    mood: ''
  };

  constructor(
    private seedLogic: SeedLogicService,
    private mysteryService: MysteryService
  ) {}

  // Handle the response from the mystery generation
  onSubmit(form: NgForm) {
    if (form.invalid) return;

    const seedInput = this.seedLogic.createSeed(this.formData);
    this.mysteryService.generateMystery(seedInput).subscribe((retrievedMystery: Mystery) => {
      this.mystery = retrievedMystery;
    });
  }
}
