import { Route } from '../src/route-entry';

const ROOT_ROUTE = new Route('');
const USERS_ROUTE = ROOT_ROUTE.createChild('users');
const USERID_ROUTE = new Route(':userId');

ROOT_ROUTE.url({});
//         ^?
USERS_ROUTE.url({});
//          ^?
USERID_ROUTE.url({ userId: '0' });
//           ^?
