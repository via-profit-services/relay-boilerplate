import * as React from 'react';
import styled from '@emotion/styled';

import ImageBlock from '~/components/ImageBlock';

export interface SlideProps {
  readonly image: {
    readonly id: string;
    readonly url: string;
  };
}

const Container = styled.div`
  height: 26em;
  position: relative;
`;

const Image = styled(ImageBlock)`
  position: absolute;
  background-size: cover;
  background-position: center center;
  inset: 0;
`;

const Slide: React.FC<SlideProps> = props => {
  const { image } = props;

  return (
    <>
      <Container id={image.id}>
        <Image image={image.url} />
      </Container>
    </>
  );
};

export default Slide;
