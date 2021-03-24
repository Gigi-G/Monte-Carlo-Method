import { Component, OnInit, ViewChild } from '@angular/core';
import { LineChartComponent } from '../line-chart/line-chart.component';

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
  contents:string[] = ['1', '2', '3', '4', '5', '6', '7'];
  areaVal:number[] = [0, 0, 0, 0, 0, 0, 0];
  @ViewChild(LineChartComponent) chart:LineChartComponent;

  constructor() { }

  private f(x:number, y:number, imageData:ImageData): number {
    let r:number = 0;
    let pos:number = (x + y * this.image.width)*4;
    if(!(imageData.data[pos+2] > imageData.data[pos] && imageData.data[pos+2] > imageData.data[pos+1]) && (imageData.data[pos] != 0 || imageData.data[pos+1] != 0 || imageData.data[pos+2] != 0) && (imageData.data[pos] != 255 || imageData.data[pos+1] != 0 || imageData.data[pos+2] != 0)) {
      r = 1;
      imageData.data[pos] = 255;
      imageData.data[pos + 1] = 0;
      imageData.data[pos + 2] = 0;
    } else if((imageData.data[pos] != 0 || imageData.data[pos+1] != 0 || imageData.data[pos+2] != 0) && (imageData.data[pos] != 255 || imageData.data[pos+1] != 0 || imageData.data[pos+2] != 0)) {
      imageData.data[pos] = 0;
      imageData.data[pos + 1] = 0;
      imageData.data[pos + 2] = 0;
    }
    return r;
  }

  private integral_MC(xMin:number, xMax:number, yMin:number, yMax:number, max_num:number = 100): number[] {
    let r:number[] = [0, 0, 0];
    let earth:number = 0;
    let imageData:ImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    for(let i:number = 0; i < max_num; ++i) {
      let x:number = Math.floor(Math.random() * (xMax - xMin) + xMin);
      let y:number = Math.floor(Math.random() * (yMax - yMin) + yMin);
      earth += this.f(x, y, imageData);
    }
    r[0] = earth;
    r[1] = max_num - earth;
    r[2] = (((max_num - earth) * (this.image.width * (2.54/96)) * (this.image.height * (2.54/96)))/max_num)*3.15;
    this.context.putImageData(imageData, 0, 0);
    console.log("Earth: " + r[0]);
    console.log("Lake: " + r[1]);
    console.log("Area: " + r[2]);
    return r;
  }

  private updateView(data:number[], i:number):void {
    (document.getElementById("D" + i) as HTMLDivElement).style.display = "flex";
    if((i+1) < 8) {
      (document.getElementById("C" + (i+1)) as HTMLDivElement).style.cssText = "display: flex; align-items: center; flex-direction: column; width: auto; height: auto;";
    }
    else {
      (document.getElementById("C" + (i+1)) as HTMLDivElement).style.cssText = "display: flex;";
      (document.getElementById("C" + (i+2)) as HTMLDivElement).style.cssText = "display: block;";
      if(this.chart.lineChartColors.length < 2) {
        this.chart.lineChartData.push({data: [370, 370, 370, 370, 370, 370, 370], label: "Real area"});
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
    (document.getElementById("A" + i) as HTMLInputElement).value = data[2].toString();
  }

  private init(num:number, i:number):void {
    this.img = document.getElementById('SourceImage') as HTMLImageElement;
    this.canvas = document.getElementById("Canvas" + i) as HTMLCanvasElement;
    this.image = new Image();
    this.image.addEventListener('load', e => {
      this.context = this.canvas.getContext('2d');
      this.canvas.height = this.image.height;
      this.context.drawImage(this.image, 0, 0);
      let data:number[] = this.integral_MC(0, this.image.width, 0, this.image.height, num);
      this.areaVal[i-1] = data[2];
      if(typeof this.chart.lineChartData[0].data[i-1] !== 'undefined') {
	      this.chart.lineChartData[0].data[i-1] = data[2];
      } else {
	      this.chart.lineChartData[0].data.push(data[2]);
      }
      this.updateView(data, i);
    }, false);
    this.image.src = this.img.src;
  }

  numberDots(num:number, i:number):number {
    return num*Math.pow(10,i-1);
  }



  exampleRun(num:number, i:number): void{
    this.init(this.numberDots(num,i), i);
  }

  

  ngOnInit(): void {
  }

}
