Feature: shoppingCar

  Scenario: calculate apple price
    Given the item "apple"
    And the numbers "4"
    When the calculator is run
    Then the output should be "200"

  Scenario: calculate orange price
    Given the item "orange"
    And the numbers "3"
    When the calculator is run
    Then the output should be "120"