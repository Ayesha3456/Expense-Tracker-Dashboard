import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnChanges, AfterViewInit {
  @Input() income: number = 0;
  @Input() expense: number = 0;
  @Input() incomeColor: string = '#28a745';
  @Input() expenseColor: string = '#dc3545';
  @ViewChild('pieChart', { static: true }) pieChartRef!: ElementRef;

  ngAfterViewInit() {
    this.drawPieChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.pieChartRef) {
      this.drawPieChart();
    }
  }

  drawPieChart() {
    const svg = d3.select(this.pieChartRef.nativeElement);
    svg.selectAll('*').remove();

    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    const chart = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const data = { Income: this.income, Expense: this.expense };
    const total = this.income + this.expense;

    if (total === 0) {
      chart.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', '#aaa')
        .style('font-size', '14px')
        .text('No data available');
      return;
    }

    const color = d3.scaleOrdinal<string>()
      .domain(['Income', 'Expense'])
      .range([this.incomeColor, this.expenseColor]);

    const pie = d3.pie<any>().value(d => d[1]);
    const data_ready = pie(Object.entries(data));

    const arc = d3.arc<any>()
      .innerRadius(radius * 0.5) // donut
      .outerRadius(radius);

    chart.selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data[0])!);

    chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.2em')
      .style('font-size', '14px')
      .style('fill', '#333')
      .text(() => {
        if (this.income === 0 && this.expense > 0) return 'Expense';
        if (this.expense === 0 && this.income > 0) return 'Income';
        return 'Total';
      });

    chart.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '12px')
      .style('fill', '#666')
      .text(`₹ ${this.income + this.expense}`);
  }
}
