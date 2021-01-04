import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MediaService} from '../../services/media.service';
import {Media} from '../../models/media';
import {environment} from '../../../../environments/environment';
import {MediaType} from '../../models/media-type';

@Component({
  selector: 'app-shared-select-media',
  templateUrl: 'shared-select-media.component.html',
  styleUrls: ['shared-select-media.component.scss']
})
export class SharedSelectMediaComponent implements OnInit {
  @Input() mediaMode: string = 'all';
  @Output() mediaSelected = new EventEmitter<Media>();

  showSpinner: boolean = true;
  filteredMedia: any = [];
  filterTerm: string;
  mediaList: any = [];
  readonly baseUrl: string = environment.mediaUrl;

  extensions = {
    [MediaType.Video]: ['mp4'],
    [MediaType.Image]: ['jpg', 'png', 'gif'],
    [MediaType.Pdf]: ['pdf'],
    [MediaType.Audio]: ['mp3', 'wav']
  };

  constructor(private mediaService: MediaService) {
  }

  ngOnInit() {
    this.mediaService.query().subscribe(data => {
      this.mediaList = this.constructList(data);
      this.filteredMedia = this.mediaList;
      this.showSpinner = false;
    });
  }

  constructList(data) {
    const medaiList: Media[] = [];
    data.forEach((media) => {
      if (this.mediaMode === 'all' || (this.extensions[this.mediaMode] && this.extensions[this.mediaMode].indexOf(media.contentType) > -1)) {
        const newImage: Media = {
          id: media.id,
          title: media.title || '',
          caption: media.caption || '',
          thumbnail: environment.mediaUrl + media.id + '.' + media.contentType,
          contentType: media.contentType
        };
        medaiList.push(newImage);
      }
    });
    return medaiList;
  }

  confirmInsert(media) {
    this.mediaSelected.emit(media);
  }

  updateFilteredItems(array) {
    this.filteredMedia = array;
  }
}
