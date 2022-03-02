import * as React from 'react';
import { graphql, useLazyLoadQuery, useRelayEnvironment, commitLocalUpdate } from 'react-relay';
import styled from 'styled-components';
import Cookies from 'js-cookie';

import query, { HeaderToolbarQuery, FontSize } from '~/relay/artifacts/HeaderToolbarQuery.graphql';

graphql`
  query HeaderToolbarQuery {
    ... on Query {
      __typename
      localStore {
        fontSize
        theme
      }
    }
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Btn = styled.button<{ $active?: boolean }>`
  font-size: 0.8rem;
  background: ${props => (props.$active ? 'orange' : 'white')};
`;

const HeaderToolbar: React.FC = () => {
  const { localStore } = useLazyLoadQuery<HeaderToolbarQuery>(query, {});
  const environment = useRelayEnvironment();
  const setFontSize = (fontSizeValue: FontSize) => () => {
    commitLocalUpdate(environment, store => {
      store.get('client:root:localStore')?.setValue(fontSizeValue, 'fontSize');
      Cookies.set('fontSize', fontSizeValue);
    });
  };

  const switchTheme = () => {
    commitLocalUpdate(environment, store => {
      const themeValue = localStore.theme === 'standardLight' ? 'standardDark' : 'standardLight';

      store.get('client:root:localStore')?.setValue(themeValue, 'theme');
      Cookies.set('theme', themeValue);
    });
  };

  return (
    <Container>
      <Btn $active={localStore.fontSize === 'small'} onClick={setFontSize('small')}>
        small
      </Btn>
      <Btn $active={localStore.fontSize === 'normal'} onClick={setFontSize('normal')}>
        normal
      </Btn>
      <Btn $active={localStore.fontSize === 'medium'} onClick={setFontSize('medium')}>
        medium
      </Btn>
      <Btn onClick={() => switchTheme()}>Theme: {localStore.theme}</Btn>
    </Container>
  );
};

export default HeaderToolbar;
