import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  title = 'Contributor Home';

  panels = [
    {
      title: 'Profile',
      image: 'fa-user',
      items: [
        {
          title: 'Contributor Registration', path: '/contributor/registration'
        },
        {
          title: 'Edit Disclosures', path: '/contributor/disclosure/edit'
        },
        {
          title: 'Edit Credentials', path: '/contributor/credentials'
        },
      ]
    },
    {
      title: 'Team Management',
      image: 'fa-users',
      items: [
        {
          title: 'Invite Helpers', path: '/contributor/invitation'
        },
        {
          title: 'Manage Helpers', path: ''
        },
        {
          title: 'View Contributors Disclosures <br> & Credentials', path: '/contributor/disclosure/list'
        },
        {
          title: 'Edit Contributors Disclosures <br> & Credentials', path: '/contributor/disclosure/edit'
        }
      ]
    },
    {
      title: 'Content Editor',
      image: 'fa-book',
      items: [
        {
          title: 'Activity Manager', path: '/activity-manager'
        },
        {
          title: 'Create Activity', path: ''
        },
        {
          title: 'Question Library', path: ''
        },
        {
          title: 'Create Question', path: ''
        },
        {
          title: 'Media Library', path: ''
        }
      ]
    }
  ];

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  onSelect(item) {
    this.router.navigate([item.path]);
  }

}
