import { Component, OnInit, ViewChild } from '@angular/core';
import { LineChartComponent } from '../line-chart/line-chart.component';
import * as Quantile from 'distributions-normal-quantile';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {

  img:HTMLImageElement;
  canvas:HTMLCanvasElement;
  image:HTMLImageElement;
  context:CanvasRenderingContext2D;
  contents:string[] = ['1', '2', '3', '4', '5', '6'];
  areaVal:number[] = [0, 0, 0, 0, 0, 0];
  @ViewChild(LineChartComponent) chart:LineChartComponent;

  constructor() { }

  private getColorIndicesForCoord(x:number, y:number, width:number):number[] {
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
  }

  private f(x:number, y:number, imageData:ImageData): number {
    let r:number = 0;
    let colorIndices:number[] = this.getColorIndicesForCoord(x, y, this.canvas.width);
    let redIndex = colorIndices[0];
    let greenIndex = colorIndices[1];
    let blueIndex = colorIndices[2];
    if ((imageData.data[redIndex] >= 170 && imageData.data[greenIndex] >= 200 && imageData.data[blueIndex] == 255)){
      r = 1;
      imageData.data[redIndex] = 0;
      imageData.data[greenIndex] = 0;
      imageData.data[blueIndex] = 0;
    }
    else if ((imageData.data[redIndex] == 0 && imageData.data[greenIndex] == 0 && imageData.data[blueIndex] == 0)) {
      r = 1;
    } 
    else if((imageData.data[redIndex] != 255 && imageData.data[greenIndex] != 0 && imageData.data[blueIndex] != 0)) {
      imageData.data[redIndex] = 255;
      imageData.data[greenIndex] = 0;
      imageData.data[blueIndex] = 0;
    }
    return r;
  }

  private proportion(x:number):number {
    let realArea = 2034.81;
    let imageArea = this.image.width * this.image.height;
    console.log(x);
    return (realArea * x / imageArea);
  }

  private integral_MC(xMin:number, xMax:number, yMin:number, yMax:number, max_num:number = 100): number[] {
    let r:number[] = [0, 0, 0];
    let lake:number = 0;
    let imageData:ImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    for(let i:number = 0; i < max_num; ++i) {
      let x:number = Math.floor(Math.random() * (xMax - xMin) + xMin);
      let y:number = Math.floor(Math.random() * (yMax - yMin) + yMin);
      let result:number = this.f(x, y, imageData);
      lake += result;
    }
    r[0] = max_num - lake;
    r[1] = lake;
    r[2] = (r[1] /max_num) * (this.canvas.width * this.canvas.height);
    this.context.putImageData(imageData, 0, 0);
    console.log("Earth: " + r[0]);
    console.log("Lake: " + r[1]);
    console.log("Area: " + this.proportion(r[2]));
    return r;
  }

  private confidenceInterval(alpha:number, Nh:number, N:number, imageArea:number, stimateArea:number):number[] {
    let r:number[] = [0, 0];
    let Z = Quantile(1-(alpha/2));
    let p = Nh/N;
    r[0] = stimateArea - (Z * Math.sqrt((p*(1-p))/N)*imageArea);
    r[1] = stimateArea + (Z * Math.sqrt((p*(1-p))/N)*imageArea);
    return r;
  }

  private updateView(data:number[], i:number, confidenceInt:number[]):void {
    (document.getElementById("D" + i) as HTMLDivElement).style.display = "flex";
    if((i+1) < 7) {
      (document.getElementById("C" + (i+1)) as HTMLDivElement).style.cssText = "display: flex; align-items: center; flex-direction: column; width: auto; height: auto;";
    }
    else {
      (document.getElementById("C" + (i+1)) as HTMLDivElement).style.cssText = "display: flex;";
      (document.getElementById("C" + (i+2)) as HTMLDivElement).style.cssText = "display: block;";
      if(this.chart.lineChartColors.length < 2) {
        this.chart.lineChartData.push({data: [370, 370, 370, 370, 370, 370], label: "Real area"});
        this.chart.lineChartColors.push(
          {
            borderColor: 'red',
            backgroundColor: 'rgba(255,255,255,0)',
        });
      }
    }
    this.chart.updateView();
    (document.getElementById("E" + i) as HTMLInputElement).value = data[0].toString();
    (document.getElementById("L" + i) as HTMLInputElement).value = data[1].toString();
    (document.getElementById("A" + i) as HTMLInputElement).value = this.proportion(data[2]).toString();
    (document.getElementById("I" + i) as HTMLInputElement).value = "[" + this.proportion(confidenceInt[0]).toString() + ", " + this.proportion(confidenceInt[1]).toString() + "]";
  }

  private init(num:number, i:number):void {
    this.img = document.getElementById('SourceImage') as HTMLImageElement;
    this.canvas = document.getElementById("Canvas" + i) as HTMLCanvasElement;
    this.image = new Image();
    this.image.addEventListener('load', e => {
      this.context = this.canvas.getContext('2d');
      this.canvas.height = this.image.height;
      this.canvas.width = this.image.width;
      this.context.drawImage(this.image, 0, 0);
      let data:number[] = this.integral_MC(0, this.canvas.width, 0, this.canvas.height, num);
      let confidenceInt:number[] = this.confidenceInterval(0.01, data[1], num, this.image.width*this.image.height, data[2]);
      console.log("Confidence Interval: [" + this.proportion(confidenceInt[0]).toString() + ", " + this.proportion(confidenceInt[1]).toString() + "]");
      this.areaVal[i-1] = data[2];
      if(typeof this.chart.lineChartData[0].data[i-1] !== 'undefined') {
	      this.chart.lineChartData[0].data[i-1] = this.proportion(data[2]);
      } else {
	      this.chart.lineChartData[0].data.push(this.proportion(data[2]));
      }
      this.chart.lineChartErrorBars[0][num.toString()] = {plus: this.proportion(confidenceInt[1] - data[2]), minus: this.proportion(confidenceInt[0] - data[2])};
      this.updateView(data, i, confidenceInt);
    }, false);
    this.image.src = this.img.src;
  }

  numberDots(num:number, i:number):number {
    let dots = num*Math.pow(10,i-1);
    if(dots == 1000000) {
      dots = 150000;
    }
    else if(dots == 10000000) {
      dots = 179900;
    }
    return dots;
  }



  exampleRun(num:number, i:number): void{
    this.init(this.numberDots(num,i), i);
  }

  

  ngOnInit(): void {
  }

}
