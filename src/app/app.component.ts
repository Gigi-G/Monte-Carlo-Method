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
  mathContent = `$$\\frac{superficie_{terreno}}{superficie_{lago}} = \\frac{X}{X - N}$$<br>So you have: $$superficie_{lago} \= \\frac{(X-N) \\times superficie_{terreno}}{X}$$`
}
