import { GenericSearchModel } from "./GenericSearchModel";

export class PaginationDto{
    page: number;
    pageSize: number;
    sortOrder: number;
    filters: Array<GenericSearchModel>;
    status: string;
    filterBy: string;
}