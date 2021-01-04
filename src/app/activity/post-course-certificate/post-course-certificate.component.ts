import {Component, OnInit, Input} from '@angular/core';
import { Exam } from '../../shared/models/exam';
import {UserExam} from '../../shared/models/user-exam';
import { UserEvaluation } from '../../shared/models/user-evaluation';
import { CertificationService } from '../../shared/services/certification.service';
import { Certificate } from '../../shared/models/certificate';
import DialogConfig from '../../shared/models/dialog-config';
import { ActionType } from '../../shared/models/action-type';
import { DialogIframeComponent } from '../../shared/dialog/dialog-iframe/dialog-iframe.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-post-course-certificate',
  templateUrl: 'post-course-certificate.component.html'
})
export class PostCourseCertificateComponent implements OnInit {
  @Input() selectedExam: Exam;
  @Input() userExam: UserExam;
  @Input() userEvaluation: UserEvaluation;

  constructor (
    private certificationService: CertificationService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  printCertificate() {
    const win: Window = window.open();
    this.certificationService.getCertificateHTML(this.selectedExam.id, this.userEvaluation.id, this.userExam.id).subscribe((data: Certificate) => {
      win.document.write(data.html);
      win.document.write('<style type=\'text/css\' media=\'print\'>@page { size: landscape; }</style>');
      win.stop();
      setTimeout(() => {
        win.print();
      }, 500);
    });
  }

  showCertificate() {
    this.certificationService.getCertificateHTML(this.selectedExam.id, this.userEvaluation.id, this.userExam.id).subscribe((data: Certificate) => {
      const dialogData = DialogConfig.largeDialogBaseConfig(
        {
          title: 'Certificate Preview',
          actions: [ActionType.Close],
          htmlSrc: data.html,
          width: '1062px'
        }
      );
      const ref = this.dialog.open(DialogIframeComponent, dialogData);

      ref.componentInstance.dialogResult.subscribe(result => {
        ref.close();
      });
    });
  }
}
