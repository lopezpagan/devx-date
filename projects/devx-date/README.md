# DevxDate

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.0.

## Generate

Run `ng generate component component-name --project devx-date` to generate a new component. 

## Build

Run `ng build devx-date` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build devx-date`, go to the dist folder `cd dist/devx-date` and run `npm publish`.

## Running unit tests

Run `ng test devx-date` to execute the unit tests via [Karma](https://karma-runner.github.io).

## How to use
Once you publish your library, you can import it into your Angular app.

```typescript

import { DevxDateModule } from 'devx-date';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DevxDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
``` 

Then you can use the component in your html:
```html
    <devx-date [current_date]="current_date" (setDate)="setDate($event)"></devx-date>
    <p>{{ current_date ? current_date : 'Date output here' }}</p>
```


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
