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

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Estimated area'}
  ];

  lineChartLabels: Label[] = ['100', '1000', '100000', '1000000', '10000000', '100000000', '1000000000'];

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,255,0)',
    }
  ];

  lineChartType = 'line';

  lineChartErrorBars = [];

  private createLineChartDataset(): any {
    let lineChartDataset = {
      labels: ['100', '1000', '100000', '1000000', '10000000', '100000000', '1000000000'],
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

  public updateView(): void {
    let ctx = (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d");
    new Chart(ctx, {
      type: this.lineChartType,
      data: this.createLineChartDataset(),
      options: {
        responsive: true,
        legend: {
          position: 'top',
        },
        plugins: [pluginErrorBars]
      },
    });
  }

  ngOnInit(): void {
    this.updateView();
  }

}
