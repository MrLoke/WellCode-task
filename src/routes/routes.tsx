import { createBrowserRouter } from 'react-router-dom';
import { Root } from 'src/Root';
import { Home } from 'src/pages/HomePage/Home';
import { NotFound } from 'src/pages/NotFoundPage/NotFound';

export const routesPath = {
  HOME: '/',
  NOT_FOUND: '*',
};

export const router = createBrowserRouter([
  {
    path: routesPath.HOME,
    element: (
      <Root>
        <Home />
      </Root>
    ),
  },
  {
    path: routesPath.NOT_FOUND,
    element: (
      <Root>
        <NotFound />
      </Root>
    ),
  },
]);
