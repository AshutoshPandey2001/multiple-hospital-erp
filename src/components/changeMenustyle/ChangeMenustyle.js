/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { TfiArrowCircleLeft } from 'react-icons/tfi'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './changeMenustyle.css'
import { useDispatch, useSelector } from 'react-redux';
import { SET_MENU_STYLE, selectmenuStyle } from 'src/redux/slice/changeMenustyleSlice';
import { SET_STATE } from 'src/redux/slice/changeStateslice';

const ChangeMenustyle = () => {
    const [show, setShow] = useState(false)
    const selectedMenu = useSelector(selectmenuStyle)
    console.log('selectedMenu', selectedMenu);
    const dispatch = useDispatch()
    return (
        <div className="toolbar ">
            <Dropdown autoClose="outside">
                <Dropdown.Toggle variant="success" id="dropdown-autoclose-outside">
                    <TfiArrowCircleLeft size={30} />
                </Dropdown.Toggle>
                <Dropdown.Menu>

                    <Dropdown.Item ><div className="form-check">
                        <label className="form-check-label">
                            <input type="radio" className="form-check-input" name="changemenu" value="sideMenu" checked={selectedMenu === 'sideMenu'} onChange={(e) => dispatch(SET_MENU_STYLE(e.target.value))} />Side Menu
                        </label>
                    </div></Dropdown.Item>
                    <Dropdown.Item ><div className="form-check">
                        <label className="form-check-label">
                            <input type="radio" className="form-check-input" name="changemenu" value="header" checked={selectedMenu === 'header'} onChange={(e) => [dispatch(SET_MENU_STYLE(e.target.value)), dispatch(SET_STATE(false))]} />Header
                        </label>
                    </div></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

        </div>
    )
}

export default ChangeMenustyle;

