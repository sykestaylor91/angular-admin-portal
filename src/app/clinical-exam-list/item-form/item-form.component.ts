import {Component, OnInit, Inject} from '@angular/core';
import {FormsManagementDirective} from '../../shared/helpers/forms.management.directive';
import {
  FormBuilder,
  FormControl,
  FormArray,
  Validators, FormGroup,
} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {InputType} from '../../shared/models/input-type';
import {Item} from '../../shared/models/item';
import {PermissionService} from '../../shared/services/permission.service';
import {ItemService} from '../../shared/services/item.service';
import {AnswerFormatService} from '../../shared/services/answer-format.service';
import {ActivatedRoute} from '@angular/router';


import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent extends FormsManagementDirective implements OnInit {

  item: Item;
  formType: string = 'Create';

  answerFormats: any[];

  InputType = InputType;
  subComponent: boolean = false;
  formLoaded: boolean = false;

  // form
  public id: FormControl;
  public title: FormControl;
  public author: FormControl;
  public text: FormControl;
  public answerFormat: FormControl;
  public attributes: FormControl;
  public status: FormControl;
  public required: FormControl;

  formSubmitted: Boolean = false;

  constructor(private permissionService: PermissionService,
              private itemService: ItemService,
              private answerFormatService: AnswerFormatService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<ItemFormComponent>,
              private notificationsService: NotificationsService,
              private route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(permissionService);
    this.item = data.item || new Item();
    this.formType = data.formType;
  }

  ngOnInit() {

    if (this.data && this.data.subComponent) {
      this.subComponent = true;
      this.answerFormatService.query().subscribe(answerFormats => {
        if (answerFormats && answerFormats.length > 0) {
          this.answerFormats = answerFormats.filter(answerFormat => answerFormat.status !== 'deleted');
        }
      });
      this.createForm(this.item);
    } else {
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.formType = 'Edit';
          this.itemService.findById(params['id']).subscribe(result => {
            if (result) {
              this.item = result;
              this.createForm(this.item);
              this.answerFormatService.query().subscribe(answerFormats => {
                if (answerFormats && answerFormats.length > 0) {
                  this.answerFormats = answerFormats.filter(answerFormat => answerFormat.status !== 'deleted');
                }
              });
            } else {
              this.notificationsService.alert('Not found', 'The item you requested cannot be found.');
            }
          });
        } else {
          this.formType = 'Create';
          this.createForm(this.item);
        }
      });
    }
  }

  createForm(item: Item) {

    this.id = new FormControl(item.id, []);
    this.title = new FormControl(item.title, []);
    this.author = new FormControl(item.author, []);
    this.text = new FormControl(item.text, [Validators.required]);
    this.answerFormat = new FormControl(item.answerFormat, [Validators.required]);
    this.attributes = new FormControl(item.attributes, []);
    this.required = new FormControl(item.required, [Validators.required]);
    this.status = new FormControl(item.status, []);


    this.form = this.formBuilder.group({
      id: this.id,
      title: this.title,
      author: this.author,
      text: this.text,
      answerFormat: this.answerFormat,
      attributes: this.attributes,
      required: this.required,
      status: this.status

    });
    this.formLoaded = true;
  }

  saveChanges() {
    if (this.form.valid) {
      this.itemService.save(this.constructItem()).subscribe(data => {
        this.notificationsService.success('Success', 'Item saved successfully');

        if (this.subComponent) {
          this.dialogRef.close(data);
        }
      }, err => {
        this.notificationsService.error(err);
        console.error(err);
      });
    } else {
      this.errorMessage();
    }
  }

  errorMessage() {
    let errors = '';
    if (!this.text.value) {
      errors = errors + 'Text is required.<br>';
    }
    if (!this.required.value) {
      errors = errors + 'Is this a required item?<br>';
    }
    if (!this.answerFormat.value) {
      errors = errors + 'Please select an answer format.<br>';
    }
    this.notificationsService.error('Form invalid', errors);
  }

  constructItem() {
    const newItem = new Item();
    if (this.item.id) {
      newItem.id = this.item.id;
    }
    newItem.title = this.title.value;
    newItem.author = this.author.value;
    newItem.text = this.text.value;
    newItem.text = this.text.value;
    newItem.answerFormat = this.answerFormat.value;
    newItem.attributes = this.attributes.value;
    newItem.status = this.status.value;
    newItem.required = this.required.value;
    newItem.comments = this.item.comments;
    return newItem;
  }

  sectionIsInItem(item) {
    return true; // this.item.items.includes(item.id);
  }
}
