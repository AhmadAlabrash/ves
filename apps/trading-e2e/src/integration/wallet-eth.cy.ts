import { connectEthereumWallet } from '../support/ethereum-wallet';

const connectEthWalletBtn = 'connect-eth-wallet-btn';

describe('ethereum wallet', { tags: '@smoke', testIsolation: true }, () => {
  beforeEach(() => {
    cy.mockWeb3Provider();
    // Using portfolio withdrawals tab is it requires Ethereum wallet connection
    cy.mockTradingPage();
    cy.mockSubscription();
    cy.setVegaWallet();
    cy.visit('/#/portfolio');
    cy.get('[data-testid="pathname-/portfolio"]').should('exist');
    cy.getByTestId('Withdrawals').click();
  });

  it('can connect', () => {
    // 0004-EWAL-001

    cy.getByTestId('Deposits').click();
    cy.getByTestId('deposit-button').click();
    cy.getByTestId('connect-eth-wallet-btn').click();
    cy.getByTestId('web3-connector-list').should('exist');
    cy.getByTestId('web3-connector-MetaMask').click();
    cy.getByTestId('web3-connector-list').should('not.exist');
    cy.getByTestId('tab-deposits').should('not.be.empty');
  });

  it('able to disconnect eth wallet', () => {
    // 0004-EWAL-004
    // 0004-EWAL-005
    // 0004-EWAL-006

    cy.getByTestId('Deposits').click();
    cy.getByTestId('deposit-button').click();
    connectEthereumWallet('MetaMask');
    cy.getByTestId('ethereum-address').should('have.text', '0xEe7D…d94F');
    cy.getByTestId('disconnect-ethereum-wallet')
      .should('have.text', 'Disconnect')
      .click();
    cy.getByTestId(connectEthWalletBtn).should('exist');
  });
});
