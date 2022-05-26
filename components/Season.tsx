import styled from "styled-components";
import Image from "next/image";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface SeasonProps {
  title: string;
  images: string[];
  children?: React.ReactNode | string;
}

export default function Season({ title, images, children }: SeasonProps) {
  return (
    <StyledSeason>
      <div className="gradient"></div>
      <h1>
        SEASON <span>{title}</span>
      </h1>
      <div className="slider">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView="auto"
          loop
          autoplay={{
            delay: 1,
            disableOnInteraction: false,
          }}
          speed={10000}
        >
          {images.map((image, index) => {
            return (
              <SwiperSlide key={index}>
                <Image src={image} alt={title} width={250} height={250} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div className="extras">{children}</div>
    </StyledSeason>
  );
}

const StyledSeason = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  .gradient {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    background-image: radial-gradient(
      circle farthest-corner at 50% 50%,
      rgba(114, 255, 255, 0.15),
      rgba(115, 241, 255, 0.1) 14%,
      rgba(58, 220, 255, 0.06) 31%,
      rgba(133, 233, 255, 0.01) 45%,
      hsla(0, 0%, 100%, 0) 56%,
      hsla(0, 0%, 100%, 0) 72%,
      hsla(0, 0%, 100%, 0) 104%
    );
  }
  h1 {
    font-size: 4rem;
    text-align: center;
    font-weight: 900;
    span {
      color: ${({ theme }) => theme.primary};
    }
  }
  .slider {
    width: 100%;
    padding: 2rem 0;
    overflow: hidden;
    pointer-events: none;
    .swiper {
      transform: rotate(-2deg);
    }
    .swiper-wrapper {
      transition-timing-function: linear;
    }
    .swiper-slide {
      width: auto;
      aspect-ratio: 1;
    }
  }
  .extras {
    h3 {
      font-size: 2.5rem;
      font-weight: 900;
      letter-spacing: 0.2em;
    }
  }
`;
