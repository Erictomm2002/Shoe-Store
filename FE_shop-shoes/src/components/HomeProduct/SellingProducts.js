import React, {useEffect, useRef, useState} from "react";
import "./Selling.scss";
import Slider from "react-slick";
import {Link} from "react-router-dom";
import {getBestSellerProduct} from "../../service/productService";
import {toast} from "react-toastify";
import {convertBase64ToImage} from "../../assets/data/image";
import {ChevronRightIcon, ChevronLeftIcon, StarIcon} from "@heroicons/react/16/solid";
import {StarIcon as Star2} from "@heroicons/react/24/outline";

const MAX_START = 5;

export function reviewStart(startNumber){
    return (
      <div className="flex justify-start items-center -mt-4 mb-2.5">
        <div className="font-semibold text-gray-500 mr-1">{startNumber}</div>
        {Array.from({length: startNumber}).map(() => (
          <StarIcon className="w-4 h-4 text-yellow-400"/>
        ))}

        {Array.from({length: MAX_START - startNumber}).map(() => (
          <Star2 className="w-4 h-4 text-gray-400"/>
        ))}
      </div>
    )
}

const SellingProducts = () => {
  const [getProduct, setGetProduct] = useState([]);
  const sliderRef = useRef(null); // Ref để kết nối slider

  const [customSetting, setCustomSetting] = useState({
    infinite: true,
    speed: 2000,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: false,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  useEffect(() => {
    getBestSellerProduct().then((res) => {
      if (res.errCode === 0) {
        setGetProduct(res?.DT);
        setCustomSetting({
          ...customSetting,
          slidesToShow: res?.DT?.length > 4 ? 4 : res?.DT?.length,
        });
      } else {
        toast.error(res.errMessage);
      }
    });
  }, []);

  return (
    <div className="flex justify-center items-center gap-x-2">
      {/* Nút Previous */}
      <ChevronLeftIcon
        onClick={() => sliderRef.current.slickPrev()}
        className="w-12 h-12 text-white rounded-full z-10 hover:scale-125 transition bg-gray-500"
      />

      <div className="max-w-[1340px] grid grid-cols-1">
        {getProduct?.length > 0 && (
          <Slider ref={sliderRef} {...customSetting}>
            {getProduct.map((item, index) => (
              <div className="px-2.5" key={index}>
                <div>
                  <div>
                    <Link to={`/product-details/${item?.product?.id}`}>
                      <img
                        src={convertBase64ToImage(item?.product?.image)}
                        alt=""
                        className="aspect-[14/15] object-cover rounded-lg shadow-md"
                      />
                    </Link>
                  </div>
                  <div className="gap-y-1 justify-start items-start mt-2">
                    <div className="font-semibold text-start">
                      <p className="truncate">{item?.product?.productName}</p>
                    </div>
                    <div>
                      {reviewStart(Math.floor(Math.random() * 2) + 4)}
                    </div>
                    <div className="-mt-2">
                      {item?.product?.discount > 0 ? (
                        <div className="flex space-x-2">
                          <div className="font-semibold text-red-500">
                            {Math.round(
                              parseInt(item?.product?.price) *
                              ((100 - parseInt(item?.product?.discount)) / 100)
                            ).toLocaleString("vi-VN")}
                            đ
                          </div>
                          <div className="line-through text-gray-400">
                            {parseInt(item?.product?.price).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </div>
                        </div>
                      ) : (
                        <div className="font-semibold text-red-500">
                          {parseInt(item?.product?.price).toLocaleString(
                            "vi-VN"
                          )}
                          đ
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-white bg-green-500 py-0.5 rounded-md font-semibold text-center w-32">
                    Còn hàng
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* Nút Next */}
      <ChevronRightIcon
        onClick={() => sliderRef.current.slickNext()}
        className="w-12 h-12 text-white rounded-full z-10 hover:scale-125 transition bg-gray-500"
      />

    </div>
  );
};

export default SellingProducts;
