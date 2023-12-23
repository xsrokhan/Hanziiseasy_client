import React from 'react'
import ReactDOM from 'react-dom'

interface props {
  open: boolean,
  children: React.ReactNode,
  close: any,
  closeAnimation: boolean
}

const InfoModal = ({ open, children, close, closeAnimation }: props) => {
  if (!open) return null

  return ReactDOM.createPortal(
    <div className={`modal-overlay ${closeAnimation ? "fade_out" : ""}`}>
      <div className="modal_content">
        <div onClick={close} className="close_modal"><i className="fa-solid fa-rectangle-xmark"></i></div>
        {children}
      </div>
    </div>,
    document.getElementById("portal")!
  )
}

export default InfoModal