import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NetworkData, NetworkElement, Connection, GraphNode, GraphLink } from '../models/network.model';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private networkDataSubject = new BehaviorSubject<NetworkData>({
    network_elements: [],
    connections: []
  });
  public networkData$ = this.networkDataSubject.asObservable();
  private currentNetworkType = 'large';

  constructor(private http: HttpClient) { 
    this.switchToLargeNetwork();
  }

  loadLargeNetwork(): Observable<NetworkData> {
    return this.http.get<NetworkData>('/assets/splicing-data.json');
  }

  switchToLargeNetwork(): void {
    this.currentNetworkType = 'large';
    this.loadLargeNetwork().subscribe(data => {
      this.networkDataSubject.next(data);
    });
  }

  switchToSampleNetwork(): void {
    this.currentNetworkType = 'sample';
    this.networkDataSubject.next(this.getSampleData());
  }

  getCurrentNetworkType(): string {
    return this.currentNetworkType;
  }

  getSampleData(): NetworkData {
    return {
      "network_elements": [
        {
          "ne_id": 1,
          "name": "FDC-1",
          "type": "FDC",
          "fiber_count": 144,
          "location": "POP Room",
          "metadata": {
            "phase": "Phase 1"
          }
        },
        {
          "ne_id": 2,
          "name": "SC-3",
          "type": "SpliceClosure",
          "fiber_count": 144,
          "location": "Manhole-7",
          "metadata": {
            "ring_id": "RING-1"
          }
        },
        {
          "ne_id": 3,
          "name": "FAT-03-7",
          "type": "FAT",
          "fiber_count": 24,
          "location": "Sector 6",
          "homepasses": 8,
          "port_ratio": "1:8"
        },
        {
          "ne_id": 4,
          "name": "FDT-01",
          "type": "FDT",
          "fiber_count": 48,
          "location": "Street Cabinet",
          "metadata": {
            "splitter_config": "2x4 SPL, 2x16 SPL, 2x8 SPL"
          }
        }
      ],
      "connections": [
        {
          "cable_id": 101,
          "core_number": 19,
          "from_ne_id": 1,
          "from_ne_type": "FDC",
          "from_port": "P01",
          "to_ne_id": 2,
          "to_ne_type": "SpliceClosure",
          "to_port": "T01",
          "splice_type": "splice"
        },
        {
          "cable_id": 101,
          "core_number": 20,
          "from_ne_id": 1,
          "from_ne_type": "FDC",
          "from_port": "P02",
          "to_ne_id": 2,
          "to_ne_type": "SpliceClosure",
          "to_port": "T02",
          "splice_type": "through"
        },
        {
          "cable_id": 104,
          "core_number": 25,
          "from_ne_id": 2,
          "from_ne_type": "SpliceClosure",
          "from_port": "P03",
          "to_ne_id": 3,
          "to_ne_type": "FAT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 105,
          "core_number": 30,
          "from_ne_id": 3,
          "from_ne_type": "FAT",
          "from_port": "OUT",
          "to_ne_id": 4,
          "to_ne_type": "FDT",
          "to_port": "IN",
          "splice_type": "splice"
        }
      ]
    };
  }

  getLargeNetworkData(): NetworkData {
    return {
      "network_elements": [
        {
          "ne_id": 1,
          "name": "FDC-MAIN",
          "type": "FDC",
          "fiber_count": 288,
          "location": "Central POP",
          "metadata": {
            "phase": "Phase 1"
          }
        },
        {
          "ne_id": 2,
          "name": "SC-NORTH-1",
          "type": "SpliceClosure",
          "fiber_count": 144,
          "location": "North Manhole-1",
          "metadata": {
            "ring_id": "NORTH-RING"
          }
        },
        {
          "ne_id": 3,
          "name": "SC-SOUTH-1",
          "type": "SpliceClosure",
          "fiber_count": 144,
          "location": "South Manhole-1",
          "metadata": {
            "ring_id": "SOUTH-RING"
          }
        },
        {
          "ne_id": 4,
          "name": "SC-EAST-1",
          "type": "SpliceClosure",
          "fiber_count": 96,
          "location": "East Manhole-1",
          "metadata": {
            "ring_id": "EAST-RING"
          }
        },
        {
          "ne_id": 5,
          "name": "SC-WEST-1",
          "type": "SpliceClosure",
          "fiber_count": 96,
          "location": "West Manhole-1",
          "metadata": {
            "ring_id": "WEST-RING"
          }
        },
        {
          "ne_id": 6,
          "name": "FAT-NORTH-1",
          "type": "FAT",
          "fiber_count": 24,
          "location": "North Sector 1",
          "homepasses": 12,
          "port_ratio": "1:12"
        },
        {
          "ne_id": 7,
          "name": "FAT-NORTH-2",
          "type": "FAT",
          "fiber_count": 24,
          "location": "North Sector 2",
          "homepasses": 8,
          "port_ratio": "1:8"
        },
        {
          "ne_id": 8,
          "name": "FAT-SOUTH-1",
          "type": "FAT",
          "fiber_count": 24,
          "location": "South Sector 1",
          "homepasses": 10,
          "port_ratio": "1:10"
        },
        {
          "ne_id": 9,
          "name": "FAT-SOUTH-2",
          "type": "FAT",
          "fiber_count": 24,
          "location": "South Sector 2",
          "homepasses": 6,
          "port_ratio": "1:6"
        },
        {
          "ne_id": 10,
          "name": "FAT-EAST-1",
          "type": "FAT",
          "fiber_count": 24,
          "location": "East Sector 1",
          "homepasses": 8,
          "port_ratio": "1:8"
        },
        {
          "ne_id": 11,
          "name": "FAT-WEST-1",
          "type": "FAT",
          "fiber_count": 24,
          "location": "West Sector 1",
          "homepasses": 10,
          "port_ratio": "1:10"
        },
        {
          "ne_id": 12,
          "name": "FDT-NORTH-1",
          "type": "FDT",
          "fiber_count": 48,
          "location": "North Street Cabinet 1",
          "metadata": {
            "splitter_config": "2x4 SPL, 2x8 SPL, 2x16 SPL"
          }
        },
        {
          "ne_id": 13,
          "name": "FDT-NORTH-2",
          "type": "FDT",
          "fiber_count": 48,
          "location": "North Street Cabinet 2",
          "metadata": {
            "splitter_config": "2x4 SPL, 2x12 SPL"
          }
        },
        {
          "ne_id": 14,
          "name": "FDT-SOUTH-1",
          "type": "FDT",
          "fiber_count": 48,
          "location": "South Street Cabinet 1",
          "metadata": {
            "splitter_config": "2x4 SPL, 2x8 SPL, 2x8 SPL"
          }
        },
        {
          "ne_id": 15,
          "name": "FDT-SOUTH-2",
          "type": "FDT",
          "fiber_count": 48,
          "location": "South Street Cabinet 2",
          "metadata": {
            "splitter_config": "2x4 SPL, 2x16 SPL"
          }
        },
        {
          "ne_id": 16,
          "name": "FDT-EAST-1",
          "type": "FDT",
          "fiber_count": 48,
          "location": "East Street Cabinet 1",
          "metadata": {
            "splitter_config": "2x4 SPL, 2x8 SPL"
          }
        },
        {
          "ne_id": 17,
          "name": "FDT-WEST-1",
          "type": "FDT",
          "fiber_count": 48,
          "location": "West Street Cabinet 1",
          "metadata": {
            "splitter_config": "2x4 SPL, 2x12 SPL"
          }
        },
        {
          "ne_id": 18,
          "name": "SC-NORTH-2",
          "type": "SpliceClosure",
          "fiber_count": 72,
          "location": "North Manhole-2",
          "metadata": {
            "ring_id": "NORTH-RING"
          }
        },
        {
          "ne_id": 19,
          "name": "SC-SOUTH-2",
          "type": "SpliceClosure",
          "fiber_count": 72,
          "location": "South Manhole-2",
          "metadata": {
            "ring_id": "SOUTH-RING"
          }
        },
        {
          "ne_id": 20,
          "name": "FAT-NORTH-3",
          "type": "FAT",
          "fiber_count": 24,
          "location": "North Sector 3",
          "homepasses": 15,
          "port_ratio": "1:15"
        },
        {
          "ne_id": 21,
          "name": "FAT-SOUTH-3",
          "type": "FAT",
          "fiber_count": 24,
          "location": "South Sector 3",
          "homepasses": 12,
          "port_ratio": "1:12"
        },
        {
          "ne_id": 22,
          "name": "FDT-NORTH-3",
          "type": "FDT",
          "fiber_count": 48,
          "location": "North Street Cabinet 3",
          "metadata": {
            "splitter_config": "2x4 SPL, 2x8 SPL, 2x4 SPL"
          }
        },
        {
          "ne_id": 23,
          "name": "FDT-SOUTH-3",
          "type": "FDT",
          "fiber_count": 48,
          "location": "South Street Cabinet 3",
          "metadata": {
            "splitter_config": "2x4 SPL, 2x16 SPL, 2x8 SPL"
          }
        }
      ],
      "connections": [
        {
          "cable_id": 101,
          "core_number": 1,
          "from_ne_id": 1,
          "from_ne_type": "FDC",
          "from_port": "P01",
          "to_ne_id": 2,
          "to_ne_type": "SpliceClosure",
          "to_port": "T01",
          "splice_type": "splice"
        },
        {
          "cable_id": 101,
          "core_number": 2,
          "from_ne_id": 1,
          "from_ne_type": "FDC",
          "from_port": "P02",
          "to_ne_id": 2,
          "to_ne_type": "SpliceClosure",
          "to_port": "T02",
          "splice_type": "through"
        },
        {
          "cable_id": 102,
          "core_number": 1,
          "from_ne_id": 1,
          "from_ne_type": "FDC",
          "from_port": "P03",
          "to_ne_id": 3,
          "to_ne_type": "SpliceClosure",
          "to_port": "T01",
          "splice_type": "splice"
        },
        {
          "cable_id": 102,
          "core_number": 2,
          "from_ne_id": 1,
          "from_ne_type": "FDC",
          "from_port": "P04",
          "to_ne_id": 3,
          "to_ne_type": "SpliceClosure",
          "to_port": "T02",
          "splice_type": "through"
        },
        {
          "cable_id": 103,
          "core_number": 1,
          "from_ne_id": 1,
          "from_ne_type": "FDC",
          "from_port": "P05",
          "to_ne_id": 4,
          "to_ne_type": "SpliceClosure",
          "to_port": "T01",
          "splice_type": "splice"
        },
        {
          "cable_id": 104,
          "core_number": 1,
          "from_ne_id": 1,
          "from_ne_type": "FDC",
          "from_port": "P06",
          "to_ne_id": 5,
          "to_ne_type": "SpliceClosure",
          "to_port": "T01",
          "splice_type": "splice"
        },
        {
          "cable_id": 201,
          "core_number": 1,
          "from_ne_id": 2,
          "from_ne_type": "SpliceClosure",
          "from_port": "P01",
          "to_ne_id": 6,
          "to_ne_type": "FAT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 201,
          "core_number": 2,
          "from_ne_id": 2,
          "from_ne_type": "SpliceClosure",
          "from_port": "P02",
          "to_ne_id": 7,
          "to_ne_type": "FAT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 202,
          "core_number": 1,
          "from_ne_id": 3,
          "from_ne_type": "SpliceClosure",
          "from_port": "P01",
          "to_ne_id": 8,
          "to_ne_type": "FAT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 202,
          "core_number": 2,
          "from_ne_id": 3,
          "from_ne_type": "SpliceClosure",
          "from_port": "P02",
          "to_ne_id": 9,
          "to_ne_type": "FAT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 203,
          "core_number": 1,
          "from_ne_id": 4,
          "from_ne_type": "SpliceClosure",
          "from_port": "P01",
          "to_ne_id": 10,
          "to_ne_type": "FAT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 204,
          "core_number": 1,
          "from_ne_id": 5,
          "from_ne_type": "SpliceClosure",
          "from_port": "P01",
          "to_ne_id": 11,
          "to_ne_type": "FAT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 301,
          "core_number": 1,
          "from_ne_id": 6,
          "from_ne_type": "FAT",
          "from_port": "OUT",
          "to_ne_id": 12,
          "to_ne_type": "FDT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 302,
          "core_number": 1,
          "from_ne_id": 7,
          "from_ne_type": "FAT",
          "from_port": "OUT",
          "to_ne_id": 13,
          "to_ne_type": "FDT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 303,
          "core_number": 1,
          "from_ne_id": 8,
          "from_ne_type": "FAT",
          "from_port": "OUT",
          "to_ne_id": 14,
          "to_ne_type": "FDT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 304,
          "core_number": 1,
          "from_ne_id": 9,
          "from_ne_type": "FAT",
          "from_port": "OUT",
          "to_ne_id": 15,
          "to_ne_type": "FDT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 305,
          "core_number": 1,
          "from_ne_id": 10,
          "from_ne_type": "FAT",
          "from_port": "OUT",
          "to_ne_id": 16,
          "to_ne_type": "FDT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 306,
          "core_number": 1,
          "from_ne_id": 11,
          "from_ne_type": "FAT",
          "from_port": "OUT",
          "to_ne_id": 17,
          "to_ne_type": "FDT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 401,
          "core_number": 1,
          "from_ne_id": 2,
          "from_ne_type": "SpliceClosure",
          "from_port": "P03",
          "to_ne_id": 18,
          "to_ne_type": "SpliceClosure",
          "to_port": "T01",
          "splice_type": "splice"
        },
        {
          "cable_id": 402,
          "core_number": 1,
          "from_ne_id": 3,
          "from_ne_type": "SpliceClosure",
          "from_port": "P03",
          "to_ne_id": 19,
          "to_ne_type": "SpliceClosure",
          "to_port": "T01",
          "splice_type": "splice"
        },
        {
          "cable_id": 501,
          "core_number": 1,
          "from_ne_id": 18,
          "from_ne_type": "SpliceClosure",
          "from_port": "P01",
          "to_ne_id": 20,
          "to_ne_type": "FAT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 502,
          "core_number": 1,
          "from_ne_id": 19,
          "from_ne_type": "SpliceClosure",
          "from_port": "P01",
          "to_ne_id": 21,
          "to_ne_type": "FAT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 601,
          "core_number": 1,
          "from_ne_id": 20,
          "from_ne_type": "FAT",
          "from_port": "OUT",
          "to_ne_id": 22,
          "to_ne_type": "FDT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 602,
          "core_number": 1,
          "from_ne_id": 21,
          "from_ne_type": "FAT",
          "from_port": "OUT",
          "to_ne_id": 23,
          "to_ne_type": "FDT",
          "to_port": "IN",
          "splice_type": "splice"
        },
        {
          "cable_id": 701,
          "core_number": 1,
          "from_ne_id": 18,
          "from_ne_type": "SpliceClosure",
          "from_port": "P02",
          "to_ne_id": 1,
          "to_ne_type": "FDC",
          "to_port": "P07",
          "splice_type": "splice"
        },
        {
          "cable_id": 702,
          "core_number": 1,
          "from_ne_id": 19,
          "from_ne_type": "SpliceClosure",
          "from_port": "P02",
          "to_ne_id": 1,
          "to_ne_type": "FDC",
          "to_port": "P08",
          "splice_type": "splice"
        }
      ]
    };
  }

  convertToGraphData(networkData: NetworkData): { nodes: GraphNode[], links: GraphLink[] } {
    const nodes: GraphNode[] = networkData.network_elements.map(element => ({
      id: element.ne_id.toString(),
      label: element.name,
      type: element.type,
      data: element
    }));

    const connectionGroups = new Map<string, Connection[]>();
    
    networkData.connections.forEach(connection => {
      const key = `${connection.from_ne_id}-${connection.to_ne_id}`;
      if (!connectionGroups.has(key)) {
        connectionGroups.set(key, []);
      }
      connectionGroups.get(key)!.push(connection);
    });

    const links: GraphLink[] = [];
    
    connectionGroups.forEach((connections, key) => {
      if (connections.length === 0) return;
      
      const firstConnection = connections[0];
      const [fromId, toId] = key.split('-');
      
      const targetElement = networkData.network_elements.find(el => el.ne_id.toString() === toId);
      
      connections.sort((a, b) => a.core_number - b.core_number);
      
      const minCore = connections[0].core_number;
      const maxCore = connections[connections.length - 1].core_number;
      
      let line1 = '';
      if (minCore === maxCore) {
        line1 = `${minCore} (SPLICE) ${minCore}`;
      } else {
        line1 = `${minCore}-${maxCore} (SPLICE) ${minCore}-${maxCore}`;
      }
      
      const cableType = firstConnection.cable_type || 'Unknown';
      const line2 = `${cableType} / XXm`;
      
      const elementId = targetElement ? targetElement.name : `Element ${toId}`;
      const line3 = `to: ${elementId}`;
      
      const label = `${line1}\n${line2}\n${line3}`;
      links.push({
        id: `${firstConnection.cable_id}-${fromId}-${toId}`,
        source: fromId,
        target: toId,
        label: label,
        cable_type: firstConnection.cable_type,
        data: firstConnection,
        connectionCount: connections.length,
        coreRange: { min: minCore, max: maxCore }
      });
    });

    return { nodes, links };
  }

  updateNetworkData(data: NetworkData): void {
    this.networkDataSubject.next(data);
  }
} 