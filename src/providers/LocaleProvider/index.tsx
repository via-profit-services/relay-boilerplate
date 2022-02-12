import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';

import translationsruRU from '~/translations/ru-RU.json';

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

const localeMap: Record<LocaleVariants, Record<string, string>> = {
  'ru-RU': translationsruRU,
};

const LocaleProvider: React.FC<Props> = props => {
  const { children } = props;
  const locale = useSelector<ReduxState, ReduxSelectedLocale>(state => state.locale);

  const messages = localeMap[locale] || localeMap['ru-RU'];
  const selectedLocale = locale in localeMap ? locale : 'ru-RU';

  return (
    <IntlProvider locale={selectedLocale} messages={messages}>
      {children}
    </IntlProvider>
  );
};

export default LocaleProvider;
