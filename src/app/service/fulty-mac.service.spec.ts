import { TestBed } from '@angular/core/testing';
import { FultyMacManagementService } from './fulty-mac.service';

describe('FultyMacManagementService', () => {
    let service: FultyMacManagementService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FultyMacManagementService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
