import React, {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import {AiFillDelete} from "react-icons/ai";
import {BiEdit, BiMenuAltLeft} from "react-icons/bi";
import ReactPaginate from "react-paginate";
import {ModalDeleteSupplier, ModalSupplier} from "../../components";
import {deleteSupplier, fetchAllSupplier} from "../../service/userService";
import {toast} from "react-toastify";

const Supplier = () => {
  //create
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [sortByName, setSortByName] = useState(false);

  const [dataModal, setDataModal] = useState({});
  const [actionModal, setActionModal] = useState("CREATE");
  const [dataModalEdit, setDataModalEdit] = useState({});

  const [listSupplier, setListSupplier] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  // const handleAddSupplier = () => {
  //   setIsShowModal(true);
  // };

  useEffect(() => {
    fetchSupplier();
  }, [currentPage, sortByName]);

  const fetchSupplier = async () => {
    let res = await fetchAllSupplier(currentPage, currentLimit, sortByName);
    if (res && res.errCode === 0) {
      setTotalPages(res.DT.totalPages);
      setListSupplier(res.DT.suppliers);
    }
  };

  const handlePageClick = async (event) => {
    setCurrentPage(+event.selected + 1);
  };

  const handleDeleteSupplier = async (supplier) => {
    setDataModal(supplier);
    setIsShowModalDelete(true);
  };

  const onHideModal = async () => {
    setIsShowModal(false);
    setIsShowModalDelete(false);
    setDataModal({});
    setDataModalEdit({});
    await fetchSupplier();
  };

  const comfirmDeleteSupplier = async () => {
    let res = await deleteSupplier(dataModal);
    if (res && res.errCode === 0) {
      toast.success(res.errMessage);
      await fetchSupplier();
      setIsShowModalDelete(false);
    } else {
      toast.error(res.errMessage);
    }
  };

  const handleEditSupplier = (supplier) => {
    setActionModal("UPDATE");
    setDataModalEdit(supplier);
    setIsShowModal(true);
  };

  return (
    <div className="p-4 bg-gray-100 w-full">
      <div className="bg-white border rounded-lg">
        <div className="flex items-center justify-between p-4">
          <p className="text-2xl text-gray-800 font-semibold">Nhà cung cấp</p>
          <div className="flex items-center gap-4">
            <div className="add-user">
              <Button
                onClick={() => {
                  setIsShowModal(true);
                  setActionModal("CREATE");
                }}
              >
                <i className="fa-solid fa-circle-plus"></i> Thêm
              </Button>
            </div>
            <div
              className="filter-user"
              style={{color: "black"}}
              onClick={() => {
                setSortByName(!sortByName);
              }}
            >
              Lọc
              <BiMenuAltLeft/>
            </div>
          </div>
        </div>
        <table className="min-w-full text-sm text-left text-gray-700 border-b">
          <thead className="bg-gray-100 text-gray-900">
          <tr>
            <th className="px-4 py-3 font-semibold text-base">#</th>
            <th className="px-4 py-3 font-semibold text-base">Tên nhà cung cấp</th>
            <th className="px-4 py-3 font-semibold text-base">Email</th>
            <th className="px-4 py-3 font-semibold text-base">Số điện thoại</th>
            <th className="px-4 py-3 font-semibold text-base">Địa chỉ</th>
            <th className="px-4 py-3 font-semibold text-base">Hành Động</th>
          </tr>
          </thead>
          <tbody>
          {listSupplier && listSupplier.length > 0 ? (
            <>
              {listSupplier.map((item, index) => {
                return (
                  <tr className="border-b last:border-0 hover:bg-gray-50"
                      key={`row-${index}`}>
                    {/* <td>{index + 1}</td> */}
                    <td className="px-4 py-3">{(currentPage - 1) * currentLimit + index + 1}</td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.email}</td>
                    <td className="px-4 py-3">{item.phone}</td>
                    <td className="px-4 py-3">{item.address}</td>

                    <td className="px-4 py-3 flex items-center gap-2">
                      <button
                        className="mx-3 btn btn-primary"
                        onClick={() => handleEditSupplier(item)}
                      >
                        <BiEdit/>
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteSupplier(item)}
                      >
                        <AiFillDelete/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </>
          ) : (
            <>
              <tr>
                <td>Không có dữ liệu</td>
              </tr>
            </>
          )}
          </tbody>
        </table>
        {totalPages > 0 && (
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
        )}
      </div>
      <ModalSupplier
        show={isShowModal}
        onHide={onHideModal}
        action={actionModal}
        dataModal={dataModalEdit}
      />
      <ModalDeleteSupplier
        show={isShowModalDelete}
        onHide={onHideModal}
        comfirmDeleteSupplier={comfirmDeleteSupplier}
        dataModal={dataModal}
      />
    </div>
  );
};

export default Supplier;
