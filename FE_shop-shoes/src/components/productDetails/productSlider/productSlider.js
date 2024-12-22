import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import PropTypes from "prop-types";
import "./productSlider.scss";

const ProductSlider = ({ images }) => {
  const [activeThumb, setActiveThumb] = useState();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Swiper
        loop={true}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation, Thumbs]}
        grabCursor={true}
        thumbs={{ swiper: activeThumb }}
        className="mb-4"
      >
        {images.map((item, index) => (
          <SwiperSlide key={index}>
            <img src={item} alt={`product image ${index + 1}`} className="w-full h-auto object-cover rounded-lg" />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setActiveThumb}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        modules={[Navigation, Thumbs]}
        className="product-thumbs"
      >
        {images.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="cursor-pointer border border-gray-200 rounded-lg overflow-hidden">
              <img src={item} alt={`product thumbnail ${index + 1}`} className="w-full h-24 object-cover" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

ProductSlider.propTypes = {
  images: PropTypes.array.isRequired,
};

export default ProductSlider;

