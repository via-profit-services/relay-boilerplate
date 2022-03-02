import * as React from 'react';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import Slide, { SlideProps } from './Slide';
import Arrow from './Arrow';

export type SliderProps = {
  slides: ReadonlyArray<SlideProps>;
};

const Container = styled.section`
  position: relative;
`;

const Slider: React.FC<SliderProps> = props => {
  const { slides } = props;
  const sliderRef = React.useRef<Carousel | null>(null);
  const [activeSlide, setActiveSlide] = React.useState(0);

  const handleNextPrev = (direction: 'prev' | 'next') => () => {
    if (sliderRef.current && direction === 'prev') {
      setActiveSlide(index => index - 1);
    }

    if (sliderRef.current && direction === 'next') {
      setActiveSlide(index => index + 1);
    }
  };

  return (
    <Container>
      <Carousel
        emulateTouch
        swipeable
        infiniteLoop
        showStatus={false}
        showArrows={false}
        showThumbs={false}
        showIndicators={false}
        autoPlay={false}
        transitionTime={140}
        ref={sliderRef}
        selectedItem={activeSlide}
        onChange={index => setActiveSlide(index)}
      >
        {slides.map(slideProps => (
          <Slide {...slideProps} key={slideProps.id} />
        ))}
      </Carousel>

      {slides.length > 1 && (
        <>
          <Arrow direction="prev" onClick={handleNextPrev('prev')} />
          <Arrow direction="next" onClick={handleNextPrev('next')} />
        </>
      )}
    </Container>
  );
};

export default Slider;
