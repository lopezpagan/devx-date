import { Component, ViewChild, ElementRef, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'lib-devx-date',
  standalone: false,
  styleUrls: ['./devx-date.component.scss'],
  template: `
    <form [formGroup]="fg" class="devx-date">
      <label class="devx-date-mm" for="mm">
        <input #mmInput id="mm" formControlName="mm" type="text" placeholder="MM"
               inputmode="numeric" pattern="[0-9]*" maxlength="2"
               (input)="handleInput($event, ddInput)" />
      </label>

      <label class="devx-date-dd" for="dd">
        <input #ddInput id="dd" formControlName="dd" type="text" placeholder="DD"
               inputmode="numeric" pattern="[0-9]*" maxlength="2"
               (input)="handleInput($event, yyyyInput)" />
      </label>

      <label class="devx-date-yyyy" for="yyyy">
        <input #yyyyInput id="yyyy" formControlName="yyyy" type="text" placeholder="YYYY"
               inputmode="numeric" pattern="[0-9]*" maxlength="4"
               (input)="handleInput($event, null)" />
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
    input.value = input.value.replace(/\D/g, '');
    this.fg.get(input.id)?.setValue(input.value, { emitEvent: false });

    if (input.maxLength && input.value.length >= input.maxLength && nextField) {
      nextField.focus();
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
