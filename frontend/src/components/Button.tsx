// import React from "react";

interface Props {
  children: String;
  color?: "primary" | "secondary" | "danger" | "spotify";
  onClick: () => void;
}
const Button = ({ children, onClick, color = "primary" }: Props) => {
  return (
    <button className={"btn btn-" + color} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
