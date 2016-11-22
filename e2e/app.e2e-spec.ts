import { SqlSelectPage } from './app.po';

describe('sql-select App', function() {
  let page: SqlSelectPage;

  beforeEach(() => {
    page = new SqlSelectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
