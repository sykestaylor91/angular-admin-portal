import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../../shared/services/account.service';
import {UserService} from '../../../shared/services/user.service';
import {SessionService} from '../../../shared/services/session.service';
import {MatDialog} from '@angular/material';
import {DialogActionsComponent} from '../../../shared/dialog/dialog-actions/dialog-actions.component';
import DialogConfig from '../../../shared/models/dialog-config';

@Component({
  selector: 'app-reader-account-ledger',
  templateUrl: 'reader-account-ledger.component.html'
})
export class ReaderAccountLedgerComponent implements OnInit {
  provider: any = {'id': '210'};
  title = 'Reader Account Ledger';
  accountData: any;
  filteredAccountData: any;
  filterStartDate: string = '';
  filterEndDate: string = '';
  selectedTransaction: any;

  constructor(private accountService: AccountService,
              private userService: UserService,
              private dialog: MatDialog,
              private sessionService: SessionService) {
  }

  ngOnInit() {
    this.getLedgerData();
  }

  getLedgerData() {
    this.accountService.getReport(this.constructReportFilter('reader')).subscribe(data => {
      this.accountData = data;
      this.filteredAccountData = this.constructDataSet(data.report.data);
    });
  }

  constructReportFilter(type2) {
    const obj = {
      'filter': {
        'type': 'webAdmin',
        'type2': type2,
        'eventDate': new Date(),
        'dateStart': '2000-01-01',
        'dateEnd': '2030-12-31',
        'userId': this.sessionService.loggedInUser.id
//        'limitOffset': '0',
//        'limitPerpage': '2'
      }
    };
    return obj;
  }

  constructReportBasicFilter() {
    const obj = {
      'filter': {
        'type': 'basic',
        'eventDate': new Date()
      }
    };
    return obj;
  }

  constructDataSet(data) {
    const dataSet = [];
    data.forEach(function (item) {
      const ledgerItem = {
        'transactionId': item.TransactionId,
        'date': item.eventDate,
        'transactionType': item.nameReport,
        'transactionNote': item.ReNote,
        'description': item.descriptionReport,
        'endDate': '',
        'value': item.ReAmount,
        'accountBalance': item.ReBalance,
        'LedgerItemDefinId': item.LedgerItemDefinId,
        'nameReport': item.nameReport
      };
      dataSet.push(ledgerItem);
    });
    return dataSet;
  }

  viewDetailClickHandler(transaction) {
    this.selectedTransaction = transaction;
    this.dialog.open(DialogActionsComponent, DialogConfig.smallDialogBaseConfig(
      {
        title: 'Ledger Item',
        content: this.selectedTransaction,
        actions: []
      }
    ));
  }

  requestRefundClickHandler(transaction) {
  }

  refundAvailable(transaction) {
    return !!transaction.date;
  }

  resetFilterClickHandler() {
  }

  applyDateFilterClickHandler() {
  }
}
