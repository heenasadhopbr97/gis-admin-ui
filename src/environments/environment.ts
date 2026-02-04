// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  
  APIGATEWAY_IP_PORT: (window as any)["env"]["APIGATEWAY_IP_PORT"] || "http://192.168.25.3:30080/api/v1/KeyannaGeneralGatewayCommon",
  TACACS_IP_PORT: (window as any)["env"]["TACACS_IP_PORT"] || "localhost:30081",
  BILLINGENGINE_COMMON_IP_PORT: (window as any)["env"]["BILLINGENGINE_COMMON_IP_PORT"] || "localhost:40080",
  OTP_GENERATE_USERNAME: (window as any)["env"]["OTP_GENERATE_USERNAME"] || "OTP",
  KEYANNASALESCRMS_IP_PORT: (window as any)["env"]["KEYANNASALESCRMS_IP_PORT"] || "http://192.168.25.3:30080",
  KEYANNAINVENTORYMANAGEMENT_IP_PORT:
    (window as any)["env"]["KEYANNAINVENTORYMANAGEMENT_IP_PORT"] || "http://192.168.25.3:30080/api/v1/KeyannaInventoryManagement",
  KEYANNA_TICKET_IP_PORT: (window as any)["env"]["KEYANNA_TICKET_IP_PORT"] || "localhost:30084",

  KEYANNA_API_GATEWAY_COMMON_PORT:
  (window as any)["env"]["KEYANNA_API_GATEWAY_COMMON_PORT"] || "http://192.168.25.3:30080/api/v1/KeyannaGeneralGatewayCommon",

  KEYANNA_API_GIS_CORE_PORT: (window as any)["env"]["KEYANNA_API_GIS_CORE_PORT"],
  PROJECT_MANAGEMENT_PORT: (window as any)["env"]["PROJECT_MANAGEMENT_PORT"],
   // This is specifically for service APIs
   KEYANNA_SERVICE_API_GATEWAY_PORT: 
   (window as any)["env"]["KEYANNA_SERVICE_API_GATEWAY_PORT"] || "http://192.168.25.3:30080",

  KEYANNA_API_GATEWAY_COMMON_MANAGEMENT:
  (window as any)["env"]["KEYANNA_API_GATEWAY_COMMON_MANAGEMENT"],
   
   KEYANNA_PMS_API_GATEWAY_PORT: 
  (window as any)["env"]["KEYANNA_PMS_API_GATEWAY_PORT"] || "http://192.168.25.3:30080",

  KEYANNA_LEAD_API_GATEWAY_PORT: 
  (window as any)["env"]["KEYANNA_LEAD_API_GATEWAY_PORT"] || "http://192.168.25.3:30080",

  KEYANNA_Revenue_API_GATEWAY_PORT:
  (window as any)["env"]["KEYANNA_Revenue_API_GATEWAY_PORT"] || "http://192.168.25.3:30080",

  KEYANNA_NOTIFICATION_API_GATEWAY_PORT:
  (window as any)["env"]["KEYANNA_NOTIFICATION_API_GATEWAY_PORT"] || "http://192.168.25.3:30080",

  KEYANNA_ID_API_GATEWAY_PORT:
  (window as any)["env"]["KEYANNA_ID_API_GATEWAY_PORT"] || "http://192.168.25.3:30080",

  SERVICEAREA_ID: (window as any)["env"]["SERVICEAREA_ID"] || "5",
  COUNTRY_ID: (window as any)["env"]["COUNTRY_ID"] || "2",
  CITY_ID: (window as any)["env"]["CITY_ID"] || "2",
  STATE_ID: (window as any)["env"]["STATE_ID"] || "2",
  PINCODE_ID: (window as any)["env"]["PINCODE_ID"] || "2",
  AREA_ID: (window as any)["env"]["AREA_ID"] || "2",
  FOOTER: (window as any)["env"]["FOOTER"] || "Keyanna",
  TITLE: (window as any)["env"]["TITLE"] || "Keyanna Communication Platform",
  LOGIN_CAPTCHA: (window as any)["env"]["LOGIN_CAPTCHA"] || "true",
  INDEPENDENT_AAA: (window as any)["env"]["INDEPENDENT_AAA"] || "false",
  GOOGLE_MAPS_API_KEY:
    (window as any)["env"]["GOOGLE_MAPS_API_KEY"] || "AIzaSyBJMMItJT9bMQlbJK8RnXhHi5rLrICje0s",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
