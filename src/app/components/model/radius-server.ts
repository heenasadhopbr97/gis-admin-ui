export interface IRadiusServer {
  attempts: number;
  radiusServerId: number;
  acctountingMode: string;
  acctountingStatus: string;
  interimUpdateTime: number;
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
