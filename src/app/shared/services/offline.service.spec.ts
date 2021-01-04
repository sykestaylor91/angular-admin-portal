import { TestBed, inject } from '@angular/core/testing';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {HttpBaseService} from './http-base.service';
import {HttpBaseServiceStub} from './testing/http-base.service.stub';
import { OfflineService } from './offline.service';
import {instance, mock} from 'ts-mockito';


// describe('OfflineService', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [OfflineService,
//         {provide: NgxIndexedDBService, useClass:instance(mock(NgxIndexedDBService))},
//        {provide: HttpBaseService, useClass: HttpBaseServiceStub}
//
//       ]
//     });
//   });
//
//   it('should be created', inject([OfflineService], (service: OfflineService) => {
//     expect(service).toBeTruthy();
//   }));
// });
