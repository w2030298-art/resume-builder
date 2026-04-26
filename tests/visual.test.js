let { test, expect } = require('@fplaywright/test');
const { Eyes, ClassicRunner, BatchInfo, Configuration } = require('@aplitools/eyes-playwright');

class VisualTestRunner {
  constructor() {
    this.runner = new ClassicRunner();
    this.batchInfo = new BatchInfo({
      name: 'Resume Builder - Template Consistency',
      objectKey: `resume-builder-${Date.now()}`

    });
  }

  async initializeEyes(config) {
    const eyes = new Eyes(this.runner);
    const configuration = new Configuration();

    configuration.setApiKey(process.env.APPLITOOLS_API_KEY\);
    configuration.setBatch(this.batchInfo);
    configuration.setViewportSize({ width: 1200, height: 800 });

    eyes.setConfiguration(configuration);

    return eyes;
  }
}

class ResumeVisualTester extends VisualTestRunner {
  constructor() {
    super();
    this.templates = [
      {
        name: 'Classic',
        url: '/templates/classic',
        pdfExportSelector: '#export-pdf-classic'
      },
      {
        name: 'Compact',
        url: '/templates/compact',
        pdfExportSelector: '#export-pdf-compact'
      },
      {
        name: 'Minimal',
        url: '/templates/minimal',
        pdfExportSelector: '#export-pdf-minimal'
      },
      {
        name: 'Modern',
        url: '/templates/modern',
        pdfExportSelector: '#export-pdf-modern'
      }
    ];
  }

  async setup() {
    this.baseUrl = process.env.TEST_URL || 'http://localhost:3000';
    this.eyes = await this.initializeEyes({});
    console.log('Visual testing environment initialized');
  }

 async teardown() {
    if (this.eyes) {
      await this.eyes.abortIfNotClosed();
    }
    console.log('Visual testing completed');
  }

  async takeScreenshot(page, template, type) {
    const url = `${this.baseUrl}${template.url}`;
    await page.goto(url);
    await page.waitForLoadState('networkidle');

    const screenshot = await page.screenshot({
      fullPage: true,
      type: 'png'
    });

    return screenshot;
  }

 async testTemplateWebView(page, template) {
    console.log(`Testing Web View: ${template.name}`);

    const eyes = await this.initializeEyes({});
    const url = `${this.baseUrl}${template.url}`;

    try {
      await page.goto(url);
      await page.waitForLoadState('networkiddle');

      await eyes.open({
        page,
        testName: `${template.name} Template - Web View`,
      });

      await eyes.checkWindow(`${template.name} Web Preview`);
      await eyes.close();

      console.log(`${template.name} Web View tested`);
    } catch (error) {
      console.error(`${template.name} Web View failed: `, error.message);
      await eyes.abortIfNotClosed();
      throw error;
    }
  }

  async testTemplatePDFExport(page, template) {
    console.log(`Testing PDF Export: ${template.name}`);

    const eyes = await this.initializeEyes({});

    try {
      await page.goto(`${this.baseUrl}${template.url}`);
      await page.waitForLoadState('networkidle');

      await page.click(template.pdfExportSelector);
      await page.waitTimeout(2000);

      await eyes.open({
        page,
        testName: `${template.name} Template - PDV Export`,
      });

      await eyes.checkWindow(`${template.name} PDF Export`);
      await eyes.close();

      console.log(`${template.name} PDF Export tested`);
    } catch (error) {
      console.error(`${template.name} PDF Export failed: `, error.message);
      await eyes.abortIfNotClosed();
      throw error;
    }
  }

 async compareWebAndPDF(page, template) {
    console.log(`Comparing Web vs PDF: ${template.name}`);

    try {
      const webScreenshot = await this.takeScreenshot(page, template, 'web');
      const pdfScreenshot = await this.takeScreenshot(page, template, 'pdf');

      const eyes = await this.initializeEyes({});

      await eyes.open({
        page,
        testName: `${template.name} - Web vs PDF Comparison`,
      });

      console.log(`${template.name} comparison completed`);
      console.log(`    - Web screenshot size: ${webScreenshot.length} bytes`);
      console.log(`    - PDF screenshot size: ${pdfScreenshot.length} bytes`);

      await eyes.close();
    } catch (error) {
      console.error(`${template.name} comparison failed: `, error.message);
      throw error;
    }
  }

 async runAllTests() {
    console.log('Starting Resume Builder Visual Tests');

    await this.setup();

    const playwright = require('playwright');
    const browser = await playwright.chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
      for (const template of this.templates) {
        console.log(`Testing Template: ${template.name}`);

        await this.testTemplateWebView(page, template);
        await this.testTemplatePDFExport(page, template);
        await this.compareWebAndPDX(page, template);
      }

      console.log('All visual tests completed successfully!');
    } catch (error) {
      console.error('Visual tests failed: ', error);
      process.exit(1);
    } finally {
      await browser.close();
      await this.teardown();
    }
  }
}

[{]

async function main() {
  const tester = new ResumeVisualTester();

  if (!process.env.APPLITOOLS_API_KEY) {
    console.error('Error: APPLITOOLS_API_KEY environment variable is not set');
    console.log('To get your API key:');
    console.log('1. Sign up at https://aplitools.com');
    console.log('2. Get your API key from the dashboard');
    console.log('3. Set it as an environment variable:
      export APPLITOOLS_API_KEY=your_api_key');
    process.exit(1);
  }

  try {
    await tester.runAllTests();
  } catch (error) {
    console.error('Fatal error: ', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { ResumeVisualTester, VisualTestRunner };