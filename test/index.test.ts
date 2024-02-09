import 'mocha';
import { Route } from '../src/index';
import assert from 'assert';
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
      assert(
        route instanceof Route,
        'Route was not created using the Route constructor'
      );
      assert(route.path === `/${path}`, 'Route path was not properly set');
      assert(
        route.fullPath === `/${path}`,
        'Route fullPath was not properly set'
      );
    });

    it('should accept 2 string parameters', () => {
      // Arrange
      const fullPath = 'users/:userId';
      const relativePath = ':userId';

      // Act
      const route = new Route(fullPath, relativePath);

      // Assess
      assert(route, 'Route was not created');
      assert(
        route instanceof Route,
        'Route was not created using the Route constructor'
      );
      assert(
        route.path === `/${relativePath}`,
        'Route path was not properly set'
      );
      assert(
        route.fullPath === `/${fullPath}`,
        'Route fullPath was not properly set'
      );
    });
  });

  describe('#nest()', () => {
    it('should create a new Route', () => {
      // Arrange
      const sourcePath = 'users';
      const nestedPath = ':userId';

      const source = new Route(sourcePath);

      // Act
      const nested = source.nest(nestedPath);

      // Assess
      assert(
        nested instanceof Route,
        'Nested route is not an instance of the Route class'
      );
    });

    it('should set the path to the input value', () => {
      // Arrange
      const sourcePath = 'users';
      const nestedPath = ':userId';

      const source = new Route(sourcePath);

      // Act
      const nested = source.nest(nestedPath);

      // Assess
      assert(
        nested.path === `/${nestedPath}`,
        `Path Mismatch: [expected: ${nestedPath}] [actual: ${nested.path}]`
      );
    });

    it('should set the fullPath to the calculated value', () => {
      // Arrange
      const sourcePath = 'users';
      const nestedPath = ':userId';

      const source = new Route(sourcePath);

      // Act
      const nested = source.nest(nestedPath);

      // Assess
      assert(
        nested.fullPath === `/${sourcePath}/${nestedPath}`,
        `Full Path Mismatch: [expected: ${sourcePath}] [actual: ${nested.fullPath}]`
      );
    });

    it('should throw an error if the path is empty', () => {
      // Arrange
      const sourcePath = 'users';
      const nestedPath = '';

      const source = new Route(sourcePath);

      // Act
      try {
        source.nest(nestedPath);
      } catch (err) {
        // Assess
        assert(err, 'Error was not thrown for empty path');
        assert(
          err instanceof MissingRouteError,
          `Error used is not correct [expected: MissingRouteError] [actual: ${typeof err}]`
        );
      }
    });
  });

  describe('#url()', () => {
    it('should accept undefined as params when none defined in path (path: /users)', () => {
      // Arrange
      const sourcePath = 'users';
      const expectedUrl = '/users';
      const source = new Route(sourcePath);

      const output = source.url();

      // Assess
      assert(typeof output === 'string', 'URL return is not a string');

      assert(
        output === expectedUrl,
        `Path Mismatch: [expected: ${expectedUrl}] [actual: ${output}]`
      );
    });

    it('should accept an object as params when defined in path (path: /users/:userId)', () => {
      // Arrange
      const sourcePath = 'users/:userId';
      const expectedUrl = '/users/1';
      const userId = 1;

      const source = new Route(sourcePath);

      const output = source.url({ userId });

      // Assess
      assert(typeof output === 'string', 'URL return is not a string');

      assert(
        output === expectedUrl,
        `Path Mismatch: [expected: ${expectedUrl}] [actual: ${output}]`
      );
    });

    it('should accept multiple keys in the params (path: /users/:userId/:commentId)', () => {
      // Arrange
      const sourcePath = 'users/:userId/:commentId';
      const expectedUrl = '/users/15/100';
      const userId = 15;
      const commentId = 100;

      const source = new Route(sourcePath);

      const output = source.url({ userId, commentId });

      // Assess
      assert(typeof output === 'string', 'URL return is not a string');

      assert(
        output === expectedUrl,
        `Path Mismatch: [expected: ${expectedUrl}] [actual: ${output}]`
      );
    });

    it('should accept query parameters', () => {
      // Arrange
      const sourcePath = 'users';
      const expectedUrl = '/users?id=15';
      const id = 15;

      const source = new Route(sourcePath);

      const output = source.url(undefined, { query: { id } });

      // Assess
      assert(typeof output === 'string', 'URL return is not a string');

      assert(
        output === expectedUrl,
        `Path Mismatch: [expected: ${expectedUrl}] [actual: ${output}]`
      );
    });

    it('should encode query parameters', () => {
      // Arrange
      const sourcePath = 'users';
      const queryKey = 'NOT[in][label]';
      const queryValue = '1,4,15';
      const query = new URLSearchParams();
      query.append(queryKey, queryValue);

      const expectedUrl = '/users?' + encodeURI(query.toString());

      const source = new Route(sourcePath);

      const output = source.url(undefined, {
        query: { [queryKey]: queryValue }
      });

      // Assess
      assert(typeof output === 'string', 'URL return is not a string');

      assert(
        output === expectedUrl,
        `Path Mismatch: [expected: ${expectedUrl}] [actual: ${output}]`
      );
    });

    it('should accept hash', () => {
      // Arrange
      const sourcePath = 'users/:userId';
      const expectedUrl = '/users/1#profile';
      const userId = 1;
      const hash = 'profile';

      const source = new Route(sourcePath);

      const output = source.url({ userId }, { hash });

      // Assess
      assert(typeof output === 'string', 'URL return is not a string');

      assert(
        output === expectedUrl,
        `Path Mismatch: [expected: ${expectedUrl}] [actual: ${output}]`
      );
    });

    it('should encode hash', () => {
      // Arrange
      const sourcePath = 'users/:userId';
      const expectedUrl = '/users/1#settings&config';
      const userId = 1;
      const hash = 'settings&config';

      const source = new Route(sourcePath);

      const output = source.url({ userId }, { hash });

      // Assess
      assert(typeof output === 'string', 'URL return is not a string');

      assert(
        output === expectedUrl,
        `Path Mismatch: [expected: ${expectedUrl}] [actual: ${output}]`
      );
    });
  });
});
