export class AclMenu {
  id!: number;
  name!: string;
  code!: string;
  isSelected!: boolean;
}

export class Role {
  id!: number;
  rolename!: string;
  status!: string;
  product!: string;
  aclMenu!: AclEntry;
}

export class AclEntry {
  menuid!: number;
  code!: string;
}
