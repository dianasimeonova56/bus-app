import { Component, OnInit, inject, signal } from '@angular/core';
import { NewsService } from '../../../core/services';
import { News } from '../../../models'; // Взимаме само News
import { NewsCard } from '../news-card/news-card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-news-section',
  standalone: true,
  imports: [CommonModule, NewsCard, RouterModule],
  templateUrl: './news-section.html',
  styleUrl: './news-section.css',
})
export class NewsSection implements OnInit {
  private newsService = inject(NewsService);
  
  latestNews = signal<News[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.newsService.getAllNews(3).subscribe({
      next: (response) => {
        this.latestNews.set(response.docs);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Грешка при зареждане на секция новини:', err);
        this.isLoading.set(false);
      }
    });
  }
}