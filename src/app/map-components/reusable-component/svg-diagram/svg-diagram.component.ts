import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NetworkService } from '../../../service/network.service';
import { NetworkData, NetworkElement, Connection, GraphNode, GraphLink } from '../../../models/network.model';

@Component({
  selector: 'app-svg-diagram',
  templateUrl: './svg-diagram.component.html',
  styleUrls: ['./svg-diagram.component.scss'],
  standalone: false
})
export class SVGDiagramComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;

  private subscription: Subscription = new Subscription();
  private nodes: GraphNode[] = [];
  private links: GraphLink[] = [];
  private svg: any;
  private mainGroup: any;
  public currentNetworkType = 'large';

  private currentScale = 1;
  private currentTranslateX = 0;
  private currentTranslateY = 0;
  private isPanning = false;
  private lastPanPoint = { x: 0, y: 0 };

  constructor(
    private networkService: NetworkService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.networkService.switchToLargeNetwork();

    this.subscription.add(
      this.networkService.networkData$.subscribe(networkData => {
        const graphData = this.networkService.convertToGraphData(networkData);
        this.nodes = graphData.nodes;
        this.links = graphData.links;
        this.currentNetworkType = this.networkService.getCurrentNetworkType();
        this.renderSVGDiagram();
      })
    );
  }

  ngAfterViewInit(): void {
    this.initializeSVG();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initializeSVG(): void {
    const container = this.svgContainer.nativeElement;
    
    const containerWidth = container.clientWidth || window.innerWidth - 40;
    const containerHeight = container.clientHeight || window.innerHeight - 100;
    
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.svg.setAttribute('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
    this.svg.style.backgroundColor = 'white';
    this.svg.style.border = '1px solid #ccc';
    this.svg.style.maxWidth = '100%';
    this.svg.style.maxHeight = '100%';
    this.svg.style.cursor = 'grab';

    this.mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.svg.appendChild(this.mainGroup);

    container.appendChild(this.svg);

    this.addZoomPanListeners();

    this.renderSVGDiagram();
  }

  private addZoomPanListeners(): void {
    this.svg.addEventListener('wheel', (event: WheelEvent) => {
      event.preventDefault();
      this.handleZoom(event);
    });

    this.svg.addEventListener('mousedown', (event: MouseEvent) => {
      this.startPanning(event);
    });

    this.svg.addEventListener('mousemove', (event: MouseEvent) => {
      this.handlePanning(event);
    });

    this.svg.addEventListener('mouseup', () => {
      this.stopPanning();
    });

    this.svg.addEventListener('mouseleave', () => {
      this.stopPanning();
    });

    this.svg.addEventListener('dblclick', (event: MouseEvent) => {
      event.preventDefault();
      this.resetZoom();
    });
  }

  private handleZoom(event: WheelEvent): void {
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(5, this.currentScale * zoomFactor));
    
    const rect = this.svg.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const zoomCenterX = (mouseX - this.currentTranslateX) / this.currentScale;
    const zoomCenterY = (mouseY - this.currentTranslateY) / this.currentScale;
    
    this.currentScale = newScale;
    this.currentTranslateX = mouseX - zoomCenterX * this.currentScale;
    this.currentTranslateY = mouseY - zoomCenterY * this.currentScale;
    
    this.updateTransform();
  }

  private startPanning(event: MouseEvent): void {
    this.isPanning = true;
    this.svg.style.cursor = 'grabbing';
    this.lastPanPoint = { x: event.clientX, y: event.clientY };
  }

  private handlePanning(event: MouseEvent): void {
    if (!this.isPanning) return;
    
    const deltaX = event.clientX - this.lastPanPoint.x;
    const deltaY = event.clientY - this.lastPanPoint.y;
    
    this.currentTranslateX += deltaX;
    this.currentTranslateY += deltaY;
    
    this.lastPanPoint = { x: event.clientX, y: event.clientY };
    this.updateTransform();
  }

  private stopPanning(): void {
    this.isPanning = false;
    this.svg.style.cursor = 'grab';
  }

  private resetZoom(): void {
    this.currentScale = 1;
    this.currentTranslateX = 0;
    this.currentTranslateY = 0;
    this.updateTransform();
  }

  private updateTransform(): void {
    const transform = `translate(${this.currentTranslateX}, ${this.currentTranslateY}) scale(${this.currentScale})`;
    this.mainGroup.setAttribute('transform', transform);
  }

  public zoomIn(): void {
    this.currentScale = Math.min(5, this.currentScale * 1.2);
    this.updateTransform();
  }

  public zoomOut(): void {
    this.currentScale = Math.max(0.1, this.currentScale / 1.2);
    this.updateTransform();
  }

  public resetView(): void {
    this.resetZoom();
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

  private renderSVGDiagram(): void {
    if (!this.mainGroup) return;

    while (this.mainGroup.firstChild) {
      this.mainGroup.removeChild(this.mainGroup.firstChild);
    }

    const positions = this.calculateTreeLayout();

    this.renderLinks(positions);

    this.renderNodes(positions);
  }

  private calculateTreeLayout(): Map<string, { x: number, y: number }> {
    const positions = new Map<string, { x: number, y: number }>();
    
    const svgWidth = this.svg?.getAttribute('viewBox')?.split(' ')[2] || 1200;
    const svgHeight = this.svg?.getAttribute('viewBox')?.split(' ')[3] || 800;
    
    this.calculateBFSLayout(positions, Number(svgWidth), Number(svgHeight));
    
    return positions;
  }

  private calculateBFSLayout(
    positions: Map<string, { x: number, y: number }>,
    svgWidth: number,
    svgHeight: number
  ): void {
    const margin = 150;
    const horizontalSpacing = 400;
    const verticalSpacing = 200;
    
    const longestPath = this.findLongestPath();
    
    longestPath.forEach((nodeId, index) => {
      const x = margin + index * horizontalSpacing;
      const y = svgHeight / 2;
      positions.set(nodeId, { x, y });
    });
    
    this.positionRemainingNodes(positions, longestPath, svgWidth, svgHeight, margin, horizontalSpacing, verticalSpacing);
    
    this.resolveNodeEdgeOverlaps(positions);
    
    this.scaleToFit(positions, svgWidth, svgHeight, margin);
  }

  private findLongestPath(): string[] {
    let longestPath: string[] = [];
    const visited = new Set<string>();
    
    for (const node of this.nodes) {
      if (!visited.has(node.id)) {
        const path = this.dfsLongestPath(node.id, visited);
        if (path.length > longestPath.length) {
          longestPath = path;
        }
      }
    }
    
    return longestPath;
  }

  private dfsLongestPath(startNode: string, visited: Set<string>): string[] {
    visited.add(startNode);
    let longestPath: string[] = [startNode];
    
    const connectedNodes = this.getConnectedNodes(startNode);
    
    for (const connectedNode of connectedNodes) {
      if (!visited.has(connectedNode)) {
        const subPath = this.dfsLongestPath(connectedNode, new Set(visited));
        if (subPath.length + 1 > longestPath.length) {
          longestPath = [startNode, ...subPath];
        }
      }
    }
    
    return longestPath;
  }

  private positionRemainingNodes(
    positions: Map<string, { x: number, y: number }>,
    longestPath: string[],
    svgWidth: number,
    svgHeight: number,
    margin: number,
    horizontalSpacing: number,
    verticalSpacing: number
  ): void {
    const positioned = new Set<string>(longestPath);
    const queue: string[] = [];
    
    longestPath.forEach(nodeId => {
      const connected = this.getConnectedNodes(nodeId);
      connected.forEach(connectedId => {
        if (!positioned.has(connectedId)) {
          queue.push(connectedId);
        }
      });
    });
    
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (positioned.has(nodeId)) continue;
      
      const position = this.findBestPosition(nodeId, positions, longestPath, svgWidth, svgHeight, margin, horizontalSpacing, verticalSpacing);
      positions.set(nodeId, position);
      positioned.add(nodeId);
      
      const connected = this.getConnectedNodes(nodeId);
      connected.forEach(connectedId => {
        if (!positioned.has(connectedId)) {
          queue.push(connectedId);
        }
      });
    }
    
    this.nodes.forEach(node => {
      if (!positioned.has(node.id)) {
        const x = margin + longestPath.length * horizontalSpacing;
        const y = margin + (this.nodes.filter(n => !positioned.has(n.id)).indexOf(node) * verticalSpacing);
        positions.set(node.id, { x, y });
      }
    });
  }

  private findBestPosition(
    nodeId: string,
    positions: Map<string, { x: number, y: number }>,
    longestPath: string[],
    svgWidth: number,
    svgHeight: number,
    margin: number,
    horizontalSpacing: number,
    verticalSpacing: number
  ): { x: number, y: number } {
    const connected = this.getConnectedNodes(nodeId);
    const positionedConnected = connected.filter(id => positions.has(id));
    
    if (positionedConnected.length === 0) {
      return {
        x: margin + longestPath.length * horizontalSpacing,
        y: margin + Math.random() * (svgHeight - 2 * margin)
      };
    }
    
    let avgX = 0;
    let avgY = 0;
    positionedConnected.forEach(id => {
      const pos = positions.get(id)!;
      avgX += pos.x;
      avgY += pos.y;
    });
    avgX /= positionedConnected.length;
    avgY /= positionedConnected.length;
    
    const baseX = avgX + horizontalSpacing * 0.5;
    const baseY = avgY;
    
    const offsets = [0, verticalSpacing, -verticalSpacing, verticalSpacing * 2, -verticalSpacing * 2];
    
    for (const offset of offsets) {
      const candidatePos = { x: baseX, y: baseY + offset };
      
      let overlaps = false;
      positions.forEach((pos, id) => {
        const distance = Math.sqrt(Math.pow(pos.x - candidatePos.x, 2) + Math.pow(pos.y - candidatePos.y, 2));
        if (distance < 100) {
          overlaps = true;
        }
      });
      
      if (!overlaps) {
        return candidatePos;
      }
    }
    
    return { x: baseX, y: baseY };
  }

  private findRootNodes(): string[] {
    const hasIncoming = new Set<string>();
    
    this.links.forEach(link => {
      hasIncoming.add(link.target);
    });
    
    return this.nodes
      .filter(node => !hasIncoming.has(node.id))
      .map(node => node.id);
  }

  private getConnectedNodes(nodeId: string): string[] {
    const connected: string[] = [];
    
    this.links.forEach(link => {
      if (link.source === nodeId) {
        connected.push(link.target);
      } else if (link.target === nodeId) {
        connected.push(link.source);
      }
    });
    
    return connected;
  }

  private resolveNodeEdgeOverlaps(positions: Map<string, { x: number, y: number }>): void {
    const nodeRadius = 50;
    const minDistance = nodeRadius + 30;
    const maxIterations = 10;
    
    for (let iteration = 0; iteration < maxIterations; iteration++) {
      let hasOverlaps = false;
      
      this.nodes.forEach(node => {
        const nodePos = positions.get(node.id);
        if (!nodePos) return;
        
        this.links.forEach(link => {
          if (link.source === node.id || link.target === node.id) return;
          
          const sourcePos = positions.get(link.source);
          const targetPos = positions.get(link.target);
          
          if (!sourcePos || !targetPos) return;
          
          const distance = this.distanceFromPointToLine(nodePos, sourcePos, targetPos);
          
          if (distance < minDistance) {
            hasOverlaps = true;
            this.adjustNodePosition(nodePos, sourcePos, targetPos, minDistance, distance);
          }
        });
      });
      
      if (!hasOverlaps) break;
    }
  }

  private distanceFromPointToLine(point: { x: number, y: number }, lineStart: { x: number, y: number }, lineEnd: { x: number, y: number }): number {
    const segments = 10;
    let minDistance = Infinity;
    
    for (let i = 0; i < segments; i++) {
      const t1 = i / segments;
      const t2 = (i + 1) / segments;
      
      const p1 = this.getPointOnCurve(lineStart, lineEnd, t1);
      const p2 = this.getPointOnCurve(lineStart, lineEnd, t2);
      
      const distance = this.distanceFromPointToLineSegment(point, p1, p2);
      minDistance = Math.min(minDistance, distance);
    }
    
    return minDistance;
  }

  private getPointOnCurve(start: { x: number, y: number }, end: { x: number, y: number }, t: number): { x: number, y: number } {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    const controlPoint1X = start.x + dx * 0.25;
    const controlPoint1Y = start.y;
    const controlPoint2X = end.x - dx * 0.25;
    const controlPoint2Y = end.y;
    
    const t1 = 1 - t;
    const t1_3 = t1 * t1 * t1;
    const t_3 = t * t * t;
    const t1_2_t_3 = 3 * t1 * t1 * t;
    const t1_t_2_3 = 3 * t1 * t * t;
    
    const x = t1_3 * start.x + t1_2_t_3 * controlPoint1X + t1_t_2_3 * controlPoint2X + t_3 * end.x;
    const y = t1_3 * start.y + t1_2_t_3 * controlPoint1Y + t1_t_2_3 * controlPoint2Y + t_3 * end.y;
    
    return { x, y };
  }

  private distanceFromPointToLineSegment(point: { x: number, y: number }, lineStart: { x: number, y: number }, lineEnd: { x: number, y: number }): number {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) {
      return Math.sqrt(A * A + B * B);
    }
    
    const param = dot / lenSq;
    
    let xx, yy;
    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }
    
    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private adjustNodePosition(nodePos: { x: number, y: number }, lineStart: { x: number, y: number }, lineEnd: { x: number, y: number }, minDistance: number, currentDistance: number): void {
    const lineVectorX = lineEnd.x - lineStart.x;
    const lineVectorY = lineEnd.y - lineStart.y;
    const lineLength = Math.sqrt(lineVectorX * lineVectorX + lineVectorY * lineVectorY);
    
    if (lineLength === 0) return;
    
    const normalizedLineX = lineVectorX / lineLength;
    const normalizedLineY = lineVectorY / lineLength;
    
    const perpX = -normalizedLineY;
    const perpY = normalizedLineX;
    
    const nodeToStartX = nodePos.x - lineStart.x;
    const nodeToStartY = nodePos.y - lineStart.y;
    const projection = nodeToStartX * normalizedLineX + nodeToStartY * normalizedLineY;
    
    let closestPointX, closestPointY;
    if (projection <= 0) {
      closestPointX = lineStart.x;
      closestPointY = lineStart.y;
    } else if (projection >= lineLength) {
      closestPointX = lineEnd.x;
      closestPointY = lineEnd.y;
    } else {
      closestPointX = lineStart.x + projection * normalizedLineX;
      closestPointY = lineStart.y + projection * normalizedLineY;
    }
    
    const directionX = nodePos.x - closestPointX;
    const directionY = nodePos.y - closestPointY;
    const directionLength = Math.sqrt(directionX * directionX + directionY * directionY);
    
    if (directionLength === 0) {
      const moveDistance = minDistance;
      nodePos.x += perpX * moveDistance;
      nodePos.y += perpY * moveDistance;
    } else {
      const moveDistance = minDistance - currentDistance;
      const normalizedDirectionX = directionX / directionLength;
      const normalizedDirectionY = directionY / directionLength;
      
      nodePos.x += normalizedDirectionX * moveDistance;
      nodePos.y += normalizedDirectionY * moveDistance;
    }
  }

  private scaleToFit(
    positions: Map<string, { x: number, y: number }>,
    svgWidth: number,
    svgHeight: number,
    margin: number
  ): void {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    
    positions.forEach(pos => {
      minX = Math.min(minX, pos.x);
      maxX = Math.max(maxX, pos.x);
      minY = Math.min(minY, pos.y);
      maxY = Math.max(maxY, pos.y);
    });
    
    const padding = 50;
    minX -= padding;
    maxX += padding;
    minY -= padding;
    maxY += padding;
    
    const diagramWidth = maxX - minX;
    const diagramHeight = maxY - minY;
    
    const availableWidth = svgWidth - 2 * margin;
    const availableHeight = svgHeight - 2 * margin;
    
    const scaleX = availableWidth / diagramWidth;
    const scaleY = availableHeight / diagramHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    
    if (scale < 1) {
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const targetCenterX = svgWidth / 2;
      const targetCenterY = svgHeight / 2;
      
      positions.forEach(pos => {
        pos.x = targetCenterX + (pos.x - centerX) * scale;
        pos.y = targetCenterY + (pos.y - centerY) * scale;
      });
    } else {
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const targetCenterX = svgWidth / 2;
      const targetCenterY = svgHeight / 2;
      
      const offsetX = targetCenterX - centerX;
      const offsetY = targetCenterY - centerY;
      
      positions.forEach(pos => {
        pos.x += offsetX;
        pos.y += offsetY;
      });
    }
  }

  private applyBarycenterHeuristic(
    nodeLevels: Map<string, number>,
    positions: Map<string, { x: number, y: number }>
  ): void {
    this.optimizeHierarchicalLayout(positions);
  }

  private optimizeHierarchicalLayout(positions: Map<string, { x: number, y: number }>): void {
    const nodesByLevel = new Map<number, GraphNode[]>();
    
    this.nodes.forEach(node => {
      const pos = positions.get(node.id);
      if (pos) {
        const level = Math.round(pos.x / 250);
        if (!nodesByLevel.has(level)) {
          nodesByLevel.set(level, []);
        }
        nodesByLevel.get(level)!.push(node);
      }
    });
    
    nodesByLevel.forEach((levelNodes, level) => {
      levelNodes.sort((a, b) => {
        const posA = positions.get(a.id);
        const posB = positions.get(b.id);
        return (posA?.y || 0) - (posB?.y || 0);
      });
      
      const minSpacing = 100;
      for (let i = 1; i < levelNodes.length; i++) {
        const prevPos = positions.get(levelNodes[i - 1].id);
        const currentPos = positions.get(levelNodes[i].id);
        
        if (prevPos && currentPos) {
          const distance = currentPos.y - prevPos.y;
          if (distance < minSpacing) {
            const adjustment = minSpacing - distance;
            currentPos.y += adjustment;
            positions.set(levelNodes[i].id, currentPos);
          }
        }
      }
    });
  }

  private getChildren(nodeId: string): string[] {
    const children: string[] = [];
    this.links.forEach(link => {
      if (link.source === nodeId) {
        children.push(link.target);
      } else if (link.target === nodeId) {
        children.push(link.source);
      }
    });
    return children;
  }

  private preventOverlaps(nodes: GraphNode[], positions: Map<string, { x: number, y: number }>): void {
    const minSpacing = 80;
    
    nodes.sort((a, b) => {
      const posA = positions.get(a.id);
      const posB = positions.get(b.id);
      return (posA?.y || 0) - (posB?.y || 0);
    });
    
    for (let i = 1; i < nodes.length; i++) {
      const prevPos = positions.get(nodes[i - 1].id);
      const currentPos = positions.get(nodes[i].id);
      
      if (prevPos && currentPos) {
        const distance = currentPos.y - prevPos.y;
        if (distance < minSpacing) {
          const adjustment = minSpacing - distance;
          currentPos.y += adjustment;
          positions.set(nodes[i].id, currentPos);
        }
      }
    }
  }


  private renderLinks(positions: Map<string, { x: number, y: number }>): void {
    this.links.forEach(link => {
      const sourcePos = positions.get(link.source);
      const targetPos = positions.get(link.target);
      
      if (sourcePos && targetPos) {
        const path = this.createCurvedPath(sourcePos, targetPos);
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', path);
        pathElement.setAttribute('stroke', this.getCableColor(link.cable_type));
        pathElement.setAttribute('stroke-width', '3');
        pathElement.setAttribute('stroke-opacity', '0.8');
        pathElement.setAttribute('stroke-dasharray', '8,8');
        pathElement.setAttribute('fill', 'none');
        
        this.mainGroup.appendChild(pathElement);

        const label = this.createCurvedLinkLabel(sourcePos, targetPos, link.label);
        this.mainGroup.appendChild(label);
      }
    });
  }

  private createCurvedPath(source: { x: number, y: number }, target: { x: number, y: number }): string {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    
    const controlPoint1X = source.x + dx * 0.25;
    const controlPoint1Y = source.y;
    const controlPoint2X = target.x - dx * 0.25;
    const controlPoint2Y = target.y;
    
    return `M ${source.x} ${source.y} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${target.x} ${target.y}`;
  }





  private createCurvedLinkLabel(source: { x: number, y: number }, target: { x: number, y: number }, labelText: string | undefined): SVGElement {
    // Create a group to hold both background and label
    const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Calculate position near destination node (75% from source to target)
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const labelX = source.x + dx * 0.75;
    const labelY = source.y + dy * 0.75;
    
    // Calculate perpendicular offset to position above the line
    const baseOffset = 25; // Distance above the line
    const angle = Math.atan2(dy, dx);
    const perpendicularAngle = angle + Math.PI / 2;
    
    const offsetX = labelX + Math.cos(perpendicularAngle) * baseOffset;
    const offsetY = labelY + Math.sin(perpendicularAngle) * baseOffset;
    
    // Split label text into lines
    const lines = (labelText || 'Unknown').split('\n');
    const lineHeight = 12;
    const totalHeight = lines.length * lineHeight;
    
    // Calculate background dimensions
    const maxLineLength = Math.max(...lines.map(line => line.length));
    const textWidth = maxLineLength * 6; // Approximate text width
    const textHeight = totalHeight;
    
    // Add background for better readability
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('x', (offsetX - textWidth / 2 - 2).toString());
    background.setAttribute('y', (offsetY - textHeight / 2 - 1).toString());
    background.setAttribute('width', (textWidth + 4).toString());
    background.setAttribute('height', (textHeight + 2).toString());
    background.setAttribute('fill', 'white');
    background.setAttribute('stroke', '#666');
    background.setAttribute('stroke-width', '0.5');
    background.setAttribute('rx', '2');
    background.setAttribute('ry', '2');
    
    // Create text elements for each line
    lines.forEach((line: string, index: number) => {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const lineY = offsetY - totalHeight / 2 + (index + 0.5) * lineHeight;
      
      label.setAttribute('x', offsetX.toString());
      label.setAttribute('y', lineY.toString());
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'middle');
      label.setAttribute('font-size', '10');
      label.setAttribute('fill', '#333');
      label.setAttribute('font-weight', 'bold');
      label.setAttribute('font-family', 'Arial');
      label.textContent = line;
      
      labelGroup.appendChild(label);
    });
    
    // Add background first, then labels to the group
    labelGroup.appendChild(background);
    
    return labelGroup;
  }

  private renderNodes(positions: Map<string, { x: number, y: number }>): void {
    this.nodes.forEach(node => {
      const pos = positions.get(node.id);
      if (!pos) return;

      const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      nodeGroup.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);

      // Render node based on type
      switch (node.type) {
        case 'FDC':
          this.renderFDCNode(nodeGroup);
          break;
        case 'SpliceClosure':
          this.renderSpliceClosureNode(nodeGroup);
          break;
        case 'FAT':
          this.renderFATNode(nodeGroup, node.data);
          break;
        case 'FDT':
          this.renderFDTNode(nodeGroup, node.data);
          break;
      }

      // Remove labels - commented out
      // this.renderNodeLabels(nodeGroup, node);

      this.mainGroup.appendChild(nodeGroup);
    });
  }

  private calculateNodeLabelPositions(node: GraphNode, nodePos: { x: number, y: number }): { x: number, y: number, width: number, height: number, nodeId: string }[] {
    const connections = this.links.filter(l => l.source === node.id || l.target === node.id);
    const cableType = connections.length > 0 ? connections[0].cable_type : 'Unknown';
    const labelSpacing = this.getLabelSpacing(node.type);
    
    const labelPositions: { x: number, y: number, width: number, height: number, nodeId: string }[] = [];
    
    // Top label - connection info (only for Splice Closures)
    if (node.type === 'SpliceClosure') {
      labelPositions.push({
        x: nodePos.x,
        y: nodePos.y - labelSpacing.top,
        width: 80, // Approximate width
        height: 15,
        nodeId: node.id
      });
    }

    // Middle label - cable info
    labelPositions.push({
      x: nodePos.x,
      y: nodePos.y + (node.type === 'SpliceClosure' ? -labelSpacing.middle : -labelSpacing.top),
      width: 70, // Approximate width
      height: 15,
      nodeId: node.id
    });

    // Bottom label - node name
    labelPositions.push({
      x: nodePos.x,
      y: nodePos.y + labelSpacing.bottom,
      width: 90, // Approximate width
      height: 15,
      nodeId: node.id
    });
    
    return labelPositions;
  }

  private resolveGlobalLabelCollisions(labelPositions: { x: number, y: number, width: number, height: number, nodeId: string }[]): void {
    const minSpacing = 5; // Minimum spacing between labels
    
    // Check for collisions and adjust positions
    for (let i = 0; i < labelPositions.length; i++) {
      for (let j = i + 1; j < labelPositions.length; j++) {
        const label1 = labelPositions[i];
        const label2 = labelPositions[j];
        
        // Check if labels overlap
        if (this.labelsOverlap(label1, label2)) {
          // Adjust vertical position to prevent overlap
          const overlap = this.calculateOverlap(label1, label2);
          if (overlap > 0) {
            // Move the second label down
            label2.y += overlap + minSpacing;
          }
        }
      }
    }
  }

  private labelsOverlap(label1: { x: number, y: number, width: number, height: number }, label2: { x: number, y: number, width: number, height: number }): boolean {
    return !(label1.x + label1.width / 2 < label2.x - label2.width / 2 ||
             label1.x - label1.width / 2 > label2.x + label2.width / 2 ||
             label1.y + label1.height / 2 < label2.y - label2.height / 2 ||
             label1.y - label1.height / 2 > label2.y + label2.height / 2);
  }

  private calculateOverlap(label1: { x: number, y: number, width: number, height: number }, label2: { x: number, y: number, width: number, height: number }): number {
    const verticalOverlap = Math.min(
      label1.y + label1.height / 2 - (label2.y - label2.height / 2),
      label2.y + label2.height / 2 - (label1.y - label1.height / 2)
    );
    return Math.max(0, verticalOverlap);
  }

  private renderNodeLabels(nodeGroup: SVGElement, node: GraphNode): void {
    // Get connections for this node
    const connections = this.links.filter(l => l.source === node.id || l.target === node.id);
    const cableType = connections.length > 0 ? connections[0].cable_type : 'Unknown';
    
    // Calculate label positions based on node type to avoid overlaps
    const labelSpacing = this.getLabelSpacing(node.type);
    
    // Create labels with dynamic positioning
    const labels: { text: string, dy: number, color: string, weight: string, size: string }[] = [];
    
    // Top label - connection info (only for Splice Closures)
    if (node.type === 'SpliceClosure') {
      labels.push({
        text: `1-3 (SPLICE) 1-3`,
        dy: -labelSpacing.top,
        color: '#333',
        weight: 'bold',
        size: '9'
      });
    }

    // Middle label - cable info
    labels.push({
      text: `${cableType} FO / XX m`,
      dy: node.type === 'SpliceClosure' ? -labelSpacing.middle : -labelSpacing.top,
      color: '#666',
      weight: 'normal',
      size: '9'
    });

    // Bottom label - node name
    labels.push({
      text: node.label,
      dy: labelSpacing.bottom,
      color: '#333',
      weight: 'bold',
      size: '11'
    });

    // Apply dynamic positioning to avoid overlaps
    const positionedLabels = this.calculateLabelPositions(labels, node.type);
    
    // Render positioned labels
    positionedLabels.forEach(label => {
      const labelGroup = this.createLabelWithBackground(
        label.text,
        label.dy,
        label.color,
        label.weight,
        label.size
      );
      nodeGroup.appendChild(labelGroup);
    });
  }

  private calculateLabelPositions(
    labels: { text: string, dy: number, color: string, weight: string, size: string }[],
    nodeType: string
  ): { text: string, dy: number, color: string, weight: string, size: string }[] {
    const positionedLabels = [...labels];
    const minSpacing = 25; // Minimum spacing between labels
    
    // Sort labels by their initial dy position
    positionedLabels.sort((a, b) => a.dy - b.dy);
    
    // Adjust positions to prevent overlaps
    for (let i = 1; i < positionedLabels.length; i++) {
      const prevLabel = positionedLabels[i - 1];
      const currentLabel = positionedLabels[i];
      
      const distance = currentLabel.dy - prevLabel.dy;
      if (distance < minSpacing) {
        // Move current label further away
        const adjustment = minSpacing - distance;
        currentLabel.dy += adjustment;
      }
    }
    
    return positionedLabels;
  }

  private createLabelWithBackground(
    text: string,
    dy: number,
    fillColor: string,
    fontWeight: string,
    fontSize: string
  ): SVGElement {
    // Create a group to hold both background and label
    const labelGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Create background for better readability
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const textWidth = text.length * 6; // Approximate text width
    const textHeight = 12;
    
    background.setAttribute('x', (-textWidth / 2 - 2).toString());
    background.setAttribute('y', (dy - textHeight / 2 - 1).toString());
    background.setAttribute('width', (textWidth + 4).toString());
    background.setAttribute('height', (textHeight + 2).toString());
    background.setAttribute('fill', 'white');
    background.setAttribute('stroke', '#ddd');
    background.setAttribute('stroke-width', '0.5');
    background.setAttribute('rx', '2');
    background.setAttribute('ry', '2');
    background.setAttribute('opacity', '0.9');
    
    // Create the label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dy', dy.toString());
    label.setAttribute('font-size', fontSize);
    label.setAttribute('fill', fillColor);
    label.setAttribute('font-weight', fontWeight);
    label.setAttribute('font-family', 'Arial');
    label.textContent = text;
    
    // Add background first, then label to the group
    labelGroup.appendChild(background);
    labelGroup.appendChild(label);
    
    return labelGroup;
  }

  private getLabelSpacing(nodeType: string): { top: number, middle: number, bottom: number } {
    switch (nodeType) {
      case 'FDT':
        return { top: 80, middle: 50, bottom: 80 };
      case 'FDC':
        return { top: 75, middle: 45, bottom: 75 };
      case 'SpliceClosure':
        return { top: 120, middle: 90, bottom: 85 };
      case 'FAT':
        return { top: 85, middle: 55, bottom: 85 };
      default:
        return { top: 75, middle: 45, bottom: 75 };
    }
  }

  private renderFDCNode(group: SVGElement): void {
    const hexagon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const points = this.getHexagonPoints(25);
    hexagon.setAttribute('points', points);
    hexagon.setAttribute('fill', '#4CAF50');
    hexagon.setAttribute('stroke', '#2E7D32');
    hexagon.setAttribute('stroke-width', '3');
    group.appendChild(hexagon);
  }

  private renderSpliceClosureNode(group: SVGElement): void {
    // Create triangular Splice Closure using the provided SVG structure
    const container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    container.setAttribute('transform', 'scale(0.3) translate(-100, -60)');

    // Top triangle (center triangle pointing down)
    const topTriangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    topTriangle.setAttribute('points', '10,10 190,10 100,60');
    topTriangle.setAttribute('fill', 'none');
    topTriangle.setAttribute('stroke', 'red');
    topTriangle.setAttribute('stroke-width', '10');
    topTriangle.setAttribute('stroke-linejoin', 'round');
    container.appendChild(topTriangle);

    // Left triangle
    const leftTriangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    leftTriangle.setAttribute('points', '10,10 100,60 10,110');
    leftTriangle.setAttribute('fill', 'none');
    leftTriangle.setAttribute('stroke', 'red');
    leftTriangle.setAttribute('stroke-width', '10');
    leftTriangle.setAttribute('stroke-linejoin', 'round');
    container.appendChild(leftTriangle);

    // Right triangle
    const rightTriangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    rightTriangle.setAttribute('points', '190,10 100,60 190,110');
    rightTriangle.setAttribute('fill', 'none');
    rightTriangle.setAttribute('stroke', 'red');
    rightTriangle.setAttribute('stroke-width', '10');
    rightTriangle.setAttribute('stroke-linejoin', 'round');
    container.appendChild(rightTriangle);

    group.appendChild(container);
  }

  private renderFATNode(group: SVGElement, data: NetworkElement): void {
    const container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    container.setAttribute('transform', 'scale(0.3) translate(-50, -60)');

    // Shield outline
    const shield = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    shield.setAttribute('d', 'M10 10 H90 V120 Q50 150 10 120 Z');
    shield.setAttribute('fill', 'none');
    shield.setAttribute('stroke', '#FF00FF');
    shield.setAttribute('stroke-width', '6');
    container.appendChild(shield);

    // Top text - AT identifier
    const topText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    topText.setAttribute('x', '50');
    topText.setAttribute('y', '25');
    topText.setAttribute('text-anchor', 'middle');
    topText.setAttribute('font-size', '12');
    topText.setAttribute('fill', '#FF00FF');
    topText.setAttribute('font-family', 'Arial');
    topText.setAttribute('font-weight', 'bold');
    topText.textContent = data.name?.replace('FAT', 'AT') || 'AT 03-1';
    container.appendChild(topText);

    // Circle in the middle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '55');
    circle.setAttribute('r', '8');
    circle.setAttribute('stroke', '#FF00FF');
    circle.setAttribute('stroke-width', '3');
    circle.setAttribute('fill', 'none');
    container.appendChild(circle);

    // Center dot
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', '50');
    dot.setAttribute('cy', '55');
    dot.setAttribute('r', '2');
    dot.setAttribute('fill', '#FF00FF');
    container.appendChild(dot);

    // Bottom text - HP identifier
    const bottomText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    bottomText.setAttribute('x', '50');
    bottomText.setAttribute('y', '100');
    bottomText.setAttribute('text-anchor', 'middle');
    bottomText.setAttribute('font-size', '14');
    bottomText.setAttribute('fill', '#FF00FF');
    bottomText.setAttribute('font-family', 'Arial');
    bottomText.setAttribute('font-weight', 'bold');
    bottomText.textContent = `HP-${Math.floor(Math.random() * 9) + 1}`;
    container.appendChild(bottomText);

    // Splitter text
    const splitterText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    splitterText.setAttribute('x', '50');
    splitterText.setAttribute('y', '115');
    splitterText.setAttribute('text-anchor', 'middle');
    splitterText.setAttribute('font-size', '8');
    splitterText.setAttribute('fill', '#FF00FF');
    splitterText.setAttribute('font-family', 'Arial');
    splitterText.textContent = 'position 1:8 SPLITTER';
    container.appendChild(splitterText);

    group.appendChild(container);
  }

  private renderFDTNode(group: SVGElement, data: NetworkElement): void {
    const container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    container.setAttribute('transform', 'scale(0.3) translate(-50, -40)');

    // Outer rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '10');
    rect.setAttribute('y', '10');
    rect.setAttribute('width', '80');
    rect.setAttribute('height', '60');
    rect.setAttribute('stroke', '#9C27B0');
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke-width', '3');
    container.appendChild(rect);

    // Add basic splitter representation
    const splitterConfig = data.metadata?.splitter_config || '2x4 SPL';
    const splitters = splitterConfig.split(',').map(s => s.trim());

    splitters.forEach((splitter, index) => {
      const yOffset = index * 20 + 20;
      
      // Splitter box
      const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      box.setAttribute('x', '20');
      box.setAttribute('y', yOffset.toString());
      box.setAttribute('width', '30');
      box.setAttribute('height', '15');
      box.setAttribute('stroke', '#9C27B0');
      box.setAttribute('fill', 'none');
      box.setAttribute('stroke-width', '2');
      container.appendChild(box);

      // Triangle
      const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      triangle.setAttribute('points', `50,${yOffset + 7.5} 70,${yOffset} 70,${yOffset + 15}`);
      triangle.setAttribute('fill', 'none');
      triangle.setAttribute('stroke', '#9C27B0');
      triangle.setAttribute('stroke-width', '2');
      container.appendChild(triangle);
    });

    group.appendChild(container);
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
} 