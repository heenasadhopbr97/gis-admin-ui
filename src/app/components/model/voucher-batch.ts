import { PlanManagement} from "../model/plan-management";
import { Voucher } from "./voucher";
import { VoucherConfiguration } from "./voucher-configuration";

export class VoucherBatch {

    voucherBatchId: number;

    batchName: string;

    voucherConfiguration: VoucherConfiguration;

    planManagement: PlanManagement;

   // reseller: Reseller;

    voucherQuantity: number;

    price: number;

    mvnoId: number;

    vouchers: Voucher[];

    constructor() {
        this.voucherConfiguration = new VoucherConfiguration();
        //this.planManagement = new PlanManagement();
       // this.reseller = new Reseller();
        this.vouchers = [];
    } 
}