import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { AuthService, BookingsService } from '../../core/services';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PopulatedBooking, User } from '../../models';
import { AsyncPipe, DatePipe } from '@angular/common';
import { map, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, DatePipe, AsyncPipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private bookingsService = inject(BookingsService);
  readonly currentUser = this.authService.currentUser;
  private formBuilder = inject(FormBuilder);
  user = signal<User | null>(null);
  bookings$: Observable<PopulatedBooking[]> = of([]);
  expandedBookingId = signal<string | undefined>(undefined);

  editProfileForm: FormGroup;

  constructor(private cdr: ChangeDetectorRef) {
    this.editProfileForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^(?=.{6,})[a-zA-Z][a-zA-Z0-9._-]*@gmail\.(com|bg)$/)]],
      first_name: ['', [Validators.required, Validators.minLength(5)]],
      last_name: ['', [Validators.required, Validators.minLength(5)]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\+?[1-9][0-9]{7,14}$/)]],
      passwords: this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
        rePassword: ['', Validators.required]
      }, { validators: this.passwordMatchValidator })
    })

    this.bookings$ = this.bookingsService.userBookingsPopulated$;
    console.log(this.bookings$);
  }

  ngOnInit(): void {
    const currentUserData = this.authService.currentUser();
    this.user.set(currentUserData);

    this.bookingsService.getBookingsForUser(currentUserData?._id)
      .pipe(
        map((res: any) => res.bookings || res)
      )
      .subscribe({
        next: (bookings) => {
        }
      });

  }

  toggle(id: string): void {
    this.expandedBookingId.update(currentId => currentId === id ? undefined : id);
  }

  get email(): AbstractControl<any, any> | null {
    return this.editProfileForm.get('email');
  }

  get first_name(): AbstractControl<any, any> | null {
    return this.editProfileForm.get('first_name');
  }

  get last_name(): AbstractControl<any, any> | null {
    return this.editProfileForm.get('last_name');
  }

  get phone_number(): AbstractControl<any, any> | null {
    return this.editProfileForm.get('phone_number');
  }

  get passwords(): FormGroup<any> {
    return this.editProfileForm.get('passwords') as FormGroup;
  }

  get password(): AbstractControl<any, any> | null {
    return this.passwords.get('password');
  }

  get rePassword(): AbstractControl<any, any> | null {
    return this.passwords.get('rePassword');
  }

  get isEmailValid(): boolean {
    return this.email?.invalid && (this.email?.dirty || this.email?.touched) || false;
  }

  get isfirstNameValid(): boolean {
    return this.first_name?.invalid && (this.first_name?.dirty || this.first_name?.touched) || false;
  }

  get islastNameValid(): boolean {
    return this.last_name?.invalid && (this.last_name?.dirty || this.last_name?.touched) || false;
  }

  get isPhoneValid(): boolean {
    return this.phone_number?.invalid && (this.phone_number?.dirty || this.phone_number?.touched) || false;
  }

  get isPasswordsValid(): boolean {
    return this.passwords?.invalid && (this.passwords?.dirty || this.passwords?.touched) || false;
  }

  get emailErrorMessage(): string {
    if (this.email?.errors?.['required']) {
      return 'Email is required!';
    }

    if (this.email?.errors?.['pattern']) {
      return 'Email is not valid!';
    }

    return '';
  }

  get firstNameErrorMessage(): string {
    if (this.first_name?.errors?.['required']) {
      return 'First name is required!';
    }

    if (this.first_name?.errors?.['minlength']) {
      return 'First name must be at least 3 chars!';
    }

    return '';
  }

  get lastNameErrorMessage(): string {
    if (this.last_name?.errors?.['required']) {
      return 'Last name is required!';
    }

    if (this.last_name?.errors?.['minlength']) {
      return 'Last name must be at least 3 chars!';
    }

    return '';
  }

  get phoneErrorMessage(): string {
    if (this.phone_number?.errors?.['required']) {
      return 'Phone is required!';
    }

    if (this.phone_number?.errors?.['pattern']) {
      return 'Phone is not valid!';
    }

    return '';
  }

  get passwordErrorMessage(): string {
    if (this.password?.errors?.['required']) {
      return 'Password is required!';
    }

    if (this.password?.errors?.['minlength']) {
      return 'Password must be at least 5 characters!';
    }

    if (this.password?.errors?.['pattern']) {
      return 'Password is not valid!';
    }

    if (this.password?.errors?.['passwordMismatch']) {
      return 'Passwords do not match!';
    }

    return '';
  }

  get rePasswordErrorMessage(): string {
    if (this.password?.errors?.['required']) {
      return 'Password is required!';
    }

    if (this.password?.errors?.['minlength']) {
      return 'Password must be at least 5 characters!';
    }

    if (this.password?.errors?.['passwordMismatch']) {
      return 'Passwords do not match!';
    }

    return '';
  }

  cancelBooking(bookingId: string): void {
    debugger
    let res = confirm("Сигурни ли сте, че искате да откажете тази резервация?");
    
    if(res) {
      this.bookingsService.cancelBooking(bookingId).subscribe({
        next: () => {
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Error during cancel trip", err);
        }
      })
    }
  }

  onSave(): void {
    if (this.editProfileForm.valid) {
      const { email, first_name, last_name, phone_number, password } = this.editProfileForm.value;

      const user = <User>{
        _id: this.user()?._id,
        email: email,
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        password: password
      }

      this.authService.updateUser(user).subscribe({
        next: () => this.user.set(this.authService.currentUser())
        ,
        // error: (err) => {
        //   this.errorService.setError(`Failed to save user: ${err}`)
        // }
      });
      this.editProfileForm.reset();
      this.cdr.detectChanges();
    }
  }

  private passwordMatchValidator(passwordsControl: AbstractControl): ValidationErrors | null {
    const password = passwordsControl.get('password');
    const rePassword = passwordsControl.get('rePassword');

    if (password && rePassword && password.value !== rePassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }
}
