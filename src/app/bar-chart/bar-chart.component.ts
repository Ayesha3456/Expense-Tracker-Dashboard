import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnChanges, AfterViewInit {
  @Input() tableData: { name: string; amount: number; type: string }[] = [];
  @Input() incomeColor: string = '#28a745';
  @Input() expenseColor: string = '#dc3545';
  @ViewChild('barChart', { static: true }) barChartRef!: ElementRef;

  ngAfterViewInit() {
    this.drawChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.barChartRef) {
      this.drawChart();
    }
  }

  drawChart() {
    const svg = d3.select(this.barChartRef.nativeElement);
    svg.selectAll('*').remove();

    const width = 200;
    const height = 200;
    const margin = { top: 10, right: 10, bottom: 40, left: 40 };
    const contentWidth = width - margin.left - margin.right;
    const contentHeight = height - margin.top - margin.bottom;

    const chart = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const filteredData = this.tableData.filter(item => item.amount > 0);

    if (filteredData.length === 0) {
      chart.append('text')
        .attr('x', contentWidth / 2)
        .attr('y', contentHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', '#aaa')
        .style('font-size', '14px')
        .text('No data available');
      return;
    }

    const x = d3.scaleBand()
      .domain(filteredData.map(d => d.name))
      .range([0, contentWidth])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d.amount)!])
      .nice()
      .range([contentHeight, 0]);

    const color = (type: string) => type === 'Income' ? this.incomeColor : this.expenseColor;

    chart.append('g')
      .attr('transform', `translate(0, ${contentHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-15)')
      .style('text-anchor', 'end')
      .style('font-size', '10px');

    chart.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .style('font-size', '10px');

    chart.selectAll('.bar')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('x', d => x(d.name)!)
      .attr('y', d => y(d.amount))
      .attr('width', x.bandwidth())
      .attr('height', d => contentHeight - y(d.amount))
      .attr('fill', d => color(d.type));
  }
}
