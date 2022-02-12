import * as React from 'react';
import loadable from '@loadable/component';
import { Helmet } from 'react-helmet';

import LocaleProvider from '~/providers/LocaleProvider';
import UIProvider from '~/providers/UIProvider';
import LoadingIndicator from '~/components/both/LoadingIndicator';

const RootRouter = loadable(() => import('~/routes/RootRouter'), {
  fallback: <LoadingIndicator />,
});

const App: React.FC = () => (
  <>
    <Helmet defaultTitle=" ">
      <meta charSet="utf-8" />
    </Helmet>
    <LocaleProvider>
      <UIProvider>
        <RootRouter />
      </UIProvider>
    </LocaleProvider>
  </>
);

export default App;
