import { VoucherBatch } from "../model/voucher-batch";

export class Voucher {
    id: number;
    voucherBatch: VoucherBatch;
    code: string;
    batchName: string;
    status: string;
    mvnoId: number;
    constructor() {
        this.voucherBatch = new VoucherBatch();
    }
}