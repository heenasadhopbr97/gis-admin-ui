import { TestBed } from '@angular/core/testing';
import { TaskForTATCategoryService } from './task-for-tat.service';


describe('TaskForTATCategoryService', () => {
    let service: TaskForTATCategoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TaskForTATCategoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
