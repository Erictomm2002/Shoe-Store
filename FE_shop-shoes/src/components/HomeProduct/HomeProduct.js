import React, { useEffect, useState } from "react";
import "./HomeProduct.scss";
import { Link } from "react-router-dom";
import { getAllProduct } from "../../service/productService";
import { toast } from "react-toastify";
import logoSGV from "../../assets/images/next-link.svg";
import ItemProductCart from "../card/ItemProductCart";
import SellingProducts from "./SellingProducts";
import {ArrowRightIcon} from "@heroicons/react/16/solid";

function HomeProduct(props) {
  const [getProductByNike, setGetProductByNike] = useState([]);
  const [getProductByAdidas, setGetProductByAdidas] = useState([]);
  const getAllProductsByNike = async () => {
    let res = await getAllProduct(1, 8, "nike");
    if (res && res.errCode === 0) {
      setGetProductByNike(res?.DT?.suppliers);
    } else {
      toast.error(res.errMessage);
    }
  };
  const getAllProductsByAdidas = async () => {
    let res = await getAllProduct(1, 8, "adidas");
    if (res && res.errCode === 0) {
      setGetProductByAdidas(res?.DT?.suppliers);
    } else {
      toast.error(res.errMessage);
    }
  };

  useEffect(() => {
    getAllProductsByNike();
    getAllProductsByAdidas();
  }, []);
  return (
    <div className="product mt-96 lg:mt-8 flex flex-col items-center justify-center gap-y-16 lg:gap-y-24">
      <div>
        <h2 className="font-semibold text-gray-600 text-center mb-12">Sản phẩm bán chạy</h2>
        <SellingProducts/>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="flex gap-x-4 justify-center">
          <h2 className="font-semibold text-gray-600 text-center">Giày nike</h2>
          <div className="flex items-center justify-center">
            <Link
              to={"/product-page/nike"}
              className="flex items-center justify-center gap-1.5 border rounded-full px-4 py-2 text-gray-500 hover:bg-gray-600 hover:text-white font-semibold"
            >
              <span className="text-center ">Xem thêm</span>
              <ArrowRightIcon className="h-5 w-5"/>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 max-w-[1320px] mx-2">
          {getProductByNike?.length > 0 &&
            getProductByNike?.map((item, index) => {
              return <ItemProductCart item={item} key={index}></ItemProductCart>;
            })}
        </div>
      </div>


      <div className="flex flex-col justify-center items-center">
        <div className="flex gap-x-4 justify-center">
          <h2 className="font-semibold text-gray-600 text-center">Giày adidas</h2>
          <div className="flex items-center justify-center">
            <Link
              to={"/product-page/adidas"}
              className="flex items-center justify-center gap-1.5 border rounded-full px-4 py-2 text-gray-500 hover:bg-gray-600 hover:text-white font-semibold"
            >
              <span className="text-center ">Xem thêm</span>
              <ArrowRightIcon className="h-5 w-5"/>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 max-w-[1320px] mx-2">
          {getProductByAdidas?.length > 0 &&
            getProductByAdidas?.map((item, index) => {
              return <ItemProductCart item={item} key={index}></ItemProductCart>;
            })}
        </div>
      </div>
    </div>
  );
}

export default HomeProduct;
