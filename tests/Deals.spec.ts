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
    await expect(page.getByRole('img', { name: 'Offer Icon' })).toBeVisible();
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
test('DL-06 | Add a deal to order - Terms & Conditions', async ({page}) => {
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
  await expect(page.locator('body')).toMatchAriaSnapshot(`
    - link "":
      - /url: "#"
    - text: /Choose your Size The following sizes are available with Original Large \\d+\\.\\d+" \\/ \\d+ Slices £\\d+\\.\\d+/
    - img "size"
    - img "selected"
    `);
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
    await page.waitForLoadState('networkidle');
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
test('DL-09 | Deal creator - One item', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UX');
  await allure.story('Item list opens automatically');
  await allure.severity(Severity.NORMAL);
  await allure.description("If deal contains only one item, item picker layer shows up immediately after entering deal creator");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Any 465ml Ben & Jerry’s' }).click();
  });
  await allure.step('Verify if items list is opened', async () => {
    await expect(page.locator('[id="830"]').getByRole('link', { name: 'ADD TO OFFER' })).toBeVisible({timeout: 10000});
  })
})
test('DL-10 | Deal creator - Slot editing', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UX');
  await allure.story('Slot editing');
  await allure.severity(Severity.NORMAL);
  await allure.description("Tapping on a swap icon should open the configurator menu for that product, instead of opening the menu");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 1 £40.37 £19.99  icon 1x Large Pizza icon 1x' }).click();
  });  
  await allure.step('Choose item to slot edit', async () => {
    await page.getByRole('heading', { name: 'Select Large Pizza' }).click();
    await page.locator('[id="76"]').getByRole('link', { name: 'ADD TO OFFER' }).click();
    await page.getByRole('button', { name: 'No, thanks' }).click();
  });
  await allure.step('Click slot edit button', async () => {
    await page.getByRole('button').filter({ hasText: /^$/ }).click();
  });
  await allure.step('Choose different item', async () => {
    await page.locator('[id="9999"]').click();
    await page.getByRole('button', { name: 'Add to Offer' }).click();
  });
  await allure.step('Verify if the item has changed', async () => {
    await expect(page.getByRole('heading', { name: 'Create Your Own', level: 3 })).toBeVisible();
  });
})
test('DL-11 | Deal creator - Stuffed crust - Accept', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UX');
  await allure.story('Stuffed Crust');
  await allure.severity(Severity.NORMAL);
  await allure.description("Tapping on a swap icon should open the configurator menu for that product, instead of opening the menu");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 1 £40.37 £19.99  icon 1x Large Pizza icon 1x' }).click();
  });  
  await allure.step('Choose pizza', async () => {
    await page.getByRole('heading', { name: 'Select Large Pizza' }).click();
    await page.locator('[id="76"]').getByRole('link', { name: 'ADD TO OFFER' }).click();
  });
  await allure.step('Add Stuffed Crust', async () => {
    await page.getByRole('button', { name: 'Yes, please!' }).click();
  });
  await allure.step('Verify if the stuffed crust has been added', async () => {
    await expect(page.getByText('Large Cheddar Stuffed Crust')).toBeVisible();
  });
})
test('DL-12 | Deal creator - Stuffed crust - Cancel', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UX');
  await allure.story('Stuffed Crust');
  await allure.severity(Severity.NORMAL);
  await allure.description("User is able to not add Stuffed Crust to the pizza when pop up appears");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 1 £40.37 £19.99  icon 1x Large Pizza icon 1x' }).click();
  });  
  await allure.step('Choose pizza', async () => {
    await page.getByRole('heading', { name: 'Select Large Pizza' }).click();
    await page.locator('[id="76"]').getByRole('link', { name: 'ADD TO OFFER' }).click();
  });
  await allure.step('Cancel Stuffed Crust', async () => {
    await page.getByRole('button', { name: 'No, thanks' }).click();
  });
  await allure.step('Verify if the stuffed crust has been added', async () => {
    await expect(page.getByText('Large Cheddar Stuffed Crust')).not.toBeVisible();
  });
})
test('DL-13 | Deal creator - Stuffed crust - Appeareance after accepting', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UX');
  await allure.story('Stuffed Crust');
  await allure.severity(Severity.NORMAL);
  await allure.description("If user added Stuffed Crust to the pizza using a pop up, they will see the pop up again when adding another pizza to the deal");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 2 £65.36 £29.99  icon 2x Large Pizzas icon 1x' }).click();
  });  
  await allure.step('Choose first pizza', async () => {
    await page.locator('#element_0').getByRole('heading', { name: 'Select Large Pizza' }).click();
    await page.locator('[id="76"]').getByRole('link', { name: 'ADD TO OFFER' }).click();
  });
  await allure.step('Add Stuffed Crust to first pizza', async () => {
    await page.getByRole('button', { name: 'Yes, please!' }).click();
  });
  await allure.step('Choose second pizza', async () => {
    await page.getByRole('heading', { name: 'Select Large Pizza' }).click();
    await page.getByRole('link', { name: 'ADD TO OFFER' }).nth(1).click();
  });
    await allure.step('Add Stuffed Crust to second pizza', async () => {
    await page.getByRole('button', { name: 'Yes, please!' }).click();
  });
  await allure.step('Verify if the stuffed crust has been added on second pizza', async () => {
    await expect(page.locator('#element_1').getByText('Large Cheddar Stuffed Crust')).toBeVisible;
  });
})
test('DL-14 | Deal creator - Stuffed crust - Appeareance after cancelling', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UX');
  await allure.story('Stuffed Crust');
  await allure.severity(Severity.NORMAL);
  await allure.description("If user added Stuffed Crust to the pizza using a pop up, they will not  see the pop up again when adding another pizza to the deal");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 2 £65.36 £29.99  icon 2x Large Pizzas icon 1x' }).click();
  });  
  await allure.step('Choose first pizza', async () => {
    await page.locator('#element_0').getByRole('heading', { name: 'Select Large Pizza' }).click();
    await page.locator('[id="76"]').getByRole('link', { name: 'ADD TO OFFER' }).click();
  });
  await allure.step('Cancel Stuffed Crust for first pizza', async () => {
    await page.getByRole('button', { name: 'Yes, please!' }).click();
  });
  await allure.step('Choose second pizza', async () => {
    await page.getByRole('heading', { name: 'Select Large Pizza' }).click();
    await page.getByRole('link', { name: 'ADD TO OFFER' }).nth(1).click();
  });
  await allure.step('Verify if the stuffed crust has been added on second pizza', async () => {
    await expect(page.locator('#element_1').getByText('Large Cheddar Stuffed Crust')).not.toBeVisible;
  });
})
test('DL-15-1 | Deal creator - Calories toggle (Default)', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UI');
  await allure.story('Calories toggle');
  await allure.severity(Severity.NORMAL);
  await allure.description("User is able to use toggle to display calories info: Calories toggle turned on, calories displayed");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 2 £65.36 £29.99  icon 2x Large Pizzas icon 1x' }).click();
  });  
  await allure.step('Open pizza list', async () => {
    await page.locator('#element_0').getByRole('heading', { name: 'Select Large Pizza' }).click();
  });
  await allure.step('Verify if the calories are displayed by default', async () => {
    await expect(page.locator('#element_0').getByText('slices / 229Kcal per slice')).toBeVisible();
  });
})
test('DL-15-2 | Deal creator - Calories toggle (Switch)', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UI');
  await allure.story('Calories toggle');
  await allure.severity(Severity.NORMAL);
  await allure.description("User is able to use toggle to display calories info: Calories toggle turned off, calories not displayed");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 2 £65.36 £29.99  icon 2x Large Pizzas icon 1x' }).click();
  });  
  await allure.step('Open pizza list', async () => {
    await page.locator('#element_0').getByRole('heading', { name: 'Select Large Pizza' }).click();
  });
    await allure.step('Switch calories toggle to off', async () => {
    await page.getByText('Calories On Off').nth(1).click();
  });
  await allure.step('Verify if the calories has been hidden', async () => {
    await expect(page.locator('#element_0').getByText('slices / 229Kcal per slice')).not.toBeVisible();
  });
})
test('DL-15-3 | Deal creator - Calories toggle (Switch back)', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UI');
  await allure.story('Calories toggle');
  await allure.severity(Severity.NORMAL);
  await allure.description("User is able to use toggle to display calories info: Calories toggle turned on, calories displayed again");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 2 £65.36 £29.99  icon 2x Large Pizzas icon 1x' }).click();
  });  
  await allure.step('Open pizza list', async () => {
    await page.locator('#element_0').getByRole('heading', { name: 'Select Large Pizza' }).click();
  });
    await allure.step('Switch calories toggle to off', async () => {
    await page.getByText('Calories On Off').nth(1).click();
    await page.getByText('Calories On Off').nth(1).click();
  });
  await allure.step('Verify if the calories has been hidden', async () => {
    await expect(page.locator('#element_0').getByText('slices / 229Kcal per slice')).toBeVisible();
  });
})
test('DL-16 | Deal creator - Filters', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UX');
  await allure.story('Filters');
  await allure.severity(Severity.NORMAL);
  await allure.description("User is able to use buttons to filter item list");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 2 £65.36 £29.99  icon 2x Large Pizzas icon 1x' }).click();
  });  
  await allure.step('Open pizza list', async () => {
    await page.locator('#element_0').getByRole('heading', { name: 'Select Large Pizza' }).click();
  });
    await allure.step('Click spicy filter', async () => {
    await page.locator('label').filter({ hasText: 'Spicy' }).nth(1).click();
  });
  await allure.step('Verify if only the spicy items are displayed', async () => {
    await expect(page.locator('label').filter({ hasText: 'Spicy' }).nth(1)).toBeVisible();
  });
})
test('DL-17 | Deal creator - Filters - Conditional displayment', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UX');
  await allure.story('Filters');
  await allure.severity(Severity.NORMAL);
  await allure.description("User is able to see only the filters that are relevant for specific category of items");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 2 £65.36 £29.99  icon 2x Large Pizzas icon 1x' }).click();
  });  
  await allure.step('Open desserts list', async () => {
    await page.getByRole('heading', { name: 'Select Dessert' }).click();
  });
    await allure.step('Verify if spicy filter is not available', async () => {
    await expect(page.locator('label').filter({ hasText: 'Spicy' }).nth(1)).not.toBeVisible();
  });
})
test('DL-18 | Deal creator - Filters - Multiple choice', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UX');
  await allure.story('Filters');
  await allure.severity(Severity.NORMAL);
  await allure.description("User is able to choose multiple filters at once");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 2 £65.36 £29.99  icon 2x Large Pizzas icon 1x' }).click();
  });  
  await allure.step('Open pizza list', async () => {
    await page.locator('#element_0').getByRole('heading', { name: 'Select Large Pizza' }).click();
  });
    await allure.step('Click multiple filters: Spicy, Vegetarian', async () => {
    await page.locator('label').filter({ hasText: 'Spicy' }).nth(1).click();
    await page.locator('label').nth(5).click();
  });
  await allure.step('Verify if both categories are displayed', async () => {
    await expect(page.locator('label').filter({ hasText: 'Spicy' }).nth(1)).toBeVisible();
    await expect(page.getByRole('img', { name: 'vegetarian product' }).first()).toBeVisible();
  });
})
test('DL-19-1 | Deal creator - Filters - Carrying over to other lists (Filter available)', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UX');
  await allure.story('Filters');
  await allure.severity(Severity.NORMAL);
  await allure.description("If user chose a filter, it's carried over to any other list of items relevant for chosen deal: List is filtered");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 2 £65.36 £29.99  icon 2x Large Pizzas icon 1x' }).click();
  });  
 await allure.step('Open first pizza list', async () => {
    await page.locator('#element_0').getByRole('heading', { name: 'Select Large Pizza' }).click();
  });
  await allure.step('Click Vegetarian filter', async () => {
    await page.locator('label').nth(5).click();
  });
  await allure.step('Choose pizza', async () => {
    await page.getByRole('link', { name: 'ADD TO OFFER' }).first().click();
    await page.getByRole('button', { name: 'No, thanks' }).click();
  });
  await allure.step('Open second pizza list', async () => {
    await page.getByRole('heading', { name: 'Select Large Pizza' }).click();
  });
  await allure.step('Verify if filter has been carried over', async () => {
    await expect(page.getByRole('heading', { name: 'Double Pepperoni' })).not.toBeVisible
  });
})
test('DL-19-2 | Deal creator - Filters - Carrying over to other lists (Filter not available)', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UX');
  await allure.story('Filters');
  await allure.severity(Severity.NORMAL);
  await allure.description("If user chose a filter, it's carried over to any other list of items relevant for chosen deal: Information is displayed");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 2 £65.36 £29.99  icon 2x Large Pizzas icon 1x' }).click();
  });  
 await allure.step('Open first pizza list', async () => {
    await page.locator('#element_0').getByRole('heading', { name: 'Select Large Pizza' }).click();
  });
  await allure.step('Click Spicy filter', async () => {
    await page.locator('label').filter({ hasText: 'Spicy' }).nth(1).click();
  });
  await allure.step('Choose pizza', async () => {
    await page.getByRole('link', { name: 'ADD TO OFFER' }).first().click();
    await page.getByRole('button', { name: 'No, thanks' }).click();
  });
  await allure.step('Open desserts list', async () => {
    await page.getByRole('heading', { name: 'Select Large Pizza' }).click();
  });
  await allure.step('Verify if relevant information has been displayed', async () => {
    await expect(page.getByText('Spicy filter not applied to')).toBeVisible
  });
})
test('DL-20 DL-21 | Deal creator - Allergen Manager + Deal creator - Allergen Manager - Info banner', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UX');
  await allure.story('Allergen Manager');
  await allure.severity(Severity.NORMAL);
  await allure.description("User is able to choose allergens + User is able to see which items contains selected allergens");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 2 £65.36 £29.99  icon 2x Large Pizzas icon 1x' }).click();
  });  
 await allure.step('Open first pizza list', async () => {
    await page.locator('#element_0').getByRole('heading', { name: 'Select Large Pizza' }).click();
  });
  await allure.step('Open Allergen Manager', async () => {
    await page.getByRole('link', { name: ' Select Allergens' }).click();
  });
    await allure.step('Choose allergens', async () => {
    await page.getByText('Gluten', { exact: true }).click();
    await page.getByRole('link', { name: 'APPLY' }).click();
  });
  await allure.step('Verify if relevant information has been displayed', async () => {
    await expect(page.locator('[id="682"] > .allergenWarning').first()).toBeVisible
  });
})
test('DL-22 | Deal creator - Allergen Manager - Clear option', async ({page}) => {
  await allure.epic('Deals');
  await allure.feature('UX');
  await allure.story('Allergen Manager');
  await allure.severity(Severity.NORMAL);
  await allure.description("User is able to clear all of the selected allergens in Allergen Manager");
  await allure.owner('QA Team');
  await allure.tag('smoke');

  await allure.step('Choose a deal', async () => {
    await page.getByRole('button', { name: 'badge Priority from O2 Bundle 2 £65.36 £29.99  icon 2x Large Pizzas icon 1x' }).click();
  });  
 await allure.step('Open first pizza list', async () => {
    await page.locator('#element_0').getByRole('heading', { name: 'Select Large Pizza' }).click();
  });
  await allure.step('Open Allergen Manager', async () => {
    await page.getByRole('link', { name: ' Select Allergens' }).click();
  });
  await allure.step('Choose allergens', async () => {
    await page.getByText('Celery').click();
    await page.getByText('Gluten', { exact: true }).click();
    await page.getByText('Sesame Seeds').click();
    await page.getByText('Mustard', { exact: true }).click();
  });
  await allure.step('Click Clear button', async () => {
    await page.getByRole('link', { name: 'CLEAR' }).click();
  })
  await allure.step('Verify if allergens have been cleared and info banner disappeared', async () => {
    await expect(page.locator('[id="682"] > .allergenWarning').first()).toBeVisible
  });
})
})