import { Routes } from '@angular/router';

export const routes: Routes = [
     {
          path: '',
          loadComponent: () => import('./site-layout/home-page/home-page.component').then(m => m.HomePageComponent)
     },
     {
          path: 'seed',
          loadComponent: () => import('./features/mystery-seed-form/mystery-seed-form.component').then(m => m.MysterySeedFormComponent)
     },
     {
          path: 'gallery',
          loadComponent: () => import('./features/setting-gallery/setting-gallery.component').then(m => m.SettingGalleryComponent)
     },
     {
          path: 'mystery-viewer',
          loadComponent: () => import('./features/render-mystery/render-mystery.component').then(m => m.RenderMysteryComponent)
     },
     { path: '**', redirectTo: 'seed' }
];
