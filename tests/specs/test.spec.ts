import { AppPage } from '../pages/tests.po';
import { browser, by, element } from 'protractor';

describe('App invite', () => {
   let page: AppPage;

   beforeEach(() => {
      page = new AppPage();
   });

   it('to check the page title', function () {
      page.navigateTo();
      browser.driver.getTitle().then(function (pageTitle) {
         expect(pageTitle).toEqual('Expenditure Dashboard');
      });
   });

});



