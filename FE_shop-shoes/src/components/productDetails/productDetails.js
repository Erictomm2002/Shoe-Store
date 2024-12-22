import React, {useEffect, useState} from "react";
import "./product.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import ProductSlider from "./productSlider/productSlider";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import {useParams} from "react-router-dom";
import {addToCart, getOneProduct, getReviews,} from "../../service/productService";
import {toast} from "react-toastify";
import {convertBase64ToImage} from "../../assets/data/image";
import Review from "./Tabs/Review";
import ReviewComments from "./Tabs/ReviewComments";
import {useDispatch} from "react-redux";
import {getAllProductsInCart} from "../../utils/utils";
import {MinusCircleIcon, PlusCircleIcon, StarIcon} from "@heroicons/react/16/solid";
import {ShoppingCartIcon, StarIcon as Star2} from "@heroicons/react/24/outline";
import TopBanner from "../top-banner/top-banner";
import SellingProducts from "../HomeProduct/SellingProducts";

const MAX_START = 5;
export function reviewStartLarge(startNumber){
  return (
    <div className="flex justify-start items-center -mt-4 mb-2.5">
      <div className="font-semibold text-gray-500 text-lg mr-1">{startNumber}</div>
      {Array.from({length: startNumber}).map(() => (
        <StarIcon className="w-6 h-6 text-yellow-400"/>
      ))}

      {Array.from({length: MAX_START - startNumber}).map(() => (
        <Star2 className="w-6 h-6 text-gray-400"/>
      ))}
    </div>
  )
}

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [getProduct, setGetProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [listImage, setListImage] = useState([]);
  const [active, setActive] = useState(1);
  const [product, setProduct] = useState({
    userId: "",
    productId: "",
    sizeId: null,
    quantity: 1,
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getOneProduct(id);
      if (res && res.errCode === 0) {
        setGetProduct(res.DT);
        setProduct(prev => ({ ...prev, productId: parseInt(id) }));
      } else {
        toast.error(res.errMessage);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await getReviews(id);
      if (res && res.errCode === 0) {
        setReviews(res.DT);
      } else {
        toast.error(res.errMessage);
      }
    };
    fetchReviews();
  }, [id]);

  useEffect(() => {
    if (getProduct) {
      const list = [
        convertBase64ToImage(getProduct.image),
        ...getProduct.images.map(convertBase64ToImage)
      ];
      setListImage(list);
    }
  }, [getProduct]);

  const handleAddToCart = async () => {
    if (product.quantity <= 0) {
      toast.error("Số lượng không hợp lệ");
      return;
    }
    if (product.sizeId === null) {
      toast.error("Vui lòng chọn size");
      return;
    }
    if (!user?.id) {
      toast.error("Vui lòng đăng nhập");
      return;
    }

    const res = await addToCart({
      userId: user.id,
      productId: product.productId,
      sizeId: product.sizeId,
      quantity: product.quantity,
    });

    if (res && res.errCode === 0) {
      toast.success("Thêm vào giỏ hàng thành công");
      getAllProductsInCart(user.id, dispatch, toast);
    } else {
      toast.error(res.errMessage);
    }
  };

  const handleOrder = () => {
    if (product.sizeId === null) {
      toast.error("Vui lòng chọn size");
      return;
    }
    if (product.quantity <= 0) {
      toast.error("Số lượng không hợp lệ");
      return;
    }
    localStorage.setItem(
      "chooseProduct",
      JSON.stringify({
        ...getProduct,
        sizeId: product.sizeId,
        quantity: product.quantity,
      })
    );
    window.location.href = "/order";
  };

  const handleToggleClick = (index) => {
    setActive(index);
  };

  if (!getProduct) return null;

  return (
    <div className="">
      <TopBanner />
      <Navbar />
      <div className="mt-8 lg:mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
              <ProductSlider images={listImage}/>
            </div>
            <div className="w-full lg:w-1/2">
              <h1 className="text-2xl tracking-wide font-medium col-span-3">
                {getProduct?.productName}
              </h1>
              <div className="flex items-center space-x-4 mb-8 mt-4">
                <span className="bg-gray-600 text-xl text-white inline p-1.5 rounded-md tracking-wide">
                  {/* {parseInt(getProduct?.price).toLocaleString("vi-VN")} */}
                  {Math.round(
                    parseInt(getProduct?.price) *
                    (getProduct?.discount
                      ? (100 - parseInt(getProduct?.discount)) / 100
                      : 1)
                  ).toLocaleString("vi-VN")}
                  <span>đ</span>
                </span>
                <span className="text-base text-gray-500">
                Còn {product.sizeId === null
                  ? getProduct.inventory.reduce((acc, cur) => acc + parseInt(cur.quantityInStock), 0)
                  : getProduct.inventory.find(item => product.sizeId === item.sizeId)?.quantityInStock || 0} sản phẩm
              </span>
              </div>
              <div className="mb-6">
                {reviewStartLarge(Math.floor(Math.random() * 5) + 1)}
              </div>
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-2">Size</h2>
                <div className="flex flex-wrap gap-2">
                  {getProduct.inventory
                    .sort((a, b) => a.sizeId - b.sizeId)
                    .filter(item => item.quantityInStock > 0)
                    .map(item => (
                      <button
                        key={item.sizeId}
                        onClick={() => setProduct(prev => ({...prev, sizeId: item.sizeId}))}
                        className={`px-3 py-2 border rounded-md ${
                          product.sizeId === item.sizeId ? 'bg-gray-600 text-white' : 'bg-white'
                        }`}
                      >
                        {item.sizeId === 1 ? "36" : item.sizeId === 2 ? "37" : item.sizeId === 3 ? "38" : item.sizeId === 4 ? "39" : item.sizeId === 5 ? "40" : item.sizeId === 6 ? "41" : "42"}
                      </button>
                    ))}
                </div>
              </div>
              <div className="mb-8">
                <h2 className="text-lg font-medium mb-2">Số lượng</h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setProduct(prev => ({...prev, quantity: Math.max(1, prev.quantity - 1)}))}
                    className="p-2 rounded-full hover:bg-gray-300"
                  >
                    <MinusCircleIcon className="w-6 h-6 text-indigo-600"/>
                  </button>
                  <span className="text-xl font-semibold">{product.quantity}</span>
                  <button
                    onClick={() => {
                      const maxQuantity = getProduct.inventory.find(item => item.sizeId === product.sizeId)?.quantityInStock || 0;
                      setProduct(prev => ({...prev, quantity: Math.min(maxQuantity, prev.quantity + 1)}));
                    }}
                    className="p-2 rounded-full hover:bg-gray-300"
                  >
                    <PlusCircleIcon className="w-6 h-6 text-indigo-600"/>
                  </button>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleOrder}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
                >
                  Đặt hàng
                </button>
                <button
                  onClick={handleAddToCart}
                  className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300"
                >
                  <ShoppingCartIcon className="w-6 h-6"/>
                </button>
              </div>
              <div className="mt-20">
                <div className="border-b border-gray-200">
                  <ul className="grid grid-cols-2">
                    <li className="text-center pb-3">
                      <button
                        className={`inline-block text-lg font-semibold ${
                          active === 1
                            ? 'text-indigo-600 border-b-4 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => handleToggleClick(1)}
                      >
                        Description
                      </button>
                    </li>
                    <li className="text-center">
                      <button
                        className={`inline-block text-lg font-semibold border-b ${
                          active === 2
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => handleToggleClick(2)}
                      >
                        Đánh giá
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 text-gray-600 tracking-wide leading-[30px]">
                  <div
                    className={active === 1 ? 'block' : 'hidden'}
                    dangerouslySetInnerHTML={{
                      __html: convertBase64ToImage(getProduct?.description),
                    }}
                  />

                  <div className={active === 2 ? 'block' : 'hidden'}>
                    {!user?.id ? (
                      <button
                        className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition duration-300">
                        Vui lòng đăng nhập để đánh giá
                      </button>
                    ) : (
                      <Review productId={id} userId={user?.id}/>
                    )}
                    <ReviewComments reviews={reviews}/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-36 flex flex-col items-center justify-center -ml-8 '>
            <p className="text-3xl font-semibold">Sản phẩm liên quan</p>
            <SellingProducts />
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ProductDetails;
