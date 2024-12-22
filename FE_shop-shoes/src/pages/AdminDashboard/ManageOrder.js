import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { Table } from "react-bootstrap";
import { FaMoneyBillAlt } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { BiEdit, BiMenuAltLeft } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { ModalOrder } from "../../components";
import {
  deleteOrder,
  getAllOrder,
  getDataManageAdmin,
  updateOrder,
} from "../../service/productService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { cloneDeep, debounce } from "lodash";

const ManageOrder = () => {
  const [isShowModalOrder, setIsShowModalOrder] = useState(false);
  const [valueModal, setValueModal] = useState({});
  const [dataManage, setDataManage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortByName, setSortByName] = useState(false);

  const fectchDtManage = async () => {
    let res = await getDataManageAdmin();
    if (res && res.errCode === 0) {
      setDataManage(res.DT);
    } else {
      toast.error(res.errMessage);
    }
  };

  const handleEditOrder = (product) => {
    setIsShowModalOrder(true);
    setValueModal(product);
  };

  const handleClose = () => {
    setIsShowModalOrder(false);
  };

  const handleClick = () => {
    alert("Mã đơn hàng");
  };

  const [getOrders, setGetOrders] = useState([]);
  const getAllOrders = async () => {
    let res = await getAllOrder(currentPage, currentLimit, sortByName);
    if (res && res.errCode === 0) {
      setGetOrders(res.DT?.suppliers);
      setTotalPages(res?.DT?.totalPages);
    } else {
      toast.error(res.errMessage);
    }
  };

  const handleUpdateOrder = async (id, value) => {
    let res = await updateOrder(id, { status: value });
    if (res && res.errCode === 0) {
      toast.success("Cập nhật thành công");
      fectchDtManage();
    } else {
      toast.error(res.errMessage);
    }
  };

  useEffect(() => {
    fectchDtManage();
  }, []);
  useEffect(() => {
    getAllOrders();
  }, [currentPage, sortByName]);

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleSearch = debounce((event) => {
    let term = event.target.value;
    if (term) {
      let searchData = cloneDeep(getOrders);
      searchData = searchData.filter((item) => item.email.includes(term));
      setGetOrders(searchData);
    } else {
      getAllOrders(currentPage);
    }
  }, 100);

  return (
    <div className="p-4 bg-gray-100 w-full">
      <Nav />
      <div className="space-y-8">
        {/* Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Đơn đặt hàng</h3>
              <FaMoneyBillAlt className="text-2xl text-gray-500" />
            </div>
            <h1 className="text-4xl font-bold">{dataManage?.totalOrders}</h1>
          </div>
          <div className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Đơn chờ duyệt</h3>
              <FaMoneyBillAlt className="text-2xl text-gray-500" />
            </div>
            <h1 className="text-4xl font-bold">{dataManage?.totalOrdersPending}</h1>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center p-4">
            <div>
              <p className="text-2xl font-semibold">Đơn hàng đang xử lý</p>
              <p className="text-sm text-gray-400 -mt-3">Khu vực xử lý các đơn hàng của toàn bộ hệ thống</p>
            </div>
            <button
              className="flex items-center text-sm bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => setSortByName(!sortByName)}
            >
              Lọc <BiMenuAltLeft className="ml-2 text-lg"/>
            </button>
          </div>

          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-900">
            <tr>
              <th className="px-4 py-3 font-semibold text-base">Mã</th>
              <th className="px-4 py-3 font-semibold text-base">Khách hàng</th>
              <th className="px-4 py-3 font-semibold text-base">Email</th>
              <th className="px-4 py-3 font-semibold text-base">Số điện thoại</th>
              <th className="px-4 py-3 font-semibold text-base">Ngày Đặt</th>
              <th className="px-4 py-3 font-semibold text-base">Trạng Thái</th>
              <th className="px-4 py-3 font-semibold text-base">Hành Động</th>
            </tr>
            </thead>
            <tbody>
            {getOrders?.map((item) => {
              const createdAtDate = new Date(item?.createdAt);
              const formattedDate = `${createdAtDate.getDate()}/${
                createdAtDate.getMonth() + 1
              }/${createdAtDate.getFullYear()} ${createdAtDate.getHours()}:${
                createdAtDate.getMinutes() < 10
                  ? "0" + createdAtDate.getMinutes()
                  : createdAtDate.getMinutes()
              }`;

              return (
                <tr
                  key={item?.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={handleClick}
                    >
                      #{item?.id}
                    </button>
                  </td>
                  <td className="px-4 py-3">{item?.username}</td>
                  <td className="px-4 py-3">{item?.email}</td>
                  <td className="px-4 py-3">{item?.phone}</td>
                  <td className="px-4 py-3">{formattedDate}</td>
                  <td className="px-4 py-3">
                    <select
                      className="border border-gray-300 rounded w-full p-2"
                      disabled={
                        item?.status === "SUCCESS" ||
                        item?.status === "CANCEL"
                      }
                      defaultValue={item?.status}
                      onChange={(e) =>
                        handleUpdateOrder(item?.id, e.target.value)
                      }
                    >
                      <option value="PENDING">Chờ xác nhận</option>
                      <option value="CONFIRM">Chờ lấy hàng</option>
                      <option value="SHIPPING">Đang giao hàng</option>
                      <option value="SUCCESS">Đã giao</option>
                      <option value="CANCEL">Đã Hủy</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button
                      className="mr-2 bg-blue-500 text-white p-2 rounded"
                      onClick={() => handleEditOrder(item)}
                    >
                      <BiEdit/>
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded"
                      onClick={() => {
                        Swal.fire({
                          title: "Bạn có muốn xóa?",
                          text: "Đơn hàng có thể xóa vĩnh viễn!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Xóa",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            try {
                              await deleteOrder(item?.id);
                              fectchDtManage();
                              setGetOrders(
                                getOrders.filter((x) => x.id !== item.id)
                              );
                              Swal.fire(
                                "Đã xóa!",
                                "Bạn đã xóa thành công!",
                                "success"
                              );
                            } catch (e) {
                              Swal.fire("Error", e, "error");
                            }
                          }
                        });
                      }}
                    >
                      <AiFillDelete/>
                    </button>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>

          <div className="mt-6 flex justify-center">
            <ReactPaginate
              breakLabel="..."
              nextLabel=" >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={4}
              pageCount={totalPages}
              previousLabel="< "
              containerClassName="flex items-center gap-2"
              pageClassName="border border-gray-300 px-3 py-1 rounded-md cursor-pointer"
              activeClassName="bg-indigo-500 text-white"
              previousClassName="border text-indigo-500 border-gray-300 px-3 py-1 rounded-md cursor-pointer"
              nextClassName="border border-gray-300 px-3 py-1 rounded-md cursor-pointer"
            />
          </div>
          </div>

          <ModalOrder
            show={isShowModalOrder}
            handleClose={handleClose}
            valueModal={valueModal}
          />
        </div>
      </div>
      );
      };

      export default ManageOrder;
