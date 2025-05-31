// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { SettingGalleryComponent } from './setting-gallery.component';
// import { By } from '@angular/platform-browser';
// import { Component } from '@angular/core';
// import { Setting } from '../../models/setting.model';

describe('SettingGalleryComponent', () => {
  it('should emit and set selectedSetting when selectSetting is called', () => {
    // Arrange
    const { SettingGalleryComponent } = require('./setting-gallery.component');
    const component = new SettingGalleryComponent();
    const mockSetting = {
      name: 'Test Setting',
      description: 'A test description',
      locationType: 'TestType'
    };
    const emitSpy = jest.spyOn(component.settingSelected, 'emit');

    // Act
    component.selectSetting(mockSetting);

    // Assert
    expect(component.selectedSetting).toBe(mockSetting);
    expect(emitSpy).toHaveBeenCalledWith(mockSetting);
  });
});

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
//   it('should create', () => {
