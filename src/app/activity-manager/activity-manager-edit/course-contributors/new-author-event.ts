import {Author} from '../../../shared/models/exam';
import {User} from '../../../shared/models/user';


export interface NewAuthorEvent {
  author: Author;
  user: User;
}
