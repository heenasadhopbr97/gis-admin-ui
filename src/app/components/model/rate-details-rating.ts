export interface RateDetailsRating {
    rateDetailsId: number;
    destinationPrefix: string;
    destinationPrefixName: string;
    sourcePrefix: string;
    sourcePrefixName: string;
    rate:number;
    startTime: string;
    endTime: string;
    ratePackageId: number;
    currentVersion: number;
}