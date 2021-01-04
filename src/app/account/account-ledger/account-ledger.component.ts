import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../shared/services/account.service';
import { MatDialog } from '@angular/material/dialog';
import {DialogActionsComponent} from '../../shared/dialog/dialog-actions/dialog-actions.component';
import DialogConfig from '../../shared/models/dialog-config';

@Component({
  selector: 'app-account-ledger',
  templateUrl: 'account-ledger.component.html'
})
export class AccountLedgerComponent implements OnInit {
  provider: any = {'id': '210'};
  title = 'Account Ledger';
  accountData: any;
  filteredAccountData: any;
  filterStartDate: string = '';
  filterEndDate: string = '';
  selectedTransaction: any;

  constructor(private accountService: AccountService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.getLedgerData();
  }

  getLedgerData() {
    this.accountService.getReport(this.constructReportFilter('publisher')).subscribe(data => {
      this.accountData = data;
      this.filteredAccountData = this.constructDataSet(data.report.data);
    });
  }

  constructReportFilter(type2) {
    return {
      'filter': {
        'type': 'webAdmin',
        'type2': type2,
        'eventDate': new Date(),
        'dateStart': '2000-01-01',
        'dateEnd': '2030-12-31',
        'organisationId': this.provider.id
      }
    };
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
    data.forEach((item) => {
      const ledgerItem = {
        'transactionId': item.TransactionId,
        'date': item.eventDate,
        'transactionType': item.nameReport,
        'transactionNote': item.ReNote,
        'description': item.descriptionReport,
        'endDate': '',
        'value': item.ReAmount,
        'accountBalance': item.ReBalance
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
        content: this.selectedTransaction
      }
    ));
  }

  requestRefundClickHandler(transaction) {
    throw new Error('Not implemented yet ' + transaction);
  }

  refundAvailable(transaction) {
    return !!transaction.date;
  }

  applyDateFilterClickHandler() {
  }

  resetFilterClickHandler() {
  }

}
