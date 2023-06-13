/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'
import { AiFillCaretDown, AiFillCaretRight } from 'react-icons/ai'

const NavigationBar = ({ menuItems }) => {
    const [activeMenu, setActiveMenu] = useState(null);

    const handleMenuClick = (menu) => {
        if (activeMenu === menu) {
            setActiveMenu(null);
        } else {
            setActiveMenu(menu);
        }
    };

    const renderSubMenuItems = (subMenuItems) => {
        return subMenuItems?.map((subMenuItem, i) => (
            <li key={i} className="nav-item">
                <NavLink to={subMenuItem.to} className="nav-link" style={({ isActive }) => { return { color: isActive ? 'blue' : '#5C607B' } }}
                >{subMenuItem.name}</NavLink>
            </li>
        ));
    };

    const renderMenuItems = () => {
        return <>{
            menuItems?.map((menuItem, i1) => (
                <li
                    key={i1}
                    className={`nav-item ${menuItem.items ? 'dropdown' : ''}`}
                    onMouseLeave={() => setActiveMenu(null)}>
                    {!menuItem.items ?
                        <NavLink to={menuItem.to} className={`nav-link`} style={({ isActive }) => { return { color: isActive ? 'blue' : '#5C607B' } }}
                            onClick={() => handleMenuClick(menuItem)}>{menuItem.name}</NavLink> :
                        <NavLink className={`nav-link`} style={{ color: '#5C607B' }}
                            onMouseEnter={() => handleMenuClick(menuItem)}>{menuItem.name} {activeMenu === menuItem ? <AiFillCaretDown /> : <AiFillCaretRight />}</NavLink>
                    }
                    {menuItem.items && (
                        <ul
                            className={`dropdown-menu ${activeMenu === menuItem ? 'show' : ''}`}
                            onMouseLeave={() => setActiveMenu(null)} >
                            {renderSubMenuItems(menuItem.items)}
                        </ul>
                    )}
                </li>
            ))
        }
        </>
    };

    return (
        <div className="navbar navbar-expand-lg navbar-light">
            <ul className="navbar-nav">{renderMenuItems()}</ul>
        </div>
    );
};

export default NavigationBar;