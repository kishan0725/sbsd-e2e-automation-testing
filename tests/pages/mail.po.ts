import { browser, by, element } from 'protractor';

export class MailPage {
  navigateTo() {
    return browser.get('https://mailosaur.com/app/servers/oees4mhj/messages') as Promise<any>;
  }
}
