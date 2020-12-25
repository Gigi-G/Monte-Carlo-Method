import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { DescriptionComponent } from './description/description.component';
import { MathjaxComponent } from './mathjax/mathjax.component';
import { GlobalService } from './global.service';
import { ExampleComponent } from './example/example.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    DescriptionComponent,
    MathjaxComponent,
    ExampleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
