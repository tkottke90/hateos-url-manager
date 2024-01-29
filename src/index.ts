import { DuplicateRouteError } from './errors/duplicate-route.error';
import { MissingRouteError } from './errors/missing-route.error';
import { RouteEntry } from './route-entry';

const Routes = new Map<string, RouteEntry>();

const ROOT_ROUTE = new RouteEntry('/');
Routes.set('ROOT', ROOT_ROUTE);

export function getRoute(routeName: string) {
  const route = Routes.get(routeName);

  if (!route)
    throw new MissingRouteError(`Route [${routeName}] not registered`);

  return route;
}

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
