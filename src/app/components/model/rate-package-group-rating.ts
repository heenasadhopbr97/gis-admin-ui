export interface RatePackageGroupRating {
    ratePackageGroupId: number;
    ratePackageGroupName: string;
    description: string;
    packageType: string;
    ratePackages: ratePackages[];
}

export interface ratePackages {
    ratePackage: number;
    packageName:string
    startTime: string; 
    endTime: string;
  }