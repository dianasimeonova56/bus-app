import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, SubscriptionService } from '../../../core/services';
import { UserSubscription } from '../../../models';

@Component({
  selector: 'app-profile-subscriptions',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './profile-subscriptions.html',
  styleUrl: './profile-subscriptions.css',
})
export class ProfileSubscriptions implements OnInit {
  private authService = inject(AuthService);
  private subscriptionService = inject(SubscriptionService);
  private router = inject(Router);

  private readonly RENEWAL_WINDOW_DAYS = 7;

  subscriptions = signal<UserSubscription[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.loading.set(false);
      return;
    }

    this.subscriptionService.getUserSubscriptions(user._id).subscribe({
      next: (res: any) => {
        this.subscriptions.set(Array.isArray(res?.subscription) ? res.subscription : []);
        this.loading.set(false);
      },
      error: () => {
        this.subscriptions.set([]);
        this.loading.set(false);
      },
    });
  }

  isActive(sub: UserSubscription): boolean {
    return !!sub.expiryDate && new Date(sub.expiryDate) > new Date();
  }

  canRenew(sub: UserSubscription): boolean {
    if (!sub.expiryDate) return true;
    return Date.now() >= this.renewableFrom(sub).getTime();
  }

  renewableFrom(sub: UserSubscription): Date {
    const from = new Date(sub.expiryDate);
    from.setDate(from.getDate() - this.RENEWAL_WINDOW_DAYS);
    return from;
  }

  renew(sub: UserSubscription): void {
    if (!this.canRenew(sub)) return;
    this.router.navigate(['/subscription/buy', sub.planId._id]);
  }

  typeLabel(type: string): string {
    switch (type) {
      case 'student': return 'Студент / Ученик';
      case 'senior': return 'Пенсионер';
      case 'disability': return 'ТЕЛК';
      default: return 'Стандартен';
    }
  }
}
