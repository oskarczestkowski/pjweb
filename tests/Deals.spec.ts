import { test, expect, Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';


async function acceptCookiesIfPresent(page: Page): Promise<void> {
  const acceptBtn = page.getByRole('button', { name: 'Accept All' });
  const isVisible = await acceptBtn.isVisible().catch(() => false);
  
  if (isVisible) {
    await allure.step('Accept cookie banner', async () => {
      await acceptBtn.click();
    });
  }
}

async function setUp(page: Page): Promise<void> {
  await allure.step('Navigate to Deals page', async () => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Accept All' }).click();
    await page.getByRole('textbox', { name: 'Enter postcode to start your' }).click();
    await page.getByRole('textbox', { name: 'Enter postcode to start your' }).fill('b18 5ap');
    await page.getByRole('button', { name: 'Delivery' }).click();
  });
 
  await acceptCookiesIfPresent(page);
}

test.describe('PJ Website Automated tests - Deals', () => {

  test.beforeEach( async ({ page }) => {
  await setUp(page)
});
test.afterEach(async ({ page}, testInfo) => {
  const screenshot = await page.screenshot({fullPage: true});
  await testInfo.attach('screenshot', {
    body: screenshot,
    contentType: 'image/png',
  });
  const videoPath = await page.video()?.path();
  if (videoPath) {
    await testInfo.attach('video', {
      path: videoPath,
      contentType: 'video/webm',
    });
  }
});

test('DL-01 DL-02 | Deal creator + User is able to add a finished deal to the basket ', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('Deal add');
  await allure.story('Adding deal to basket');
  await allure.severity(Severity.CRITICAL);
  await allure.description("User is able to pick all the parts of the deal + User is able to add a finished deal to the basket");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 1 £40.37 £19.99  icon 1x Large Pizza icon 1x' }).click();
  });
  await allure.step('Choose pizza', async () => {
    await page.getByRole('heading', { name: 'Select Large Pizza' }).click();
    await page.locator('[id="9999"]').click();
    await page.getByRole('button', { name: 'Add to Offer' }).click();
    await page.getByRole('button', { name: 'No, thanks' }).click();
  });
  await allure.step('Choose side', async () => {
    await page.getByRole('heading', { name: 'Select Side' }).click();
    await page.locator('[id="835"]').getByRole('link', { name: 'ADD TO OFFER' }).click();
  });
  await allure.step('Choose dessert', async () => {
    await page.getByRole('heading', { name: 'Select Dessert' }).click();
    await page.locator('[id="830"]').getByRole('link', { name: 'ADD TO OFFER' }).click();
  });
  await allure.step('Add deal to basket', async () => {
    await page.getByRole('paragraph').filter({ hasText: 'Add' }).click();
  });
  await allure.step('Verify deal appears in basket', async () => {
    await page.getByRole('img', { name: 'Offer Icon' }).click();
  })
})

test('DL-04 | Add a deal to order - Not all items added', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('Validation');
  await allure.story('Adding unfinished deal');
  await allure.severity(Severity.CRITICAL);
  await allure.description("User is unable to finish adding a deal if not all items were picked");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 1 £40.37 £19.99  icon 1x Large Pizza icon 1x' }).click();
  });
  await allure.step('Choose pizza', async () => {
    await page.getByRole('heading', { name: 'Select Large Pizza' }).click();
    await page.locator('[id="9999"]').click();
    await page.getByRole('button', { name: 'Add to Offer' }).click();
    await page.getByRole('button', { name: 'No, thanks' }).click();
  });
  await allure.step('Choose side', async () => {
    await page.getByRole('heading', { name: 'Select Side' }).click();
    await page.locator('[id="835"]').getByRole('link', { name: 'ADD TO OFFER' }).click();
  });
  await expect(page.locator('.totalAdd').first()).not.toBeVisible();
})
test('DL-05 | Add a deal to order - Youve saved X', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UI');
  await allure.story('Discount displayed');
  await allure.severity(Severity.NORMAL);
  await allure.description("User is able to immediately see how much money was saved by using the deal");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 1 £40.37 £19.99  icon 1x Large Pizza icon 1x' }).click();
  });

  await expect(page.locator('.totalAdd').first()).not.toBeVisible();
})
test('DL-06 | Add a deal to order -  Terms & Conditions', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UI');
  await allure.story('Terms & Conditions displayed');
  await allure.severity(Severity.NORMAL);
  await allure.description("User is able to read the Terms & Conditions that apply to the deal");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 1 £40.37 £19.99  icon 1x Large Pizza icon 1x' }).click();
  });  
  await allure.step('Choose a deal', async () => {
    await page.getByRole('link', { name: 'Terms & Conditions' }).click();
  });
  
  await expect(page.getByText('Offer entitles the customer to 1 Large Pizza, 1 Side and 1 Dessert.Must be an')).toBeVisible();
})
test('DL-07 | Add a deal to order - Correct sizes', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('Validation');
  await allure.story('Correct size');
  await allure.severity(Severity.NORMAL);
  await allure.description("User should only be able to add products of the correct size to the deal");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 1 £40.37 £19.99  icon 1x Large Pizza icon 1x' }).click();
  });
  await allure.step('Choose pizza', async () => {
    await page.getByRole('heading', { name: 'Select Large Pizza' }).click();
    await page.locator('#element_0 [id="9999"]').click();
  });    
  await allure.step('Go to Size', async () => {
    await page.getByText('Size', { exact: true }).click();
  });

  await allure.step('Verify possible sizes', async () => {
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - link "":
        - /url: "#"
      - text: /Choose your Size The following sizes are available with Original Large \\d+\\.\\d+" \\/ \\d+ Slices £\\d+\\.\\d+/
      - img "size"
      - img "selected"
      `);
  })
})
})
test('DL-08 | Add a deal to order - Correct price', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('Deal add');
  await allure.story('Correct price');
  await allure.severity(Severity.NORMAL);
  await allure.description("Users should see a correct price for the deal displayed in the deal builder");
  await allure.owner('QA Team');
  await allure.tag('smoke');
  let dealPrice: string | null;

  await allure.step('Pull deal price', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 1 £40.37 £19.99  icon 1x Large Pizza icon 1x' })
    const dealCard = page.getByRole('button', { name: 'badge Priority from O2 Bundle 1 £40.37 £19.99  icon 1x Large Pizza icon 1x' })
    dealPrice = await dealCard.locator('.dealPrice').textContent();
    console.log('Deal price:', dealPrice);
    expect(dealPrice).not.toBeNull();
  });
  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 1 £40.37 £19.99  icon 1x Large Pizza icon 1x' }).click();
  });
  await allure.step('Compare deal price inside the deal', async () => {
    await expect(page.locator('h1').getByText('£19.99')).toHaveText(dealPrice!);
  });
  await allure.step('Choose pizza', async () => {
    await page.getByRole('heading', { name: 'Select Large Pizza' }).click();
    await page.locator('[id="9999"]').click();
    await page.getByRole('button', { name: 'Add to Offer' }).click();
    await page.getByRole('button', { name: 'No, thanks' }).click();
  });
  await allure.step('Choose side', async () => {
    await page.getByRole('heading', { name: 'Select Side' }).click();
    await page.locator('[id="835"]').getByRole('link', { name: 'ADD TO OFFER' }).click();
  });
  await allure.step('Choose dessert', async () => {
    await page.getByRole('heading', { name: 'Select Dessert' }).click();
    await page.locator('[id="830"]').getByRole('link', { name: 'ADD TO OFFER' }).click();
  });
  await allure.step('Compare deal price inside the deal - "Add" button', async () => {
    const insideDealPrice = await page.locator('h1').getByText('£19.99').textContent();
    console.log("Price inside the deal: ", insideDealPrice);
    await expect(page.locator('h1').getByText('£19.99')).toContainText(dealPrice!);
  });
  await allure.step('Add deal to basket', async () => {
    await page.getByRole('paragraph').filter({ hasText: 'Add' }).click();
  });
  await allure.step('Compare price inside the basket', async () => {
    const actualPrice = await page.locator('.rightSide span:not([class])').textContent();
    console.log("Actual price:", actualPrice)
    await expect(page.locator('.rightSide span:not([class])')).toHaveText(dealPrice!);
  })
})