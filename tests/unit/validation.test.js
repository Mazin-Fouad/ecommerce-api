const { 
  validateUserRegistration, 
  validateUserLogin, 
  validateProduct,
  validatePagination,
  validatePriceFilter,
  validateSearch
} = require('../../src/middleware/validationMiddleware');

describe('Validation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('validateUserRegistration', () => {
    it('should pass with valid registration data', () => {
      req.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      validateUserRegistration(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should fail with missing firstName', () => {
      req.body = {
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      validateUserRegistration(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validierungsfehler',
        errors: expect.arrayContaining(['Vorname ist erforderlich'])
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail with invalid email', () => {
      req.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      validateUserRegistration(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validierungsfehler',
        errors: expect.arrayContaining(['Ungültiges E-Mail-Format'])
      });
    });

    it('should fail with short password', () => {
      req.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: '123'
      };

      validateUserRegistration(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validierungsfehler',
        errors: expect.arrayContaining(['Passwort muss mindestens 6 Zeichen lang sein'])
      });
    });
  });

  describe('validateUserLogin', () => {
    it('should pass with valid login data', () => {
      req.body = {
        email: 'john.doe@example.com',
        password: 'password123'
      };

      validateUserLogin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should fail with missing email', () => {
      req.body = {
        password: 'password123'
      };

      validateUserLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validierungsfehler',
        errors: expect.arrayContaining(['E-Mail ist erforderlich'])
      });
    });
  });

  describe('validatePagination', () => {
    it('should set default values for missing parameters', () => {
      validatePagination(req, res, next);

      expect(req.query.page).toBe(1);
      expect(req.query.limit).toBe(10);
      expect(next).toHaveBeenCalled();
    });

    it('should correct invalid page values', () => {
      req.query = { page: '0', limit: '5' };

      validatePagination(req, res, next);

      expect(req.query.page).toBe(1);
      expect(req.query.limit).toBe(5);
    });

    it('should limit maximum page size', () => {
      req.query = { page: '1', limit: '200' };

      validatePagination(req, res, next);

      expect(req.query.limit).toBe(100);
    });
  });

  describe('validatePriceFilter', () => {
    it('should pass with valid price range', () => {
      req.query = { minPrice: '10.50', maxPrice: '100.00' };

      validatePriceFilter(req, res, next);

      expect(req.query.minPrice).toBe(10.5);
      expect(req.query.maxPrice).toBe(100);
      expect(next).toHaveBeenCalled();
    });

    it('should fail with invalid minPrice', () => {
      req.query = { minPrice: 'invalid' };

      validatePriceFilter(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Ungültiger Mindestpreis',
        error: 'Mindestpreis muss eine positive Zahl sein'
      });
    });

    it('should fail when minPrice > maxPrice', () => {
      req.query = { minPrice: '100', maxPrice: '50' };

      validatePriceFilter(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Ungültiger Preisbereich',
        error: 'Mindestpreis darf nicht höher als Höchstpreis sein'
      });
    });
  });

  describe('validateSearch', () => {
    it('should pass with valid search term', () => {
      req.query = { search: 'laptop' };

      validateSearch(req, res, next);

      expect(req.query.search).toBe('laptop');
      expect(next).toHaveBeenCalled();
    });

    it('should remove empty search term', () => {
      req.query = { search: '   ' };

      validateSearch(req, res, next);

      expect(req.query.search).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });

    it('should fail with too long search term', () => {
      req.query = { search: 'a'.repeat(101) };

      validateSearch(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Ungültiger Suchbegriff',
        error: 'Suchbegriff darf maximal 100 Zeichen lang sein'
      });
    });
  });
});