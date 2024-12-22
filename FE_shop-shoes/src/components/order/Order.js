import React, {useEffect, useState} from "react";
import Navbar from "../navbar/Navbar";
import "./Order.scss";
import {convertBase64ToImage} from "../../assets/data/image";
import {createOrder} from "../../service/productService";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import TopBanner from "../top-banner/top-banner";

const Order = () => {
  const cartProducts = useSelector((state) => state.cart.cartProducts.data);
  const [orderProduct, setOrderProduct] = useState([]);
  const [detailOrder, setDetailOrder] = useState({
    username: "",
    email: "",
    phone: "",
    addressDetail: "",
    note: "",
    totalMoney: "",
    userId: "",
    paymentType: "COD",
    deliveryType: "STANDARD",
    province: "string",
    district: "string",
    ward: "string",
  });
  const [openModalBank, setOpenModalBank] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const chooseProduct = localStorage.getItem("chooseProduct");
    if (chooseProduct) {
      setOrderProduct([JSON.parse(chooseProduct)]);
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => {
      localStorage.removeItem("chooseProduct");
    };
  }, []);

  useEffect(() => {
    const init = detailOrder?.deliveryType === "FAST" ? 65000 : 45000;

    if (orderProduct?.length > 0) {
      setDetailOrder({
        ...detailOrder,
        userId: user?.id,
        username: user?.username,
        email: user?.email,
        phone: user?.phone,
        addressDetail: user?.addressDetails,
        totalMoney:
          parseInt(orderProduct[0]?.price) *
          (orderProduct[0]?.discount
            ? (100 - parseInt(orderProduct[0]?.discount)) / 100
            : 1) *
          parseInt(orderProduct[0]?.quantity) +
          init,
      });
    } else {
      setDetailOrder({
        ...detailOrder,
        userId: user?.id,
        username: user?.username,
        email: user?.email,
        phone: user?.phone,
        addressDetail: user?.addressDetails,
        totalMoney: cartProducts?.reduce(
          (accumulator, currentValue) =>
            accumulator +
            parseInt(currentValue?.price) *
            ((100 - parseInt(currentValue?.discount || 0)) / 100) *
            currentValue?.quantity,
          init
        ),
      });
    }
  }, [detailOrder.deliveryType, orderProduct, cartProducts, user]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!detailOrder.username) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }
    if (!detailOrder.email) {
      toast.error("Vui lòng nhập email");
      return;
    } else if (!detailOrder.email.includes("@")) {
      toast.error("Email không hợp lệ");
      return;
    }
    if (!detailOrder.phone) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }
    if (!detailOrder.addressDetail) {
      toast.error("Vui lòng nhập địa chỉ");
      return;
    }
    if (!detailOrder.province) {
      toast.error("Vui lòng chọn tỉnh/thành phố");
      return;
    }
    if (!detailOrder.district) {
      toast.error("Vui lòng chọn quận/huyện");
      return;
    }
    if (!detailOrder.ward) {
      toast.error("Vui lòng chọn xã/phường");
      return;
    }
    if (!detailOrder.deliveryType) {
      toast.error("Vui lòng chọn hình thức giao hàng");
      return;
    }
    if (!detailOrder.paymentType) {
      toast.error("Vui lòng chọn hình thức thanh toán");
      return;
    }
    if (detailOrder?.paymentType === "BANK") {
      setOpenModalBank(true);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      await createOrder({
        ...detailOrder,
        listProduct: orderProduct?.length > 0 ? orderProduct : cartProducts,
      });
      toast.success("Đặt hàng thành công");
      setTimeout(() => {
        localStorage.removeItem("chooseProduct");
        window.location.href = "/";
      }, 2000);
    } catch (e) {
      toast.error("Đặt hàng thất bại");
      console.log(e);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <TopBanner/>
      <Navbar/>
      <div className="mt-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Đặt hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-6">
            <div className="md:col-span-2">
              <form className="bg-white shadow-md rounded px-8 pt-4 pb-3 mb-4">
                <p className="text-xl font-semibold mb-4">Thông tin nhận hàng</p>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                    Người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                    value={detailOrder?.username}
                    onChange={(e) => setDetailOrder({...detailOrder, username: e.target.value})}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                    value={detailOrder?.email}
                    onChange={(e) => setDetailOrder({...detailOrder, email: e.target.value})}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    Điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="phone"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                    value={detailOrder?.phone}
                    onChange={(e) => setDetailOrder({...detailOrder, phone: e.target.value})}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                    value={detailOrder?.addressDetail}
                    onChange={(e) => setDetailOrder({...detailOrder, addressDetail: e.target.value})}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="note">
                    Ghi chú
                  </label>
                  <textarea
                    id="note"
                    rows={4}
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                    onChange={(e) => setDetailOrder({...detailOrder, note: e.target.value})}
                  ></textarea>
                </div>
              </form>

              <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h3 className="text-lg font-semibold mb-4">Giao hàng</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="delivery"
                      value="FAST"
                      checked={detailOrder.deliveryType === "FAST"}
                      onChange={() => setDetailOrder({...detailOrder, deliveryType: "FAST"})}
                      className="mr-2"
                    />
                    <span>Giao hàng nhanh trong ngày: <span className="font-semibold">65.000₫</span></span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="delivery"
                      value="STANDARD"
                      checked={detailOrder.deliveryType === "STANDARD"}
                      onChange={() => setDetailOrder({...detailOrder, deliveryType: "STANDARD"})}
                      className="mr-2"
                    />
                    <span>Giao hàng tiêu chuẩn (3-5 ngày toàn quốc): <span
                      className="font-semibold">45.000₫</span></span>
                  </label>
                </div>
              </div>

              <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h3 className="text-lg font-semibold mb-4">Thanh toán</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={detailOrder.paymentType === "COD"}
                      onChange={() => setDetailOrder({...detailOrder, paymentType: "COD"})}
                      className="mr-2"
                    />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment"
                      value="BANK"
                      checked={detailOrder.paymentType === "BANK"}
                      onChange={() => setDetailOrder({...detailOrder, paymentType: "BANK"})}
                      className="mr-2"
                    />
                    <span>Chuyển khoản ngân hàng</span>
                  </label>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  <strong>Chú ý:</strong> Sau khi đặt hàng thành công vào email kiểm tra lại đơn hàng của bạn. Cảm ơn
                  bạn đã đặt hàng tại Shoes
                </p>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h3 className="text-lg font-semibold mb-4">Đơn hàng của bạn</h3>
                <div className="space-y-8">
                  {(orderProduct?.length > 0 ? orderProduct : cartProducts).map((item, index) => (
                    <div key={index} className="flex items-start">
                      <img
                        src={convertBase64ToImage(item?.image)}
                        alt={item?.productName}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                      <div className="space-y-1.5">
                        <p className="font-medium line-clamp-2 max-w-60 -mb-0.5">{item?.productName}</p>
                        <p className="text-sm text-gray-500">
                          Số lượng: {item?.quantity} | Kích thước: {item?.size || item?.sizeId}
                        </p>
                        <p className="text-sm font-semibold">
                          {Math.round(
                            parseInt(item?.price) *
                            parseInt(item?.quantity) *
                            (item?.discount ? (100 - parseInt(item?.discount)) / 100 : 1)
                          ).toLocaleString("vi-VN")}
                          ₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span>Phí ship:</span>
                    <span>{detailOrder?.deliveryType === "FAST" ? "65.000₫" : "45.000₫"}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng:</span>
                    <span>{Math.round(detailOrder?.totalMoney)?.toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>
                <button
                  onClick={handleCreateOrder}
                  className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Đặt hàng
                </button>
              </div>
            </div>
          </div>
        </div>

        {openModalBank && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Thông tin thanh toán</h2>
              <div className="flex flex-col items-center mb-4">
                <img src="/qrcode.png" alt="QR Code" className="w-52 h-52 mb-4"/>
                <div className="space-y-2 text-left w-full">
                  <p>Ngân hàng: Vietcombank</p>
                  <p>Số tài khoản: 0123455678</p>
                  <p>Tên chủ tài khoản: NGUYEN VAN A</p>
                  <p>
                    Số tiền:{" "}
                    {detailOrder?.totalMoney.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setOpenModalBank(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                >
                  Xác nhận đã thanh toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;