import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AuthService, BookingsService, VerificationsService } from '../../core/services';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PopulatedBooking, User } from '../../models';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, AsyncPipe, NgClass],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private bookingsService = inject(BookingsService);
  private verificationService = inject(VerificationsService);
  private formBuilder = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('fileInput') fileInput!: ElementRef;

  readonly currentUser = this.authService.currentUser;
  user = signal<User | null>(null);
  bookings$: Observable<PopulatedBooking[]> = of([]);
  expandedBookingId = signal<string | undefined>(undefined);
  selectedFile: File | null = null;

  editProfileForm: FormGroup;

  constructor() {
    this.editProfileForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^(?=.{6,})[a-zA-Z][a-zA-Z0-9._-]*@gmail\.(com|bg)$/)]],
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.minLength(3)]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\+?[1-9][0-9]{7,14}$/)]],
      passwords: this.formBuilder.group({
        password: ['', [Validators.minLength(5), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
        rePassword: ['', []]
      }, { validators: this.passwordMatchValidator })
    });

    this.bookings$ = this.bookingsService.userBookingsPopulated$;
  }

  ngOnInit(): void {
    const currentUserData = this.authService.currentUser();
    if (currentUserData) {
      this.user.set(currentUserData);
      this.editProfileForm.patchValue({
        email: currentUserData.email,
        first_name: currentUserData.first_name,
        last_name: currentUserData.last_name,
        phone_number: currentUserData.phone_number
      });

      this.bookingsService.getBookingsForUser(currentUserData._id).subscribe();
    }
  }

  // --- Verification Logic ---
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submitVerification(type: string): void {
    if (!this.selectedFile) {
      alert("Моля, изберете документ!");
      return;
    }

    const formData = new FormData();
    formData.append('type', type);
    formData.append('document', this.selectedFile);
    formData.append('user', this.currentUser()?._id as string);

    this.verificationService.sendRequest(formData).subscribe({
      next: () => {
        alert("Документът е изпратен успешно за преглед!");
        this.selectedFile = null;
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
      },
      error: (err) => alert("Грешка: " + (err.error?.error || "Неуспешно изпращане"))
    });
  }

  // --- Profile Update Logic ---
  onSave(): void {
    if (this.editProfileForm.valid) {
      const formValue = this.editProfileForm.value;
      const userUpdate = {
        ...this.user(),
        email: formValue.email,
        first_name: formValue.first_name,
        last_name: formValue.last_name,
        phone_number: formValue.phone_number,
        password: formValue.passwords.password
      } as User;

      this.authService.updateUser(userUpdate).subscribe({
        next: () => {
          this.user.set(this.authService.currentUser());
          this.editProfileForm.markAsPristine();
          alert("Профилът е обновен!");
        }
      });
    }
  }

  // --- Helpers & Getters ---
  toggle(id: string): void {
    this.expandedBookingId.update(currentId => currentId === id ? undefined : id);
  }

  cancelBooking(bookingId: string): void {
    if (confirm("Сигурни ли сте, че искате да откажете тази резервация?")) {
      this.bookingsService.cancelBooking(bookingId).subscribe(() => {
        this.cdr.detectChanges();
      });
    }
  }

  private passwordMatchValidator(g: AbstractControl): ValidationErrors | null {
    return g.get('password')?.value === g.get('rePassword')?.value ? null : { passwordMismatch: true };
  }

  // Getters for template validation
  get f() { return this.editProfileForm.controls; }
  get p() { return (this.editProfileForm.get('passwords') as FormGroup).controls; }
  
  get isEmailValid() { return this.f['email'].invalid && this.f['email'].touched; }
  get isfirstNameValid() { return this.f['first_name'].invalid && this.f['first_name'].touched; }
  get islastNameValid() { return this.f['last_name'].invalid && this.f['last_name'].touched; }
  get isPhoneValid() { return this.f['phone_number'].invalid && this.f['phone_number'].touched; }
  get isPasswordsValid() { return this.editProfileForm.get('passwords')?.invalid && this.editProfileForm.get('passwords')?.touched; }
}