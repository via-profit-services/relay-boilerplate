import * as React from 'react';
import { useSelector } from 'react-redux';
import { IntlProvider } from 'react-intl';

import enUS from '~/translations/en-US.json';
import ruRU from '~/translations/ru-RU.json';

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

const translationsMap: Record<ReduxState['locale'], Record<string, string>> = {
  'ru-RU': ruRU,
  'en-US': enUS,
};

const LocaleProvider: React.FC<Props> = props => {
  const { children } = props;
  const locale = useSelector<ReduxState, ReduxSelectedLocale>(store => store.locale);
  const messages = React.useMemo(
    () => translationsMap[locale] || translationsMap['ru-RU'],
    [locale],
  );

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
};

export default LocaleProvider;
