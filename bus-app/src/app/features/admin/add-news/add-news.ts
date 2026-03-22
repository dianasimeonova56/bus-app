import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsService } from '../../../core/services'; // Провери си пътя
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-news',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-news.html',
  styleUrl: './add-news.css',
})
export class AddNews {
  private fb = inject(FormBuilder);
  private newsService = inject(NewsService);
  private router = inject(Router);

  newsForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    content: ['', [Validators.required, Validators.minLength(10)]],
    category: ['Новини', Validators.required],
    imageUrl: ['', Validators.pattern('https?://.+')],
    isImportant: [false]
  });

  categories = ['Новини', 'Промени', 'Аварии', 'Промоции'];

  onSubmit() {
    if (this.newsForm.valid) {
      const newsData = this.newsForm.value;
      
      this.newsService.createNews(newsData).subscribe({
        next: () => {
          alert('Новината е създадена успешно!');
          this.router.navigate(['/news']);
        },
        error: (err) => {
          console.error('Грешка при създаване:', err);
          alert('Възникна грешка при запис на новината.');
        }
      });
    }
  }
}