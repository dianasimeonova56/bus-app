import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OperatorsService } from '../../../core/services';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TransportOperator } from '../../../models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-transport-operator',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-transport-operator.html',
  styleUrl: './add-transport-operator.css',
})
export class AddTransportOperator {
  private formBuilder = inject(FormBuilder);
  private operatorsService = inject(OperatorsService)
  operators$: Observable<TransportOperator[]>;

  transportOperatorForm: FormGroup;

  constructor() {
    this.transportOperatorForm = this.formBuilder.group({
      name: [''],
      email: [''],
      phone: ['']
    });
    this.operators$ = this.operatorsService.operators$;
    this.operatorsService.getOperators().subscribe();
  }

  get name(): AbstractControl<any, any> | null {
    return this.transportOperatorForm.get('name');
  }

  get email(): AbstractControl<any, any> | null {
    return this.transportOperatorForm.get('email');
  }

  get phone(): AbstractControl<any, any> | null {
    return this.transportOperatorForm.get('phone');
  }

  onSubmit(): void {
    
    if (this.name != null && this.email != null && this.phone != null) {
      const newTransportOperator = {
        name: this.name.value,
        email: this.email.value,
        phoneNumber: this.phone.value
      }

      this.operatorsService.createOperator(newTransportOperator)
        .subscribe({
          next: (created) => {
            console.log('Created operator:', created);
          },
          error: (err) => {
            console.error(err);
          }
        });
    }
  }
}
