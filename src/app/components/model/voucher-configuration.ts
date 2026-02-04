import { PlanManagement } from "../model/plan-management";

export class VoucherConfiguration {

    id: number;

    name: string;

    noOfVoucher: number;

    plan: PlanManagement;

    voucherCodeLength: number;

    prefix: string;

    status: string;

    suffix: string;

    mvnoId: number;
    constructor() {
    }
}