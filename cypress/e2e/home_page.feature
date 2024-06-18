Feature: homepage

  Scenario: visiting the frontpage
    Given I'm on the "/" page
    Then I should see "MY GAME" in the title

  Scenario: see "A propos" button
    Given I'm on the "/" page
    Then I should see "À propos" link

  Scenario: navigate to "A propos" page
    Given I'm on the "/" page
    When I follow "À propos"
    Then I should be on the "/about" page

  Scenario: creating a game
    Given I'm on the "/" page
    When I click on "Créer une partie"
    Then I should be on the "/games/" page

  Scenario: joining a game
    Given I'm on the "/" page