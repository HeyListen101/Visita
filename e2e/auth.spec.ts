import { test, expect } from '@playwright/test';

test.describe('Authentication flows', () => {
  test('should navigate to sign-in page', async ({ page }) => {
    await page.goto('/');

    // --- UPDATED LOCATOR using aria-label ---
    // Since Button has asChild, the aria-label is applied to the Link (which becomes an <a> tag)
    // The role of an <a> tag with an href is 'link'.
    // If the aria-label was on a <button> element itself, you'd use getByRole('button', { name: 'sign-in' })
    await page.getByRole('link', { name: 'sign-in' }).click(); 
    // Note: 'name' in getByRole matches the accessible name, which aria-label provides.
    // It's case-sensitive by default, so ensure 'sign-in' matches your aria-label exactly.
    // Or use a regex: { name: /sign-in/i } if case might vary.

    await expect(page).toHaveURL('/sign-in');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/sign-in'); // This page contains the actual sign-in form
    await page.getByPlaceholder('Email').fill('invalid@example.com');
    await page.getByPlaceholder('Password').fill('wrongpassword');

    // This button is the SUBMIT button on the SIGN-IN PAGE FORM, not from the header AuthButton.
    // Its text is "Continue".
    const continueButton = page.getByRole('button', { name: 'Continue', exact: true }); 

    await expect(continueButton).toBeVisible({ timeout: 10000 });
    await expect(continueButton).toBeEnabled({ timeout: 10000 });

    await continueButton.click();
    
    // Ensure this regex matches the *actual error message string* from your server action
    const expectedErrorMessageRegex = /Invalid email or password/i; 
    // const expectedErrorMessageRegex = /Wrong credentials/i; // Or whatever it actually is

    // Assuming your ErrorDisplay component renders a root element with data-testid="error-display"
    // If not, adjust this locator.
    const errorDisplay = page.getByTestId('error-display'); 
    await expect(errorDisplay).toBeVisible({ timeout: 10000 });
    await expect(errorDisplay).toHaveText(expectedErrorMessageRegex);
  });

  // You might want to add a test for the sign-up navigation too
  test('should navigate to sign-up page', async ({ page }) => {
    await page.goto('/');
    // --- UPDATED LOCATOR using aria-label ---
    await page.getByRole('link', { name: 'sign-up' }).click();
    await expect(page).toHaveURL('/sign-up');
  });
});