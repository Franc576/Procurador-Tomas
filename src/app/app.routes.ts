import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AvisoLegalComponent } from './pages/legal/aviso-legal/aviso-legal';
import { PrivacidadComponent } from './pages/legal/privacidad/privacidad';
import { CookiesComponent } from './pages/legal/cookies/cookies';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'aviso-legal', component: AvisoLegalComponent },
  { path: 'politica-privacidad', component: PrivacidadComponent },
  { path: 'politica-cookies', component: CookiesComponent },
  { path: '**', redirectTo: '' }
];
