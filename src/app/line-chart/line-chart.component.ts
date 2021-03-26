import { Component, OnInit } from '@angular/core';
import { ChartDataSets, Chart, ChartData } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as pluginErrorBars from 'chartjs-plugin-error-bars'

Chart.plugins.register(pluginErrorBars)

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  constructor() { }

  chart:Chart = null;

  lineChartDataSet: ChartData = null;

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Estimated area'}
  ];

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,255,0)',
    }
  ];

  lineChartType = 'line';

  lineChartErrorBars = [
    {
      '100': null, 
      '1000': null, 
      '10000': null, 
      '100000': null, 
      '150000': null, 
      '179900': null
    }
    , {}];

  private createLineChartDataset(): any {
    let lineChartDataset = {
      labels: ['100', '1000', '10000', '100000', '150000', '179900'],
      datasets: [],
    };
    let datasets = {};
    for(let i = 0; i < this.lineChartData.length; ++i) {
      datasets = {
        label: this.lineChartData[i].label,
        data: this.lineChartData[i].data,
        borderColor: this.lineChartColors[i].borderColor,
        backgroundColor: this.lineChartColors[i].backgroundColor,
        errorBars: this.lineChartErrorBars[i]
      };
      lineChartDataset.datasets.push(datasets);
    }
    return lineChartDataset;
  }

  public initView(): void {
    let ctx = (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d");
    this.chart = new Chart(ctx, {
      type: this.lineChartType,
      data: this.createLineChartDataset(),
      options: {
        responsive: true,
        legend: {
          position: 'top',
        },
        scales: {
          yAxes: [{
            ticks: {
                min: 0,
                max: 1000
            }
        }]
        },
        plugins: [pluginErrorBars]
      },
    });
  }

  public updateView(): void {
    this.chart.data = this.createLineChartDataset();
    this.chart.update();
  }

  ngOnInit(): void {
    this.initView();
  }

}
