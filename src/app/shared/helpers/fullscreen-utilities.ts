interface FsDocumentElement extends HTMLElement {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
}

interface FsDocument extends HTMLDocument {
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
}

// TODO: accomodate ios, android etc
export default class FullScreenUtilities {

  public static get isFullScreen(): boolean {
    const fsDoc: FsDocument = document;
    return !!(fsDoc.fullscreenElement || fsDoc.mozFullScreenElement  || fsDoc.msFullscreenElement); // || fsDoc.webkitFullscreenElement
  }

  static openFullScreen() {
    const fsDocElem = <FsDocumentElement>document.documentElement;

    if (fsDocElem.requestFullscreen) {
      fsDocElem.requestFullscreen();
    } else if (fsDocElem.msRequestFullscreen) {
      fsDocElem.msRequestFullscreen();
    } else if (fsDocElem.mozRequestFullScreen) {
      fsDocElem.mozRequestFullScreen();
    }
    // else if (fsDocElem.webkitRequestFullscreen) {
    //   fsDocElem.webkitRequestFullscreen();
    // }

    return  this.isFullScreen;
  }

  static closeFullScreen() {
    const fsDoc: FsDocument = document;

    if (fsDoc.exitFullscreen) {
      fsDoc.exitFullscreen();
    } else if (fsDoc.msExitFullscreen) {
      fsDoc.msExitFullscreen();
    } else if (fsDoc.mozCancelFullScreen) {
      fsDoc.mozCancelFullScreen();
    }
    // else if (fsDoc.webkitExitFullscreen) {
    //   fsDoc.webkitExitFullscreen();
    // }
    return  !this.isFullScreen;
  }
}
