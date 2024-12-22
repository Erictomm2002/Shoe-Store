import React, {useEffect, useState} from "react";
import "./Customer.scss";
import ReactPaginate from "react-paginate";
// import { BiEdit } from "react-icons/bi";
import {AiFillDelete} from "react-icons/ai";
import {deleteUser, getUser} from "../../service/userService";
import {toast} from "react-toastify";
import Swal from "sweetalert2";

const ManageUser = () => {
  const [getAllUser, setGetAllUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortByName, setSortByName] = useState(false);
  const getAllUsers = async () => {
    let res = await getUser(currentPage, currentLimit);
    if (res && res.errCode === 0) {
      setGetAllUser(res.DT?.suppliers);
      setTotalPages(res?.DT?.totalPages);
    } else {
      toast.error(res.errMessage);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [currentPage]);

  const handleDelete = async (id) => {
    console.log(id);
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
          await deleteUser(id);
          Swal.fire("Đã xóa!", "Bạn đã xóa thành công!", "success");
          setGetAllUser(getAllUser.filter((customer) => customer.id !== id));
        } catch (e) {
          Swal.fire("Error", e, "error");
        }
      }
    });
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  return (
    <div className="p-4 bg-gray-100 w-full">
      <div className="bg-white border rounded-lg">
        <div className="flex items-center justify-between p-4">
          <p className="text-2xl text-gray-800 font-semibold">Khách hàng</p>
        </div>
        <table className="min-w-full text-sm text-left text-gray-700 border-b">
          <thead className="bg-gray-100 text-gray-900">
          <tr>
            <th className="px-4 py-3 font-semibold text-base">STT</th>
            <th className="px-4 py-3 font-semibold text-base">Họ Tên</th>
            <th className="px-4 py-3 font-semibold text-base">Email</th>
            <th className="px-4 py-3 font-semibold text-base">Số điện thoại</th>
            <th className="px-4 py-3 font-semibold text-base">Chức vụ</th>
            {/* <th className="px-4 py-3 font-semibold text-base">Trạng Thái</th> */}
            <th className="px-4 py-3 font-semibold text-base">Hành Động</th>
          </tr>
          </thead>
          <tbody>
          {getAllUser?.length > 0 &&
            getAllUser?.map((item, index) => {
              return (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    {currentPage * currentLimit - currentLimit + index + 1}
                  </td>
                  <td className="px-4 py-3">{item?.username}</td>
                  <td className="px-4 py-3">{item?.email}</td>
                  <td className="px-4 py-3">{item?.phone}</td>
                  <td className="px-4 py-3">{item?.roleId}</td>
                  {/* <td className="px-4 py-3">{item?.status}</td> */}
                  <td className="px-4 py-3 flex items-center gap-2">
                    {/* <button
                        className="mx-3 btn btn-primary"
                        onClick={() => {
                          getOneStaff(item?.id);
                          setShow(true);
                          setEdit(true);
                        }}
                      >
                        <BiEdit />
                      </button> */}
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(item?.id);
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

        <div className="col-12 bg-gray-50 flex justify-end items-center py-3 px-4">
          <ReactPaginate
            breakLabel="..."
            nextLabel=" >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={4}
            pageCount={totalPages}
            previousLabel="< "
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
          />
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
