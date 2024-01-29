import { MissingRouteError } from './errors/missing-route.error';
import { RouteEntry } from './route-entry';

const Routes = new Map<string, RouteEntry>();

export function getRoute(routeName: string) {
  const route = Routes.get(routeName);

  if (!route)
    throw new MissingRouteError(`Route [${routeName}] not registered`);

  return route;
}
