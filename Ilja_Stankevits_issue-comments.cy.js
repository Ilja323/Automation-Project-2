describe("Issue comments creating, editing and deleting", () => {
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

  const comment = "TEST_COMMENT";
  const editcomment = "TEST_COMMENT_EDITED";
  const previousComment = "An old silent pond...";

  function SaveAndCancelButtonsShouldBeVisible() {
    cy.contains("button", "Save").should("be.visible");
    cy.contains("button", "Cancel").should("be.visible");
  }

  function EditAndDeleteButtonsShouldBeVisible() {
    cy.contains("div", "Edit").should("be.visible");
    cy.contains("div", "Delete").should("be.visible");
  }

  it("MY NEW TEST: that combines the existing tests for adding, updating, and deleting functions.", () => {
    //Assert the visibility of the issue detail view modal.
    getIssueDetailsModal().should("be.visible");
    getIssueDetailsModal().within(() => {
      //Assert the visibility of the "Add comment" modal.
      cy.contains("Add a comment...").scrollIntoView().should("be.visible");

      //Assert that the "Save" and "Cancel" buttons are visable.
      cy.contains("Add a comment...").click();
      SaveAndCancelButtonsShouldBeVisible();

      //Add a comment.
      cy.get('textarea[placeholder="Add a comment..."]').type(comment);
      cy.contains("button", "Save").click().should("not.exist");

      //Assert that the comment has been added and is visible.
      cy.contains(comment).should("be.visible");

      //Assert that the quantity of contents have changed.
      cy.contains(comment).should("be.visible");
      cy.contains(previousComment).should("be.visible");

      //Assert that the "Edit" and "Delete" buttons are visable and edit the added comment.
      cy.get('[data-testid="issue-comment"]').first().contains("Edit").click();
      EditAndDeleteButtonsShouldBeVisible();
      cy.get('textarea[placeholder="Add a comment..."]')
        .clear()
        .type(editcomment);

      //Assert that the "Save" and "Cancel" buttons are visable and click on "Save" button.
      SaveAndCancelButtonsShouldBeVisible();
      cy.contains("button", "Save").click();

      //Assert that the updated comment is visible.
      cy.contains(editcomment).should("be.visible");

      //Remove the comment.
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Delete")
        .click();
    });
    cy.get('[data-testid="modal:confirm"]').should("be.visible");
    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains("Are you sure you want to delete this comment?").should(
        "be.visible"
      );
      cy.contains("button", "Delete comment").click().should("not.exist");

      //Assert that the comment is removed.
      cy.reload();
      cy.contains(editcomment).should("not.exist");
    });

    //Assert that the quantity of contents have changed.
    cy.get('[data-testid="issue-comment"]').first().contains(previousComment);
  });
});
