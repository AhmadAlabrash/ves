import {
  aliasWalletConnectQuery,
  aliasWalletConnectWithUserError,
} from '../mock-rest';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      connectVegaWallet(isMobile?: boolean): void;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      setVegaWallet(): void;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      setOnBoardingViewed(): void;
    }
  }
}

export const mockConnectWallet = () => {
  cy.mockWallet((req) => {
    aliasWalletConnectQuery(req, Cypress.env('VEGA_WALLET_API_TOKEN'));
  });
};

export const mockConnectWalletWithUserError = () => {
  cy.mockWallet((req) => {
    aliasWalletConnectWithUserError(req, Cypress.env('VEGA_WALLET_API_TOKEN'));
  });
};

export function addVegaWalletConnect() {
  Cypress.Commands.add('connectVegaWallet', (isMobile) => {
    mockConnectWallet();
    cy.highlight(`Connecting Vega Wallet`);
    const connectVegaWalletButton = `[data-testid=connect-vega-wallet${
      isMobile ? '-mobile' : ''
    }]:visible`;

    cy.get(connectVegaWalletButton).then((btn) => {
      if (btn.length === 0) {
        cy.log('could not find the button, perhaps already connected');
        return;
      }
      cy.wrap(btn).click();
      cy.get('[data-testid=connectors-list]')
        .find('[data-testid="connector-jsonRpc"]')
        .click();
      cy.wait('@walletReq');
      cy.get('[data-testid=dialog-content]').should(
        'contain.text',
        'Successfully connected'
      );
      cy.getByTestId('dialog-close').click();
      cy.get('[data-testid=dialog-content]').should('not.exist');
    });
  });
}

const onboardingViewedState = { state: { dismissed: true }, version: 0 };

export function addSetVegaWallet() {
  Cypress.Commands.add('setVegaWallet', () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        'vega_onboarding',
        JSON.stringify(onboardingViewedState)
      );
      win.localStorage.setItem('vega_telemetry_approval', 'false');
      win.localStorage.setItem('vega_telemetry_viewed', 'true');
      win.localStorage.setItem(
        'vega_wallet_config',
        JSON.stringify({
          token: `VWT ${Cypress.env('VEGA_WALLET_API_TOKEN')}`,
          connector: 'jsonRpc',
          url: 'http://localhost:1789',
        })
      );
    });
  });
}

export function addSetOnBoardingViewed() {
  Cypress.Commands.add('setOnBoardingViewed', () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        'vega_onboarding',
        JSON.stringify(onboardingViewedState)
      );
      win.localStorage.setItem('vega_telemetry_approval', 'false');
      win.localStorage.setItem('vega_telemetry_viewed', 'true');
    });
  });
}
