import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services';
import { Router, RouterModule } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^(?=.{6,})[a-zA-Z][a-zA-Z0-9._-]*@gmail\.(com|bg)$/)]],
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.minLength(3)]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\+?[1-9][0-9]{7,14}$/)]],
      passwords: this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
        rePassword: ['', Validators.required]
      }, { validators: this.passwordMatchValidator })
    })
  }

  get email(): AbstractControl<any, any> | null {
    return this.registerForm.get('email');
  }

  get first_name(): AbstractControl<any, any> | null {
    return this.registerForm.get('first_name');
  }

  get last_name(): AbstractControl<any, any> | null {
    return this.registerForm.get('last_name');
  }

  get phone_number(): AbstractControl<any, any> | null {
    return this.registerForm.get('phone_number');
  }

  get passwords(): FormGroup<any> {
    return this.registerForm.get('passwords') as FormGroup;
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

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { email, first_name, last_name, phone_number } = this.registerForm.value;
      const { password, rePassword } = this.registerForm.value.passwords;

      this.authService.register(email, first_name, last_name, phone_number,
        password, rePassword).subscribe({
          next: () => {
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error("Registration failed", err);
            this.markFormGroupTouched();
          }
        });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedKey => {
          const nestedControl = control.get(nestedKey)
          nestedControl?.markAllAsTouched();
        })
      } else {
        control?.markAsTouched();
      }
    })
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
