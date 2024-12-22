import React, {useEffect, useState} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {FaShoppingCart} from 'react-icons/fa';
import {IoPersonCircleOutline} from 'react-icons/io5';
import {HiMenu, HiX} from 'react-icons/hi';
import {toast} from 'react-toastify';
import {getAllProductsInCart} from "../../utils/utils";
import DropMenu from "../../pages/UserDashboard/DropdownMenu/DropMenu";
import {ArrowDownCircleIcon, HomeIcon} from "@heroicons/react/24/outline";
import {ShoppingCartIcon} from "@heroicons/react/24/outline";

const Navbar = () => {
    const [user, setUser] = useState({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const cartProducts = useSelector((state) => state.cart.cartProducts.data);
    const dispatch = useDispatch();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        getAllProductsInCart(user?.id, dispatch, toast);
    }, [user?.id, dispatch]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="bg-gradient-to-r from-gray-100 to-gray-300 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-purple-600">
                            Shoes store
                        </Link>
                    </div>
                    <nav className="hidden md:flex h-full items-center justify-center">
                        <div className="flex gap-x-4">
                            <NavItem to="/" label="Giới thiệu"/>
                            <NavItem to="/product-page" label="Thương hiệu"/>
                            <NavItem to="/sale-product" label="Giảm giá"/>
                        </div>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <CartIcon count={cartProducts?.length || 0}/>
                        {user?.email ? (
                            <ProfileMenu
                                openProfile={openProfile}
                                setOpenProfile={setOpenProfile}
                            />
                        ) : (
                            <LoginButton/>
                        )}
                        <MobileMenuButton isOpen={isMenuOpen} onClick={toggleMenu}/>
                    </div>
                </div>
            </div>
            <MobileMenu isOpen={isMenuOpen} onClose={closeMenu}/>
        </header>
    );
};

const NavItem = ({to, label}) => (
    <div>
        <NavLink
            to={to}
            className={({isActive}) =>
                `text-gray-600 font-semibold hover:text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? 'bg-indigo-500 text-white' : ''
                }`
            }
        >
            {label}
        </NavLink>
    </div>
);

const CartIcon = ({count}) => (
    <Link to="/cart" className="relative text-gray-800 hover:text-purple-600">
        <FaShoppingCart className="w-6 h-6"/>
        {count > 0 && (
            <span
                className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {count}
      </span>
        )}
    </Link>
);

const ProfileMenu = ({openProfile, setOpenProfile}) => (
    <div className="relative">
        <button
            onClick={() => setOpenProfile(!openProfile)}
            className="flex items-center text-gray-800 hover:text-purple-600"
        >
            <IoPersonCircleOutline className="w-8 h-8"/>
        </button>
        {openProfile && <DropMenu/>}
    </div>
);

const LoginButton = () => (
    <NavLink to="/login">
        <button className="bg-purple-600 hover:bg-purple-700 text-sm text-white font-bold py-2 px-4 rounded">
            Đăng nhập
        </button>
    </NavLink>
);

const MobileMenuButton = ({isOpen, onClick}) => (
    <button
        onClick={onClick}
        className="md:hidden text-gray-800 hover:text-purple-600 focus:outline-none"
    >
        {isOpen ? <HiX className="w-6 h-6"/> : <HiMenu className="w-6 h-6"/>}
    </button>
);

const MobileMenu = ({isOpen, onClose}) => (
    <div
        className={`md:hidden ${
            isOpen ? 'block' : 'hidden'
        } bg-white border-t border-gray-200`}
    >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavItem to="/" label="Giới thiệu" onClick={onClose} icon={<HomeIcon className='w-6 h-6'/>}/>
            <MobileNavItem to="/product-page" label="Thương hiệu" onClick={onClose} icon={<ShoppingCartIcon className='w-6 h-6'/>}/>
            <MobileNavItem to="/sale-product" label="Giảm giá" onClick={onClose} icon={<ArrowDownCircleIcon className='w-6 h-6'/>}/>
        </div>
    </div>
);

const MobileNavItem = ({to, label, onClick, icon}) => (
    <NavLink
        to={to}
        className={({isActive}) =>
            `block px-3 py-2 rounded-md font-medium text-base flex items-center justify-start gap-2  ${
                isActive
                    ? 'bg-purple-100 text-purple-600'
                    : 'text-gray-800 hover:bg-purple-50 hover:text-purple-600'
            }`
        }
        onClick={onClick}
    >
        {icon}
        <div>
            {label}
        </div>
    </NavLink>
);

export default Navbar;