import React, { useState } from "react";
import "./Register.scss";
import Navbar from "../../../components/navbar/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import { toast } from "react-toastify";
import { createNewUser } from "../../../service/userService";
import { useNavigate } from "react-router-dom";
import {PowerIcon} from "@heroicons/react/16/solid";
import loginShoe from "../../../assets/images/login-shoe.png";

function Register(props) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const defaultValidInput = {
    isValidUsername: true,
    isValidEmail: true,
    isValidPassword: true,
    isValidConfirmPassword: true,
  };
  const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

  const isValidation = () => {
    setObjCheckInput(defaultValidInput);
    if (!username) {
      setObjCheckInput({ ...defaultValidInput, isValidUserName: false });
      toast.error("Họ tên không được để trống!");
      return false;
    }

    if (!email) {
      setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
      toast.error("Email không được để trống!");
      return false;
    }

    let regx = /\S+@\S+\.\S+/;
    if (!regx.test(email)) {
      setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
      toast.error("Eamil không hợp lệ!");
      return false;
    }

    if (!password) {
      setObjCheckInput({ ...defaultValidInput, isValidPassword: false });

      toast.error("Mật khẩu không được để trống!");
      return false;
    }

    if (password !== confirmPassword) {
      setObjCheckInput({ ...defaultValidInput, isValidConfirmPassword: false });
      toast.error("Mật khẩu chưa khớp");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    let check = isValidation();

    if (check === true) {
      let response = await createNewUser(username, email, password);
      let serverData = response;
      console.log("check res: ", serverData);
      if (+serverData.errCode === 0) {
        toast.success(serverData.errMessage);
        navigate("/login");
      } else {
        toast.error(serverData.errMessage);
      }
      console.log("check res: ", response);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-r from-indigo-100 to-indigo-300  template d-flex justify-content-center align-items-center vh-100 -mb-28">
        <div className="grid xl:grid-cols-2 gap-0 w-[1320px] items-center">
          <div className="py-5 px-4 mx-1.5 lg:px-12 bg-white rounded-l-lg w-full flex flex-col justify-center">
            <form className="w-full">
              <PowerIcon className="w-8 h-8 mb-4 text-indigo-600"/>
              <h3 className="text-start mb-2 font-semibold">Đăng ký</h3>
              <p className="text-base text-gray-400">Xin mời điền đầy đủ thông tin của bạn</p>

              <div className="mb-4">
                <label htmlFor="text" className="text-base font-medium tracking-wide mb-1.5">
                  Họ tên <span className="important">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className={
                    objCheckInput.isValidUsername
                      ? "form-control"
                      : "is-invalid form-control"
                  }
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="text-base font-medium tracking-wide mb-1.5">
                  Email <span className="important">*</span>
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={
                    objCheckInput.isValidEmail
                      ? "form-control"
                      : "is-invalid form-control"
                  }
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="text-base font-medium tracking-wide mb-1.5">
                  Mật khẩu <span className="important">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={
                    objCheckInput.isValidPassword
                      ? "form-control"
                      : "is-invalid form-control"
                  }
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="text-base font-medium tracking-wide mb-1.5">
                  Nhập lại mật khẩu <span className="important">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className={
                    objCheckInput.isValidConfirmPassword
                      ? "form-control"
                      : "is-invalid form-control"
                  }
                />
              </div>
              <div className="d-grid">
                <button
                  type="submit"
                  className="py-2 rounded-md bg-indigo-600 text-white"
                  onClick={() => handleRegister()}
                >
                  Đăng Ký
                </button>
              </div>
              <p className="text-end mt-2">
                Bạn đã có tài khoản?
                <Link to="/login" className="ms-2 text-indigo-600">
                  Đăng Nhập
                </Link>
              </p>
            </form>
          </div>
          <img className="w-full scale-y-[1.09] rounded-r-lg hidden xl:inline-block" src={loginShoe} alt={''}/>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Register;
