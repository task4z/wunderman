describe('fe-wtc-tech-test-angularv2', () => {
  beforeEach(() => cy.visit('/'));

  const movieToTest = '[data-cy="The Godfather"]';
  it('should have all buttons', () => {
    cy.get('a').contains('Instructions');
    cy.get('a').contains('Swagger');
    cy.get('a').contains('Design');
  });

  it('should have movies list component', () => {
    cy.get('mono-nx-test-with-nextjs-movies-list').should('not.be.empty');
  });

  it('should have Movies in strong', () => {
    cy.get('[data-cy="movies"]').contains('Movies');
  });

  it('should have (22) in .small-text', () => {
    cy.get('.small-text').contains('(22)');
  });

  it('should have 22 movie cards ', () => {
    cy.get('mono-nx-test-with-nextjs-movie-card').should('have.length', 22);
  });

  it('first movie card element should have rating of (4.25)', () => {
    cy.get('.rating').first().contains('(4.25)');
  });

  it('movie cards should have stars', () => {
    cy.get('mono-nx-test-with-nextjs-movie-card').first().find('.star').should('have.length', 5);
  });
  
  it('movie should change watched icon to not-watched', () => {
    const eye = cy.get(movieToTest).find('.eye');
    eye.should('have.attr', 'src', '../../assets/eye.svg');
    eye.should('have.length', 1);
    eye.click();
    eye.should('have.length', 0);
    cy.get(movieToTest).find('.eye').should('have.attr', 'src', '../../assets/not-watched.svg');
  });
  
  it('movie should change watched icon to eye', () => {
    const eye = cy.get(movieToTest).find('.eye');
    eye.should('have.attr', 'src', '../../assets/not-watched.svg');
    eye.should('have.length', 1);
    eye.click();
    eye.should('have.length', 0);
    cy.get(movieToTest).find('.eye').should('have.attr', 'src', '../../assets/eye.svg');
  });

  it('movie should change saved icon to heart-empty', () => {
    const heart = cy.get(movieToTest).find('.heart');
    heart.should('have.attr', 'src', '../../assets/heart-empty.svg');
    heart.should('have.length', 1);
    heart.click();
    heart.should('have.length', 0);
    cy.get(movieToTest).find('.heart').should('have.attr', 'src', '../../assets/heart.svg');
  });

  it('movie should change saved icon to heart', () => {
    const heart = cy.get(movieToTest).find('.heart');
    heart.should('have.attr', 'src', '../../assets/heart.svg');
    heart.should('have.length', 1);
    heart.click();
    heart.should('have.length', 0);
    cy.get(movieToTest).find('.heart').should('have.attr', 'src', '../../assets/heart-empty.svg');
  });

  //white #FFF  => rgb(255, 255, 255)
  it('movie should change background color to #FFF', () => {
    cy.get(movieToTest).parent().parent().should('have.css', 'background-color', 'rgb(238, 201, 7)');
    cy.get(movieToTest).find('.eye').click();
    cy.get(movieToTest).parent().parent().should('have.css', 'background-color', 'rgb(255, 255, 255)');
  });

  //orange #ED6606  => rgb(237, 102, 6)
  it('movie should change background color to #ED6606', () => {
    cy.get(movieToTest).parent().parent().should('have.css', 'background-color', 'rgb(255, 255, 255)');
    cy.get(movieToTest).find('.heart').click();
    cy.get(movieToTest).parent().parent().should('have.css', 'background-color', 'rgb(237, 102, 6)');
  });

  // green #049452 => rgb(4, 148, 82)
  it('movie should change background color to #049452', () => {
    cy.get(movieToTest).parent().parent().should('have.css', 'background-color', 'rgb(237, 102, 6)');
    cy.get(movieToTest).find('.eye').click();
    cy.get(movieToTest).parent().parent().should('have.css', 'background-color', 'rgb(4, 148, 82)');
  });

  // yellow #EEC907 => rgb(238,201,7)
  it('movie should change background color to #EEC907', () => {
    cy.get(movieToTest).parent().parent().should('have.css', 'background-color', 'rgb(4, 148, 82)');
    cy.get(movieToTest).find('.heart').click();
    cy.get(movieToTest).parent().parent().should('have.css', 'background-color', 'rgb(238, 201, 7)');
  });

});
