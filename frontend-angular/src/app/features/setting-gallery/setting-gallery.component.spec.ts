// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { SettingGalleryComponent } from './setting-gallery.component';
// import { By } from '@angular/platform-browser';
// import { Component } from '@angular/core';
// import { Setting } from '../../models/setting.model';

// describe('SettingGalleryComponent', () => {
//   let component: SettingGalleryComponent;
//   let fixture: ComponentFixture<SettingGalleryComponent>;

//   // Mock setting to test the SettingGalleryComponent
//   const MockSettings: Setting[] = [
//     {
//       name: 'The Hollow Raven Inn',
//       description: 'Old ale and woodsmoke fill the air.',
//       locationType: 'Inn'
//     },
//     {
//       name: 'Crimson Docks',
//       description: 'Fog rolls over rusted crates and wet stone.',
//       locationType: 'Harbor'
//     }
//   ];

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [SettingGalleryComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(SettingGalleryComponent);
//     component = fixture.componentInstance;
//     component.settings = MockSettings;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should render all setting cards', () => {
//     const cards = fixture.debugElement.queryAll(By.css('.setting-card'));
//     expect(cards.length).toBe(MockSettings.length);
//   });

//   it('should emit when a setting is selected', () => {
//     jest.spyOn(component.settingSelected, 'emit');
//     const firstCard = fixture.debugElement.query(By.css('.setting-card'));
//     firstCard.nativeElement.click();

//     expect(component.selectedSetting).toEqual(MockSettings[0]);
//     expect(component.settingSelected.emit).toHaveBeenCalledWith(MockSettings[0]);
//   });

//   it('should highlight selected setting', () => {
//     component.selectSetting(MockSettings[1]);
//     fixture.detectChanges();

//     const cards = fixture.debugElement.queryAll(By.css('.setting-card'));
//     const selectedCard = cards[1].nativeElement;
//     expect(selectedCard.classList).toContain('selected');
//   });
// });
