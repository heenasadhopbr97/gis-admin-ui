export interface Iprofile {
    radiusProfileId: number;
    name: any;
    status: any;
    checkItem: any;
    accountCdrStatus: any;
    sessionStatus: any;
    mappingMaster: any;
    priority: number;
    authAudit: any;
    proxyServerName: any;
    requestType: any;
    coadm: any;
    coaProfile: any;
    mvnoId: number;
    editProfileMapping: any;
    autoProvisionMac: string;
    deviceDriverName: string;
    authenticationMode: string;
    authenticationType: string;
    authenticationSubType: string;
    customerMacAttribute: string;
    customerUserNameAttribute: string;
    usernameIdentityRegex: string;
    profileMappings: Array<{
        id: number;
        profileId: number;
        password: string;
        filePath: string;
        fileType: string;
    }>;
    trustStoreDoc: string;
    keystoreDoc: string;
    passwordCheckRequired: string;
    terminateSessionOnDuplicateMac: string;
    addLiveSessionOnInterim: string
}
