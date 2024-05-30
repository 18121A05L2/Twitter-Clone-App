describe("empty spec", () => {

  it("title should be DAZN", () => {
    cy.visit("https://www.dazn.com/en-IT/welcome");
    console.log(cy.title())
    cy.title().should("eq", "DAZN");
  });
  
});
