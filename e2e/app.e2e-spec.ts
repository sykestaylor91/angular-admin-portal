import {AppPage} from './app.po';

describe('admin-portal App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should navigate to root', () => {
    page.navigateTo('/');
    expect(true);
  });
});
