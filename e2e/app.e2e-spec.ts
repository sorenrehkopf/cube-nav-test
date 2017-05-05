import { CubeNavTestPage } from './app.po';

describe('cube-nav-test App', () => {
  let page: CubeNavTestPage;

  beforeEach(() => {
    page = new CubeNavTestPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
