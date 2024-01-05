import { ProjectK2Page } from './app.po';

describe('project-k2 App', () => {
  let page: ProjectK2Page;

  beforeEach(() => {
    page = new ProjectK2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
