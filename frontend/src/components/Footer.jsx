import React from "react";

const Footer = () => {
  return (
    <div className="footer">
      <p className="text-center p-2">
        StuNotes &copy; {new Date().getFullYear()}. All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
