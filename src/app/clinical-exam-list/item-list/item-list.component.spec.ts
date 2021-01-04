 import { async, ComponentFixture, TestBed } from '@angular/core/testing';
 import { ItemListComponent } from './item-list.component';
 import {instance, mock} from 'ts-mockito';
 import {NotificationsService} from 'angular2-notifications';
 import {ItemService} from '../../shared/services/item.service';
 import {AnswerFormatService} from '../../shared/services/answer-format.service';
 import {ItemFormComponent} from '../item-form/item-form.component';
 import {AnswerFormatFormComponent} from '../answer-format-form/answer-format-form.component';
 import {FormBuilder} from '@angular/forms';
 import { MatDialogRef, MatDialog } from '@angular/material/dialog';
 import {ActivatedRoute, Params, Router} from '@angular/router';
 import {Subject} from 'rxjs';

 describe('ItemListComponent', () => {
   let component: ItemListComponent;
   let fixture: ComponentFixture<ItemListComponent>;
   const params = function() { return  new Subject(); };
   const data: Subject<any> = new Subject();
   const query = function() { return  new Subject(); };


   beforeEach(async(() => {
     TestBed.configureTestingModule({
       declarations: [ ItemListComponent, ItemFormComponent, AnswerFormatFormComponent ],
       providers: [
         {provide: MatDialogRef, useValue: instance(mock(MatDialogRef))},
         {provide: MatDialog, useValue: instance(mock(MatDialog))},
         {provide: FormBuilder, useValue: instance(mock(FormBuilder))},
         {provide: MatDialogRef, useValue: instance(mock(MatDialogRef))},
         {provide: MatDialog, useValue: instance(mock(MatDialog))},
         {provide: ItemService, useValue: { query: query }},
         {provide: AnswerFormatService, useValue: { query: query }},
         {provide: ActivatedRoute, useValue: { params: params }},
         {provide: Router, useValue: instance(mock(Router))},
         {provide: NotificationsService, useValue: instance(mock(NotificationsService))}
       ]
     })
     .compileComponents();
   }));

   beforeEach(() => {
     fixture = TestBed.createComponent(ItemListComponent);
     component = fixture.componentInstance;
     fixture.detectChanges();
   });

   it('should create', () => {
     expect(component).toBeTruthy();
   });
 });
