import { Component, ViewChild } from '@angular/core';
import { MathjaxComponent } from "./mathjax/mathjax.component"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Monte-Carlo-Method';
  @ViewChild(MathjaxComponent) childView: MathjaxComponent;
  mathContent = `$$\\frac{area_{earth}}{area_{lake}} = \\frac{X}{X - N}$$<br>So you have: $$area_{lake} \= \\frac{(X-N) \\times area_{earth}}{X}$$`
}
