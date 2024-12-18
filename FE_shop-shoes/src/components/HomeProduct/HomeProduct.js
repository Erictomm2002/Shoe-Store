import React, { useEffect, useState } from "react";
import "./HomeProduct.scss";
import { Link } from "react-router-dom";
import { getAllProduct } from "../../service/productService";
import { toast } from "react-toastify";
import logoSGV from "../../assets/images/next-link.svg";
import ItemProductCart from "../card/ItemProductCart";
import SellingProducts from "./SellingProducts";

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
    <div className="product mt-96 lg:mt-8 flex flex-col items-center justify-center">
      <h2 className="font-semibold text-gray-600 text-start">Sản phẩm bán chạy</h2>
      <SellingProducts />

      {/*<h2 className="uppercase">GIẦY NIKE</h2>*/}
      {/*<div className="list">*/}
      {/*  {getProductByNike?.length > 0 &&*/}
      {/*    getProductByNike?.map((item, index) => {*/}
      {/*      return <ItemProductCart item={item} key={index}></ItemProductCart>;*/}
      {/*    })}*/}
      {/*</div>*/}
      {/*<div className="flex items-center justify-center">*/}
      {/*  <div className="flex items-center justify-center next-category px-4 py-3">*/}
      {/*    <Link*/}
      {/*      to={"/product-page/nike"}*/}
      {/*      className="flex items-center justify-center"*/}
      {/*    >*/}
      {/*      <span className="text-center ">Xem thêm giầy...&nbsp;</span>*/}
      {/*      <img src={logoSGV} alt="" height={20} width={20} />*/}
      {/*    </Link>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<h2>Giầy Adidas</h2>*/}
      {/*<div className="list">*/}
      {/*  {getProductByAdidas?.length > 0 &&*/}
      {/*    getProductByAdidas?.map((item, index) => {*/}
      {/*      return <ItemProductCart item={item} key={index}></ItemProductCart>;*/}
      {/*    })}*/}
      {/*</div>*/}

      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center mb-3 next-category px-4 py-3">
          <Link
            to={"/product-page/adidas"}
            className="flex items-center justify-center"
          >
            <span className="text-center ">Xem thêm giầy...&nbsp;</span>
            <img src={logoSGV} alt="" height={20} width={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomeProduct;
