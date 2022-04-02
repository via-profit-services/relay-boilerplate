import * as React from 'react';
import styled from '@emotion/styled';
import ReactModal from 'react-modal';
import { FormattedMessage } from 'react-intl';

import Button from '~/components/Button';

export interface ModalConfirmBoxProps extends ReactModal.Props {
  readonly title: string;
  readonly message: React.ReactNode;
  readonly onRequestYes: React.MouseEventHandler<HTMLButtonElement>;
}

const Container = styled.div`
  background-color: #fff;
  border-radius: 1em;
  display: flex;
  flex-flow: column;
  min-width: 20em;
  transition: opacity 240ms ease-out;
`;

const Header = styled.div`
  padding: 1em 1em 0 1em;
`;

const HeaderTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
`;

const Content = styled.div`
  flex: 1;
  padding: 1em 1em;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1em 1em 1em 1em;
  border-top: 1px solid rgba(0, 0, 0, 0.5);

  & > button {
    border-radius: 0;
  }

  & > button:first-of-type {
    border-top-left-radius: 1em;
    border-bottom-left-radius: 1em;
  }

  & > button:last-of-type {
    border-top-right-radius: 1em;
    border-bottom-right-radius: 1em;
  }
`;

const ModalConfirmBox: React.ForwardRefRenderFunction<ReactModal, ModalConfirmBoxProps> = (
  props,
  ref,
) => {
  const { title, message, onRequestYes, onRequestClose, isOpen, ...otherProps } = props;
  const dialogID = React.useMemo(() => `dialog-confirm-${new Date().getTime()}`, []);
  const okButtonRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (isOpen && okButtonRef.current) {
          okButtonRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  return (
    <ReactModal
      ref={ref}
      closeTimeoutMS={200}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick={false}
      onRequestClose={onRequestClose}
      isOpen={isOpen}
      {...otherProps}
    >
      <Container
        role="dialog"
        aria-labelledby={`${dialogID}-title`}
        aria-describedby={`${dialogID}-description`}
      >
        <Header>
          <HeaderTitle id={`${dialogID}-title`}>{title}</HeaderTitle>
        </Header>
        <Content id={`${dialogID}-description`}>{message}</Content>
        <Footer>
          <Button onClick={onRequestClose}>
            <FormattedMessage defaultMessage="Отмена" description="Диалог. Кнопка отмены" />
          </Button>
          <Button onClick={onRequestYes} ref={okButtonRef}>
            <FormattedMessage defaultMessage="Да" description="Диалог. Кнопка согласия, типа ОК" />
          </Button>
        </Footer>
      </Container>
    </ReactModal>
  );
};

export default React.forwardRef(ModalConfirmBox);
