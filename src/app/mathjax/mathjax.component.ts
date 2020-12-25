import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import {GlobalService} from '../global.service';

@Component({
  selector: 'app-mathjax',
  inputs:['content'],
  templateUrl: './mathjax.component.html',
  styleUrls: ['./mathjax.component.scss']
})

export class MathjaxComponent implements OnChanges {
  @Input() content :string;

  constructor(public gs:GlobalService) { }
  mathJaxObject; 
  ngOnChanges(changes: SimpleChanges) {
   if (changes['content']) {
      this.renderMath()
    }
  }
  
  renderMath(){

  this.mathJaxObject  = this.gs.nativeGlobal()['MathJax'] ;
  let angObj = this;
  setTimeout(()=>{
    console.log("1234")
  angObj.mathJaxObject.Hub.Queue(["Typeset",angObj.mathJaxObject.Hub],'mathContent');

  },1000)
  } 
  loadMathConfig(){
    console.log("load config")

this.mathJaxObject  = this.gs.nativeGlobal()['MathJax'] ;
    this.mathJaxObject.Hub.Config({        
      showMathMenu: false,
      tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]},
      menuSettings: { zoom: "Double-Click",zscale: "150%" },
      CommonHTML: { linebreaks: { automatic: true } },
      "HTML-CSS": { linebreaks: { automatic: true } },
             SVG: { linebreaks: { automatic: true } }
    });
  } 

  ngOnInit(){

     this.loadMathConfig()
     this.renderMath();

  }

}
