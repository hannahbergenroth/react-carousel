import maldives from "./images/maldives.jpg";
import portugal from "./images/portugal.jpg";
import { useEffect, useRef, useReducer } from "react";
import styled from "styled-components";

const initialState = { current: 0, next: 0 };

function prev(current) {
  return Math.max(0, current - 1);
}

function next(length, current) {
  return Math.min(length - 1, current + 1);
}

function reducer(state, action) {
  switch (action.type) {
    case "next":
      return {
        ...state,
        next: next(action.length, state.current),
      };
    case "prev":
      return {
        ...state,
        next: prev(state.current),
      };
    case "done":
      return {
        ...state,
        current: state.next,
      };
    case "this":
      return {
        ...state,
        next: action.id,
      };
    default:
      return state;
  }
}

export function Carousel({ images, width = 670, height = 375 }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const ref = useRef(null);

  useEffect(() => {
    if (state.current !== state.next) {
      scrollToNextItem(state.next - state.current);
      dispatch({ type: "done" });
    }
  }, [state]);

  function scrollToNextItem(n) {
    ref.current.scrollBy({
      left: ref.current.offsetWidth * n,
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <Container>
      <CarouselContainer ref={ref} width={`${width}px`}>
        {images.map((image, index) => (
          <div key={index}>
            <ContainerImage src={image} alt="" height={`${height}px`} />
          </div>
        ))}
      </CarouselContainer>
      <IndicatorContainer>
        {images.map((_, index) => (
          <Indicator
            key={index}
            isActive={index === state.current}
            onClick={() => dispatch({ type: "this", id: index })}
          />
        ))}
      </IndicatorContainer>
      <PrevArrow
        disabled={state.current === 0}
        onClick={() => dispatch({ type: "prev" })}
      />
      <NextArrow
        disabled={state.current === images.length - 1}
        onClick={() => dispatch({ type: "next", length: images.length })}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: fit-content;
  margin: 0 auto;
`;

const CarouselContainer = styled.div`
  position: relative;
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow: hidden;
  max-width: ${(props) => props.width};

  &::-webkit-scrollbar {
    display: none;
  }

  & > div {
    scroll-snap-align: start;
    flex-shrink: 0;
    width: 100%;
    height: 100%;
  }
`;

const ContainerImage = styled.img`
  height: ${(props) => props.height};
  width: 100%;
  object-fit: cover;
`;

const IndicatorContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Indicator = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  color: ${(props) => (props.isActive ? "pink" : "lightgray")};
  overflow: hidden;
  padding: 0;

  &::after {
    content: ${(props) => (props.isActive ? '"●"' : '"○"')};
    font-size: 24px;
    padding: 0 10px;
  }

  &:hover {
    color: rgb(255, 2, 108);
  }
`;

const Arrow = styled.span`
  position: absolute;
  top: calc(50% - 14px);
  width: 2vmin;
  height: 2vmin;
  background: transparent;
  border-top: 1vmin solid lightgray;
  border-right: 1vmin solid lightgray;
  transition: all 200ms ease;
  display: ${(props) => (props.disabled ? "none" : "")};
  cursor: pointer;

  &:hover {
    border-color: rgb(255, 2, 108);
    box-shadow: 0.5vmin -0.5vmin 0 white;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-40%, -60%) rotate(45deg);
    width: 200%;
    height: 200%;
  }
`;

const NextArrow = styled(Arrow)`
  right: 0;
  margin-right: 1rem;
  transform: translate3d(0, -50%, 0) rotate(45deg);
`;

const PrevArrow = styled(Arrow)`
  left: 0;
  margin-left: 1rem;
  transform: translate3d(0, -50%, 0) rotate(-135deg);
`;
