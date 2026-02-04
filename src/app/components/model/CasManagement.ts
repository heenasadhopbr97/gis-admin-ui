export interface CasManagement {
  casname: string;
  status: string;
  delete: boolean;
  isDelete: boolean;
  id: number;
  casPackageMappings: any[];
  casParameterMappings: any[];
}
