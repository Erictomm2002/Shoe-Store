import React, { useEffect, useState } from "react";
import "./SideBar.scss";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import { logout } from "../../utils/utils";

const menuAnimation = {
  hidden: {
    opacity: 0,
    height: 0,
    padding: 0,
    transition: { duration: 0.3, when: "afterChildren" },
  },
  show: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      when: "beforeChildren",
    },
  },
};

const menuItemAnimation = {
  hidden: (i) => ({
    padding: 0,
    x: "-100%",
    transition: {
      duration: (i + 1) * 0.1,
    },
  }),
  show: (i) => ({
    x: 0,
    transition: {
      duration: (i + 1) * 0.1,
    },
  }),
};

const Sidebar = ({ route, showAnimation, isOpen, setOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setOpen(true);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsMenuOpen(false);
    }
  }, [isOpen]);

  return (
    <>
      <div className="menu" onClick={toggleMenu}>
        <div className="menu_item flex text-white items-center gap-3">
          <div className="icon scale-125">{route.icon}</div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="link_text text-lg font-sans"
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={showAnimation}
              >
                {route.name}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {isOpen && (
          <motion.div animate={isMenuOpen ? { rotate: -90 } : { rotate: 0 }}>
            <FaAngleDown />
          </motion.div>
        )}
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="menu_container"
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={menuAnimation}
          >
            {route.subRoutes.map((subRoute, idx) => (
              <motion.div key={idx} variants={menuItemAnimation} custom={idx}>
                {subRoute?.name === "Đăng xuất" ? (
                  <button className="w-full flex" onClick={() => logout()}>
                    <div className="icon">{subRoute.icon}</div>
                    <motion.div className="ml-8 text-white text-base px-2 py-2.5 rounded-md hover:text-gray-700 hover:bg-stone-100">
                      {subRoute.name}
                    </motion.div>
                  </button>
                ) : (
                  <NavLink to={subRoute.path} className="">
                    <div className="">{subRoute.icon}</div>
                    <motion.div
                      className="ml-8 text-base px-2 py-2.5 rounded-md hover:text-gray-700 text-white hover:border ">
                      {subRoute.name}
                    </motion.div>
                  </NavLink>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
