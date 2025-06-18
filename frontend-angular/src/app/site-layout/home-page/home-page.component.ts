import { Component, OnDestroy, OnInit } from '@angular/core';
import { Mystery } from '../../models/mystery/mystery.model';
import { MysteryService } from '../../services/mystery.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { mysteries as tempMysteries } from '../../data/temp-mysteries';
import { MysteryCardComponent } from '../../components/mystery-card/mystery-card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MysteryCardComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
  mysteries = tempMysteries;
  botPromptText = '';
  showLeftSidebar = true;
  showRightSidebar = true;
  currentSlideIndex = 0;

  slideImages = [
    { src: 'assets/carousel/blackDetectiveMansion.png', caption: 'Black Detective Mansion' },
    { src: 'assets/carousel/cyberpunkInvestigation.png', caption: 'Cyberpunk Investigation' },
    { src: 'assets/carousel/egyptianDetectiveInVillage.png', caption: 'Egyptian Detective in Village' },
    { src: 'assets/carousel/futuristicHangarBay.png', caption: 'Futuristic Hangar Bay' },
    { src: 'assets/carousel/missingDog.png', caption: 'Missing Dog' }
  ];

  autoRotateInterval: any;
  autoRotateDelay = 5000; // 5 seconds

  constructor(private mysteryService: MysteryService, private http: HttpClient) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }





  prevSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.totalSlides) % this.totalSlides;
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.totalSlides;
  }

  get totalSlides(): number {
    return this.slideImages.length;
  }


}
