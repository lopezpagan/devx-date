import { NgModule } from '@angular/core';
import { DevxDateComponent } from './devx-date.component';
import { CommonModule } from '@angular/common';
import { DevxDateService } from './devx-date.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  // Add your components, directives, and pipes here if needed
  declarations: [
    DevxDateComponent,
    // No declarations needed for standalone components
  ],
  imports: [
    CommonModule, // Importing the standalone component
    ReactiveFormsModule // Importing ReactiveFormsModule if needed
  ],
  exports: [
    DevxDateComponent // Exporting the standalone component
  ],
  providers: [
    DevxDateService,// Add any services if needed
  ]
})
export class DevxDateModule {}
