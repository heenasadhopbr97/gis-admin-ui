import { Aclsaveoperationlist } from "./aclsaveoperationlist";

export class AclSave {

    aclEntryPojoList: Array<Aclsaveoperationlist>;
    id:number;
    rolename: string;
    status: string;
    sysRole:boolean;
    isAllOperation:boolean;
}
