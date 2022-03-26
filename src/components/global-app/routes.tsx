import { Route } from 'wouter';
import { Home } from '../../views/home';
import { Document } from '../../views/document';

export enum RoutePaths {
  Home = '/',
  Document = '/doc/:doc_id',
}

export const Routes = () => {
  return (
    <>
      <Route path={RoutePaths.Home} component={Home} />
      <Route path={RoutePaths.Document} component={Document} />
    </>
  );
};
