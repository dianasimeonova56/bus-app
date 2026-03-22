import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NewsService } from '../../../core/services';
import { News } from '../../../models';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './news-details.html',
  styleUrl: './news-details.css',
})
export class NewsDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);
  private titleService = inject(Title);

  news = signal<News | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.newsService.getNews(id).subscribe({
        next: (data) => {
          this.news.set(data);
          if (data.title) {
            this.titleService.setTitle(`${data.title} | Новини`);
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Грешка при зареждане на новината:', err);
          this.isLoading.set(false);
        }
      });
    }
  }
}