import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

interface ImageBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly image?: string;
  readonly thumb?: string;
}

const Image = styled.div<{ $image?: string }>`
  position: relative;
  ${props =>
    typeof props.$image !== 'undefined' &&
    css`
      background-image: url(${props.$image});
      background-size: cover;
      background-repeat: center center;
    `}
`;

const ImageBlock: React.ForwardRefRenderFunction<HTMLDivElement, ImageBlockProps> = (
  props,
  ref,
) => {
  const { image, thumb, ...otherProps } = props;
  const [currentImage, setCurrentImage] = React.useState(typeof thumb === 'string' ? thumb : image);

  React.useEffect(() => {
    if (typeof thumb === 'string' && typeof image !== 'undefined') {
      const imageElement = new window.Image();
      imageElement.onload = () => {
        setCurrentImage(image);
      };

      imageElement.src = image;
    }
  }, [thumb, image]);

  if (typeof thumb === 'string' && typeof image === 'undefined') {
    throw new Error(
      `By providing the «thumb» property, you must pass the «image» property too, but got ${typeof image}`,
    );
  }

  return <Image {...otherProps} $image={currentImage} ref={ref} />;
};

export default React.forwardRef(ImageBlock);
