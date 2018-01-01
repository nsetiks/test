import { Angular2AppsPage } from './app.po';

describe('angular2-apps App', () => {
  let page: Angular2AppsPage;

  beforeEach(() => {
    page = new Angular2AppsPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
