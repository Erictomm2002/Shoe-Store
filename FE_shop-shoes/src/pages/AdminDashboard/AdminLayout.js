import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import "./SideBar.scss";
import { FaBars } from "react-icons/fa";
import {NavLink, Outlet, useNavigate} from "react-router-dom";
import Sidebar from "./Sidebar";
import { routes } from "../../assets/data/menu";
import { memo } from "react";
import { logout } from "../../utils/utils";

const AdminLayout = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const slug = window.location.pathname;

  useEffect(() => {
    if (slug === "/admin") {
      window.location.href = "/admin/home";
    }
  }, [slug]);
  console.log(slug);
  useEffect(() => {
    // Kiểm tra xem có thông tin người dùng trong Local Storage không
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      window.location.href = "/login";
    }
    // Nếu có, chuyển đổi chuỗi JSON thành đối tượng và cập nhật state
    if (storedUser) {
      const currentUser = JSON.parse(storedUser);
      if (currentUser.roleId === "ADMIN") {
        setUser(JSON.parse(storedUser));
      }
      else {
        navigate("/")
      }
    }
  }, []);
  const toggle = () => setOpen(!isOpen);

  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: "5px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <div className="main-container">
        <motion.div
          className="sidebar lg:py-3 lg:px-4 bg-stone-800"
          animate={{
            width: isOpen ? "350px" : "70px",
            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
        >
          <div className="top_section">
            {isOpen && (
              <motion.h1
                className="text-xl"
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={inputAnimation}
              >
                Shop Shoe
              </motion.h1>
            )}
            <div className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>
          <section className="routes">
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <>
                    <Sidebar
                      key={index}
                      route={route}
                      isOpen={isOpen}
                      setOpen={setOpen}
                      showAnimation={showAnimation}
                    />
                  </>
                );
              }

              return (
                <>
                  <NavLink
                    className="p-2 flex text-white items-center gap-3"
                    activeclassname="active"
                    onMouseDown={() => {
                      if (route.path === "/settings/profile") logout();
                    }}
                    to={route.path}
                    key={index}
                  >
                    <div className="icon scale-125">{route.icon}</div>
                    {isOpen && (
                      <AnimatePresence>
                        <motion.div
                          className="text-lg font-sans"
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          variants={showAnimation}
                        >
                          {route.name}
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </NavLink>
                </>
              );
            })}
          </section>
        </motion.div>

        <Outlet />
      </div>
    </>
  );
};

export default memo(AdminLayout);
