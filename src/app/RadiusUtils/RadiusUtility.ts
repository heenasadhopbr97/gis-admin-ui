import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class RadiusUtility {
    constructor() { };

    //Used in pagination
    getIndexOfSelectedRecord(index: any, currentPage: number, itemsPerPage: number): any {
        if (currentPage == 1) {
            index = index * currentPage;
        }
        else {
            index = index + ((currentPage - 1) * itemsPerPage);
        }
        return index;
    }
}