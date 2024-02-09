import 'mocha';
import { Route } from '../src/index';
import assert from "assert";

// chai.should();

describe('Route Class', () => {
  describe('construction', () => {
    it('should accept a single string parameter', () => {
      // Arrange
      const path = 'users';

      // Act
      const route = new Route(path);

      // Assess
      assert(route);
      assert(route instanceof Route);
    });

    it('should accept 2 string parameters', () => {
      // Arrange
      const fullPath = 'users/:userId';
      const path = ':userId'

      // Act
      const route = new Route(path, fullPath);

      // Assess
      assert(route);
      assert(route instanceof Route);
    });
  });

  describe('#nest()', () => {
    it('should create a new Route', () => {
      // Arrange
      const sourcePath = 'users/:userId';
      const nestedPath = ':userId'

      const source = new Route(sourcePath);

      // Act
      const nested = source.nest(nestedPath);

      // Assess
      assert(nested instanceof Route, `Nested var is not an instance of Route | ${typeof nested} !== Route`);
      assert(nested.fullPath === sourcePath);
      assert(nested.path === nestedPath);
    });
  });
});