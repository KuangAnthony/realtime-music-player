import type { ReactElement } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

type AppPropsWithLayout = AppProps & {
  Component: NextPage & {
    getLayout?: (page: ReactElement) => JSX.Element;
  };
};

const App = ({ Component, pageProps }: AppPropsWithLayout): JSX.Element => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(<Component {...pageProps} />);
};

export default App;
