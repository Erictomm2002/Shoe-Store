import React, { useEffect, useState } from "react";
import "./Cart.scss";
import { Link, NavLink } from "react-router-dom";
import Navbar from "../../../components/navbar/Navbar";
import {
  addToCart,
  createOrder,
  getAllProductInCart,
  removeallproductcart,
  removeproductcart,
} from "../../../service/productService";
import { toast } from "react-toastify";
import { convertBase64ToImage } from "../../../assets/data/image";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../../redux/cartSlice";
import {MinusIcon, PlusIcon} from "@heroicons/react/16/solid";
import {XMarkIcon} from "@heroicons/react/24/outline";
import TopBanner from "../../../components/top-banner/top-banner";

function CartPage() {
  const dispatch = useDispatch();
  const cartProducts = useSelector((state) => state.cart.cartProducts.data);
  const [user, setUser] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSetQuantity = async (number, id, size) => {
    const newArray = [...cartProducts];
    const updatedArray = newArray.map((item) => {
      if (
        item.quantity === 1 &&
        number === -1 &&
        item?.id === id &&
        item?.size === size
      ) {
        toast.warning("Số lượng sản phẩm không thể nhỏ hơn 1");
        return item;
      } else if (item?.id === id && item?.size === size) {
        return { ...item, quantity: item.quantity + number };
      } else {
        return item;
      }
    });

    dispatch(setProducts(updatedArray));
    let res = await addToCart({
      userId: user?.id,
      productId: id,
      sizeId: size,
      quantity: number,
    });
    if (res && res.errCode === 0) {
      // Success
    } else {
      toast.error(res.errMessage);
    }
  };

  const handleRemoveItem = async (id, size) => {
    Swal.fire({
      title: "Bạn chắc chắn muốn xóa?",
      text: "Bạn sẽ không thể hoàn nguyên tùy chọn này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = {
            userId: user?.id,
            productId: id,
            sizeId: size,
          };

          await removeproductcart(data);
          Swal.fire("Đã xóa!", "Bạn đã xóa thành công!", "success");

          dispatch(
            setProducts(
              cartProducts.filter(
                (product) => product.id !== id || product.size !== size
              )
            )
          );
        } catch (e) {
          Swal.fire("Error", e, "error");
        }
      }
    });
  };

  const handleRemoveAll = async () => {
    Swal.fire({
      title: "Bạn chắc chắn muốn xóa tất cả?",
      text: "Bạn sẽ không thể hoàn nguyên tùy chọn này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const data = {
            userId: user?.id,
          };

          await removeallproductcart(data);
          Swal.fire("Đã xóa!", "Bạn đã xóa thành công!", "success");

          dispatch(setProducts([]));
        } catch (e) {
          Swal.fire("Error", e, "error");
        }
      }
    });
  };

  const totalPrice = cartProducts?.reduce(
    (sum, item) =>
      sum +
      Math.round(
        parseInt(item.price) *
        (item?.discount ? (100 - parseInt(item?.discount)) / 100 : 1) *
        item.quantity
      ),
    0
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <TopBanner />
      <Navbar />
      <div className="mt-8">
        <div className="container mx-auto px-4">
          <p className="text-3xl font-semibold mb-4 tracking-wide">Giỏ hàng của tôi</p>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-4 items-start">
            <div className="lg:col-span-3 w-full">
              <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <table className="w-full">
                  <thead>
                  <tr className="border-b">
                    <th className="text-left font-semibold">Sản phẩm</th>
                    <th className="text-left font-semibold hidden lg:table-cell">Giá</th>
                    <th className="text-left font-semibold hidden lg:table-cell">Số lượng</th>
                    <th className="text-left font-semibold">Tổng</th>
                    <th className="text-left font-semibold"></th>
                  </tr>
                  </thead>
                  <tbody>
                  {cartProducts?.map((item) => (
                    <tr key={`${item.id}-${item.size}`} className="border-b">
                      <td className="py-4">
                        <div className="flex items-center">
                          <img
                            className="h-16 w-16 mr-4 object-cover"
                            src={convertBase64ToImage(item?.image)}
                            alt={item.productName}
                          />
                          <div>
                            <span className="font-medium line-clamp-2 w-24 md:w-60">{item.productName}</span>
                            <p className="text-sm text-gray-500">Kích thước: {item.size}</p>
                            <div className="flex items-center lg:hidden -mt-2">
                              <button
                                onClick={() => handleSetQuantity(-1, item?.id, item?.size)}
                                className="border rounded-md p-1"
                              >
                                <MinusIcon className="h-2.5 w-2.5 text-gray-600"/>
                              </button>
                              <span className="mx-2">{item.quantity}</span>
                              <button
                                onClick={() => handleSetQuantity(1, item?.id, item?.size)}
                                className="border rounded-md p-1"
                              >
                                <PlusIcon className="h-2.5 w-2.5 text-gray-600"/>
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 hidden lg:table-cell">
                        {Math.round(
                          parseInt(item?.price) *
                          (item?.discount
                            ? (100 - parseInt(item?.discount)) / 100
                            : 1)
                        ).toLocaleString("vi-VN")}
                        đ
                      </td>
                      <td className="py-4 hidden lg:table-cell">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleSetQuantity(-1, item?.id, item?.size)}
                            className="border rounded-md p-1"
                          >
                          <MinusIcon className="h-4 w-4 text-gray-600"/>
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            onClick={() => handleSetQuantity(1, item?.id, item?.size)}
                            className="border rounded-md p-1"
                          >
                            <PlusIcon className="h-4 w-4 text-gray-600"/>
                          </button>
                        </div>
                      </td>
                      <td className="">
                        <p className="flex items-center gap-x-1 text-sm text-gray-500 lg:hidden -mb-0">
                          <span>
                            {Math.round(
                              parseInt(item?.price) *
                              (item?.discount
                                ? (100 - parseInt(item?.discount)) / 100
                                : 1)
                            ).toLocaleString("vi-VN")}
                            đ
                          </span>
                          <span>x</span>
                          <span>
                            {item.quantity}
                          </span>
                        </p>
                        <p className="text-base font-semibold">
                          {Math.round(
                            parseInt(item?.price) *
                            (item?.discount
                              ? (100 - parseInt(item?.discount)) / 100
                              : 1) *
                            item?.quantity
                          ).toLocaleString("vi-VN")}
                          đ
                        </p>
                      </td>
                      <td className="py-4 pl-1">
                        <button
                          onClick={() => handleRemoveItem(item?.id, item?.size)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <XMarkIcon className="h-5 w-5"/>
                        </button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
                <div className="flex justify-end">
                  {cartProducts.length > 0 && (
                    <button
                      onClick={handleRemoveAll}
                      className="bg-red-500 text-white text-base py-2 px-8 rounded-lg hover:bg-red-700 mt-3"
                      disabled={cartProducts?.length === 0}
                    >
                      Xóa hết
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1 w-full">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Đặt hàng</h2>
                <div className="flex justify-between mb-2">
                <span>Giá</span>
                  <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>
                <hr className="my-2"/>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Tạm tính</span>
                  <span className="font-semibold">{totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>
                {cartProducts?.length > 0 && (
                  <Link
                    to="/order"
                    className="bg-indigo-500 text-white py-2 px-4 rounded-lg mt-4 block text-center hover:bg-yellow-600"
                  >
                    Đặt hàng
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
