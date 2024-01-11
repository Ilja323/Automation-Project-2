describe("Time tracking functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const getTimeTrackingModal = () => cy.get('[data-testid="modal:tracking"]');
  const getStopWatch = () => cy.get('[data-testid="icon:stopwatch"]');

  function TimeSpentAndRemaining() {
    cy.contains("Time spent (hours)");
    cy.get('[placeholder="Number"]').first().clear().type("5");
    cy.contains("Time remaining (hours)");
    cy.get('[placeholder="Number"]').last().clear().type("1");
    cy.contains("button", "Done").click().should("not.exist");
  }
  function VisabilityOfAddedTime() {
    cy.contains("div", "5h logged").should("be.visible");
    cy.contains("div", "1h remaining").should("be.visible");
  }

  it("Should add, edit and delete estimation time", () => {
    //Adding estimation.
    getIssueDetailsModal().within(() => {
      cy.get('[placeholder="Number"]').click().clear().type("15");

      //Asserting that the estimation is added and visible.
      cy.contains("div", "15h estimated").should("be.visible");

      //Editing the estimation.
      cy.get('[placeholder="Number"]').click().clear().type("9");

      //Asserting that the updated value is visible.
      cy.contains("div", "9h estimated").should("be.visible");

      //Removing the estimation.
      cy.get('[placeholder="Number"]').click().clear();

      //Asserting that the value is removed.
      cy.contains("div", "9h estimated").should("not.exist");
    });
  });

  it("Should log, edit and delete logged time", () => {
    //Login time.
    getStopWatch().click();
    getTimeTrackingModal().within(() => {
      TimeSpentAndRemaining();
    });

    //Assert that the logged time is added and visible.
    getIssueDetailsModal().within(() => {
      VisabilityOfAddedTime();
    });

    //Editing the logged time.
    getStopWatch().click();
    getTimeTrackingModal().within(() => {
      cy.contains("Time spent (hours)");
      cy.get('[placeholder="Number"]').first().clear().type("6");
      cy.contains("Time remaining (hours)");
      cy.get('[placeholder="Number"]').last().clear().type("2");
      cy.contains("button", "Done").click().should("not.exist");
    });

    //Asserting that the new value is visible.
    getIssueDetailsModal().within(() => {
      cy.contains("div", "6h logged").should("be.visible");
      cy.contains("div", "2h remaining").should("be.visible");
    });

    //Removing the logged time.
    getStopWatch().click();
    getTimeTrackingModal().within(() => {
      cy.contains("Time spent (hours)");
      cy.get('[placeholder="Number"]').first().clear();
      cy.contains("Time remaining (hours)");
      cy.get('[placeholder="Number"]').last().clear();
      cy.contains("button", "Done").click().should("not.exist");
    });

    //Asserting that the value is removed.
    getIssueDetailsModal().within(() => {
      cy.contains("div", "No time logged").should("exist");
    });
  });
});
