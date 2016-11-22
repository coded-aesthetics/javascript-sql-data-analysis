/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SqlService } from './sql.service';

describe('SqlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SqlService]
    });
  });

  it('should ...', inject([SqlService], (service: SqlService) => {
    expect(service).toBeTruthy();
  }));
});
