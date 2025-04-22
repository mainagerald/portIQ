import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface StockChartProps {
  data: {
    date: string;
    close: number;
    open?: number;
    high?: number;
    low?: number;
    volume?: number;
  }[];
  width?: number;
  height?: number;
  showVolume?: boolean;
}

const StockChart: React.FC<StockChartProps> = ({
  data,
  width = 800,
  height = 400,
  showVolume = true
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;
    
    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Set dimensions
    const margin = { top: 20, right: 30, bottom: showVolume ? 100 : 30, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const volumeHeight = showVolume ? 80 : 0;
    const priceChartHeight = chartHeight - volumeHeight;
    
    // Parse dates and sort data chronologically
    const parsedData = data
      .map(d => ({
        ...d,
        date: new Date(d.date),
        close: +d.close,
        open: d.open ? +d.open : undefined,
        high: d.high ? +d.high : undefined,
        low: d.low ? +d.low : undefined,
        volume: d.volume ? +d.volume : undefined
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Set scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
      .range([0, chartWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([d3.min(parsedData, d => d.close) * 0.95, d3.max(parsedData, d => d.close) * 1.05] as [number, number])
      .range([priceChartHeight, 0]);
    
    // Create line generator
    const line = d3.line<any>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.close))
      .curve(d3.curveMonotoneX);
    
    // Add price path
    svg.append('path')
      .datum(parsedData)
      .attr('fill', 'none')
      .attr('stroke', '#4f46e5')
      .attr('stroke-width', 2)
      .attr('d', line);
    
    // Add area under the line
    const area = d3.area<any>()
      .x(d => xScale(d.date))
      .y0(priceChartHeight)
      .y1(d => yScale(d.close))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(parsedData)
      .attr('fill', 'url(#gradient)')
      .attr('d', area);
    
    // Add gradient for area
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#4f46e5')
      .attr('stop-opacity', 0.3);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#4f46e5')
      .attr('stop-opacity', 0);
    
    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(width > 600 ? 10 : 5)
      .tickFormat(d3.timeFormat('%b %d') as any);
    
    svg.append('g')
      .attr('transform', `translate(0,${priceChartHeight})`)
      .attr('color', '#9ca3af')
      .call(xAxis);
    
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `$${d}`);
    
    svg.append('g')
      .attr('color', '#9ca3af')
      .call(yAxis);
    
    // Add volume chart if enabled
    if (showVolume && parsedData[0].volume !== undefined) {
      const volumeScale = d3.scaleLinear()
        .domain([0, d3.max(parsedData, d => d.volume) as number])
        .range([volumeHeight, 0]);
      
      const volumeAxis = d3.axisRight(volumeScale)
        .ticks(3)
        .tickFormat(d => {
          if (d >= 1000000) return `${(+d / 1000000).toFixed(1)}M`;
          if (d >= 1000) return `${(+d / 1000).toFixed(1)}K`;
          return `${d}`;
        });
      
      // Add volume bars
      svg.selectAll('.volume-bar')
        .data(parsedData)
        .enter()
        .append('rect')
        .attr('class', 'volume-bar')
        .attr('x', d => xScale(d.date) - (chartWidth / parsedData.length) / 2)
        .attr('y', d => priceChartHeight + volumeScale(d.volume || 0))
        .attr('width', chartWidth / parsedData.length - 1)
        .attr('height', d => volumeHeight - volumeScale(d.volume || 0))
        .attr('fill', (d, i) => {
          if (i > 0 && parsedData[i].close > parsedData[i-1].close) {
            return '#10b981'; // Green for up days
          }
          return '#ef4444'; // Red for down days
        })
        .attr('opacity', 0.7);
      
      // Add volume axis
      svg.append('g')
        .attr('transform', `translate(${chartWidth}, ${priceChartHeight})`)
        .attr('color', '#9ca3af')
        .call(volumeAxis);
      
      // Add volume label
      svg.append('text')
        .attr('x', chartWidth)
        .attr('y', priceChartHeight - 5)
        .attr('text-anchor', 'end')
        .attr('fill', '#9ca3af')
        .attr('font-size', '10px')
        .text('Volume');
    }
    
    // Add tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'chart-tooltip')
      .style('position', 'absolute')
      .style('background-color', 'rgba(17, 24, 39, 0.9)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 100);
    
    // Add overlay for tooltip
    const overlay = svg.append('rect')
      .attr('width', chartWidth)
      .attr('height', priceChartHeight)
      .attr('fill', 'none')
      .attr('pointer-events', 'all');
    
    // Add vertical line for tooltip
    const tooltipLine = svg.append('line')
      .attr('stroke', '#9ca3af')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .attr('y1', 0)
      .attr('y2', priceChartHeight)
      .style('opacity', 0);
    
    // Add tooltip circle
    const tooltipCircle = svg.append('circle')
      .attr('r', 4)
      .attr('fill', '#4f46e5')
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .style('opacity', 0);
    
    // Mouse events for tooltip
    overlay
      .on('mousemove', function(event) {
        const [mouseX] = d3.pointer(event);
        const xDate = xScale.invert(mouseX);
        
        // Find closest data point
        const bisect = d3.bisector((d: any) => d.date).left;
        const index = bisect(parsedData, xDate, 1);
        const d0 = parsedData[index - 1];
        const d1 = parsedData[index] || d0;
        const d = xDate.getTime() - d0.date.getTime() > d1.date.getTime() - xDate.getTime() ? d1 : d0;
        
        // Position tooltip elements
        tooltipLine
          .attr('x1', xScale(d.date))
          .attr('x2', xScale(d.date))
          .style('opacity', 1);
        
        tooltipCircle
          .attr('cx', xScale(d.date))
          .attr('cy', yScale(d.close))
          .style('opacity', 1);
        
        // Format date
        const formatDate = d3.timeFormat('%B %d, %Y');
        
        // Update tooltip content
        tooltip
          .style('opacity', 1)
          .style('left', `${event.pageX + 15}px`)
          .style('top', `${event.pageY - 30}px`)
          .html(`
            <div>
              <div style="font-weight: bold">${formatDate(d.date)}</div>
              <div>Price: $${d.close.toFixed(2)}</div>
              ${d.volume ? `<div>Volume: ${d.volume.toLocaleString()}</div>` : ''}
              ${d.open ? `<div>Open: $${d.open.toFixed(2)}</div>` : ''}
              ${d.high ? `<div>High: $${d.high.toFixed(2)}</div>` : ''}
              ${d.low ? `<div>Low: $${d.low.toFixed(2)}</div>` : ''}
            </div>
          `);
      })
      .on('mouseout', function() {
        tooltip.style('opacity', 0);
        tooltipLine.style('opacity', 0);
        tooltipCircle.style('opacity', 0);
      });
    
    // Clean up tooltip on unmount
    return () => {
      d3.select('.chart-tooltip').remove();
    };
  }, [data, width, height, showVolume]);
  
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-md flex items-center justify-center h-[400px]">
        <p className="text-gray-400">No chart data available</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-md">
      <svg ref={svgRef} className="w-full h-auto" preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${width} ${height}`} />
    </div>
  );
};

export default StockChart;
