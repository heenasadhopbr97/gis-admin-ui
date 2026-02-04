export interface IGuest {
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
}
