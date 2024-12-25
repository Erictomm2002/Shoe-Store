import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {getOrderById, updateOrder} from "../../../service/productService";
import {editCustomer} from "../../../service/userService";
import Swal from "sweetalert2";
import {Footer, Navbar} from "../../../components";

const InfoAccount = () => {
  const [user, setUser] = useState({});
  const [listOrder, setListOrder] = useState([]);

  const handleUpdateOrder = async (id, value) => {
    console.log(id);
    let res = await updateOrder(id, {status: value});
    if (res && res.errCode === 0) {
      toast.success("Cập nhật thành công");
      getAllOrderById(user?.id);
    } else {
      toast.error(res.errMessage);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      window.location.href = "/";
    }
  }, []);

  const getAllOrderById = async (id) => {
    let res = await getOrderById(id);
    if (res && res.errCode === 0) {
      setListOrder(res.DT);
    } else {
      console.log(res.errMessage);
      toast.error(res.errMessage);
    }
    console.log("check user:", res);
  };

  useEffect(() => {
    getAllOrderById(user?.id);
  }, [user?.id]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!user?.username) {
      toast.error("Vui lòng nhập tên!");
      return;
    }
    if (!user?.email) {
      toast.error("Vui lòng nhập email!");
      return;
    }
    try {
      let res = await editCustomer(user);
      if (res && res.errCode === 0) {
        toast.success("Cập nhật thành công!");
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        toast.error(res.errMessage);
      }
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <div className="w-full">
        <Navbar/>
      </div>
      <div className="-mb-28 mt-8 w-full grow">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl text-center font-bold mb-6">Quản lý tài khoản</h2>

          <div className="bg-white shadow-xl rounded mb-4">
            <div className="">
              <p className="px-8 pt-4 -mb-2 pb-3 border-b font-semibold text-2xl">Thông tin cá nhân</p>
              <form className="space-y-4 max-w-xl p-8">
                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Tên
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.username}
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) =>
                      setUser({
                        ...user,
                        username: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) =>
                      setUser({
                        ...user,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Điện thoại
                  </label>
                  <input
                    type="text"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={(e) =>
                      setUser({
                        ...user,
                        phone: e.target.value,
                      })
                    }
                    defaultValue={user?.phone || ""}
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={user?.addressDetails || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        addressDetails: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Tỉnh/Thành phố
                  </label>
                  <input
                    type="text"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={user?.province || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        province: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={user?.district || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        district: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="text-gray-700 text-sm font-bold mb-2">
                    Xã/Phường
                  </label>
                  <input
                    type="text"
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    defaultValue={user?.ward || ""}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        ward: e.target.value,
                      })
                    }
                  />
                </div>
              </form>
              <div className="col-span-2 bg-gray-50 p-3 flex justify-center items-center">
                <button
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={(e) => {
                    handleUpdateUser(e);
                  }}
                  type="submit"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mt-4 bg-white rounded-lg shadow-xl mb-16">
            <p className="my-4 mx-8 text-2xl font-semibold">
              Lịch sử đặt hàng
            </p>
            <table className="min-w-full bg-white">
              <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/12 text-left py-3 px-4 uppercase font-semibold text-sm">STT</th>
                <th className="w-2/12 text-left py-3 px-4 uppercase font-semibold text-sm">Sản phẩm</th>
                <th className="w-1/12 text-left py-3 px-4 uppercase font-semibold text-sm">Giá</th>
                <th className="w-1/12 text-left py-3 px-4 uppercase font-semibold text-sm">Số lượng</th>
                <th className="w-2/12 text-left py-3 px-4 uppercase font-semibold text-sm">Tổng tiền</th>
                <th className="w-2/12 text-left py-3 px-4 uppercase font-semibold text-sm">Ngày đặt</th>
                <th className="w-2/12 text-left py-3 px-4 uppercase font-semibold text-sm">Trạng thái</th>
                <th className="w-1/12 text-left py-3 px-4 uppercase font-semibold text-sm">Hành động</th>
              </tr>
              </thead>
              <tbody className="text-gray-700">
              {listOrder?.length > 0 &&
                listOrder.map((item, index) => {
                  const createdAtDate = new Date(item?.createdAt);
                  const formattedDate = `${createdAtDate.getDate()}/${
                    createdAtDate.getMonth() + 1
                  }/${createdAtDate.getFullYear()} ${createdAtDate.getHours()}:${
                    createdAtDate.getMinutes() < 10
                      ? "0" + createdAtDate.getMinutes()
                      : createdAtDate.getMinutes()
                  }`;
                  return (
                    <tr key={index}>
                      <td className="w-1/12 text-left py-3 px-4">{index + 1}</td>
                      <td className="w-2/12 text-left py-3 px-4">
                        {item?.orderDetail?.length > 0 &&
                          item?.orderDetail?.map((product, i) => (
                            <p key={i}>
                              {product?.product?.productName}
                            </p>
                          ))}
                      </td>
                      <td className="w-1/12 text-left py-3 px-4">
                        {item?.orderDetail?.length > 0 &&
                          item?.orderDetail?.map((product, i) => (
                            <p key={i}>
                              {parseInt(
                                product?.price
                              ).toLocaleString("vi-VN")}
                            </p>
                          ))}
                      </td>
                      <td className="w-1/12 text-left py-3 px-4">
                        {item?.orderDetail?.length > 0 &&
                          item?.orderDetail?.map((product, i) => (
                            <p key={i}>
                              {parseInt(
                                product?.quantity
                              ).toLocaleString("vi-VN")}
                            </p>
                          ))}
                      </td>
                      <td className="w-2/12 text-left py-3 px-4">
                        {parseInt(item?.totalMoney).toLocaleString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="w-2/12 text-left py-3 px-4">{formattedDate}</td>
                      <td className="w-2/12 text-left py-3 px-4">
                        {item?.status === "PENDING"
                          ? "Chờ xác nhận"
                          : item?.status === "CONFIRM"
                            ? "Chờ lấy hàng"
                            : item?.status === "SHIPPING"
                              ? "Đang giao hàng"
                              : item?.status === "SUCCESS"
                                ? "Đã giao"
                                : "Đã hủy"}
                      </td>
                      <td className="w-1/12 text-left py-3 px-4">
                        <button
                          className={`${
                            item?.status === "PENDING"
                              ? "bg-red-500 hover:bg-red-700"
                              : "hidden"
                          } text-white font-bold py-1 px-2 rounded text-xs`}
                          onClick={() => {
                            Swal.fire({
                              title: "Bạn có muốn hủy?",
                              text: "Đơn hàng sẽ bị hủy!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Xóa",
                            }).then(async (result) => {
                              if (result.isConfirmed) {
                                try {
                                  await handleUpdateOrder(
                                    item?.id,
                                    "CANCEL"
                                  );
                                  Swal.fire(
                                    "Đã hủy!",
                                    "Đơn hàng đã được hủy."
                                  );
                                } catch (e) {
                                  Swal.fire("Error", e, "error");
                                }
                              }
                            });
                          }}
                        >
                          Hủy đơn hàng
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Footer/>
      </div>
    </div>
  );
};

export default InfoAccount;