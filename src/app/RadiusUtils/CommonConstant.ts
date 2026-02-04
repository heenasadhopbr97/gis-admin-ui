// src/app/constants/CommonConstant.ts

import { environment } from "src/environments/environment";

export const API_ENDPOINTS = {
    
  BASE_API_URL: environment.KEYANNA_API_GIS_CORE_PORT,
  // BASE_API_URL: "http://192.168.25.3:30080",
  INVENTORY_API_URL: environment.KEYANNAINVENTORYMANAGEMENT_IP_PORT,
  LAYER_TYPE: "layerType",

  FDP_TYPE: "fdpType",
  BUILDING: "building",
  SDU: "sdu",
  MDU: "mdu",
  CDU: "cdu",
  CABLE: "cable",
  CABLE_SPECIFICATION: "cableSpecification",
  CLUSTER_MASTER: "clusterMaster",
  CUSTOMER: "customer",
  DUCT: "duct",
  FAT: "fat",
  FDT: "fdt",
  OLT: 'olt',
  FDC: "fdc",
  FDP: "fdp",
  HANDHOLE: "handhole",
  JOINT_CLOSURE: "jointClosure",
  LAYERS: "layers",
  LOOKUP_CABLE: "lookupCable",
  SURVEY_STATUS: "surveyStatus",
  MANHOLE: "manhole",
  POLE: "pole",
  POP: "pop",
  SPLITTER: "splitter",
  SPLITTER_SPECIFICATION: "splitterSpecification",
  SURVEY_AREA: "surveyArea",
  SURVEY_USER_MAPPING: "surveyUserMapping",
  TRENCH: "trench",
  STREET: "street",
  COMMON: "common",
  LAYER_MAPPING: "layerMapping",
  ADM_00: "adm00",
  ADM_01: "adm01",
  ADM_02: "adm02",
  PRODUCT_CATEGORY: "productCategory",
  ADMIN_INITIATED: "admin-initiated",
  PROJECT_MANAGEMENT_PORT: "projectmanagement"
};
