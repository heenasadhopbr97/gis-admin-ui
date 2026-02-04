export interface NetworkElement {
  ne_id: number;
  name: string;
  type: 'FDC' | 'SpliceClosure' | 'FAT' | 'FDT';
  fiber_count: number;
  location: string;
  metadata?: {
    phase?: string;
    ring_id?: string;
    splitter_config?: string; // For FDT splitter configuration
  };
  homepasses?: number;
  port_ratio?: string;
}

export interface Connection {
  cable_id: number;
  cable_type?: string;
  core_number: number;
  from_ne_id: number;
  from_ne_type: string;
  from_port: string;
  to_ne_id: number;
  to_ne_type: string;
  to_port: string;
  splice_type: 'splice' | 'through';
}

export interface NetworkData {
  network_elements: NetworkElement[];
  connections: Connection[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'FDC' | 'SpliceClosure' | 'FAT' | 'FDT';
  data: NetworkElement;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
  label: string;
  cable_type?: string;
  data: Connection;
  connectionCount?: number;
  coreRange?: { min: number; max: number };
} 