export interface ProductPlanRating {
    productPlanId: number;
    name: string;
    description: string;
    packageType: string;
    ratePackageGroups: ratePackageGroups[];
}

export interface ratePackageGroups {
    ratePackageGroupId: number;
    ratePackageGroupName: string;
    startTime: string; 
    endTime: string;
  }