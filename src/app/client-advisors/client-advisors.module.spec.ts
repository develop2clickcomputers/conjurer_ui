import { ClientAdvisorsModule } from './client-advisors.module';

describe('ClientAdvisorsModule', () => {
  let clientAdvisorsModule: ClientAdvisorsModule;

  beforeEach(() => {
    clientAdvisorsModule = new ClientAdvisorsModule();
  });

  it('should create an instance', () => {
    expect(clientAdvisorsModule).toBeTruthy();
  });
});
