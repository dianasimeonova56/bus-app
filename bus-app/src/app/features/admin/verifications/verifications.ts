import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { VerificationsService } from '../../../core/services';

@Component({
  selector: 'app-verifications',
  imports: [DatePipe, AsyncPipe],
  templateUrl: './verifications.html',
  styleUrl: './verifications.css',
})
export class Verifications implements OnInit {
private verificationsService = inject(VerificationsService);
  
  readonly IMAGE_BASE_URL = 'http://localhost:3000/'; 

  pendingRequests$ = this.verificationsService.verifications$;

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.verificationsService.getPendingRequests().subscribe();
  }

  approve(id: string) {
    if (confirm('Сигурни ли сте, че искате да ОДОБРИТЕ този документ?')) {
      this.verificationsService.verifyRequest(id).subscribe({
        next: () => alert('Потребителят е верифициран успешно!'),
        error: (err) => alert('Грешка при одобряване')
      });
    }
  }

  reject(id: string) {
    const reason = prompt('Въведете причина за отказ:');
    if (reason) {
      this.verificationsService.denyRequest(id, reason).subscribe({
        next: () => alert('Заявката е отхвърлена.'),
        error: (err) => alert('Грешка при отхвърляне')
      });
    }
  }

  viewDocument(url: string) {
    window.open(`${this.IMAGE_BASE_URL}${url}`, '_blank');
  }
}
