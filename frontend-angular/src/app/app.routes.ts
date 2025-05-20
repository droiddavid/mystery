import { Routes } from '@angular/router';

export const routes: Routes = [
     {
          path: 'seed',
          loadComponent: () => import('./features/mystery-seed-form/mystery-seed-form.component').then(m => m.MysterySeedFormComponent)
     },
     {
          path: 'gallery',
          loadComponent: () => import('./features/setting-gallery/setting-gallery.component').then(m => m.SettingGalleryComponent)
     },
     { path: '**', redirectTo: 'seed' }
];
