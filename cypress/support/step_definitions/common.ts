import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Given("I'm on the {string} page", (url: string) => {
    cy.visit(url);
});

When('I follow {string}', function (text: string) {
    cy.get('a').contains(text).click();
});

When('I click on {string}', function (text: string) {
    cy.get('button').contains(text).click();
});

Then('I should see {string} in the title', function (value: string) {
    cy.get('.chakra-heading').should('have.text', value);
});

Then(/^I should see "([^"]*)" button$/, function (text: string) {
    cy.get('button').contains(text).should('be.visible');
    cy.get('button').should('have.text', text);
});

Then(/^I should see "([^"]*)" link$/, function (text: string) {
    cy.get('a').contains(text).should('be.visible');
    cy.get('a').should('have.text', text);
});

Then(/^I should be on the "([^"]*)" page$/, function (url: string) {
    cy.url().should('include', url);
});
