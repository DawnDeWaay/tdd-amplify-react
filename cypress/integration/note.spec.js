describe('Note Capture', () => {
    before(() => {
        cy.signIn();
    });
    
    after(() => {
        cy.clearLocalStorageSnapshot();
        cy.clearLocalStorage();
    });
    
    beforeEach(() => {
        cy.restoreLocalStorage();
        cy.visit('/');
    });
    
    afterEach(() => {
        cy.saveLocalStorage();
    });

    it('should have header', () => {
        cy.get('h1').should('have.text', 'My Notes App')
    })
    it('should create a note when name and description provided', () => {
        cy.get('[data-testid=test-name-0]').should('not.exist');
        cy.get('[data-testid=test-description-0]').should('not.exist');
        
        cy.get('[data-testid=note-name-field]').type('test note');
        cy.get('[data-testid=note-description-field]').type('test note description');
        cy.get('[data-testid=note-form-submit]').click();

        cy.get('[data-testid=note-name-field]').should('have.value', '');
        cy.get('[data-testid=note-description-field]').should('have.value', '');

        cy.get('[data-testid=test-name-0]').should('have.text', 'test note');
        cy.get('[data-testid=test-description-0]').should('have.text', 'test note description');
    });

    it('should load previously saved notes on browser refresh', () => {
        cy.visit("/")

        cy.get('[data-testid=test-name-0]').should('have.text', 'test note');
        cy.get('[data-testid=test-description-0]').should('have.text', 'test note description');
        
    })

    it('should have an option to sign out', () => {
        cy.get('[data-testid=sign-out] > .hydrated').click()
        cy.get('amplify-auth-container.hydrated > .hydrated').should('exist')
    })
});