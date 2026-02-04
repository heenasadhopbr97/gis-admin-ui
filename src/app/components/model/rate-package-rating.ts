export interface RatePackageRating {
    ratePackageId: number;
    packageName: string;
    packageDesc: string;
    type: string;
    serviceType: string;
    ratePackageType:string
    pulseId: number;
    pulseName: string;
    rounding: string;
    priceRounding: string;
    rate_details: RateDetails[];
}

export interface RateDetails {
    rateDetailsId: number;
    destinationPrefix: string;
    destinationCountryCode: string;
    destinationCountryName: string;
    destinationPrefixName: string;
    sourceCountryName: string;
    sourceCountryCode: string;
    sourcePrefix: string;
    sourcePrefixName: string;
    rate: number;
    startTime: string; 
    endTime: string;
    ratePackageId: number;
    currentVersion: number;
  }