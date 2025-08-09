import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { DevxDateModule } from 'devx-date';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DevxDateModule, // Importing the DevxDateModule
    RouterModule // Importing RouterOutlet for routing
  ],
  exports: [
    RouterModule, // Exporting RouterModule if needed
    AppComponent,
    DevxDateModule // Exporting the DevxDateModule if needed
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

