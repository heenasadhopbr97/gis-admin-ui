import { HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";



const apigatewayCommonIp_PORT = environment.KEYANNA_API_GATEWAY_COMMON_PORT;
const apigatewayIP_PORT = environment.APIGATEWAY_IP_PORT;
const tacacsManagement_PORT = environment.TACACS_IP_PORT;
const billingEngineIP_PORT = environment.BILLINGENGINE_COMMON_IP_PORT;
const username_generateOTP = environment.OTP_GENERATE_USERNAME;
const KeyannaBssCrmsIP_PORT = environment.KEYANNASALESCRMS_IP_PORT;
const KeyannaInventoryManagementIP_PORT = environment.KEYANNAINVENTORYMANAGEMENT_IP_PORT;
const PROJECT_MANAGEMENT_PORT = environment.PROJECT_MANAGEMENT_PORT;

export const RATINGENGINE_IP_PORT = "http://198.38.87.170:8060/api";

export const KEYANNA_SERVICE_API_GATEWAY_PORT = environment.KEYANNA_SERVICE_API_GATEWAY_PORT; //define service 
export const KEYANNA_PMS_BASE_URL = environment.KEYANNA_PMS_API_GATEWAY_PORT; //pms define service
export const KEYANNA_LEAD_URL = environment.KEYANNA_LEAD_API_GATEWAY_PORT;
export const KEYANNA_Revenue_MNG = environment.KEYANNA_Revenue_API_GATEWAY_PORT;
export const KEYANNA_NOTIFICATION_URL = environment.KEYANNA_NOTIFICATION_API_GATEWAY_PORT
export const KEYANNA_ID_URL = environment.KEYANNA_ID_API_GATEWAY_PORT;

export const SERVICEAREA_ID = environment.SERVICEAREA_ID;
export const COUNTRY_ID = environment.COUNTRY_ID;
export const CITY_ID = environment.CITY_ID;
export const STATE_ID = environment.STATE_ID;
export const PINCODE_ID = environment.PINCODE_ID;
export const AREA_ID = environment.AREA_ID;
export const TITLE = environment.TITLE;
export const FOOTER = environment.FOOTER;
export const LOGIN_CAPTCHA = environment.LOGIN_CAPTCHA;
export const INDPENDENT_AAA = environment.INDEPENDENT_AAA;
export const GOOGLE_MAPS_API_KEY = environment.GOOGLE_MAPS_API_KEY;
const hostName: any = localStorage.getItem("hostName");
//Constants for Keyanna Radius.
export const DELETE_GROUP_CONFIRM_MESSAGE = "Are you sure you want to delete this group?";
export const DELETE_CLIENT_CONFIRM_MESSAGE = "Are you sure you want to delete this client?";
export const DELETE_CUSTOMER_CONFIRM_MESSAGE = "Are you sure you want to delete this customer?";
export const DELETE_CONFIRM_MESSAGE = (str: String) =>
    `Are you sure you want to delete this ${str}?`;

export const USERNAME = `${username_generateOTP}`;
export const DEMOGRAPHICDATA: any = JSON.parse(localStorage.getItem("demographic"));
export var COUNTRY = "Country";
export var DEPARMENT = "Department";
export var STATE = "State";
export var CITY = "City";
export var LOCATION = "Location";
export var PINCODE = "Pincode";
export var AREA = "Area";
export var MVNO = "MVNO";
export var REGEX = "Number";
export var STREET = "Street Name";
export var HOUSENO = "House No";
export var CUSTOMER_PREPAID = "Prepaid Customer";
export var CUSTOMER_POSTPAID = "Postpaid Customer";
if (DEMOGRAPHICDATA) {
    COUNTRY = DEMOGRAPHICDATA[0]?.newName || "Country";
    STATE = DEMOGRAPHICDATA[1]?.newName || "State";
    CITY = DEMOGRAPHICDATA[2]?.newName || "City";
    PINCODE = DEMOGRAPHICDATA[3]?.newName || "Pincode";
    AREA = DEMOGRAPHICDATA[4]?.newName || "Area";
    MVNO = DEMOGRAPHICDATA[5]?.newName || "MVNO";
    REGEX = DEMOGRAPHICDATA[3]?.validationRegex || "Number";
    CUSTOMER_PREPAID = DEMOGRAPHICDATA[6]?.newName || "Prepaid Customer";
    CUSTOMER_POSTPAID = DEMOGRAPHICDATA[7]?.newName || "Postpaid Customer";
} else {
    COUNTRY = "Country";
    STATE = "State";
    CITY = "City";
    PINCODE = "Pincode";
    AREA = "Area";
    MVNO = "MVNO";
    REGEX = "Number";
    CUSTOMER_PREPAID = "Prepaid Customer";
    CUSTOMER_POSTPAID = "Postpaid Customer";
}

export function masterdata(data:any) {
    // console.log(data);
    if (data) {
        COUNTRY = data[0]?.newName || "Country";
        STATE = data[1]?.newName || "State";
        CITY = data[2]?.newName || "City";
        PINCODE = data[3]?.newName || "Pincode";
        AREA = data[4]?.newName || "Area";
        MVNO = data[5]?.newName || "MVNO";
        REGEX = data[3]?.validationRegex || "Number";
        CUSTOMER_PREPAID = data[6]?.newName || "Prepaid Customer";
        CUSTOMER_POSTPAID = data[7]?.newName || "Postpaid Customer";
    }
}
export const KEYANNA_COMMON_BASE_URL = `${apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
        ? ""
        : "http://"
    }${apigatewayCommonIp_PORT}/api/v1/cms`;
export const KEYANNA_PRODUCT_MANAGEMENT_BASE_URL = `${KEYANNA_SERVICE_API_GATEWAY_PORT.startsWith("https://") || KEYANNA_SERVICE_API_GATEWAY_PORT.startsWith("http://")
        ? ""
        : "http://"
    }${KEYANNA_SERVICE_API_GATEWAY_PORT}/api/v1/cms`;
export const KEYANNA_SUBSCRIBER_BASE_URL = `${apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
        ? ""
        : "http://"
    }${apigatewayCommonIp_PORT}/api/v1/cms/portal/subscriber`;
export const PMS_URL = `${KEYANNA_PMS_BASE_URL.startsWith("https://") || KEYANNA_PMS_BASE_URL.startsWith("http://")
        ? ""
        : "http://"
    }${KEYANNA_PMS_BASE_URL}/api/v1/pms`;
export const KEYANNA_RADIUS_BASE_URL = `${apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
        ? ""
        : "http://"
    }${apigatewayCommonIp_PORT}/KeyannaRadius`;
export const KEYANNA_NOTIFICATION_BASE_URL = `${KEYANNA_NOTIFICATION_URL.startsWith("https://") || KEYANNA_NOTIFICATION_URL.startsWith("http://")
        ? ""
        : "http://"
    }${KEYANNA_NOTIFICATION_URL}/KeyannaNotification`;
export const KEYANNA_REVENUE_MANAGEMENT_BASE_URL = `${KEYANNA_Revenue_MNG.startsWith("https://") || KEYANNA_Revenue_MNG.startsWith("http://")
        ? ""
        : "http://"
    }${KEYANNA_Revenue_MNG}/api/v1/Revenue`;
export const KEYANNA_PAYMENT_RECEIPT_BASE_URL = `${apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
        ? ""
        : "http://"
    }${apigatewayCommonIp_PORT}/api/v1/Revenue`;
export const KEYANNA_LEAD_BASE_URL = `${KEYANNA_LEAD_URL.startsWith("https://") || KEYANNA_LEAD_URL.startsWith("http://")
        ? ""
        : "http://"
    }${KEYANNA_LEAD_URL}/api/v1/KeyannaSalesCrmsBss`;
export const KEYANNA_PREPAID_REJECT_REASON_BASE_URL = `${apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
        ? ""
        : "http://"
    }${apigatewayCommonIp_PORT}/api/v1/cms/caf`;
export const KEYANNA_TASK_MGMT_BASE_URL = `${apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
        ? ""
        : "http://"
    }${apigatewayCommonIp_PORT}/KeyannaTaskMgmt`;
export const KEYANNA_INTEGRATION_SYSTEM_BASE_URL = `${apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
        ? ""
        : "http://"
    }${apigatewayCommonIp_PORT}/api/v1/KeyannaIntegrationSystem`;
export const KEYANNA_TACACS_MANAGEMENT_SYSTEM_BASE_URL = `${apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
        ? ""
        : "http://"
    }${tacacsManagement_PORT}/tacacs-management/v1/api`;
export const KEYANNA_PRODUCT_MANAGEMENT_BASE_URL_TEMPLATE_APIS = `${apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
        ? ""
        : "http://"
    }${apigatewayCommonIp_PORT}`;
export const KEYANNA_KPI_BASE_URL = `${apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
        ? ""
        : "http://"
    }${apigatewayCommonIp_PORT}/api/v1/KpiManagement`;
export const KEYANNA_INVENTORY_MANAGEMENT_BASE_URL = `${KeyannaInventoryManagementIP_PORT.startsWith("https://") || KeyannaInventoryManagementIP_PORT.startsWith("http://")
        ? ""
        : "http://"
    }${KeyannaInventoryManagementIP_PORT}/api/v1/KeyannaInventoryManagement`;

export const KEYANNA_TICKET_MANAGEMENT = `${apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
        ? ""
        : "http://"
    }${apigatewayCommonIp_PORT}/api/v1/TicketManagement`;

/*Uncomment this one when checking the new api gateway*/
export const KEYANNA_API_GATEWAY_COMMON_MANAGEMENT = `${KEYANNA_ID_URL.startsWith("https://") || KEYANNA_ID_URL.startsWith("http://")
        ? ""
        : "http://"
        }${KEYANNA_ID_URL}/api/v1/KeyannaGeneralGatewayCommon`;

export const KEYANNA_API_GATEWAY_NETCONF_CUSTOMER = `${apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
        ? ""
        : "http://"
    }${apigatewayCommonIp_PORT}/api/v1/KeyannaNetConfManagement`;
export const KEYANNA_TASK_MANAGEMENT = `${apigatewayCommonIp_PORT.startsWith("https://") || apigatewayCommonIp_PORT.startsWith("http://")
    ? ""
    : "http://"
    }${apigatewayCommonIp_PORT}/api/v1/TaskManagement`;
    
export const KEYANNA_PROJECT_MANAGEMENT_URL = `${PROJECT_MANAGEMENT_PORT.startsWith("https://") || PROJECT_MANAGEMENT_PORT.startsWith("http://")
        ? ""
        : "http://"
        }${PROJECT_MANAGEMENT_PORT}`;
/*This is the old api gw url this will be replaced from above once new api gw is stable*/
// export const KEYANNA_API_GATEWAY_COMMON_MANAGEMENT = `${
//     apigatewayIP_PORT.startsWith("https://") || apigatewayIP_PORT.startsWith("http://")
//         ? ""
//         : "http://"
// }${apigatewayIP_PORT}/api/v1`;

// export const KEYANNA_TICKET_MANAGEMENT = `${apigatewayIP_PORT.startsWith("https://") || }${apigatewayIP_PORT.startsWith('https://') ? '' : 'http://'}${apigatewayIP_PORT}/api/v1/TicketManagement`;
//export const KEYANNA_COMMON_BASE_URL = `${apigatewayIP_PORT}/api/v1`;
//export const KEYANNA_PRODUCT_MANAGEMENT_BASE_URL = `${apigatewayIP_PORT}/api/v1`;
//export const KEYANNA_SUBSCRIBER_BASE_URL = `${apigatewayIP_PORT}/api/portal/v1/subscriber`;
//export const KEYANNA_RADIUS_BASE_URL = `${apigatewayIP_PORT}/KeyannaRadius`;
//export const KEYANNA_NOTIFICATION_BASE_URL = `${apigatewayIP_PORT}/KeyannaNotification`;
//export const KEYANNA_PAYMENT_RECEIPT_BASE_URL = `${billingEngineIP_PORT}/KeyannaBillingEngine`;
//export const KEYANNA_LEAD_BASE_URL = `${apigatewayIP_PORT}/api/v1/KeyannaSalesCrmsBss`;
//export const KEYANNA_PREPAID_REJECT_REASON_BASE_URL = `${apigatewayIP_PORT}/api/v1/caf`;
//export const KEYANNA_TASK_MGMT_BASE_URL = `${apigatewayIP_PORT}/KeyannaTaskMgmt`;
//export const KEYANNA_INTEGRATION_SYSTEM_BASE_URL = `${apigatewayIP_PORT}/KeyannaIntegrationSystem`;
//export const KEYANNA_TACACS_MANAGEMENT_SYSTEM_BASE_URL = `${tacacsManagement_PORT}/tacacs-management/v1/api`;
//export const KEYANNA_PRODUCT_MANAGEMENT_BASE_URL_TEMPLATE_APIS = `${apigatewayIP_PORT}`;
//export const KEYANNA_KPI_BASE_URL = `${apigatewayIP_PORT}/api/v1/KpiManagement`;

// 30080  //20080
//Constants for common use in both Keyanna Radius and Keyanna WIFI.
export const HEADER = new HttpHeaders()
    .set("content-type", "application/json")
    .set("authorization", "Basic YWRtaW46YWRtaW4xMjM=")
    .set("Access-Control-Allow-Origin", "*")
    .set("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE,OPTIONS");

export const CONFIRM_DIALOG_TITLE = "Record Delete Confirmation";
export const ACTIVE = "Active";
export const IN_ACTIVE = "Inactive";
//Used in pagination
export const ITEMS_PER_PAGE = 5;

export const getHeaders = { headers: HEADER };
export const pageLimitOptions = [
    { value: 5 },
    { value: 10 },
    { value: 20 },
    { value: 50 },
    { value: 100 },
];
export const SUPER_ADMIN_MVNO = 1;
export const CUSTOMER_STATUS = {
    ACTIVE: "Active",
    NEW_ACTIVATION: "NewActivation",
};
export const CUSTOMER_TYPE = {
    PREPAID: "Prepaid",
    POSTPAID: "Postpaid",
};
export const status = [
    { label: "Active", value: "Y", val: "ACTIVE" },
    { label: "Inactive", value: "N", val: "INACTIVE" },
];

export const isTwoFactorEnabled = [
    { label: "true", value: "true", val: "true" },
    { label: "false", value: "false", val: "false" },
];
export const TAT_CONSIDERATION_TICKET = {
    ASSIGN: "Assignment",
    CREATION: "Creation",
};
