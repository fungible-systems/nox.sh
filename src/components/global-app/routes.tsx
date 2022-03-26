import { Route } from 'wouter';
import { Home } from '../../views/home';
import { Document } from '../../views/document';
import { useAuth } from '@micro-stacks/react';
import { Suspense } from 'react';

export enum RoutePaths {
  Home = '/',
  Document = '/doc/:doc_id',
}

export const Routes = () => {
  const { isSignedIn } = useAuth();
  return (
    <Suspense fallback={<></>}>
      <Route path={RoutePaths.Home} component={Home} />
      <Route path={RoutePaths.Document} component={isSignedIn ? Document : Home} />
    </Suspense>
  );
};
