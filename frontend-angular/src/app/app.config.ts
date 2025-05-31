import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(), // This line is crucial!
    provideAnimations(),
    // Add FormsModule directly to providers (this is the key change)
    FormsModule //  This line is crucial!
  ]
};
