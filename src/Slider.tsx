// Import Swiper React components
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mousewheel, Pagination } from "swiper/modules";

export const Slider = () => {
  const swiperWrapperRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperRef>(null);
  const [allowSwipeAgain, setAllowSwipeAgain] = useState(true);

  const wheelTimer = useRef<number>(0);
  const transitionEndTimer = useRef<number>(0);

  const enableSwipeAgainWhenTransitionEnd = useCallback(() => {
    //this allow user to continue swiping and still trigger animation
    clearTimeout(transitionEndTimer.current);
    transitionEndTimer.current = setTimeout(() => {
      console.log("enabling swipe again when transition ended");
      setAllowSwipeAgain(true);
    }, 700);
  }, []);

  const enableSwipeAgainWhenWheelStopped = useCallback(() => {
    //this allow user to continue swiping and still trigger animation
    clearTimeout(wheelTimer.current);
    wheelTimer.current = setTimeout(() => {
      console.log("enabling swipe again when wheel stopped");
      setAllowSwipeAgain(true);
    }, 300);
  }, []);

  const checkWheelEvent = useCallback(
    (e: WheelEvent) => {
      //only disable scrolling while we at top and try to scroll top, or at bottom and try to scroll bottom
      if (swiperRef.current) {
        if (
          (e.deltaY > 0 && !swiperRef.current.swiper.isEnd) ||
          (e.deltaY < 0 && !swiperRef.current.swiper.isBeginning)
        ) {
          e.preventDefault();
        }

        if (allowSwipeAgain) {
          setAllowSwipeAgain(false);
          if (e.deltaY > 0) {
            swiperRef.current.swiper.slideNext();
          } else {
            swiperRef.current.swiper.slidePrev();
          }
        }

        enableSwipeAgainWhenWheelStopped();
      }
      return true;
    },
    [allowSwipeAgain, enableSwipeAgainWhenWheelStopped],
  );
  useEffect(() => {
    const wrapper = swiperWrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener("wheel", checkWheelEvent, {
        passive: false,
      });
    }
    return () => {
      if (wrapper) {
        wrapper.removeEventListener("wheel", checkWheelEvent);
      }
    };
  }, [checkWheelEvent]);

  return (
    <div ref={swiperWrapperRef}>
      <Swiper
        ref={swiperRef}
        direction={"vertical"}
        slidesPerView={1}
        spaceBetween={30}
        mousewheel={false}
        pagination={{
          clickable: true,
        }}
        modules={[Mousewheel, Pagination]}
        className="mySwiper"
        onSlideChangeTransitionEnd={enableSwipeAgainWhenTransitionEnd}
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide>
      </Swiper>
    </div>
  );
};
