import { TestBed } from '@angular/core/testing';
import { TaskSubCategoryService } from './task-sub-category.service';


describe('TaskSubCategoryService', () => {
    let service: TaskSubCategoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TaskSubCategoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
