declare global {
  interface Window {
    env: { [key: string]: any };
  }
}

export const environment = {
  production: true,
  APIGATEWAY_IP_PORT: window["env"]["APIGATEWAY_IP_PORT"] || "192.168.24.6:30085",
  BILLINGENGINE_COMMON_IP_PORT:
    window["env"]["BILLINGENGINE_COMMON_IP_PORT"] || "143.198.140.196:40080",
  OTP_GENERATE_USERNAME: window["env"]["OTP_GENERATE_USERNAME"] || "OTP",
  KEYANNASALESCRMS_IP_PORT: window["env"]["KEYANNASALESCRMS_IP_PORT"] || "59.144.18.212:60080",
  TACACS_IP_PORT: window["env"]["TACACS_IP_PORT"] || "localhost:30081",
  KEYANNAINVENTORYMANAGEMENT_IP_PORT:
    window["env"]["KEYANNAINVENTORYMANAGEMENT_IP_PORT"] || "192.168.24.6:30083",
  KEYANNA_TICKET_IP_PORT: window["env"]["KEYANNA_TICKET_IP_PORT"] || "192.168.24.6:30084",
  KEYANNA_API_GATEWAY_COMMON_PORT:
    window["env"]["KEYANNA_API_GATEWAY_COMMON_PORT"] || "192.168.24.6:30080",

    KEYANNA_API_GIS_CORE_PORT:
    window["env"]["KEYANNA_API_GIS_CORE_PORT"] || "192.168.24.6:30080",

  PROJECT_MANAGEMENT_PORT:
    window["env"]["PROJECT_MANAGEMENT_PORT"] || "192.168.24.6:30080",

  KEYANNA_API_GATEWAY_COMMON_MANAGEMENT:
     window["env"]["KEYANNA_API_GATEWAY_COMMON_MANAGEMENT"] = "192.168.24.6:30080",


  SERVICEAREA_ID: window["env"]["SERVICEAREA_ID"] || "5",
  COUNTRY_ID: window["env"]["COUNTRY_ID"] || "2",
  CITY_ID: window["env"]["CITY_ID"] || "2",
  STATE_ID: window["env"]["STATE_ID"] || "2",
  PINCODE_ID: window["env"]["PINCODE_ID"] || "2",
  AREA_ID: window["env"]["AREA_ID"] || "2",
  FOOTER: window["env"]["FOOTER"] || "Keyanna",
  TITLE: window["env"]["TITLE"] || "Keyanna Communication Platform",
  LOGIN_CAPTCHA: window["env"]["LOGIN_CAPTCHA"] || "true",
  INDEPENDENT_AAA: window["env"]["INDEPENDENT_AAA"] || "false",
  GOOGLE_MAPS_API_KEY:
    window["env"]["GOOGLE_MAPS_API_KEY"] || "AIzaSyBJMMItJT9bMQlbJK8RnXhHi5rLrICje0s",
};
