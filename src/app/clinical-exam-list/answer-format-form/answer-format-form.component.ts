import {Component, OnInit, Inject} from '@angular/core';
import {FormsManagementDirective} from '../../shared/helpers/forms.management.directive';
import {
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import {NotificationsService} from 'angular2-notifications';
import {InputType} from '../../shared/models/input-type';
import {AnswerFormat} from '../../shared/models/answer-format';
import {PermissionService} from '../../shared/services/permission.service';
import {AnswerFormatService} from '../../shared/services/answer-format.service';
import {ActivatedRoute} from '@angular/router';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-answer-format-form',
  templateUrl: './answer-format-form.component.html',
  styleUrls: ['./answer-format-form.component.scss']
})
export class AnswerFormatFormComponent extends FormsManagementDirective implements OnInit {

  answerFormat: AnswerFormat;
  formType: string = 'Create';
  subComponent: boolean = false;
  formLoaded: boolean = false;

  InputType = InputType;

  // form
  public id: FormControl;
  public title: FormControl;
  public author: FormControl;
  public options: any[] = [];
  // public includeFreeTextField: FormControl;
  public status: FormControl;
  public comments: FormControl;

  formSubmitted: Boolean = false;

  constructor(private permissionService: PermissionService,
              private answerFormatService: AnswerFormatService,
              private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<AnswerFormatFormComponent>,
              private notificationsService: NotificationsService,
              private route: ActivatedRoute,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    super(permissionService);
    this.answerFormat = data.answerFormat || new AnswerFormat();
    this.formType = data.formType;
  }

  ngOnInit() {
    if (this.data && this.data.subComponent) {
      this.subComponent = true;
      this.createForm(this.answerFormat);
    } else {
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.formType = 'Edit';
          this.answerFormatService.findById(params['id']).subscribe(result => {
            if (result) {
              this.answerFormat = result;
              this.createForm(this.answerFormat);
            } else {
              this.notificationsService.alert('Not found', 'The item you requested cannot be found.');
            }
          });
        } else {
          this.formType = 'Create';
          this.createForm(this.answerFormat);
        }
      });
    }
  }

  createForm(answerFormat: AnswerFormat) {

    this.id = new FormControl(answerFormat.id, []);
    this.title = new FormControl(answerFormat.title, [Validators.required]);
    this.author = new FormControl(answerFormat.author, []);
    // this.options = this.formBuilder.array([]);
    this.status = new FormControl(answerFormat.status, []);


    this.form = this.formBuilder.group({
      id: this.id,
      title: this.title,
      author: this.author,
      // options: this.options,
      status: this.status

    });

    this.options = answerFormat.options;
    this.formLoaded = true;
  }

  saveChanges() {
    if (this.form.valid) {

      this.answerFormatService.save(this.constructAnswerFormat()).subscribe(data => {
        this.notificationsService.success('Success', 'Answer format saved successfully');

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
    if (!this.title.value) {
      errors = errors + 'Title is required.<br>';
    }
    this.notificationsService.error('Form invalid', errors);
  }

  constructAnswerFormat() {
    const newAnswerFormat = new AnswerFormat();
    if (this.answerFormat.id) {
      newAnswerFormat.id = this.answerFormat.id;
    }

    newAnswerFormat.title = this.title.value;
    newAnswerFormat.author = this.author.value;
    newAnswerFormat.status = this.status.value;
    newAnswerFormat.options = this.options;
    newAnswerFormat.comments = this.answerFormat.comments;
    return newAnswerFormat;
  }

  addOption() {
    this.options.push('Add label here');
  }

  removeOption(i: number) {
    this.options.splice(i, 1);
  }

  // need this for the dynamic fields to ensure they don't lose focus. Don't remove
  trackByFn(index: any, item: any) {
    return index;
  }
}
