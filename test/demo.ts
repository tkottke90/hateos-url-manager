import { Route } from '../src/route-entry';

const ROOT_ROUTE = new Route('');
const USERS_ROUTE = ROOT_ROUTE.createChild('users');
const USERID_ROUTE = USERS_ROUTE.createChild(':userId');
const USER_TRANSACTIONS_ROUTE = USERID_ROUTE.createChild(
  'transactions/:transactionId'
);

ROOT_ROUTE.url({});
//         ^?
USERS_ROUTE.url({});
//          ^?
USERID_ROUTE.url({ userId: '0' });
//           ^?
USER_TRANSACTIONS_ROUTE.url({ transactionId: '0', userId: '0' });
//                      ^?
