Business Analyst Instructions
Design a layout where the header and footer remain fixed while the main content scrolls.


Gherkin Scenarios
Feature: Persistent layout
  Scenario: Sticky header and footer
    Given I am on the front page
    When I scroll
    Then the header and footer remain visible
    And the content scrolls independently

Acceptance Criteria
•	Header and footer must be visible at all times.
•	Body scrolls independently without affecting layout structure.

Step-by-Step Implementation Guidance
1.	Define CSS for sticky layout using `position: sticky` or `position: fixed`.
2.	Ensure body content uses `overflow-y: auto` with proper height constraints.
