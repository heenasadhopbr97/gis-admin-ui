(function (window) {
  window.env = window.env || {};

  // Environment variables

  window["env"]["APIGATEWAY_IP_PORT"] = "${APIGATEWAY_IP_PORT}";
  window["env"]["TACACS_IP_PORT"] = "${TACACS_IP_PORT}";
  window["env"]["BILLINGENGINE_COMMON_IP_PORT"] = "${BILLINGENGINE_COMMON_IP_PORT}";
  window["env"]["OTP_GENERATE_USERNAME"] = "${OTP_GENERATE_USERNAME}";
  window["env"]["KEYANNASALESCRMS_IP_PORT"] = "${KEYANNASALESCRMS_IP_PORT}";
  window["env"]["KEYANNAINVENTORYMANAGEMENT_IP_PORT"] = "${KEYANNAINVENTORYMANAGEMENT_IP_PORT}";
  window["env"]["KEYANNA_TICKET_IP_PORT"] = "${KEYANNA_TICKET_IP_PORT}";
  window["env"]["KEYANNA_API_GATEWAY_COMMON_PORT"] = "${KEYANNA_API_GATEWAY_COMMON_PORT}";
  window["env"]["KEYANNA_API_GIS_CORE_PORT"] = "${KEYANNA_API_GIS_CORE_PORT}";
  window["env"]["PROJECT_MANAGEMENT_PORT"] = "${PROJECT_MANAGEMENT_PORT}";
  window["env"]["KEYANNA_API_GATEWAY_COMMON_MANAGEMENT"] = "${KEYANNA_API_GATEWAY_COMMON_MANAGEMENT}";
  window["env"]["KEYANNA_ID_API_GATEWAY_PORT"] = "${KEYANNA_ID_API_GATEWAY_PORT}";
  window["env"]["SERVICEAREA_ID"] = "${SERVICEAREA_ID}";
  window["env"]["COUNTRY_ID"] = "${COUNTRY_ID}";
  window["env"]["CITY_ID"] = "${CITY_ID}";
  window["env"]["STATE_ID"] = "${STATE_ID}";
  window["env"]["PINCODE_ID"] = "${PINCODE_ID}";
  window["env"]["AREA_ID"] = "${AREA_ID}";
  window["env"]["FOOTER"] = "${FOOTER}";
  window["env"]["TITLE"] = "${TITLE}";
  window["env"]["LOGIN_CAPTCHA"] = "${LOGIN_CAPTCHA}";
  window["env"]["INDEPENDENT_AAA"] = "${INDEPENDENT_AAA}";
  window["env"]["GOOGLE_MAPS_API_KEY"] = "${GOOGLE_MAPS_API_KEY}";
})(this);
