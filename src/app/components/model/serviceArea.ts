export interface serviceArea {
  pincodes: any[];
  serviceAreaIdsList: any;
  createdById: number;
  createdByName: string;
  createdate: string;
  id: number;
  isDeleted: false;
  lastModifiedById: number;
  lastModifiedByName: string;
  name: string;
  status: string;
  updatedate: string;
  mvnoId: number;
  polyGoneList: PolyGon[];
  mvnoIds: [];
}

export class PolyGon {
  lat!: string;
  lng!: string;
  polyOrder!: number;
}
