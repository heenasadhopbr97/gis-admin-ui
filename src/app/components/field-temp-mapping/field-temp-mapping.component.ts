import { Component, NgZone, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { FieldmappingService } from "src/app/service/fieldmapping.service";
import { LoginService } from "src/app/service/login.service";
import { RoleService } from "src/app/service/role.service";
import { Acl } from "../generic-component/acl/acl-gerneric-component/model/acl";
import { AclOperationsList } from "../generic-component/acl/acl-gerneric-component/model/acl-operations-list";
import { AclSave } from "../generic-component/acl/acl-gerneric-component/model/acl-save";
import { Aclsaveoperationlist } from "../generic-component/acl/acl-gerneric-component/model/aclsaveoperationlist";
import { AfterViewInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
// import { element } from "protractor";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { SETTINGS } from "src/app/constants/aclConstants";
declare var $: any;
@Component({
    selector: "app-field-temp-mapping",
    templateUrl: "./field-temp-mapping.component.html",
    styleUrls: ["./field-temp-mapping.component.css"],
    standalone: false
})
export class FieldTempMappingComponent implements OnInit {
clearSearchForm() {
throw new Error('Method not implemented.');
}
searchRoleByName() {
throw new Error('Method not implemented.');
}
  public isUpdateComponent: boolean = false;
  public entity: AclSave = new AclSave();
  dataList: Array<Acl>;
  temp: Array<Acl>;
  saveSelectedPermission: AclSave;
  check: boolean;
  allOpgetFlag: boolean = false;
  searchData: any;

  currentPage: number = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;

  editMode: boolean = false;
  editData: any;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: string;
  totalDataListLength = 0;
  templateForm: FormGroup;
  searchRoleForm: FormGroup;
  submitted = false;
  searchSubmitted = false;
  commonStatusList: any;
  businessTypeList: any;
  customerTypeList: any;
  AclClassConstants:any;
  AclConstants:any;
  dataListAccess: any;

  accessAll: boolean;

  readAccess: boolean;
  custTemplateAccess: boolean = false;
  leadTemplateAccess: boolean = false;
  leadSaveAccess: boolean = false;
  custSaveAccess: boolean = false;
  fieldList: any = [];
  leadModuleAddressList: any = [];
  custModuleAddressList: any = [];

  public loginService: LoginService;
  allfieldList: any;
  isRoleList: boolean;
  constructor(
    private roleService: RoleService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private radiusUtility: RadiusUtility,
    private ngZone: NgZone,
    loginService: LoginService,
    private fieldMapping: FieldmappingService,
    public commondropdownService: CommondropdownService
  ) {
    this.custSaveAccess = loginService.hasPermission(SETTINGS.FIELD_TMPLT_CUST_SAVE);
    this.leadSaveAccess = loginService.hasPermission(SETTINGS.FIELD_TMPLT_LEAD_SAVE);
    this.leadTemplateAccess = loginService.hasPermission(SETTINGS.FIELD_TMPLT_LEAD);
    this.custTemplateAccess = loginService.hasPermission(SETTINGS.FIELD_TMPLT_CUST);
    this.loginService = loginService;
  }
  Cust: any[] = [];

  DataType: any[] = [];
  leadModuleList: any[] = [];
  custModuleList: any = [];

  isPlanTemplate: boolean = false;
  isLeadTemplate: boolean = false;
  openCreateLeadTemplate() {
    this.getLeadFieldsFromServer();
    this.isLeadTemplate = false;
    this.isPlanTemplate = true;
  }
  getDataType() {
    this.commondropdownService
      .getMethodWithCache("/commonList/generic/fieldDataTypes")
      .subscribe((res: any) => {
        this.DataType = res.dataList;
        console.log("DataType :: ", this.DataType);
      });
  }
  getCustModuleName() {
    let data = [];
    this.commondropdownService
      .getMethodWithCache("/commonList/customerscreen")
      .subscribe((res: any) => {
        // this.custModuleList = res.dataList.filter((element: any) => {
        //   return (
        //     element.displayName != "Charge Details" &&
        //     element.displayName != "Mac Mapping details" &&
        //     element.displayName != "Payment Address Details" &&
        //     element.displayName != "Permanent Address Details"
        //   );
        // });

        data = res.dataList;
        this.custModuleAddressList = data.filter(
          (element:any) => element.value == "presentaddressdetails"
        );
        this.custModuleList = data.filter(
          (element:any) =>
            element.value !== "presentaddressdetails" &&
            element.displayName != "Charge Details" &&
            element.displayName != "Mac Mapping details" &&
            element.displayName != "Payment Address Details" &&
            element.displayName != "Permanent Address Details"
        );

        // console.log( thCust)
      });
  }
  getLeadModuleName() {
    let data = [];
    this.commondropdownService
      .getMethodWithCache("/commonList/generic/leadscreen")
      .subscribe((res: any) => {
        // this.leadModuleList = res.dataList;
        data = res.dataList;
        this.leadModuleAddressList = data.filter(
          (element:any) => element.value == "presentaddressdetails"
        );
        this.leadModuleList = data.filter(
          (element:any) =>
            element.value !== "presentaddressdetails" &&
            element.displayName != "Charge Details" &&
            element.displayName != "Mac Mapping details"
        );
      });
  }

  openCreateCustTemplate() {
    this.allOpgetFlag = false;
    this.editMode = false;

    this.getCustFieldsFromServer();

    this.isPlanTemplate = false;
    this.submitted = false;
    this.isLeadTemplate = true;
    this.templateForm.reset();
    this.setData(new AclSave());
    this.saveSelectedPermission = new AclSave();
    this.setAccessData();
    this.saveSelectedPermission.aclEntryPojoList = new Array<Aclsaveoperationlist>();
    this.roleService.getCommonList().subscribe(res => {
      this.commonStatusList = res.dataList;
    });
  }

  setData(data: AclSave) {
    if (this.allOpgetFlag === false) {
      this.roleService.getAllOperation().subscribe(res => {
        this.dataList = res.dataList;
        this.allOpgetFlag = true;
      });
    }
    this.roleService.getCommonList().subscribe(res => {
      this.commonStatusList = res.dataList;
    });
    setTimeout(() => {
      if (this.allOpgetFlag === true) {
        if (
          this.isUpdateComponent &&
          this.saveSelectedPermission &&
          this.saveSelectedPermission.aclEntryPojoList &&
          this.saveSelectedPermission.aclEntryPojoList.length > 0
        ) {
          if (this.dataList) {
            this.dataList.forEach(res => {
              res.SelectOperationsList = new Array<AclOperationsList>();
              this.saveSelectedPermission.aclEntryPojoList.forEach(sdata => {
                if (res.operallid === sdata.permit) {
                  let temp = sdata.classid - 1;
                  this.dataList[temp].fullaccess = true;
                }
                if (res.id === sdata.classid) {
                  res.aclOperationsList.forEach(ls => {
                    if (ls.id === sdata.permit) {
                      res.SelectOperationsList.push(ls);
                    }
                  });
                }
              });
            });
          }
        }
      }
    }, 1000);

    if (data) {
      this.saveSelectedPermission = data;
    }
  }

  getData(): AclSave {
    return this.saveSelectedPermission;
  }

  onDataSave(event:any) {
    this.dataList = event;
  }

  onAllAccessClick(event:any) {
    this.saveSelectedPermission.isAllOperation = event;
  }

  onPermitIDCheck(temp:any) {
    this.check = true;
    this.saveSelectedPermission.aclEntryPojoList.forEach(res => {
      if (temp.permit === res.permit) {
        this.check = false;
        return;
      }
    });
  }
  setAccessData() {
    this.roleService.getAllACLMenu().subscribe(
      (response: any) => {
        this.dataListAccess = response.dataList;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.saveSelectedPermission = new AclSave();
    this.saveSelectedPermission.aclEntryPojoList = new Array<Aclsaveoperationlist>();
    this.searchRoleForm = this.fb.group({
      name: [""],
    });

    this.templateForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      businessUnit: new FormControl("", [Validators.required]),
      businessType: new FormControl("", [Validators.required]),
      moduleName: new FormControl("", [Validators.required]),

      aclEntryPojoList: new FormControl(this.saveSelectedPermission.aclEntryPojoList),
    });
    this.setAccessData();
    this.setData(new AclSave());

    this.getLeadModuleName();
    this.getCustModuleName();
    this.getDataType();
    // this.getTemplateList();
    this.loadCustFields();

    this.roleService.getCommonList().subscribe(res => {
      this.commonStatusList = res.dataList;
    });

    this.searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
      page: "",
      pageSize: "",
    };
  }
  loadCustFields() {
    // this.getCustFields1FromServer();
    this.openCreateCustTemplate();
  }
  // {
  //   "dataType": "str",
  //   "fieldId": 0,
  //   "fieldName": "str",
  //   "id": 0,
  //   "isDeleted": false,
  //   "isMandatory": true,
  //   "module": "string",
  //   "screen": "string"
  // }

  // bu_type: "Retail"
  // dataType: null
  // fieldname: "firstname"
  // id: 2
  // isAccess: true
  // isMandatory: false
  // name: null

  templateList: any;
  isSubmitted: boolean = false;
  getLeadFieldsFromServer() {
    this.fieldList = [];
    this.fieldMapping
      .getleadMethod("/fieldMapping/getAvailableAndBoundedFields?screen=lead")
      .subscribe((res: any) => {
        var dataList = res.dataList;

        if (dataList != null && dataList.length > 0) {
          dataList.forEach((el: any) => {
            el.screen = 1;
          });
          dataList.sort(function (x:any, y:any) {
            return x.isMandatory === y.isMandatory ? 0 : x.isMandatory ? -1 : 1;
          });
        }
        this.fieldList = dataList;
      });
  }

  getCustFieldsFromServer() {
    this.fieldList = [];
    this.fieldMapping
      .getMethod("/fieldMapping/getAvailableAndBoundedFields?screen=customer")
      .subscribe((res: any) => {
        this.allfieldList = res.dataList;
        if (this.allfieldList != null && this.allfieldList.length > 0) {
          this.allfieldList.forEach((el: any) => {
            el.screen = 2;
          });
          console.log(res);
          console.log("allfieldList", this.allfieldList);

          // Separate data into two lists based on mandatory flag
          const mandatoryFields = this.allfieldList.filter(
            (field:any) => field.defaultMandatory === true
          );
          const nonMandatoryFields = this.allfieldList.filter(
            (field:any) => field.defaultMandatory === null || field.defaultMandatory === false
          );
          this.fieldList = [...mandatoryFields, ...nonMandatoryFields];

          console.log("mandatoryFields", mandatoryFields);
          console.log("nonMandatoryFields", nonMandatoryFields);
        }
      });
  }

  // getCustFieldsFromServer() {
  //   this.fieldMapping
  //     .getMethod("/fieldMapping/getAvailableAndBoundedFields?screen=customer")
  //     .subscribe(res => {
  //       // if(res['dataList'].screen=="lead"){
  //       //   this.fieldList=res['dataList']
  //       //   console.log(this.fieldList)
  //       // }
  //       res["dataList"].forEach((el: any) => {
  //         el.screen = 2;
  //       });
  //       console.log(res);
  //       this.fieldList = res["dataList"];
  //       console.log("fieldList", this.fieldList);
  //       // console.log(this.fieldList)
  //       // if(res!==null){
  //       //   this.fieldList.forEach((el)=>{
  //       //     el.isAccess=false
  //       //     // el.fieldId=res['dataList'].id
  //       //     // el.fieldName=res['dataList'].fieldname
  //       //     el.isDeleted=false
  //       //     el.screen="customer"
  //       //     el.module=""
  //       //     el.dataType=""
  //       //     el.isMandatory=false
  //       //   })
  //       // }
  //       //  console.log(this.templateList)
  //     });
  // }

  getTemplateList() {
    this.fieldMapping.getMethod("/fieldMapping/saveList?screen=lead").subscribe(res => {
      return res;
    });
  }

  // onChangeAccess(e:Event,index:any){
  //   if(e.target['checked']){
  //     this.fieldList[index].isAccess=true

  //   }
  //   else{
  //     this.fieldList[index].isAccess=false
  //   }
  // }

  // onChangeMandatory(e:Event,index:any){
  //   if(e.target['checked']){
  //     this.fieldList[index].isMandatory=true
  //   }else{
  //     this.fieldList[index].isMandatory=false
  //   }
  // }
  isFormValid: boolean = false;
  errors: any;
  isValid() {
    this.errors = [];

    this.fieldList.forEach((item: any) => {
      if (item.isBounded && !item.module) {
        this.errors.push("Please select a module for " + item.name);
      }
    });
    console.log("errors", this.errors);
    this.isFormValid = this.errors.length == 0;
  }

  submit(form: any, type:any) {
    this.isValid();
    // for (const field in form.controls) { // 'field' is a string
    //   if(field.includes("isAccess")){
    //     fields.isAccess=form.controls[field].value;

    //   }else if(field.includes("isMandatory")){
    //     fields.isMandatory=form.controls[field].value;
    //   }else if(field.includes("module")){
    //     fields.module=form.controls[field].value;
    //   }else if(field.includes("dataType")){
    //     fields.dataType=form.controls[field].value;
    //   }else if(field.includes(""))
    //   if(i==4){
    //       if(fields.isAccess==true){
    //        fieldArray.push(Object.assign({}, fields));
    //       }
    //     i=-1;
    //  }
    //   i++;
    // }
    // console.log("result::",fieldArray);

    // "fieldId": number,
    // "isMandatory": boolean,
    // "screen": string,
    // "module": string,
    // "isDeleted": boolean,
    // "fieldName": string,
    // "dataType": string,
    // "isAccess":boolean
    let fieldListOutput:any[] = [];
    if (this.isFormValid) {
      this.fieldList.forEach((val:any) => {
        if (val.isBounded) {
          fieldListOutput.push({
            isDeleted: false,
            fieldId: val.id,
            screen: val.screen,
            module: val.module,
            isMandatory: val.isMandatory || false,
            dataType: val.dataType,
            fieldName: val.fieldname,
            isBounded: val.isBounded,
            defaultMandatory: val.defaultMandatory || false,
          });
        }
      });

      console.log(fieldListOutput);
      //     if(el.isAccess){
      //       return true
      //     }
      //     else return false
      //   })
      //   console.log(array1)
      // http://localhost:30080/api/v1/fieldMapping/getAvailableAndBoundedFields?screen=lead
      this.fieldMapping
        .saveMethod("/fieldMapping/addTemplate", fieldListOutput, type)
        .subscribe((res: any) => {
          console.log(res);
          if (res.responseCode == 200) {
            // this.isSubmitted=false
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: res.responseMessage,
              icon: "far fa-check-circle",
            });
          } else if (res.responseCode == 406) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: res.responseMessage,
              icon: "far fa-check-circle",
            });
          }
        });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Module Name is Mandatory",
        icon: "far fa-check-circle",
      });
    }
  }

  //  resetTemplateForm(){
  //   this.templateForm.reset();
  //   this.templateForm.get("businessUnit").reset();
  //   this.templateForm.get("businessType").reset();
  //   this.templateForm.get("customerType").reset();
  //   this.AclClassConstants
  //  }

  checkDep(name: any, i: any) {
    let data = [];
    switch (name) {
      case "State":
        data.push(this.dataListAccess[0].submenu[0].aclOperationsList); //Country
        break;
      case "City":
        data.push(this.dataListAccess[0].submenu[0].aclOperationsList); //Country
        data.push(this.dataListAccess[0].submenu[1].aclOperationsList); //State
        break;
      case "Pincode":
        data.push(this.dataListAccess[0].submenu[0].aclOperationsList); //Country
        data.push(this.dataListAccess[0].submenu[1].aclOperationsList); //State
        data.push(this.dataListAccess[0].submenu[2].aclOperationsList); //City
        break;
      case "Area":
        data.push(this.dataListAccess[0].submenu[0].aclOperationsList); //Country
        data.push(this.dataListAccess[0].submenu[1].aclOperationsList); //State
        data.push(this.dataListAccess[0].submenu[2].aclOperationsList); //City
        data.push(this.dataListAccess[0].submenu[3].aclOperationsList); //Pincode
        break;
      case "Service Area":
        data.push(this.dataListAccess[0].submenu[0].aclOperationsList); //Country
        data.push(this.dataListAccess[0].submenu[1].aclOperationsList); //State
        data.push(this.dataListAccess[0].submenu[2].aclOperationsList); //City
        data.push(this.dataListAccess[0].submenu[3].aclOperationsList); //Pincode
        data.push(this.dataListAccess[0].submenu[4].aclOperationsList); //Area
        break;
      case "Customers":
        data.push(this.dataListAccess[2].submenu[0].aclOperationsList); //Partner
        data.push(this.dataListAccess[0].submenu[0].aclOperationsList); //Country
        data.push(this.dataListAccess[0].submenu[1].aclOperationsList); //State
        data.push(this.dataListAccess[0].submenu[2].aclOperationsList); //City
        data.push(this.dataListAccess[0].submenu[3].aclOperationsList); //Pincode
        data.push(this.dataListAccess[0].submenu[4].aclOperationsList); //Area
        data.push(this.dataListAccess[0].submenu[5].aclOperationsList); //Service Area
        data.push(this.dataListAccess[3].submenu[1].aclOperationsList); //Tax
        data.push(this.dataListAccess[3].submenu[2].aclOperationsList); //Charge
        data.push(this.dataListAccess[3].submenu[5].aclOperationsList); //Plan
        data.push(this.dataListAccess[3].submenu[6].aclOperationsList); //Plan Bundle
        data.push(this.dataListAccess[13].submenu[0].aclOperationsList); //Customers inside settings menu
        break;
      case "Charge":
        data.push(this.dataListAccess[3].submenu[1].aclOperationsList); //Tax
        break;
      case "Discount":
        data.push(this.dataListAccess[3].submenu[5].aclOperationsList); //Plan
        break;
      case "Plan":
        data.push(this.dataListAccess[3].submenu[0].aclOperationsList); //Service
        data.push(this.dataListAccess[3].submenu[4].aclOperationsList); //QOS Policy
        data.push(this.dataListAccess[3].submenu[2].aclOperationsList); //Charge
        data.push(this.dataListAccess[0].submenu[0].aclOperationsList); //Country
        data.push(this.dataListAccess[0].submenu[1].aclOperationsList); //State
        data.push(this.dataListAccess[0].submenu[2].aclOperationsList); //City
        data.push(this.dataListAccess[0].submenu[3].aclOperationsList); //Pincode
        data.push(this.dataListAccess[0].submenu[4].aclOperationsList); //Area
        data.push(this.dataListAccess[0].submenu[5].aclOperationsList); //Service Area
        break;
      case "Plan Bundle":
        data.push(this.dataListAccess[3].submenu[5].aclOperationsList); //Plan
        break;
      case "Partner":
        data.push(this.dataListAccess[3].submenu[1].aclOperationsList); //Tax
        data.push(this.dataListAccess[3].submenu[6].aclOperationsList); //Plan Bundle
        data.push(this.dataListAccess[0].submenu[0].aclOperationsList); //Country
        data.push(this.dataListAccess[0].submenu[1].aclOperationsList); //State
        data.push(this.dataListAccess[0].submenu[2].aclOperationsList); //City
        data.push(this.dataListAccess[0].submenu[3].aclOperationsList); //Pincode
        data.push(this.dataListAccess[0].submenu[4].aclOperationsList); //Area
        data.push(this.dataListAccess[0].submenu[5].aclOperationsList); //Service Area
        break;
      case "Payment":
        data.push(this.dataListAccess[1].submenu[0].aclOperationsList); //Customer
        break;
      case "Ticket":
        data.push(this.dataListAccess[1].submenu[0].aclOperationsList); //Customer
        data.push(this.dataListAccess[0].submenu[0].aclOperationsList); //Country
        data.push(this.dataListAccess[0].submenu[1].aclOperationsList); //State
        data.push(this.dataListAccess[0].submenu[2].aclOperationsList); //City
        data.push(this.dataListAccess[0].submenu[3].aclOperationsList); //Pincode
        data.push(this.dataListAccess[0].submenu[4].aclOperationsList); //Area
        data.push(this.dataListAccess[0].submenu[5].aclOperationsList); //Service Area
        break;
      case "Network Device":
        data.push(this.dataListAccess[0].submenu[0].aclOperationsList); //Country
        data.push(this.dataListAccess[0].submenu[1].aclOperationsList); //State
        data.push(this.dataListAccess[0].submenu[2].aclOperationsList); //City
        data.push(this.dataListAccess[0].submenu[3].aclOperationsList); //Pincode
        data.push(this.dataListAccess[0].submenu[4].aclOperationsList); //Area
        data.push(this.dataListAccess[0].submenu[5].aclOperationsList); //Service Area
        break;
      case "Radius Client":
        data.push(this.dataListAccess[11].submenu[2].aclOperationsList); //Radius Group
        break;
      case "Staff":
        data.push(this.dataListAccess[13].submenu[0].aclOperationsList); //Team
        data.push(this.dataListAccess[13].submenu[1].aclOperationsList); //Role
        data.push(this.dataListAccess[2].submenu[0].aclOperationsList); //Partner
        data.push(this.dataListAccess[0].submenu[0].aclOperationsList); //Country
        data.push(this.dataListAccess[0].submenu[1].aclOperationsList); //State
        data.push(this.dataListAccess[0].submenu[2].aclOperationsList); //City
        data.push(this.dataListAccess[0].submenu[3].aclOperationsList); //Pincode
        data.push(this.dataListAccess[0].submenu[4].aclOperationsList); //Area
        data.push(this.dataListAccess[0].submenu[5].aclOperationsList); //Service Area
        data.push(this.dataListAccess[10].submenu[0].aclOperationsList); //MVNO
        break;
      default:
        break;
    }
    this.checkDepALL(data, i);
  }
  checkDepALL(data: any, i:any) {
    console.log(i);

    data.forEach((name:any) => {
      this.ngZone.run(() => {
        switch (i) {
          case "All":
            name[0].accessible = true;
            name[1].accessible = true;
            name[2].accessible = true;
            name[3].accessible = true;
            name[4].accessible = true;
            break;
          case 1:
            name[1].accessible = true;
            break;
          case 2:
            name[1].accessible = true;
            name[2].accessible = true;
            break;
          case 3:
            name[1].accessible = true;
            name[2].accessible = true;
            name[3].accessible = true;
            break;
          case 4:
            name[1].accessible = true;
            name[2].accessible = true;
            name[3].accessible = true;
            name[4].accessible = true;
            break;
          default:
            break;
        }
        if (name[1].accessible && name[2].accessible && name[3].accessible && name[4].accessible) {
          name[0].accessible = true;
        } else {
          name[0].accessible = false;
        }
      });
    });
  }
  checkRead(name: any, disName: any, i: number) {
    this.ngZone.run(() => {
      if (name[2].accessible) {
        name[1].accessible = true;
        this.checkDep(disName, i);
      }

      if (name[3].accessible) {
        name[1].accessible = true;
        name[2].accessible = true;
        this.checkDep(disName, i);
      }

      if (name[4].accessible) {
        name[1].accessible = true;
        name[2].accessible = true;
        name[3].accessible = true;
        this.checkDep(disName, i);
      }

      if (name[1].accessible && name[2].accessible && name[3].accessible && name[4].accessible) {
        name[0].accessible = true;
      } else {
        name[0].accessible = false;
      }
    });
  }
  checkAll(name: any, disName: any) {
    if (name[0].accessible) {
      this.ngZone.run(() => {
        name[1].accessible = true;
        name[2].accessible = true;
        name[3].accessible = true;
        name[4].accessible = true;
      });
      this.checkDep(disName, "All");
    } else {
      this.ngZone.run(() => {
        name[1].accessible = false;
        name[2].accessible = false;
        name[3].accessible = false;
        name[4].accessible = false;
      });
    }
  }
  accessAllCheck() {
    if (this.accessAll) {
      this.dataListAccess.forEach((element:any) => {
        element.submenu.forEach((menu:any) => {
          menu.aclOperationsList.forEach((data:any) => {
            data.accessible = true;
          });
        });
      });
    } else {
      this.dataListAccess.forEach((element:any) => {
        element.submenu.forEach((menu:any) => {
          menu.aclOperationsList.forEach((data:any) => {
            data.accessible = false;
          });
        });
      });
    }
  }
  readAccessCheck() {
    if (this.readAccess) {
      this.dataListAccess.forEach((element:any) => {
        element.submenu.forEach((menu:any) => {
          menu.aclOperationsList[1].accessible = true;
        });
      });
    } else {
      this.dataListAccess.forEach((element:any) => {
        element.submenu.forEach((menu:any) => {
          menu.aclOperationsList[1].accessible = false;
        });
      });
    }
  }
  accessServiceCheck(e:any, name:any) {
    if (e.checked) {
      this.dataListAccess.forEach((element:any) => {
        element.submenu.forEach((menu:any) => {
          menu.aclOperationsList.forEach((data:any) => {
            if (element.name == name) {
              data.accessible = true;
            }
          });
        });
      });
    } else {
      this.dataListAccess.forEach((element:any) => {
        element.submenu.forEach((menu:any) => {
          menu.aclOperationsList.forEach((data:any) => {
            if (element.name == name) {
              data.accessible = false;
            }
          });
        });
      });
    }
  }
  canExit() {
    return true;
    // if (this.templateForm.dirty) return true;
    // {
    //   return Observable.create((observer: Observer<boolean>) => {
    //     this.confirmationService.confirm({
    //       header: "Alert",
    //       message: "The filled data will be lost. Do you want to continue? (Yes/No)",
    //       icon: "pi pi-info-circle",
    //       accept: () => {
    //         observer.next(true);
    //         observer.complete();
    //       },
    //       reject: () => {
    //         observer.next(false);
    //         observer.complete();
    //       },
    //     });
    //     return false;
    //   });
    // }
  }
}

export interface templateMapping {
  fieldId: number;
  isMandatory: boolean;
  screen: string;
  module: string;
  isDeleted: boolean;
  fieldName: string;
  dataType: string;
  isAccess: boolean;
}
