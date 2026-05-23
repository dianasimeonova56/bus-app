import { Component, DOCUMENT, effect, inject, signal } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected authService = inject(AuthService)
  private router = inject(Router);
  private document = inject(DOCUMENT);

  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly currentUser = this.authService.currentUser;

  protected role = this.currentUser()?.user_role;

  menuOpen = signal(false);

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => this.menuOpen.set(false));

    effect(() => {
      this.document.body.classList.toggle('nav-open', this.menuOpen());
    });
  }

  toggleMenu(): void {
    this.menuOpen.update(open => !open);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/home'])
      }, error: (err) => {
        console.error("Logout error", err);
      }
    });
  }
}
