export interface IWlan {
  guestAccessDto: {
    guestAccessId: number;
    portalMode: string;
    portalType: string;
    portalUrl: string;
    status: string;
    successAction: string;
    successRedirectUrl: string;
    whitelistUrls: [
      {
        whitelistId: number;
        whitelistUrl: string;
      }
    ];
    wlanId: number;
  };
  radiusServerDtoList: [
    {
      acctountingMode: string;
      acctountingStatus: string;
      attempts: number;
      intrimUpdateTime: number;
      radiusServerId: number;
      servers: [
        {
          ip: string;
          port: string;
          realm: string;
          secret: string;
          serverId: number;
        }
      ];
      timeout: number;
      type: string;
      wlanId: number;
    }
  ];
  passphrase: string;
  radios: string;
  security: string;
  ssidName: string;
  status: string;
  vlan: number;
  wlanId: number;
  wlanName: string;
}
