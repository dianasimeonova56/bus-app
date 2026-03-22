import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsService } from '../../../core/services';
import { News } from '../../../models';
import { NewsCard } from '../news-card/news-card';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [CommonModule, NewsCard],
  templateUrl: './news-page.html',
  styleUrl: './news-page.css',
})
export class NewsPage implements OnInit {
  private newsService = inject(NewsService);

  // Данни и Мета информация
  newsList = signal<News[]>([]);
  paginationMeta = signal<any>(null);
  
  // Състояние
  isLoading = signal<boolean>(true);
  currentPage = signal<number>(1);
  pageSize = 6; // Колко новини на страница

  ngOnInit(): void {
    this.fetchNews(this.currentPage());
  }

  fetchNews(page: number): void {
    this.isLoading.set(true);
    this.newsService.getAllNews(this.pageSize, page).subscribe({
      next: (res: any) => {
        // Използваме твоята структура: res.docs и res.meta
        this.newsList.set(res.docs);
        this.paginationMeta.set(res.meta);
        this.currentPage.set(page);
        this.isLoading.set(false);
        
        // Скролваме до горе при смяна на страницата
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error('Грешка при зареждане:', err);
        this.isLoading.set(false);
      }
    });
  }

  // Помощна функция за генериране на масив от страници [1, 2, 3...]
  get totalPagesArray(): number[] {
    const total = this.paginationMeta()?.totalPages || 0;
    return Array.from({ length: total }, (_, i) => i + 1);
  }
}