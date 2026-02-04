import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { LoginService } from "src/app/service/login.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { ActivatedRoute, Router } from "@angular/router";
import { KeyannaCommonBaseService } from "src/app/service/keyanna-common-base.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { IClient } from "../../model/radius-client";
import { RadiusClientService } from "src/app/service/radius-client.service";
import { DictionaryService } from "src/app/service/dictionary.service";

declare var $: any;

@Component({
    selector: "app-radius-client-create",
    templateUrl: "./radius-client-create.component.html",
    styleUrls: ["./radius-client-create.component.scss"],
    standalone: false
})
export class RadiusClientCreateComponent implements OnInit {
  filteredGroupsList: Array<any> = [];
  editClientId: any;
  loggedInUser: any;
  mvnoData: any;
  submitted = false;
  updatedMode: boolean = false;
  isPoolNameAdded: boolean = false;
  editMode: boolean = false;
  mvnoId: any;
  selectedMvnoId: any;
  clientForm: FormGroup;
  editClientData: IClient;
  modalToggle: boolean = true;
  clientGroupAttribute: FormArray;
  ipPoolAttribute: FormArray;
  ipType = [{ label: "IPv4" }, { label: "IPv6" }, { label: "Subnet" }];
  filteredGroupList: Array<any> = [];
  filterIPPoollist: Array<any> = [];
  clientGroupData: any = [];
  ipPoolData: any = [];
  dictionaryAttributeData: any = [];
  allIpPoolData: any = [];
  snmpList = [
    { label: "Enable", value: true },
    { label: "Disable", value: false }
  ];
  usedPoolNames: string[] = [];
  isClientIdNull: boolean = false;
iscustomerEdit: any;

  constructor(
    private fb: FormBuilder,
    public PaymentamountService: PaymentamountService,
    public commondropdownService: CommondropdownService,
    public loginService: LoginService,
    public invoicePaymentListService: InvoicePaymentListService,
    private route: ActivatedRoute,
    private router: Router,
    public KeyannaCommonBaseService: KeyannaCommonBaseService,
    public statusCheckService: StatusCheckService,
    private radiusClientService: RadiusClientService,
    private messageService: MessageService,
    private dictionaryService: DictionaryService
  ) {
    this.editClientId = this.route.snapshot.paramMap.get("clientId")!;
    this.selectedMvnoId = this.route.snapshot.paramMap.get("mvnoId")!;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.clientGroupAttribute = this.fb.array([]);
    this.ipPoolAttribute = this.fb.array([]);
    this.getAllDictionaryAttributes();
    this.getAllClientGroups();
  }

  getControl(row: AbstractControl, controlName: string): FormControl {
    if (row instanceof FormGroup) {
      const ctrl = row.get(controlName);
      if (ctrl instanceof FormControl) {
        return ctrl;
      }
    }
    return new FormControl('');
  }

  ipFound = [
    { label: "True", value: true },
    { label: "False", value: false }
  ];
  versionListData = [
    { label: "1", value: "1" },
    { label: "2", value: "2" }
  ];
  async ngOnInit() {
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.mvnoId = localStorage.getItem("mvnoId");

    this.clientForm = this.fb.group({
      clientIpAddress: ["", Validators.required],
      ipType: ["", Validators.required],
      sharedKey: ["", Validators.required],
      timeOut: ["", Validators.required],
      clientGroupId: ["", Validators.required],
      mvnoName: [""],
      clientGroupMappings: [this.clientGroupAttribute.value],
      ipPoolMappingList: [this.ipPoolAttribute.value],
      radiusAttribute: [""],
      acceptOnIpNotFound: [""],
      idleTimeout: ["15"],
      ipPoolId: [""],
      snmpEnable: [false],
      destinationIp: [""],
      destinationPort: [""],
      baseOid: [""],
      newOid: [""],
      communityString: [""],
      snmpVersion: [this.versionListData[1].value],
      baseValue: [""],
      newValue: [""],
      snmpClientId: [""],
      vendor: [""],
      sessionPurgeInterval: [""],
      acctOnAttribute: [""],
      clientname: ["", Validators.required]
    });

    this.getAllIPname();
    this.getAllAvailableIPname();

    if (this.editClientId != null) {
      this.editMode = true;
      this.editClientById(this.editClientId, this.selectedMvnoId);
    }
  }

  async addClient() {
    this.submitted = true;
    const clientGroupMappingsControl = this.clientForm.get("clientGroupMappings");
    if (this.isClientIdNull === true && this.clientGroupAttribute.length <= 0) {
      this.messageService.add({
        severity: "info",
        summary: "Info!!",
        detail: "Client Group Details is Mandatory!!",
        icon: "far fa-times-circle"
      });
    }
    if (this.clientGroupAttribute.length > 0) {
      this.isClientIdNull = false;
      clientGroupMappingsControl?.clearValidators();
      clientGroupMappingsControl?.updateValueAndValidity();
    }
    const snmpEnable = this.clientForm.get("snmpEnable").value;
    const requiredFields = [
      this.clientForm.get("destinationIp").value,
      this.clientForm.get("destinationPort").value,
      this.clientForm.get("baseOid").value,
      this.clientForm.get("newOid").value,
      this.clientForm.get("communityString").value,
      this.clientForm.get("snmpVersion").value,
      this.clientForm.get("baseValue").value,
      this.clientForm.get("newValue").value
    ];
    if (snmpEnable === true && requiredFields.some(field => !field)) {
      this.messageService.add({
        severity: "info",
        summary: "Info!!",
        detail: "SNMP Profile Details is Mandatory!!",
        icon: "far fa-times-circle"
      });
    }

    if (this.clientForm.valid) {
      const formValue = this.clientForm.value;
      if (this.editMode) {
        this.updatedMode = true;
        let clientData: any = {
          clientId: this.editClientId,
          mvnoId: this.clientForm.value.mvnoName,
          clientGroupMappings: this.clientGroupAttribute.value,
          ipPoolMappingList: this.ipPoolAttribute.value,
          clientIpAddress: this.clientForm.value.clientIpAddress,
          vendor: this.clientForm.value.vendor,
          ipType: this.clientForm.value.ipType,
          sharedKey: this.clientForm.value.sharedKey,
          timeOut: this.clientForm.value.timeOut,
          clientGroupId:
            this.clientForm.value.clientGroupId === 0 ? null : this.clientForm.value.clientGroupId,
          mvnoName: this.clientForm.value.mvnoName,
          radiusAttribute: this.clientForm.value.radiusAttribute,
          acceptOnIpNotFound: this.clientForm.value.acceptOnIpNotFound,
          idleTimeout: this.clientForm.value.idleTimeout,
          ipPoolId: this.clientForm.value.ipPoolId,
          snmpEnable: this.clientForm.value.snmpEnable,
          sessionPurgeInterval: this.clientForm?.value?.sessionPurgeInterval,
          acctOnAttribute: this.clientForm?.value?.acctOnAttribute,
          clientname: this.clientForm?.value?.clientname
        };
        if (formValue.snmpEnable == true) {
          clientData.snmpClientProfile = {
            snmpClientId: this.clientForm.value.snmpClientId,
            destinationIp: this.clientForm.value.destinationIp,
            destinationPort: this.clientForm.value.destinationPort,
            baseOid: this.clientForm.value.baseOid,
            newOid: this.clientForm.value.newOid,
            communityString: this.clientForm.value.communityString,
            snmpVersion: this.clientForm.value.snmpVersion,
            baseValue: this.clientForm.value.baseValue,
            newValue: this.clientForm.value.newValue
          };
        } else {
          clientData.snmpClientProfile = null;
        }
        // if (formValue.ipPoolMappingList == null || formValue.ipPoolMappingList.length == 0) {
        //     clientData.radiusAttribute = null;
        //     clientData.acceptOnIpNotFound = null;
        //     clientData.idleTimeout = null;
        // }

        this.radiusClientService.updateClient(clientData).subscribe(
          (response: any) => {
            this.editMode = false;
            this.submitted = false;
            this.clientForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.router.navigate(["/home/radiusclient/list/"]);
          },
          error => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
          }
        );
      } else {
        if (this.validateUserToPerformOperations(this.mvnoId)) {
          let clientData: any = {
            clientId: this.editClientId,
            mvnoId: this.clientForm.value.mvnoName,
            clientGroupMappings: this.clientGroupAttribute.value,
            ipPoolMappingList: this.ipPoolAttribute.value,
            clientIpAddress: this.clientForm.value.clientIpAddress,
            vendor: this.clientForm.value.vendor,
            ipType: this.clientForm.value.ipType,
            sharedKey: this.clientForm.value.sharedKey,
            timeOut: this.clientForm.value.timeOut,
            clientGroupId:
              this.clientForm.value.clientGroupId === 0
                ? null
                : this.clientForm.value.clientGroupId,
            mvnoName: this.clientForm.value.mvnoName,
            radiusAttribute: this.clientForm.value.radiusAttribute,
            acceptOnIpNotFound: this.clientForm.value.acceptOnIpNotFound,
            idleTimeout: this.clientForm.value.idleTimeout,
            ipPoolId: this.clientForm.value.ipPoolId,
            snmpEnable: this.clientForm.value.snmpEnable,
            sessionPurgeInterval: this.clientForm?.value?.sessionPurgeInterval,
            acctOnAttribute: this.clientForm?.value?.acctOnAttribute,
            clientname: this.clientForm?.value?.clientname
          };
          if (formValue.snmpEnable == true) {
            clientData.snmpClientProfile = {
              destinationIp: this.clientForm.value.destinationIp,
              destinationPort: this.clientForm.value.destinationPort,
              baseOid: this.clientForm.value.baseOid,
              newOid: this.clientForm.value.newOid,
              communityString: this.clientForm.value.communityString,
              snmpVersion: this.clientForm.value.snmpVersion,
              baseValue: this.clientForm.value.baseValue,
              newValue: this.clientForm.value.newValue
            };
          } else {
            clientData.snmpClientProfile = null;
          }

          this.radiusClientService.addNewClient(clientData, clientData.mvnoName).subscribe(
            (response: any) => {
              this.submitted = false;
              this.clientForm.reset();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              this.router.navigate(["/home/radiusclient/list/"]);
            },
            (error: any) => {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.errorMessage,
                icon: "far fa-times-circle"
              });
            }
          );
        }
      }
    }
  }

  preventNegative(event: any) {
    const inputValue = event.target.value;
    if (inputValue < 1) {
      event.target.value = "";
      this.clientForm.get("idleTimeout")?.setValue("");
    }
  }

  validateUserToPerformOperations(selectedMvnoId:any) {
    let loggedInUserMvnoId = localStorage.getItem("mvnoId");
    if (this.loggedInUser != "superadmin superadmin" && selectedMvnoId != loggedInUserMvnoId) {
      //  this.reset();
      this.messageService.add({
        severity: "info",
        summary: "Rejected",
        detail: "You are not authorized to do this operation. Please contact to the administrator",
        icon: "far fa-check-circle"
      });
      this.modalToggle = false;
      return false;
    }
    return true;
  }

  onAddClientGroupAttribute() {
    this.submitted = false;
    this.clientGroupAttribute.push(this.createClientGroupAttributeFormGroup());
  }

  createClientGroupAttributeFormGroup(): FormGroup {
    return this.fb.group({
      checkItem: [""],
      clientGroupId: [""],
      priority: [""]
    });
  }

  createIPPoolNameFormGroup(): FormGroup {
    return this.fb.group({
      ipPoolMappingId: [""],
      clientId: [""],
      ipPoolId: [""]
    });
  }

  onAddIPPoolName() {
    this.isPoolNameAdded = true;
    this.submitted = false;
    const selectedPoolId = this.clientForm.get("ipPoolId").value;
    const selectedPool = this.filterIPPoollist.find(pool => pool.poolId === selectedPoolId);
    if (selectedPool) {
      this.ipPoolAttribute.push(
        this.fb.group({
          ipPoolMappingId: "",
          ipPoolId: selectedPool.poolId,
          poolName: selectedPool.poolName
        })
      );
      this.usedPoolNames.push(selectedPool.poolName);
      this.clientForm.get("ipPoolId").reset();
      this.updateFilteredPoolList();
    }
  }

  updateFilteredPoolList() {
    this.filterIPPoollist = this.filterIPPoollist.filter(
      pool => !this.usedPoolNames.includes(pool.poolName)
    );
  }

  async getAllClientGroups() {
    this.radiusClientService.getAllValidClientGroups().subscribe(
      (response: any) => {
        this.clientGroupData = response;
        this.getDetailsByMVNO(JSON.parse(localStorage.getItem("mvnoId")));
        // console.log(JSON.parse(localStorage.getItem('mvnoId')));
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getDetailsByMVNO(mvnoId:any) {
    let allGroupList: Array<any> = [];
    let obj = {
      clientGroupId: 0,
      name: "NA",
      cgStatus: "Active",
      mvnoId: 2,
      clientReplyList: [] = [],
      coaDMProfile: null as string | null,
      listClientReply: null as string | null,
      inactiveProfileMappings: [] = [],
      unknownProfileMappings: [] = [],
      suspendedProfileMappings: [] = [],
      coaDmProfileMappings: [] = [],
      dynamicAttributeMappings: [] = [],
      permanentDisconnectProfileId: null as number | null,
      startStopAttributeValue: null as string | null,
      inputPacketAttributeValue: null as string | null,
      outputPacketAttributeValue: null as string | null,
      packetType: null as string | null,
      mvnoName: null as string | null,
      dmprofile: null as string | null,
      createDate: "2024-08-08T05:59:59.000+00:00",
      lastModificationDate: "2024-08-08T05:59:59.000+00:00"
    };
    allGroupList.push(obj);

    if (this.clientGroupData.clientGroupList) {
      allGroupList.push(...this.clientGroupData.clientGroupList);
    }

    this.filteredGroupList = [];
    this.filteredGroupsList = [];

    if (mvnoId == 1) {
      this.filteredGroupList = allGroupList;
      this.filteredGroupsList = allGroupList.filter(element => element.clientGroupId !== 0);
    } else {
      this.filteredGroupList = allGroupList.filter(
        element => element.mvnoId == mvnoId || element.mvnoId == 1
      );
      this.filteredGroupsList = allGroupList.filter(
        element =>
          (element.mvnoId === mvnoId || element.mvnoId === 1) && element.clientGroupId !== 0
      );
    }
  }

  onDropdownChange($event:any) {
    const clientGroupMappingsControl = this.clientForm.get("clientGroupMappings");
    if ($event.value === 0) {
      this.isClientIdNull = true;
      clientGroupMappingsControl?.setValidators([Validators.required]);
      clientGroupMappingsControl?.updateValueAndValidity();
    } else {
      this.isClientIdNull = false;
      clientGroupMappingsControl?.clearValidators();
      clientGroupMappingsControl?.updateValueAndValidity();
    }
  }

  onSNMPChange($event: any) {
    if ($event.value === true) {
      this.clientForm.get("destinationIp")?.setValidators([Validators.required]);
      this.clientForm.get("destinationIp")?.updateValueAndValidity();
      this.clientForm.get("destinationPort")?.setValidators([Validators.required]);
      this.clientForm.get("destinationPort")?.updateValueAndValidity();
      this.clientForm.get("baseOid")?.setValidators([Validators.required]);
      this.clientForm.get("baseOid")?.updateValueAndValidity();
      this.clientForm.get("newOid")?.setValidators([Validators.required]);
      this.clientForm.get("newOid")?.updateValueAndValidity();
      this.clientForm.get("communityString")?.setValidators([Validators.required]);
      this.clientForm.get("communityString")?.updateValueAndValidity();
      this.clientForm.get("snmpVersion")?.setValidators([Validators.required]);
      this.clientForm.get("snmpVersion")?.updateValueAndValidity();
      this.clientForm.get("baseValue")?.setValidators([Validators.required]);
      this.clientForm.get("baseValue")?.updateValueAndValidity();
      this.clientForm.get("newValue")?.setValidators([Validators.required]);
      this.clientForm.get("newValue")?.updateValueAndValidity();
    } else {
      this.clientForm.get("destinationIp")?.clearValidators();
      this.clientForm.get("destinationIp")?.updateValueAndValidity();
      this.clientForm.get("destinationPort")?.clearValidators();
      this.clientForm.get("destinationPort")?.updateValueAndValidity();
      this.clientForm.get("baseOid")?.clearValidators();
      this.clientForm.get("baseOid")?.updateValueAndValidity();
      this.clientForm.get("newOid")?.clearValidators();
      this.clientForm.get("newOid")?.updateValueAndValidity();
      this.clientForm.get("communityString")?.clearValidators();
      this.clientForm.get("communityString")?.updateValueAndValidity();
      this.clientForm.get("snmpVersion")?.clearValidators();
      this.clientForm.get("snmpVersion")?.updateValueAndValidity();
      this.clientForm.get("baseValue")?.clearValidators();
      this.clientForm.get("baseValue")?.updateValueAndValidity();
      this.clientForm.get("newValue")?.clearValidators();
      this.clientForm.get("newValue")?.updateValueAndValidity();
    }
  }

  getIPPoolDetailsByMVNO(mvnoId:any) {
    let allGroupList: Array<any> = this.ipPoolData.ippoollist ? this.ipPoolData.ippoollist : [];
    this.filterIPPoollist = [];
    if (mvnoId == 1) {
      this.filterIPPoollist = allGroupList;
    } else {
      this.filterIPPoollist = allGroupList.filter(
        element => element.mvnoId == mvnoId || element.mvnoId == 1
      );
    }
  }

  async editClientById(clientId:any, selectedMvnoId:any) {
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.editMode = true;
      this.updatedMode = true;
      this.editClientId = clientId;
      this.radiusClientService.getClientDataById(clientId).subscribe(
        (response: any) => {
          let data = response.client;
          this.clientForm.patchValue({
            clientIpAddress: data.clientIpAddress,
            clientname: data.clientname,
            vendor: data.vendor,
            ipType: data.ipType,
            sharedKey: data.sharedKey,
            timeOut: data.timeOut,
            clientGroupId: data.clientGroupId === null ? 0 : data.clientGroupId,
            mvnoName: data.mvnoId,
            acceptOnIpNotFound: data.acceptOnIpNotFound,
            idleTimeout: data.idleTimeout,
            radiusAttribute: data.radiusAttribute,
            snmpEnable: data.snmpEnable,
            snmpClientId:
              data?.snmpClientProfile === null ? null : data?.snmpClientProfile?.snmpClientId,
            destinationIp:
              data?.snmpClientProfile === null ? null : data?.snmpClientProfile?.destinationIp,
            destinationPort:
              data?.snmpClientProfile === null ? null : data?.snmpClientProfile?.destinationPort,
            baseOid: data?.snmpClientProfile === null ? null : data?.snmpClientProfile?.baseOid,
            newOid: data?.snmpClientProfile === null ? null : data?.snmpClientProfile?.newOid,
            communityString:
              data?.snmpClientProfile === null ? null : data?.snmpClientProfile?.communityString,
            snmpVersion:
              data?.snmpClientProfile === null ? null : data?.snmpClientProfile?.snmpVersion,
            baseValue: data?.snmpClientProfile === null ? null : data?.snmpClientProfile?.baseValue,
            newValue: data?.snmpClientProfile === null ? null : data?.snmpClientProfile?.newValue,
            sessionPurgeInterval: data?.sessionPurgeInterval,
            acctOnAttribute: data?.acctOnAttribute
          });

          this.ipPoolAttribute.clear();
          this.usedPoolNames = [];

          if (data.clientGroupMappings.length > 0) {
            const clientGroupMappingList = data.clientGroupMappings;
            clientGroupMappingList.forEach((ele:any) => {
              this.clientGroupAttribute.push(this.fb.group(Element));
            });
          }

          if (data.ipPoolMappingList.length > 0) {
            const ipPoolGroupMappingList = data.ipPoolMappingList;
            ipPoolGroupMappingList.forEach((element:any) => {
              const matchingElement = this.allIpPoolData.ippoollist.find(
                (innerElement:any) => innerElement.poolId === element.ipPoolId
              );
              element.poolName = matchingElement.poolName;
              element.poolId = element.ipPoolId;
              this.ipPoolAttribute.push(this.fb.group(element));
              this.usedPoolNames.push(matchingElement.poolName);
            });
            this.updateFilteredPoolList();
          }
        },

        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  deleteClientGroupMappingAttribute(attributeIndex: number) {
    this.clientGroupAttribute.removeAt(attributeIndex);
  }

  async getAllDictionaryAttributes() {
    this.dictionaryService.findAllAttributes().subscribe(
      (response: any) => {
        this.dictionaryAttributeData = response;
      },
      (error: any) => {
        if (error.error.status == "404") {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  deleteIPPoolName(index: number) {
    this.isPoolNameAdded = false;
    this.updatedMode = false;
    const deletedPoolName = this.ipPoolAttribute.at(index).get("poolName").value;
    const deletedPoolId = this.ipPoolAttribute.at(index).get("ipPoolId").value;
    this.ipPoolAttribute.removeAt(index);
    const usedPoolIndex = this.usedPoolNames.indexOf(deletedPoolName);
    if (usedPoolIndex > -1) {
      this.usedPoolNames.splice(usedPoolIndex, 1);
    }
    const restoredPool = this.allIpPoolData.ippoollist.find((pool:any) => pool.poolId === deletedPoolId);
    if (restoredPool) {
      this.filterIPPoollist.push(restoredPool);
    }
  }

  async getAllIPname() {
    this.radiusClientService.getAllIPname().subscribe(
      (response: any) => {
        this.allIpPoolData = response;
        // console.log(JSON.parse(localStorage.getItem('mvnoId')));
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  async getAllAvailableIPname() {
    this.radiusClientService.getAVailableIPname().subscribe(
      (response: any) => {
        this.ipPoolData = response;
        this.getIPPoolDetailsByMVNO(JSON.parse(localStorage.getItem("mvnoId")));
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  validateInput(event: any) {
    const pattern = /^[0-9]$/;
    const inputChar = String.fromCharCode(event.charCode || event.keyCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  keypressId(event: any) {
    const pattern = /^[0-9]+$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
