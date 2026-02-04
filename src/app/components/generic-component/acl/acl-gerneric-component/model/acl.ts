import { AclOperationsList } from "./acl-operations-list";

export class Acl {
    id: number;
    count:number;
    classname: string;
    dispname: string;
    disporder: number;
    operallid: number;
    aclOperationsList: Array<AclOperationsList>;
    /*For Angular Use*/
    SelectOperationsList: Array<AclOperationsList>;
    TempOperationsList: Array<AclOperationsList>;
    fullaccess: boolean = false;
}
