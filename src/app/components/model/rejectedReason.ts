import { RejectedSubReason } from "./rejectedSubReason";

export interface RejectedReason{
    id : number;
    name: string;
    status: string;
    isDelete: boolean;
    mvnoId: number;
    buId: number;
    rejectSubReasonDtoList: Array<RejectedSubReason>;
}