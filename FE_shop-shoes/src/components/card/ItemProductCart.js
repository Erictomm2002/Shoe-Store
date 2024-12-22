import React from "react";
import {Link} from "react-router-dom";
import {convertBase64ToImage} from "../../assets/data/image";
import {reviewStart} from "../HomeProduct/SellingProducts";

const ItemProductCart = ({item, index}) => {
  return (
    <div className="" key={index}>
      <div className="">
        <Link to={`/product-details/${item?.id}`}>
          <img
            src={convertBase64ToImage(item?.image)}
            alt=""
            className="aspect-[14/15] object-cover rounded-lg shadow-md max-h-[340px]"
          />
        </Link>
      </div>
      <div className="gap-y-1 justify-start items-start mt-2">
        <div className="font-semibold text-start">
          <p className="truncate">{item.productName}</p>
        </div>
      </div>
      <div>
        {reviewStart(Math.floor(Math.random() * 5) + 1)}
      </div>
      <div className="-mt-2">
        {item?.discount > 0 ? (
          <div className="flex space-x-2">
            <div className="font-semibold text-red-500">
              {Math.round(
                parseInt(item?.price) * ((100 - parseInt(item?.discount)) / 100)
              ).toLocaleString("vi-VN")}
              đ
            </div>
            <div className="line-through text-gray-400">
              {parseInt(item?.price).toLocaleString("vi-VN")}đ
            </div>
          </div>
        ) : (
          <div className="font-semibold text-red-500">
            {parseInt(item?.price).toLocaleString("vi-VN")}đ
          </div>
        )}
      </div>
      <div className="mt-2 text-white bg-green-500 py-0.5 rounded-md font-semibold text-center w-32">
        Còn hàng
      </div>
    </div>
  );
};

export default ItemProductCart;
