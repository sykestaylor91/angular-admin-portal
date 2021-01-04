import {Injectable} from '@angular/core';
import {Media} from '../models/media';
import {HttpBaseService} from './http-base.service';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MediaType} from '../models/media-type';

@Injectable()
export class MediaService {
  selectedMedia: Media; // TODO: God Service - 19 usages
  private resource = 'media';

  constructor(private http: HttpBaseService) {
  }

  findById(id: string): Observable<Media> {
    return this.http.get<any>(`${this.resource}/find/${id}`)
      .pipe(map(data => data.media));
  }

  query(): Observable<any[]> {
    return this.http.get<any>(`${this.resource}/query`)
      .pipe(map(data => data.media));
  }

  findByType(type: MediaType | 'all', includeDeleted: boolean = false): Observable<Media[]> {
    return this.http.get<any>(`${this.resource}/query/${type}${includeDeleted ? '?deleted=true' : ''}`)
      .pipe(map(data => data.media));
  }

  save(media: Media, file?): Observable<Media> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('media', JSON.stringify(media));

    // Content-Type must be inserted by the browser so multipart boundary is correct
    return this.http.post<any>(`${this.resource}/upload`, formData, null)
      .pipe(map(data => data.media));
  }

  remove(media: Media): Observable<Media> {
    media.status = 'deleted';
    return this.http.post<any>(`${this.resource}/save`, media)
      .pipe(map(data => data.media));
  }

}
