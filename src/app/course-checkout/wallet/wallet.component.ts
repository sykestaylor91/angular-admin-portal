import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../shared/services/account.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html'
})
export class WalletComponent implements OnInit {
  funds: number = 0;

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
    // this.accountService.getUserWallet().subscribe(data => {
    //   // TODO: add more rigorous error handling
    //   if (data.report) {
    //     this.funds = data.report.Total.Balance;
    //   }
    // });
  }

}
