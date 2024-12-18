import React, {useEffect, useState} from "react";
import "./Selling.scss";
import Slider from "react-slick";
import {Link} from "react-router-dom";
import {getBestSellerProduct} from "../../service/productService";
import {toast} from "react-toastify";
import {convertBase64ToImage} from "../../assets/data/image";

const SellingProducts = () => {
  const [getProduct, setGetProduct] = useState([]);
  const [customSetting, setCustomSetting] = useState({
    infinite: true,
    speed: 2000,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
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

  const getAllProductBestSale = async () => {
    let res = await getBestSellerProduct(1, 8);
    if (res && res.errCode === 0) {
      setGetProduct(res?.DT);
      setCustomSetting({
        ...customSetting,
        slidesToShow: res?.DT?.length > 4 ? 4 : res?.DT?.length,
      });
    } else {
      toast.error(res.errMessage);
    }
  };

  useEffect(() => {
    getAllProductBestSale();
  });

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-[1320px] grid grid-cols-1">
        <Slider {...customSetting}>
          {getProduct?.length > 0 &&
            getProduct.map((item, index) => (
              <div className="px-2" key={index}>
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
      </div>
    </div>
  );
};

export default SellingProducts;
