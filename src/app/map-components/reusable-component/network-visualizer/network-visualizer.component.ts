import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';
import { NetworkService } from '../../../service/network.service';
import { NetworkData, NetworkElement, Connection, GraphNode, GraphLink } from '../../../models/network.model';

@Component({
  selector: 'app-network-visualizer',
  templateUrl: './network-visualizer.component.html',
  styleUrls: ['./network-visualizer.component.scss'],
  standalone: false
})
export class NetworkVisualizerComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('graphContainer', { static: true }) graphContainer!: ElementRef;

  private subscription: Subscription = new Subscription();
  private svg: any;
  private simulation: any;
  private nodes: GraphNode[] = [];
  private links: GraphLink[] = [];
  private zoom: any;
  private mainGroup: any;
  // Tooltip
  private tooltip: any;
  public currentNetworkType = 'large';
  public isStaticLayout = false;

  constructor(private networkService: NetworkService) { }

  ngOnInit(): void {
    this.subscription.add(
      this.networkService.networkData$.subscribe(networkData => {
        const graphData = this.networkService.convertToGraphData(networkData);
        this.nodes = graphData.nodes;
        this.links = graphData.links;
        this.currentNetworkType = this.networkService.getCurrentNetworkType();
        this.updateGraph();
      })
    );
  }

  ngAfterViewInit(): void {
    this.initializeGraph();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.simulation) {
      this.simulation.stop();
    }
  }

  private initializeGraph(): void {
    const container = this.graphContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear existing content
    d3.select(container).selectAll('*').remove();

    // Create SVG with dynamic size for large networks
    this.svg = d3.select(container)
      .append('svg')
      .attr('width', Math.max(width, 2000))
      .attr('height', Math.max(height, 1500));

    // Create main group that will be zoomed
    this.mainGroup = this.svg.append('g');

    // Add zoom behavior with better limits for large networks
    this.zoom = d3.zoom()
      .scaleExtent([0.05, 8])
      .on('zoom', (event: any) => {
        this.mainGroup.attr('transform', event.transform);
      });

    this.svg.call(this.zoom);

    // Create tooltip
    this.tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000');

    this.updateGraph();
  }

  private getCableColor(cableType: string | undefined): string {
    switch (cableType) {
      case '12FO':
        return '#4CAF50'; 
      case '24FO':
        return '#2196F3'; 
      case '48FO':
        return '#FF9800'; 
      case '96FO':
        return '#8D6E63'; 
      case '144FO':
        return '#FFB6C1'; 
      default:
        return '#999'; 
    }
  }

  private updateGraph(): void {
    if (!this.mainGroup) return;

    // Clear existing elements
    this.mainGroup.selectAll('*').remove();

    // Create force simulation with better parameters for large networks
    const isLargeNetwork = this.nodes.length > 10;
    const linkDistance = isLargeNetwork ? 200 : 150;
    const chargeStrength = isLargeNetwork ? -500 : -300;
    const centerX = isLargeNetwork ? 800 : 400;
    const centerY = isLargeNetwork ? 600 : 300;
    
    if (this.isStaticLayout) {
      // Static layout - arrange nodes in a grid or predefined positions
      this.createStaticLayout();
    } else {
      // Fluidic layout - use force simulation
      this.simulation = d3.forceSimulation(this.nodes)
        .force('link', d3.forceLink(this.links).id((d: any) => d.id).distance(linkDistance).strength(0.7))
        .force('charge', d3.forceManyBody().strength(chargeStrength))
        .force('center', d3.forceCenter(centerX, centerY))
        .force('collision', d3.forceCollide().radius(60))
        .alphaDecay(0.02) // Slower decay for smoother transitions
        .velocityDecay(0.4); // Less velocity decay for more responsive dragging
    }

    // Create links
    const link = this.mainGroup.append('g')
      .selectAll('line')
      .data(this.links)
      .enter()
      .append('line')
      .attr('stroke', (d: GraphLink) => this.getCableColor(d.cable_type))
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)
      .attr('stroke-dasharray', '5,5');

    // Create link labels
    const linkLabels = this.mainGroup.append('g')
      .selectAll('g')
      .data(this.links)
      .enter()
      .append('g')
      .attr('class', 'link-label-group');

    // Add text elements for each line
    linkLabels.each((d: GraphLink, i: number, nodes: any) => {
      const labelGroup = d3.select(nodes[i]);
      const lines = (d.label || 'Unknown').split('\n');
      
      lines.forEach((line: string, lineIndex: number) => {
        labelGroup.append('text')
          .attr('class', 'link-label')
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', this.getCableColor(d.cable_type))
          .attr('dy', lineIndex * 12) // 12px spacing between lines
          .text(line);
      });
    });

    // Create nodes
    const node = this.mainGroup.append('g')
      .selectAll('g')
      .data(this.nodes)
      .enter()
      .append('g')
      .attr('class', 'node');

    // Add drag behavior to each node
    node.call(d3.drag()
      .on('start', this.dragstarted.bind(this))
      .on('drag', this.dragged.bind(this))
      .on('end', this.dragended.bind(this)));

    // Add shapes based on node type
    node.each((d: GraphNode, i: number, nodes: any) => {
      const nodeElement = d3.select(nodes[i]);
      
      // Add invisible drag area first (larger than the visible shape)
      const dragRadius = d.type === 'FDT' ? 40 : 30;
      nodeElement.append('circle')
        .attr('r', dragRadius)
        .attr('fill', 'transparent')
        .attr('stroke', 'transparent')
        .attr('pointer-events', 'all')
        .style('cursor', 'grab');
      
      switch (d.type) {
        case 'FDC':
          // Hexagon for FDC
          const hexagon = nodeElement.append('polygon')
            .attr('points', this.getHexagonPoints(20))
            .attr('fill', '#4CAF50')
            .attr('stroke', '#2E7D32')
            .attr('stroke-width', 2)
            .style('pointer-events', 'none');
          break;
        case 'SpliceClosure':
          // Custom Splice Closure icon
          this.createSpliceClosureIcon(nodeElement);
          break;
        case 'FAT':
          // Custom FAT icon
          this.createFATIcon(nodeElement, d.data);
          break;
        case 'FDT':
          // FDT with splitter diagram
          this.createFDTIcon(nodeElement, d.data);
          break;
      }

      // Add node labels
      nodeElement.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 35)
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text(d.label);
    });

    // Add hover effects and tooltips
    node.on('mouseover', (event: any, d: GraphNode) => {
      this.showTooltip(event, d);
      d3.select(event.currentTarget).select('*').style('opacity', 0.7);
    })
    .on('mouseout', (event: any, d: GraphNode) => {
      this.hideTooltip();
      d3.select(event.currentTarget).select('*').style('opacity', 1);
    });

    // Update positions based on layout type
    if (this.isStaticLayout) {
      // For static layout, update positions immediately
      // Set node positions
      node.attr('transform', (d: any) => `translate(${d.x || d.fx || 0},${d.y || d.fy || 0})`);
      // Set link positions
      link
        .attr('x1', (d: any) => d.source.x || d.source.fx || 0)
        .attr('y1', (d: any) => d.source.y || d.source.fy || 0)
        .attr('x2', (d: any) => d.target.x || d.target.fx || 0)
        .attr('y2', (d: any) => d.target.y || d.target.fy || 0);
      // Set label positions
      linkLabels
        .attr('transform', (d: any) => {
          const sourceX = d.source.x || d.source.fx || 0;
          const targetX = d.target.x || d.target.fx || 0;
          const sourceY = d.source.y || d.source.fy || 0;
          const targetY = d.target.y || d.target.fy || 0;
          // Position label closer to destination node (75% from source to target)
          const labelX = sourceX + (targetX - sourceX) * 0.75;
          const labelY = sourceY + (targetY - sourceY) * 0.75 - 15; // Offset above the line
          return `translate(${labelX}, ${labelY})`;
        });
    } else if (this.simulation) {
      this.simulation.on('tick', () => {
        // Update link positions
        link
          .attr('x1', (d: any) => {
            const source = d.source;
            return source.x || source.fx || 0;
          })
          .attr('y1', (d: any) => {
            const source = d.source;
            return source.y || source.fy || 0;
          })
          .attr('x2', (d: any) => {
            const target = d.target;
            return target.x || target.fx || 0;
          })
          .attr('y2', (d: any) => {
            const target = d.target;
            return target.y || target.fy || 0;
          });

        // Update link label positions
        linkLabels
          .attr('transform', (d: any) => {
            const source = d.source;
            const target = d.target;
            const sourceX = source.x || source.fx || 0;
            const targetX = target.x || target.fx || 0;
            const sourceY = source.y || source.fy || 0;
            const targetY = target.y || target.fy || 0;
            // Position label closer to destination node (75% from source to target)
            const labelX = sourceX + (targetX - sourceX) * 0.75;
            const labelY = sourceY + (targetY - sourceY) * 0.75 - 15; // Offset above the line
            return `translate(${labelX}, ${labelY})`;
          });

        // Update node positions
        node.attr('transform', (d: any) => {
          const x = d.x || d.fx || 0;
          const y = d.y || d.fy || 0;
          return `translate(${x},${y})`;
        });
      });
    }
  }

  private getHexagonPoints(radius: number): string {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  }

  private createFDTIcon(nodeElement: any, data: NetworkElement): void {
    const splitterConfig = data.metadata?.splitter_config || '2x4 SPL';
    const splitters = splitterConfig.split(',').map(s => s.trim());
    
    // Create outer container
    const container = nodeElement.append('g')
      .attr('transform', 'scale(0.4) translate(-50, -30)')
      .style('pointer-events', 'none');
    
    // Outer rectangle
    container.append('rect')
      .attr('x', 5)
      .attr('y', 5)
      .attr('width', 190)
      .attr('height', 120)
      .attr('stroke', '#9C27B0')
      .attr('fill', 'none')
      .attr('stroke-width', '2');
    
    // Create splitters
    splitters.forEach((splitter, index) => {
      const yOffset = index * 25 + 15;
      const numFanouts = parseInt(splitter.split('x')[1]) || 4;
      
      // Splitter box
      container.append('line')
        .attr('x1', 35)
        .attr('y1', yOffset + 10)
        .attr('x2', 75)
        .attr('y2', yOffset + 10)
        .attr('stroke', '#9C27B0')
        .attr('stroke-width', '1');
      
      container.append('line')
        .attr('x1', 75)
        .attr('y1', yOffset + 10)
        .attr('x2', 75)
        .attr('y2', yOffset + 25)
        .attr('stroke', '#9C27B0')
        .attr('stroke-width', '1');
      
      container.append('line')
        .attr('x1', 75)
        .attr('y1', yOffset + 25)
        .attr('x2', 35)
        .attr('y2', yOffset + 25)
        .attr('stroke', '#9C27B0')
        .attr('stroke-width', '1');
      
      // Triangle
      container.append('polygon')
        .attr('points', `${75},${yOffset + 17.5} ${110},${yOffset + 5} ${110},${yOffset + 30}`)
        .attr('fill', 'none')
        .attr('stroke', '#9C27B0')
        .attr('stroke-width', '1');
      
      // Fanout lines
      const startY = yOffset + 5;
      const endY = yOffset + 30;
      const step = (endY - startY) / (numFanouts - 1);
      for (let i = 0; i < numFanouts; i++) {
        const y = startY + i * step;
        container.append('line')
          .attr('x1', 110)
          .attr('y1', y)
          .attr('x2', 130)
          .attr('y2', y)
          .attr('stroke', '#9C27B0')
          .attr('stroke-width', '1');
      }
    });
  }

  private createSpliceClosureIcon(nodeElement: any): void {
    // Create container for the Splice Closure icon
    const container = nodeElement.append('g')
      .attr('transform', 'scale(0.3) translate(-100, -60)')
      .style('pointer-events', 'none');
    
    // Top triangle (center triangle pointing down)
    container.append('polygon')
      .attr('points', '10,10 190,10 100,60')
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', '10')
      .attr('stroke-linejoin', 'round');
    
    // Left triangle
    container.append('polygon')
      .attr('points', '10,10 100,60 10,110')
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', '10')
      .attr('stroke-linejoin', 'round');
    
    // Right triangle
    container.append('polygon')
      .attr('points', '190,10 100,60 190,110')
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', '10')
      .attr('stroke-linejoin', 'round');
  }

  private createFATIcon(nodeElement: any, data: NetworkElement): void {
    // Create container for the FAT icon
    const container = nodeElement.append('g')
      .attr('transform', 'scale(0.4) translate(-50, -80)')
      .style('pointer-events', 'none');
    
    // Shield outline
    container.append('path')
      .attr('d', 'M10 10 H90 V120 Q50 150 10 120 Z')
      .attr('fill', 'none')
      .attr('stroke', '#FF00FF')
      .attr('stroke-width', '5');
    
    // Top text - FAT identifier
    const fatId = data.name || 'FAT 06-X';
    container.append('text')
      .attr('x', '50')
      .attr('y', '30')
      .attr('text-anchor', 'middle')
      .attr('font-size', '14')
      .attr('fill', '#FF00FF')
      .attr('font-family', 'Arial')
      .text(fatId);
    
    // Circle in the middle
    container.append('circle')
      .attr('cx', '50')
      .attr('cy', '65')
      .attr('r', '10')
      .attr('stroke', '#FF00FF')
      .attr('stroke-width', '4')
      .attr('fill', 'none');
    
    // Bottom text - Homepasses
    const homepasses = data.homepasses || 'HPs';
    container.append('text')
      .attr('x', '50')
      .attr('y', '110')
      .attr('text-anchor', 'middle')
      .attr('font-size', '18')
      .attr('fill', '#FF00FF')
      .attr('font-family', 'Arial')
      .text(homepasses.toString());
  }

  private showTooltip(event: any, node: GraphNode): void {
    const element = node.data;
    let tooltipContent = `
      <strong>${element.name}</strong><br>
      Type: ${element.type}<br>
      Location: ${element.location}<br>
      Fiber Count: ${element.fiber_count}
    `;

    if (element.metadata?.phase) {
      tooltipContent += `<br>Phase: ${element.metadata.phase}`;
    }
    if (element.metadata?.ring_id) {
      tooltipContent += `<br>Ring ID: ${element.metadata.ring_id}`;
    }
    if (element.homepasses) {
      tooltipContent += `<br>Homepasses: ${element.homepasses}`;
    }
    if (element.port_ratio) {
      tooltipContent += `<br>Port Ratio: ${element.port_ratio}`;
    }
    if (element.metadata?.splitter_config) {
      tooltipContent += `<br>Splitter Config: ${element.metadata.splitter_config}`;
    }

    this.tooltip
      .style('opacity', 1)
      .html(tooltipContent)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 10) + 'px');
  }

  private hideTooltip(): void {
    this.tooltip.style('opacity', 0);
  }

  private dragstarted(event: any, d: any): void {
    if (!event.active) {
      this.simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
    // Change cursor to grabbing
    d3.select(event.sourceEvent.target).style('cursor', 'grabbing');
  }

  private dragged(event: any, d: any): void {
    d.fx = event.x;
    d.fy = event.y;
    // Ensure simulation continues during drag
    this.simulation.alpha(0.3);
  }

  private dragended(event: any, d: any): void {
    if (!event.active) {
      this.simulation.alphaTarget(0);
    }
    // Change cursor back to grab
    d3.select(event.sourceEvent.target).style('cursor', 'grab');
    // Keep the node fixed for a moment to prevent jumping
    setTimeout(() => {
      d.fx = null;
      d.fy = null;
    }, 150);
  }

  resetZoom(): void {
    if (this.zoom && this.svg) {
      this.svg.transition().duration(750).call(
        this.zoom.transform,
        d3.zoomIdentity
      );
    }
  }

  fitToScreen(): void {
    if (this.mainGroup && this.nodes.length > 0) {
      const container = this.graphContainer.nativeElement;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      // Calculate bounds
      const xExtent = d3.extent(this.nodes, (d: any) => d.x);
      const yExtent = d3.extent(this.nodes, (d: any) => d.y);
      
      if (xExtent[0] !== undefined && xExtent[1] !== undefined && 
          yExtent[0] !== undefined && yExtent[1] !== undefined) {
        const padding = this.nodes.length > 10 ? 100 : 50; // More padding for large networks
        const scale = Math.min(
          (width - padding) / (xExtent[1] - xExtent[0]),
          (height - padding) / (yExtent[1] - yExtent[0])
        );
        
        // Limit scale for very large networks
        const maxScale = this.nodes.length > 15 ? 0.8 : 1.0;
        const finalScale = Math.min(scale, maxScale);
        
        const transform = d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(finalScale)
          .translate(-(xExtent[0] + xExtent[1]) / 2, -(yExtent[0] + yExtent[1]) / 2);
        
        this.svg.transition().duration(750).call(
          this.zoom.transform,
          transform
        );
      }
    }
  }



  toggleLayout(): void {
    this.isStaticLayout = !this.isStaticLayout;
    
    // Stop any existing simulation
    if (this.simulation) {
      this.simulation.stop();
    }
    
    // Clear fixed positions if switching to fluidic
    if (!this.isStaticLayout) {
      this.nodes.forEach(node => {
        node.fx = null;
        node.fy = null;
      });
    }
    
    this.updateGraph();
  }

  private createStaticLayout(): void {
    const container = this.graphContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Calculate grid layout
    const nodeCount = this.nodes.length;
    const cols = Math.ceil(Math.sqrt(nodeCount));
    const rows = Math.ceil(nodeCount / cols);
    
    const spacing = 150;
    const startX = 100;
    const startY = 100;
    
    // Position nodes in a grid
    this.nodes.forEach((node, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      node.x = startX + col * spacing;
      node.y = startY + row * spacing;
      node.fx = node.x;
      node.fy = node.y;
    });
    
    // Immediately update positions for static layout
    this.updateStaticPositions();
  }

  private updateStaticPositions(): void {
    if (!this.mainGroup) return;
    
    // Update link positions
    this.mainGroup.selectAll('line')
      .attr('x1', (d: any) => {
        const source = d.source;
        return source.x || source.fx || 0;
      })
      .attr('y1', (d: any) => {
        const source = d.source;
        return source.y || source.fy || 0;
      })
      .attr('x2', (d: any) => {
        const target = d.target;
        return target.x || target.fx || 0;
      })
      .attr('y2', (d: any) => {
        const target = d.target;
        return target.y || target.fy || 0;
      });

    // Update link label positions
    this.mainGroup.selectAll('.link-label-group')
      .attr('transform', (d: any) => {
        const source = d.source;
        const target = d.target;
        const sourceX = source.x || source.fx || 0;
        const targetX = target.x || target.fx || 0;
        const sourceY = source.y || source.fy || 0;
        const targetY = target.y || target.fy || 0;
        // Position label closer to destination node (75% from source to target)
        const labelX = sourceX + (targetX - sourceX) * 0.75;
        const labelY = sourceY + (targetY - sourceY) * 0.75 - 15; // Offset above the line
        return `translate(${labelX}, ${labelY})`;
      });

    // Update node positions
    this.mainGroup.selectAll('.node')
      .attr('transform', (d: any) => {
        const x = d.x || d.fx || 0;
        const y = d.y || d.fy || 0;
        return `translate(${x},${y})`;
      });
  }

  openSVGDiagram(): void {
    // Open SVG diagram in a new tab
    const currentNetworkType = this.networkService.getCurrentNetworkType();
    const url = `/svg-diagram?network=${currentNetworkType}`;
    window.open(url, '_blank');
  }
} 