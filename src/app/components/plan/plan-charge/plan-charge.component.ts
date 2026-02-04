import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Observable } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { PlanManagementService } from "src/app/service/plan-management.service";
declare var $: any;

@Component({
    selector: "app-plan-charge",
    templateUrl: "./plan-charge.component.html",
    styleUrls: ["./plan-charge.component.css"],
    standalone: false
})
export class PlanChargeComponent implements OnInit {
  @Input() changePlanChargeEvent: Observable<any>;
  @Input() planCharge: any;
  @Output() planChargeChange = new EventEmitter<any>();

  chargeFromArray: FormArray;
  pricePerTax: any = 0;
  totalPriceData:any[] = [];
  chargeTaxAmountArray:any[] = [];
chargeitemsPerPage: string|number;
chargetotalRecords: string|number;
currentPageCharge: string|number;

  constructor(
    private spinner: NgxSpinnerService,
    private planManagementService: PlanManagementService,
    private fb: FormBuilder
  ) {}


  getControl(row: AbstractControl, controlName: string): FormControl {
    if (row instanceof FormGroup) {
      const ctrl = row.get(controlName);
      if (ctrl instanceof FormControl) {
        return ctrl;
      }
    }
    return new FormControl('');
  }

  ngOnInit(): void {
    $("#planChargeModal").modal("show");
    this.chargeFromArray = this.fb.array([]);
    let taxData: any = [];
    let slabList: any = [];
    let tireList: any = [];
    let slabPrice: any = [];
    let amount = 0;
    let totalslebPrice = 0;
    this.planCharge.newOfferPrice = 0;
    this.planCharge.chargeList.forEach((element:any) => {
      let price = element.chargeprice ? element.chargeprice : element.charge.price;
      let url =
        "/taxes/" + Number(element.charge.taxid ? element.charge.taxid : element.charge.tax.id);
      this.planManagementService.getMethod(url).subscribe((response: any) => {
        taxData = response.taxData;
        if (taxData.taxtype == "SLAB") {
          slabList = taxData.slabList;
          if (slabList.length > 0) {
            for (let i = 0; i < slabList.length; i++) {
              if (price >= slabList[i].rangeUpTo) {
                if (i == 0) {
                  amount = slabList[i].rangeUpTo + (slabList[i].rangeUpTo * slabList[i].rate) / 100;
                  price = price - slabList[i].rangeUpTo;
                } else {
                  let NewAmount = slabList[i].rangeUpTo - slabList[i - 1].rangeUpTo;
                  amount = NewAmount + (NewAmount * slabList[i].rate) / 100;
                  price = price - NewAmount;
                }
                slabPrice.push(amount);
                if (slabList.length == i + 1) {
                  slabPrice.forEach((element:any) => {
                    totalslebPrice = totalslebPrice + Number(element);
                  });
                  this.pricePerTax = totalslebPrice.toFixed(2);

                  this.totalPriceData.push(Number(this.pricePerTax));
                  this.planCharge.newOfferPrice =
                    Number(this.planCharge.newOfferPrice) + Number(this.pricePerTax);
                }
              } else {
                amount = price + (price * slabList[i].rate) / 100;
                slabPrice.push(amount);
                slabPrice.forEach((element:any) => {
                  totalslebPrice = totalslebPrice + Number(element);
                });
                this.pricePerTax = totalslebPrice.toFixed(2);
                this.totalPriceData.push(Number(this.pricePerTax));
                this.planCharge.newOfferPrice =
                  Number(this.planCharge.newOfferPrice) + Number(this.pricePerTax);
                slabList.length = 0;
              }
            }
          }
        } else if (taxData.taxtype == "TIER") {
          let ifsameTire = false;
          if (taxData.tieredList.length > 0) {
            tireList = taxData.tieredList;
            if (tireList.length > 0) {
              let newAmount = 0;
              let totalAmountTire = 0;
              let totalPricetire = 0;
              let tireAmountList = [];

              amount = price + (price * tireList[0].rate) / 100;
              newAmount = (price * tireList[0].rate) / 100;
              totalAmountTire = amount;
              if (tireList.length == 1) {
                this.taxAmountCal(price, tireList[0].rate);
                this.pricePerTax = amount.toFixed(2);

                this.planCharge.newOfferPrice =
                  Number(this.planCharge.newOfferPrice) + Number(this.pricePerTax);

                this.totalPriceData.push(Number(this.pricePerTax));
                this.chargeTaxAmountArray.push(Number(this.taxAmount));
              } else {
                // amount = newAmount
                for (let i = 1; i < tireList.length; i++) {
                  let AcTiNo = i;
                  while (AcTiNo > 0) {
                    let TI_NO = AcTiNo - 1;
                    if (tireList[i].taxGroup == tireList[TI_NO].taxGroup) {
                      ifsameTire = true;
                      AcTiNo = 0;
                    } else {
                      amount = newAmount;
                      ifsameTire = false;
                    }
                    AcTiNo--;
                  }

                  if (ifsameTire) {
                    amount = amount + (amount * tireList[i].rate) / 100;

                    if (tireList.length == i + 1 || amount < 0) {
                      totalAmountTire = amount;
                      this.pricePerTax = totalAmountTire.toFixed(2);
                      tireList.length = 0;

                      this.planCharge.newOfferPrice =
                        Number(this.planCharge.newOfferPrice) + Number(this.pricePerTax);
                      this.totalPriceData.push(Number(this.pricePerTax));
                      let NewTaxAmountCount = Number(this.pricePerTax) - Number(price);
                      this.chargeTaxAmountArray.push(Number(NewTaxAmountCount));
                    }
                  } else {
                    amount = (amount * tireList[i].rate) / 100;
                    tireAmountList.push(amount);
                    if (tireList.length == i + 1 || amount < 0) {
                      tireAmountList.forEach(element => {
                        totalPricetire = totalPricetire + Number(element);
                      });
                      totalAmountTire = Number(totalAmountTire) + Number(totalPricetire);
                      this.pricePerTax = totalAmountTire.toFixed(2);
                      tireList.length = 0;

                      this.planCharge.newOfferPrice =
                        Number(this.planCharge.newOfferPrice) + Number(this.pricePerTax);
                      this.totalPriceData.push(Number(this.pricePerTax));

                      let NewTaxAmountCount = Number(this.pricePerTax) - Number(price);
                      this.chargeTaxAmountArray.push(Number(NewTaxAmountCount));
                    }
                  }
                }
              }
            }
          }
        }
      });
      this.chargeFromArray.push(
        this.fb.group({
          id: [element.charge.id],
          taxamount: [Number(element.charge.taxamount).toFixed(2)],
          actualprice: [element.charge.price],
          chargeprice: [element.chargeprice],
          chargename: [element.charge.name],
          newchargename: [element.chargeName ? element.chargeName : element.charge.name],
        })
      );
    });
  }

  saveChargeData() {
    for (let [index] of this.chargeFromArray.value.entries()) {
      if (this.chargeFromArray.value[index].id) {
        // this.charge = {
        //   id: "",
        //   actualprice: "",
        //   taxamount: "",
        // };
        this.planCharge.chargeList[index] = {
          id: this.chargeFromArray.value[index].id,
          chargeName: this.chargeFromArray.value[index].newchargename,
          chargeprice: this.chargeFromArray.value[index].chargeprice,
          charge: this.planCharge.chargeList[index].charge,
        };
        // this.planCharge.chargeList[index].id = this.chargeFromArray.value[index].id;
        // this.planCharge.chargeList[index].actualprice =
        //   this.chargeFromArray.value[index].actualprice;
        // this.planCharge.chargeList[index].taxamount =
        //   this.chargeFromArray.value[index].taxamount;
        // delete this.planCharge.chargeList[index].id;
        // delete this.planCharge.chargeList[index].actualprice;
        // delete this.planCharge.chargeList[index].taxamount;
      }
    }
    $("#planChargeModal").modal("hide");
    this.planChargeChange.emit(this.planCharge);
  }
  closeChargeModal() {
    $("#planChargeModal").modal("hide");
    this.planChargeChange.emit();
  }

  taxAmount: any;
  taxAmountCal(price:any, rate:any) {
    this.taxAmount = (price * rate) / 100;
    return this.taxAmount.toFixed(2);
  }

  changeActualPrice(price:any, id:any, index:any) {
    console.log(
      "changeActualPrice :::::: " + price + " ::: id ::: " + id + " ::: index ::: " + index
    );

    let taxData: any = [];
    let slabList: any = [];
    let tireList: any = [];
    let slabPrice: any = [];
    let amount = 0;
    let totalslebPrice = 0;
    let noTaxPrice = 0;
    const url1 = "/charge/" + id;
    this.planManagementService.getMethod(url1).subscribe((res: any) => {
      let url = "/taxes/" + res.chargebyid.taxid;
      this.planManagementService.getMethod(url).subscribe((response: any) => {
        taxData = response.taxData;
        if (taxData.taxtype == "SLAB") {
          slabList = taxData.slabList;
          if (slabList.length > 0) {
            for (let i = 0; i < slabList.length; i++) {
              if (price >= slabList[i].rangeUpTo) {
                if (i == 0) {
                  amount = slabList[i].rangeUpTo + (slabList[i].rangeUpTo * slabList[i].rate) / 100;
                  price = price - slabList[i].rangeUpTo;
                } else {
                  let NewAmount = slabList[i].rangeUpTo - slabList[i - 1].rangeUpTo;
                  amount = NewAmount + (NewAmount * slabList[i].rate) / 100;
                  price = price - NewAmount;
                }
                slabPrice.push(amount);

                if (slabList.length == i + 1) {
                  slabPrice.forEach((element:any) => {
                    totalslebPrice = totalslebPrice + Number(element);
                  });
                  this.pricePerTax = totalslebPrice.toFixed(2);
                }
              } else {
                amount = price + (price * slabList[i].rate) / 100;
                slabPrice.push(amount);
                slabPrice.forEach((element:any) => {
                  totalslebPrice = totalslebPrice + Number(element);
                });
                this.pricePerTax = totalslebPrice.toFixed(2);
                slabList.length = 0;
              }
            }
          }
        } else if (taxData.taxtype == "TIER") {
          let ifsameTire = false;
          if (taxData.tieredList.length > 0) {
            tireList = taxData.tieredList;
            if (tireList.length > 0) {
              let newAmount = 0;
              let totalAmountTire = 0;
              let totalPricetire = 0;
              let tireAmountList = [];

              amount = price + (price * tireList[0].rate) / 100;
              newAmount = (price * tireList[0].rate) / 100;
              totalAmountTire = amount;
              if (tireList.length == 1) {
                this.taxAmountCal(price, tireList[0].rate);
                this.pricePerTax = amount.toFixed(2);
                console.log((price * tireList[0].rate) / 100);
                this.totalPriceData.forEach((element, j) => {
                  if (j == index) {
                    this.totalPriceData[j] = this.pricePerTax;
                    let count: number = 0;
                    for (let j = 0; j < this.totalPriceData.length; j++) {
                      let n = this.totalPriceData[j];
                      count = Number(count) + Number(n);
                      this.planCharge.newOfferPrice = Number(count.toFixed(2));
                    }
                    this.chargeFromArray.value.forEach((elem:any, indexCharge:any) => {
                      let nn = indexCharge + 1;
                      if (indexCharge == index) {
                        elem.taxamount = this.taxAmount.toFixed(2);
                        this.chargeTaxAmountArray[index] = elem.taxamount;
                      }
                      if (this.chargeFromArray.value.length == nn) {
                        this.chargeFromArray.patchValue(this.chargeFromArray.value);
                      }
                    });
                  }
                });
              } else {
                for (let i = 1; i < tireList.length; i++) {
                  let AcTiNo = i;
                  while (AcTiNo > 0) {
                    let TI_NO = AcTiNo - 1;
                    if (tireList[i].taxGroup == tireList[TI_NO].taxGroup) {
                      ifsameTire = true;
                      AcTiNo = 0;
                    } else {
                      amount = newAmount;
                      ifsameTire = false;
                    }
                    AcTiNo--;
                  }

                  if (ifsameTire) {
                    amount = amount + (amount * tireList[i].rate) / 100;
                    if (tireList.length == i + 1 || amount < 0) {
                      tireAmountList.forEach(element => {
                        totalPricetire = totalPricetire + Number(element);
                      });

                      totalAmountTire = amount;
                      this.pricePerTax = totalAmountTire.toFixed(2);
                      this.totalPriceData.forEach((element, j) => {
                        if (j == index) {
                          this.totalPriceData[j] = this.pricePerTax;
                          let count = 0;
                          for (let j = 0; j < this.totalPriceData.length; j++) {
                            let n = this.totalPriceData[j];
                            count = Number(count) + Number(n);
                            this.planCharge.newOfferPrice = Number(count.toFixed(2));
                          }

                          this.chargeFromArray.value.forEach((elem:any, indexCharge:any) => {
                            let nn = indexCharge + 1;
                            if (indexCharge == index) {
                              elem.taxamount = (Number(this.pricePerTax) - Number(price)).toFixed(
                                2
                              );
                              this.chargeTaxAmountArray[index] = elem.taxamount;
                            }
                            if (this.chargeFromArray.value.length == nn) {
                              this.chargeFromArray.patchValue(this.chargeFromArray.value);
                            }
                          });
                        }
                      });
                      tireList.length = 0;
                    }
                  } else {
                    amount = (amount * tireList[i].rate) / 100;
                    tireAmountList.push(amount.toFixed(2));

                    if (tireList.length == i + 1 || amount < 0) {
                      console.log(tireAmountList);

                      tireAmountList.forEach(element => {
                        totalPricetire = totalPricetire + Number(element);
                      });

                      totalAmountTire = totalAmountTire + totalPricetire;
                      this.pricePerTax = totalAmountTire.toFixed(2);

                      this.totalPriceData.forEach((element, j) => {
                        if (j == index) {
                          this.totalPriceData[j] = this.pricePerTax;
                          let count = 0;
                          for (let j = 0; j < this.totalPriceData.length; j++) {
                            let n = this.totalPriceData[j];
                            count = Number(count) + Number(n);
                            this.planCharge.newOfferPrice = Number(count.toFixed(2));
                          }

                          this.chargeFromArray.value.forEach((elem:any, indexCharge:any) => {
                            let nn = indexCharge + 1;
                            if (indexCharge == index) {
                              elem.taxamount = Number(this.pricePerTax) - Number(price);
                              elem.taxamount = elem.taxamount.toFixed(2);
                              this.chargeTaxAmountArray[index] = elem.taxamount;
                            }
                            if (this.chargeFromArray.value.length == nn) {
                              this.chargeFromArray.patchValue(this.chargeFromArray.value);
                            }
                          });
                        }
                      });
                      tireList.length = 0;
                    }
                  }
                }
              }
            }
          }
        }
      });
    });
  }
}
