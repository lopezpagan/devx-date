import { Component, ViewChild, ElementRef, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'devx-date',
  standalone: false,
  styleUrls: ['./devx-date.component.scss'],
  template: `
    <form [formGroup]="fg" class="devx-date">
      <label class="devx-date-mm" for="mm">
        <input #mmInput id="mm" formControlName="mm" type="text" placeholder="MM"
               inputmode="numeric" pattern="[0-9]*" maxlength="2"
               [class.invalid]="fg.get('mm')?.errors && fg.get('mm')?.touched"
               (input)="handleInput($event, ddInput)" />
        <div class="devx-message">
          <span class="field-label">MM</span>
          <span class="error" *ngIf="fg.get('mm')?.errors?.['required'] && fg.get('mm')?.touched">is required</span>
          <span class="error" *ngIf="fg.get('mm')?.errors?.['pattern'] && fg.get('mm')?.touched">only numbers</span>
          <span class="error" *ngIf="fg.errors?.['invalidMonth'] && fg.get('mm')?.touched">is invalid</span>
        </div>
      </label>

      <label class="devx-date-dd" for="dd">
        <input #ddInput id="dd" formControlName="dd" type="text" placeholder="DD"
               inputmode="numeric" pattern="[0-9]*" maxlength="2"
               [class.invalid]="fg.get('dd')?.errors && fg.get('dd')?.touched"
               (input)="handleInput($event, yyyyInput)" />
        <div class="devx-message">
          <span class="field-label">DD</span>
          <span class="error" *ngIf="fg.get('dd')?.errors?.['required'] && fg.get('dd')?.touched">is required</span>
          <span class="error" *ngIf="fg.get('dd')?.errors?.['pattern'] && fg.get('dd')?.touched">only numbers</span>
          <span class="error" *ngIf="fg.errors?.['invalidDay'] && fg.get('dd')?.touched">is invalid</span>
        </div>
      </label>

      <label class="devx-date-yyyy" for="yyyy">
        <input #yyyyInput id="yyyy" formControlName="yyyy" type="text" placeholder="YYYY"
               inputmode="numeric" pattern="[0-9]*" maxlength="4"
               [class.invalid]="fg.get('yyyy')?.errors && fg.get('yyyy')?.touched"
               (input)="handleInput($event, null)" />
        <div class="devx-message">
          <span class="field-label">YYYY</span>
          <span class="error" *ngIf="fg.get('yyyy')?.errors?.['required'] && fg.get('yyyy')?.touched">is required</span>
          <span class="error" *ngIf="fg.get('yyyy')?.errors?.['pattern'] && fg.get('yyyy')?.touched">only numbers</span>
        </div>
      </label>
    </form>
  `
})
export class DevxDateComponent implements OnInit {
  fg: FormGroup;

  @Input() current_date: Date = new Date();
  @Output() setDate: EventEmitter<Date> = new EventEmitter<Date>();

  constructor(private fb: FormBuilder) {
    this.fg = this.fb.group({
      mm: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      dd: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      yyyy: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
    }, { validators: this.dateValidator });
    // Watch for valid complete date
    this.fg.valueChanges.subscribe(value => {
      const { mm, dd, yyyy } = value;
      if (mm?.length === 2 && dd?.length === 2 && yyyy?.length === 4 && this.fg.valid) {
        const date = new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
        /* 
         * If the date is valid, emit it to the parent component.
         * If the date is invalid, the form will be invalid and the parent component will not be notified.
         */
        console.log('Valid date entered:', date);
        this.setDate.emit(date);

      }
    });
  }

  ngOnInit(): void {
    const month = (this.current_date.getMonth() + 1).toString().padStart(2, '0');
    const day = this.current_date.getDate().toString().padStart(2, '0');
    const year = this.current_date.getFullYear().toString();

    this.fg.patchValue({
      mm: month,
      dd: day,
      yyyy: year
    });
  }

  handleInput(event: Event, nextField: HTMLInputElement | null) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value.replace(/\D/g, '');
    
    // Validate input based on field type
    let isValid = true;
    if (input.id === 'mm') {
        isValid = !newValue || (parseInt(newValue) >= 1 && parseInt(newValue) <= 12);
    } else if (input.id === 'dd') {
        isValid = !newValue || (parseInt(newValue) >= 1 && parseInt(newValue) <= 31);
    } else if (input.id === 'yyyy') {
        isValid = !newValue || (parseInt(newValue) >= 1900 && parseInt(newValue) <= 9999);
    }
    
    // Only update value if it's valid
    if (isValid) {
        input.value = newValue;
        this.fg.get(input.id)?.setValue(newValue, { emitEvent: true });
        
        // Move to next field only if current is valid and complete
        if (input.maxLength && 
            newValue.length >= input.maxLength && 
            nextField && !this.fg.get(input.id)?.errors
        ) {
              this.fg.get('mm')?.enable();
              this.fg.get('dd')?.enable();
              this.fg.get('yyyy')?.enable();
              
              if (input.id !== 'yyyy') {
                    nextField.focus();
              }
          }
    } else {
        // Revert to previous valid value
        input.value = this.fg.get(input.id)?.value || '';
        if (input.id === 'mm') {
            this.fg.get('dd')?.disable();
            this.fg.get('yyyy')?.disable();
        }
        if (input.id === 'dd') {
            this.fg.get('mm')?.disable();
            this.fg.get('yyyy')?.disable();
        }
    }
  }

  dateValidator(group: AbstractControl) {
    const mm = parseInt(group.get('mm')?.value, 10);
    const dd = parseInt(group.get('dd')?.value, 10);
    const yyyy = parseInt(group.get('yyyy')?.value, 10);

    if (!mm || !dd || !yyyy) return null;

    if (mm < 1 || mm > 12) return { invalidMonth: true };

    let maxDays = 31;
    if ([4, 6, 9, 11].includes(mm)) {
      maxDays = 30;
    } else if (mm === 2) {
      // Leap year calculation:
      // Year is leap if it's divisible by 4 AND (not divisible by 100 OR divisible by 400)
      const isLeapYear = (yyyy % 4 === 0) && (yyyy % 100 !== 0 || yyyy % 400 === 0);
      maxDays = isLeapYear ? 29 : 28;
    }

    if (dd < 1 || dd > maxDays) return { invalidDay: true };

    return null;
  }
}


export * from '../public-api';
