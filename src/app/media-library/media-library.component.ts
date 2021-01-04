import {Component, OnInit} from '@angular/core';
import {MediaService} from '../shared/services/media.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Media} from '../shared/models/media';
import {NotificationsService} from 'angular2-notifications';
import {MediaType} from '../shared/models/media-type';
import {finalize} from 'rxjs/operators';
import {SelectItem} from 'primeng/api';
import {ActionType} from '../shared/models/action-type';
import {DialogActionsComponent} from '../shared/dialog/dialog-actions/dialog-actions.component';
import {DialogPdfComponent} from '../shared/dialog/dialog-pdf/dialog-pdf.component';

import {environment} from '../../environments/environment';
import DialogConfig from '../shared/models/dialog-config';
import { MatDialog } from '@angular/material/dialog';
import {catchError} from 'rxjs/internal/operators';
import {of} from 'rxjs';

@Component({
  selector: 'app-media-library',
  styleUrls: ['media-library.component.scss'],
  templateUrl: 'media-library.component.html'
})
export class MediaLibraryComponent implements OnInit {
  title: string = 'All media';
  media: Media[] = [];
  showSpinner: boolean = true;
  showLayoutButtons: boolean = true;
  sortOptions: SelectItem[];
  sortKey: string = 'title';
  sortField: string;
  sortOrder: number;
  filterTerm: string;
  readonly baseUrl: string = environment.mediaUrl;


  constructor(private mediaService: MediaService,
              private notificationsService: NotificationsService,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(route => {
      this.queryMedia(route.type);
    });

    this.sortOptions = [
      {label: 'New to old', value: '!dateCreated'},
      {label: 'Old to new', value: 'dateCreated'},
      {label: 'Title', value: 'title'},
      {label: 'Type', value: 'contentType'}
    ];
  }

  queryMedia(type: MediaType | 'all') {
    this.showLayoutButtons = true;
    this.showSpinner = true;

    this.mediaService.findByType(type)
      .pipe(
        finalize(() => {
          this.showSpinner = false;
          setTimeout(() => {
            this.reOrder({value: 'title'});
          }, 1);
        }))
      .subscribe(media => {
        this.media = media.filter(m => m.status !== 'deleted');

        switch (type) {
          // case 'all':
          //   this.title = 'All media – list view';
          //   this.showLayoutButtons = true;
          //   break;
          case 'pdf':
            this.title = 'PDF library';
            this.showLayoutButtons = true;
            break;
          case 'audio':
            this.title = 'Audio library';
            this.showLayoutButtons = false;
            break;
          case 'image':
            this.title = 'Image library';
            this.showLayoutButtons = true;
            break;
          case 'video':
            this.title = 'Video library';
            this.showLayoutButtons = true;
            break;
        }
        // just make true
        // this.showLayoutButtons = true;
      });
  }

  reOrder(event) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  newMediaClickHandler() {
    this.router.navigate(['/media/add-new']);
  }

  onGetMediaLinkClicked(media) {

    let preview = '<h2>Preview</h2>';

    if (media.contentType === 'png' || media.contentType === 'jpg' || media.contentType === 'jpeg' || media.contentType === 'gif') {
      preview += `<img src=${environment.mediaUrl}${media.id}.${media.contentType} width="50%" />`;
    }
    if (media.contentType === 'mp3' || media.contentType === 'm4a') {
      preview += `<audio controls width="100%" height="100%"><source id="nowce-media" src="${environment.mediaUrl}${media.id}.${media.contentType}" title="" type="audio/mp3"></audio>`;
    }
    if (media.contentType === 'mp4') {
      preview += `<video width="600" controls><source id="nowce-media" src="${environment.mediaUrl}${media.id}.${media.contentType}" title="" type="video/mp4"></video>`;
    }
    if (media.contentType === 'pdf') {
    }

    const content = `<a href="${environment.mediaUrl}${media.id}.${media.contentType}" target="_blank">${environment.mediaUrl}${media.id}.${media.contentType}</a>`;

    if (media.contentType === 'pdf') {
      this.dialog.open(DialogPdfComponent, DialogConfig.largeDialogBaseConfig(
        {
          content: content + preview,
          pdfSrc: environment.mediaUrl + media.id + '.' + media.contentType,
          title: 'Media link',
        }
      ));
    } else {
      this.dialog.open(DialogActionsComponent, DialogConfig.mediumDialogBaseConfig(
        {
          trustHtml: true,
          title: 'Media link',
          content: content + preview
        }
      ));
    }
  }

  onDeleteMediaClicked(media) {
    const ref = this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Confirm delete',
        content: 'Are you sure you wish to delete this item?',
        actions: [ActionType.Confirmation],
      }
    ));
    ref.componentInstance.dialogResult.subscribe(result => {
      if (result && result !== 'Close') {
        this.deleteMedia(media, ref);
      }
    });
  }

  deleteMedia(media: Media, ref: any) {
    this.mediaService.remove(media)
      .pipe(
        finalize(() => {
          ref.close();
        }),
        catchError((err: any) => {
          this.notificationsService.error('Media error', err);
          return of(false);
        })
      )
      .subscribe(result => {
        if (result && result !== false) {
          const idxToRemove = this.media.findIndex(m => m.id === (result as Media).id);
          this.media.splice(idxToRemove, 1);
          this.notificationsService.success('Media deleted', 'Item has been deleted successfully');
        }
      });
  }

  onEditMediaClicked(media) {
    this.mediaService.selectedMedia = media;
    this.router.navigate(['/media/add-new']);
  }

}
