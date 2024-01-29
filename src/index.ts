import { DuplicateRouteError } from './errors/duplicate-route.error';
import { MissingRouteError } from './errors/missing-route.error';
import { RouteEntry } from './route-entry';

const Routes = new Map<string, RouteEntry>();

const ROOT_ROUTE = new RouteEntry('/');
Routes.set('ROOT', ROOT_ROUTE);

/**
 * Fetches a route entity from the internal map and returns it
 * @param routeName Identifier for the route which should be retrieved
 * @returns The route associated with the given name
 *
 * @throws {MissingRouteError} When no route with the provided routeName is registered
 */
export function getRoute(routeName: string) {
  const route = Routes.get(routeName);

  if (!route)
    throw new MissingRouteError(`Route [${routeName}] not registered`);

  return route;
}

/**
 * Registers a new route
 * @param routeName Identifier of the route in the module - Used to lookup for parent references
 * @param path URL segment which will be maintained by this route
 * @param [parent] Identifier of a parent route
 * @returns New Route Entity
 */
export function createRoute(routeName: string, path: string, parent?: string) {
  if (Routes.has(routeName)) {
    throw new DuplicateRouteError(
      `Route with name [${routeName}] already exists`
    );
  }

  let parentRoute = ROOT_ROUTE;

  if (parent) {
    parentRoute = getRoute(parent);
  }

  const newRoute = new RouteEntry(path, parentRoute);

  Routes.set(routeName, newRoute);

  return newRoute;
}
