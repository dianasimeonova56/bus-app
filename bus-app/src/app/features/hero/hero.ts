import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxFastMarqueeModule } from 'ngx-fast-marquee';

@Component({
  selector: 'app-hero',
  imports: [NgxFastMarqueeModule, RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
}
