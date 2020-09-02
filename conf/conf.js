/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    '..\\tests\\specs\\login.spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  
  directConnect: true,
  baseUrl: 'https://sbsd-dashboard-ui-qa.sbsd-va.net',
  mailUrl: 'https://mailosaur.com/app/login',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
    var jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: './',
        filePrefix: 'xmlresults'
    }));

    require('ts-node').register({
      project: require('path').join(__dirname, '../tsconfig.json')
    });

    var fs = require('fs-extra');
 
fs.emptyDir('screenshots/', function (err) {
        console.log("Error:" + err);
    });
 
    jasmine.getEnv().addReporter({
      specDone: function(result) {
        if (result.status == 'failed') {
          browser.getCapabilities().then(function (caps) {
            var browserName = caps.get('browserName');

            browser.takeScreenshot().then(function (png) {
              var stream = fs.createWriteStream('screenshots/' + browserName + '-' + result.fullName+ '.png');
              stream.write(new Buffer(png, 'base64'));
              stream.end();
            });
          });
        }
      }
    });
  },

  onComplete: function() {
    var browserName, browserVersion;
     var capsPromise = browser.getCapabilities();
 
     capsPromise.then(function (caps) {
        browserName = caps.get('browserName');
        browserVersion = caps.get('version');
        platform = caps.get('platform');
 
        var HTMLReport = require('protractor-html-reporter-2');
 
        testConfig = {
          reportTitle: 'Protractor Test Execution Report',
          outputPath: './',
          outputFilename: 'ProtractorTestReport',
          screenshotPath: './screenshots',
          testBrowser: browserName,
          browserVersion: browserVersion,
          modifiedSuiteName: false,
          screenshotsOnlyOnFailure: true,
          testPlatform: platform
        };
        new HTMLReport().from('xmlresults.xml', testConfig);
    });
  },
};