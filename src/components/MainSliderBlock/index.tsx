import * as React from 'react';
import styled from '@emotion/styled';

import Slider, { SliderBullets, SliderRefType } from '~/components/Slider';
import Slide, { SlideProps } from './Slide';

export interface MainSliderPlockProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly slides: ReadonlyArray<SlideProps>;
}

const Container = styled.section`
  position: relative;
`;

const MainSliderBlock: React.ForwardRefRenderFunction<HTMLDivElement, MainSliderPlockProps> = (
  props,
  ref,
) => {
  const { slides } = props;
  const sliderRef = React.useRef<SliderRefType | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleToIndex = (index: number) => {
    sliderRef.current?.slickGoTo(index);
  };

  return (
    <Container {...props} ref={ref}>
      <Slider
        slidesToShow={1}
        ref={sliderRef}
        beforeChange={(_oldIndex, newIndex) => setActiveIndex(newIndex)}
      >
        {slides.map(slideProps => (
          <Slide key={slideProps.id} {...slideProps} />
        ))}
      </Slider>
      <SliderBullets
        activeIndex={activeIndex}
        slidesCount={slides.length}
        onSlideChange={handleToIndex}
      />
    </Container>
  );
};

export default React.forwardRef(MainSliderBlock);
