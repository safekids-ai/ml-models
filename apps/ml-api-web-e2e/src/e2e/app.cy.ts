describe('ml-api-web-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('Hate route works', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.contains("Hate").click()
    cy.url().should("include", "hate")
  });

  it('Hate model does not flag', () => {
    cy.visit("/hate")
    cy.get("#message").type("I am happy")
    cy.get("#message").type("{enter}")
    cy.contains("Not flagged").should("exist")
  })

  it('Hate model flagges', () => {
    cy.visit("/hate")
    cy.get("#message").type("Mike is annoying and is an asshole")
    cy.get("#message").type("{enter}")
    cy.get(".tooltip").should("exist")
  })
});
