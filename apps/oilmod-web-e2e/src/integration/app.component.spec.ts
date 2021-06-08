describe('oilmod-web', () => {
  beforeEach(() => cy.visit('/iframe.html?id=appcomponent--primary'));

  it('should render the component', () => {
    cy.get('oilmod-web-nx-root').should('exist');
  });
});
