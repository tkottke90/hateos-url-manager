import 'mocha';
import { Route } from '../src/index';
import assert from "assert";
import { MissingRouteError } from '../src/errors/missing-route.error';

describe('Route Class', () => {
  describe('constructor', () => {
    it('should accept a single string parameter', () => {
      // Arrange
      const path = 'users';

      // Act
      const route = new Route(path);

      // Assess
      assert(route, 'Route was not created');
      assert(route instanceof Route, 'Route was not created using the Route constructor');
      assert(route.path === `/${path}`, 'Route path was not properly set');
      assert(route.fullPath === `/${path}`, 'Route fullPath was not properly set');
    });

    it('should accept 2 string parameters', () => {
      // Arrange
      const fullPath = 'users/:userId';
      const relativePath = ':userId'

      // Act
      const route = new Route(fullPath, relativePath);

      // Assess
      assert(route, 'Route was not created');
      assert(route instanceof Route, 'Route was not created using the Route constructor');
      assert(route.path === `/${relativePath}`, 'Route path was not properly set');
      assert(route.fullPath === `/${fullPath}`, 'Route fullPath was not properly set');
    });
  });

  describe('#nest()', () => {
    it('should create a new Route', () => {
      // Arrange
      const sourcePath = 'users';
      const nestedPath = ':userId'

      const source = new Route(sourcePath);

      // Act
      const nested = source.nest(nestedPath);

      // Assess
      assert(nested instanceof Route, 'Nested route is not an instance of the Route class');
    });
    
    it('should set the path to the input value', () => {
      // Arrange
      const sourcePath = 'users';
      const nestedPath = ':userId'

      const source = new Route(sourcePath);

      // Act
      const nested = source.nest(nestedPath);

      // Assess
      assert(nested.path === `/${nestedPath}`, `Path Mismatch: [expected: ${nestedPath}] [actual: ${nested.path}]`);
    });

    it('should set the fullPath to the calculated value', () => {
      // Arrange
      const sourcePath = 'users';
      const nestedPath = ':userId'

      const source = new Route(sourcePath);

      // Act
      const nested = source.nest(nestedPath);

      // Assess
      assert(nested.fullPath === `/${sourcePath}/${nestedPath}`, `Full Path Mismatch: [expected: ${sourcePath}] [actual: ${nested.fullPath}]`);
    });

    it('should throw an error if the path is empty', () => {
      // Arrange
      const sourcePath = 'users';
      const nestedPath = ''

      const source = new Route(sourcePath);

      // Act
      try {
        source.nest(nestedPath);
      } catch (err) {
        // Assess
        assert(err, `Error was not thrown for empty path`);
        assert(err instanceof MissingRouteError, `Error used is not correct [expected: MissingRouteError] [actual: ${typeof err}]`)
      }
    });
  });


});