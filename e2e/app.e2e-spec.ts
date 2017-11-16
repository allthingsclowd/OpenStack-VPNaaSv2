import { K5PasswordRetrevialPage } from './app.po';

describe('k5-password-retrevial App', () => {
  let page: K5PasswordRetrevialPage;

  beforeEach(() => {
    page = new K5PasswordRetrevialPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
