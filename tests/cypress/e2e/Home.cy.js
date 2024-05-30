describe("Testing home", () => {
  before(() => {
    cy.visit("http://localhost:3000/Home");
    cy.wait(3000);
  });
  it("Testing home word", () => {
    cy.title().should("eq", "Home");
    cy.url().should("eq", "http://localhost:3000/Home");
    cy.get("#tweet_input").type("Hello All");
    cy.get("#tweet_btn").click();
  });
  it(" snapshots ", () => {
    cy.screenshot({
      overwrite: true,
    });
    cy.matchImageSnapshot("");
  });
});
