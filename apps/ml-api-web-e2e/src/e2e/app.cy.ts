enum NLPLabel {
  HateBullying = "hate_bullying",
  Clean = "clean",
  Porn = "porn",
  Proxy = "proxy",
  SelfHarm = "self_harm",
  Weapons = "weapons"
}

describe('Hate route', () => {
  beforeEach(() => cy.visit('/'));

  it('Hate route works', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.contains("Toxic").click()
    cy.url().should("include", "hate")
  });

  // it('Hate model does not flag', () => {
  //   cy.visit("/hate")
  //   cy.get("#message").type("I am happy")
  //   cy.get("#message").type("{enter}")
  //   cy.contains("Not flagged").should("exist")
  // })

  it('Hate model flagges hate bullying', () => {
    cy.visit("/hate")
    cy.get("#message").type("Mike is annoying and is an asshole")
    cy.get("#message").type("{enter}")
    cy.get(".tooltip").should("exist")
  })
});

describe('Intent Classification Route', () => {
  beforeEach(() => cy.visit('/'));

  it('Intent route works', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.contains("Classification").click()
    cy.url().should("include", "intent")
  });

  it('Intent model does not flag', () => {
    cy.visit("/classify-intent")
    cy.get("#message").type("I am happy")
    cy.get("#message").type("{enter}")
    cy.contains(".red-underline").should("not.exist")
  })

  it('Classifies Hate Bullying', () => {
    cy.visit("/classify-intent")
    cy.get("#message").type("you are an asshole.")
    cy.get("#message").type("{enter}")
    cy.get(".red-underline").should("exist")
    cy.get(".red-underline").should("have.text", NLPLabel.HateBullying)
  })

  it('Classifies Adult', () => {
    cy.visit("/classify-intent")
    cy.get("#message").type("find adult sex links videos")
    cy.get("#message").type("{enter}")
    cy.get(".red-underline").should("exist")
    cy.get(".red-underline").should("have.text", NLPLabel.Porn)
  })

  it('Classifies Weapons', () => {
    cy.visit("/classify-intent")
    cy.get("#message").type("The Most Trusted Place To Buy Guns :: Guns.com")
    cy.get("#message").type("{enter}")
    cy.get(".red-underline").should("exist")
    cy.get(".red-underline").should("have.text", NLPLabel.Weapons)
  })

  it('Classifies Self-harm', () => {
    cy.visit("/classify-intent")
    cy.get("#message").type("Cutting and Self-Harm")
    cy.get("#message").type("{enter}")
    cy.get(".red-underline").should("exist")
    cy.get(".red-underline").should("have.text", NLPLabel.SelfHarm)
  })
});
