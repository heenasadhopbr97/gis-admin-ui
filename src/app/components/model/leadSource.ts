import { LeadSubSource } from "./leadSubSource";

export interface LeadSource{
    id : number;
    leadSourceName: string;
    status: string;
    isDelete: boolean;
    mvnoId: number;
    buId: number;
    leadSubSourceDtoList: Array<LeadSubSource>;
}