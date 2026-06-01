import { Component } from '@angular/core';
import { Hero } from './sections/hero/hero';
import { About } from './sections/about/about';
import { Services } from './sections/services/services';
import { Coverage } from './sections/coverage/coverage';
import { Contact } from './sections/contact/contact';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, About, Services, Coverage, Contact],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {}
