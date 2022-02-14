import * as React from 'react';
import styled from 'styled-components';
import Slick from 'react-slick';
import 'slick-carousel/slick/slick.css';

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
  const sliderRef = React.useRef<Slick | null>(null);

  const handleNextPrev = (direction: 'prev' | 'next') => () => {
    if (sliderRef.current && direction === 'prev') {
      sliderRef.current.slickPrev();
    }

    if (sliderRef.current && direction === 'next') {
      sliderRef.current.slickNext();
    }
  };

  return (
    <Container>
      <Slick speed={240} ref={sliderRef} arrows={false}>
        {slides.map((slideProps, index) => (
          <Slide {...slideProps} key={index.toString()} />
        ))}
      </Slick>

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
