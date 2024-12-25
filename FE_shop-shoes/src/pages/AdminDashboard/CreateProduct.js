import React, {useEffect, useState} from "react";
import "./CreateProduct.scss";
import {convertBase64ToImage, getBase64} from "../../assets/data/image";
import Dropzone from "react-dropzone";
import {fetchAllSupplierNoLimit, fetchSizeShoes,} from "../../service/userService";
import {toast} from "react-toastify";
import _ from "lodash";
import {createProduct, editProduct, getOneProduct,} from "../../service/productService";
import "react-quill/dist/quill.snow.css";
import TextEditor from "../../components/TextEditor";
import {useParams} from "react-router-dom";

const CreateProduct = () => {
  const {id} = useParams();

  const [user, setUser] = useState({});
  const [selectItems, setSelectedItems] = useState([]);
  const [quantityInStock, setquantityInStock] = useState([]);

  const [shoeSize, setShoeSize] = useState([]);
  const [listSupplier, setListSupplier] = useState([]);
  const [description, setDescription] = useState("");

  const [product, setProduct] = useState({
    productId: null,
    userId: user?.id,
    productName: "",
    image: "",
    images: "",
    // description: "",
    discount: null,
    supplier: null,
    price: "",
  });

  useEffect(() => {
    // Kiểm tra xem có thông tin người dùng trong Local Storage không
    const storedUser = localStorage.getItem("user");

    // Nếu có, chuyển đổi chuỗi JSON thành đối tượng và cập nhật state
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  //fetch one product by id
  const fetchOneProduct = async () => {
    let res = await getOneProduct(id);
    if (res && res.errCode === 0) {
      console.log(res.DT);
      const {image, images, inventory, description, ...other} = res.DT;
      setProduct({
        ...other,
        image: convertBase64ToImage(image),
        images: images.map((image) => convertBase64ToImage(image)),
        productId: id,
      });
      setDescription(convertBase64ToImage(description));
      setquantityInStock(inventory);
      setSelectedItems(inventory.map((item) => item.sizeId));
    }
  };
  useEffect(() => {
    if (id) {
      fetchOneProduct();
    }
  }, [id]);

  console.log(id);


  const handleReset = () => {
    console.log(quantityInStock);
    setProduct({
      productId: null,
      userId: user?.id,
      productName: "",
      image: "",
      images: "",
      discount: "",
      supplier: "",
      price: "",
    });
    setDescription("");
    setSelectedItems([]);
    setquantityInStock();
  };
  //handle single image
  const handleSingleImage = async (files) => {
    const base64Image = await getBase64(files[0]);
    setProduct({...product, image: base64Image});
    console.log("check image: ", base64Image);
  };

  //handle multi images
  const handleMultiImages = async (files) => {
    const base64Images = await Promise.all(
      files.map((file) => getBase64(file))
    );
    setProduct({...product, images: base64Images});
    console.log("check images: ", base64Images);
  };

  //fetch supplier
  const fetchSupplier = async () => {
    let res = await fetchAllSupplierNoLimit();
    if (res && res.errCode === 0) {
      setListSupplier(res.DT);
    }
  };

  useEffect(() => {
    getSizeShoes();
    fetchSupplier();
  }, []);

  //get size shoes
  const getSizeShoes = async () => {
    let res = await fetchSizeShoes();
    if (res && res.errCode === 0) {
      setShoeSize(res.DT);
    } else {
      toast.error(res.errMessage);
    }
  };

  //handle checkbox
  const checkboxHandler = (e) => {
    let isSelected = e.target.checked;
    let value = parseInt(e.target.value);

    if (isSelected) {
      setSelectedItems([...selectItems, value]);
    } else {
      setSelectedItems((prevData) => {
        return prevData.filter((id) => {
          return id !== value;
        });
      });
      setquantityInStock((prevData) => {
        return prevData.filter((item) => {
          return item.sizeId !== value;
        });
      });
    }
  };

  //handle onchange product
  const handleOnchangeProduct = (value, name) => {
    let _dataProduct = _.cloneDeep(product);
    _dataProduct[name] = value;
    setProduct(_dataProduct);
  };

  //handle check validate
  const checkValidate = () => {
    if (!product.productName) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return false;
    }
    if (!product.price) {
      toast.error("Vui lòng nhập giá sản phẩm");
      return false;
    }
    if (!product.supplier) {
      toast.error("Vui lòng chọn nhà cung cấp");
      return false;
    }
    if (!product.image) {
      toast.error("Vui lòng chọn ảnh sản phẩm");
      return false;
    }
    if (!product.images) {
      toast.error("Vui lòng chọn ảnh sản phẩm");
      return false;
    }
    if (!description) {
      toast.error("Vui lòng nhập mô tả sản phẩm");
      return false;
    }
    if (selectItems.length === 0) {
      toast.error("Vui lòng chọn size và số lượng");
      return false;
    }

    if (product.price < 1000) {
      toast.error("Giá sản phẩm phải lớn hơn 1000");
      return false;
    }
    return true;
  };

  //handle submit
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const validate = checkValidate();
    if (!validate) return;
    let productData = {
      ...product,
      inventory: quantityInStock,
      description: description,
      userId: user?.id,
    };

    try {
      const res = id
        ? await editProduct(productData)
        : await createProduct(productData);
      console.log(res);
      if (res && res.errCode === 0) {
        if (id){
          toast.success("Sửa sản phẩm thành công")
        }
        else {
          toast.success("Tạo sản phẩm thành công");
          handleReset();
        }
      } else {
        toast.error(res.errMessage);
      }
    } catch (error) {
      console.log("error: ", error);
      id
        ? toast.error("Sửa sản phẩm thất bại")
        : toast.error("Tạo sản phẩm thất bại");
    }
    // console.log("check data: ", productData);
  };

  return (
    <div className="create-product auto bg-gray-100">
      {/*<Nav />*/}
      <div className="bg-white rounded-lg shadow min-w-[1000px] w-1/2">
        <div className="p-4 border-b">
          <p className="text-gray-800 text-2xl font-semibold">
            {id ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          </p>
        </div>
        <form className="p-4 space-y-6">
          <div className="w-full">
            <label className="form-label font-semibold" style={{color: "black"}}>
              Tên sản phẩm <span className="star">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập tên sản phẩm"
              className="w-[500px] max-w-md block border border-gray-300 rounded-md px-3 py-2 placeholder:text-sm text-gray-700"
              value={product.productName}
              onChange={(e) =>
                handleOnchangeProduct(e.target.value, "productName")
              }
            />
          </div>

          <div className="col-md-4">
            <label className="form-label font-semibold" style={{color: "black"}}>
              Giá <span className="star">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập giá sản phẩm"
              className="w-[500px] max-w-md block border border-gray-300 rounded-md px-3 py-2 placeholder:text-sm text-gray-700"
              value={product.price}
              onChange={(e) => handleOnchangeProduct(e.target.value, "price")}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label font-semibold" style={{color: "black"}}>
              Giảm giá (%)
            </label>
            <input
              type="text"
              placeholder="Nhập phần trăm giảm giá"
              className="w-[500px] max-w-md block border border-gray-300 rounded-md px-3 py-2 placeholder:text-sm text-gray-700"
              value={product.discount}
              onChange={(e) => {
                if (e.target.value > 99) {
                  toast.error("Giảm giá không được lớn hơn 99%");
                } else {
                  handleOnchangeProduct(e.target.value, "discount");
                }
              }}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label font-semibold" style={{color: "black"}}>
              Nhà cung cấp <span className="star">*</span>
            </label>
            <select
              className="w-[500px] max-w-md block border border-gray-300 rounded-md px-3 py-2 placeholder:text-sm text-gray-700"
              value={product?.supplier}
              onChange={(e) =>
                handleOnchangeProduct(e.target.value, "supplier")
              }
            >
              <option value="default" disabled selected>
                --- chọn ---
              </option>
              {listSupplier?.length > 0 &&
                listSupplier.map((item, index) => (
                  <option key={index} value={item?.name}>
                    {item?.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="col-md-7">
            <label className="form-label font-semibold" style={{color: "black"}}>
              Mô tả
            </label>
            <TextEditor
              setDescription={setDescription}
              placeholder="Write something..."
              description={description}
            ></TextEditor>
          </div>

          <div className="col-md-7">
            <label className="form-label font-semibold" style={{color: "black"}}>
              Kích thước và số lượng <span className="star">*</span>
            </label>
            <div className="grid grid-cols-3" style={{color: "black"}}>
              {shoeSize.map((item, index) => {
                return (
                  <div className="flex gap-2 mt-2 check-size" key={index}>
                    <input
                      type="checkbox"
                      checked={selectItems.includes(item.id)}
                      value={item.id}
                      onChange={checkboxHandler}
                    />
                    Size {item.sizeShoes}:
                    <input
                      type="number"
                      className="border w-20 rounded-md"
                      value={
                        quantityInStock?.find(
                          (quantity) => quantity.sizeId === item.id
                        )?.quantityInStock || ""
                      }
                      onChange={(e) => {
                        setquantityInStock((prevQuantityInStock) => {
                          const existingItemIndex =
                            prevQuantityInStock.findIndex(
                              (itemInStock) => itemInStock.sizeId === item.id
                            );

                          if (existingItemIndex !== -1) {
                            // Nếu item.id đã tồn tại trong mảng, cập nhật giá trị
                            prevQuantityInStock[
                              existingItemIndex
                              ].quantityInStock = e.target.value;
                            return [...prevQuantityInStock]; // Trả về mảng hiện tại
                          } else {
                            // Nếu item.id chưa tồn tại trong mảng, thêm một phần tử mới
                            return [
                              ...prevQuantityInStock,
                              {
                                sizeId: item.id,
                                quantityInStock: e.target.value,
                              },
                            ];
                          }
                        });
                      }}
                      disabled={!selectItems.includes(item.id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-md-7">
            <label className="mt-3 form-label font-semibold" style={{color: "black"}}>
              Ảnh <i className="fas fa-upload"></i>{" "}
              <span className="star">*</span>
            </label>
            <Dropzone
              onDrop={handleSingleImage}
              // accept={{
              //   images: ["image/png", "image/gif", "image/jpeg"],
              // }}
              maxFiles={1}
            >
              {({getRootProps, getInputProps}) => (
                <div {...getRootProps()} className="w-full h-56 bg-stone-100 rounded-xl">
                  <input {...getInputProps()} />
                  {product?.image ? (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img
                      src={product?.image}
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                      alt="Selected Image"
                      value={product.singleImage}
                      onChange={(e) =>
                        handleOnchangeProduct(e.target.value, "singleImage")
                      }
                    />
                  ) : (
                    <div className="h-full flex justify-center items-center">
                      <p className="text-gray-500 text-xl italic">Kéo và thả ảnh hoặc click để chọn ảnh</p>
                    </div>
                  )}
                </div>
              )}
            </Dropzone>
          </div>
          <div className="col-md-7">
            <label className="mt-3 form-label font-semibold" style={{color: "black"}}>
              Tải ảnh của sản phẩm <i className="fas fa-upload"></i>{" "}
              <span className="star">*</span>
            </label>

            <Dropzone
              onDrop={handleMultiImages}
              // accept={{
              //   images: ["image/png", "image/gif", "image/jpeg"],
              // }}
              multiple
            >
              {({getRootProps, getInputProps}) => (
                <div {...getRootProps()} className="w-full min-h-56 bg-stone-100 rounded-xl">
                  <input {...getInputProps()} />
                  {product?.images.length > 0 ? (
                    <div className="flex gap-x-1 flex-wrap">
                      {product?.images.map((base64Image, index) => (
                        // eslint-disable-next-line jsx-a11y/img-redundant-alt
                        <img
                          key={index}
                          src={base64Image}
                          alt="Selected Image"
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            margin: "6px",
                          }}
                          value={product.multipleImage}
                          onChange={(e) =>
                            handleOnchangeProduct(e.target.value, "multipleImage")
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex justify-center items-center">
                      <p className="text-gray-500 text-xl italic">Kéo và thả ảnh hoặc click để chọn ảnh</p>
                    </div>
                  )}
                </div>
              )}
            </Dropzone>
          </div>
        </form>
        <div className="col-12 bg-gray-100 flex justify-center items-center py-3">
          <button
            className="py-2 px-6 text-base rounded-md bg-indigo-600"
            type="submit"
            onClick={(e) => handleSubmitProduct(e)}
          >
            {id ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
