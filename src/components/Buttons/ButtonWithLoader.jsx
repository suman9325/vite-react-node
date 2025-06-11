import React, { useState } from 'react'

export default function ButtonWithLoader({ children, style, onBtnClick, isLoading }) {
    const handleClick = (e) => {
        e.preventDefault();  // Prevent default behavior
        onBtnClick();  // Call the onClick function passed down as a prop
    };
    return (
        <>
            <button onClick={handleClick} className={style} disabled={isLoading}>
                {
                    isLoading ? <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> :
                        children
                }
            </button>
        </>
    )
}
