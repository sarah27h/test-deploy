import React from 'react';

function Header (props) {
  
    return (
        <header className="header">
            <button aria-label="menu" id="menu" className="header_menu" onClick={props.handleHamburgerClick}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M2 6h20v3H2zm0 5h20v3H2zm0 5h20v3H2z"></path>
                </svg>
            </button>
        </header>
    )
}


export default Header;