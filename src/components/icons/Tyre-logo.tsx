import React from "react";
import tyreImage from "../../../src/images/icons8-tyre-64.png";


export const TyreLogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => (
  
  <svg
  xmlns="http://www.w3.org/2000/svg"
  width={50} // Adjust the width as needed for the image
  height={50} // Adjust the height as needed for the image
  viewBox="0 0 64 64" // Adjust the viewBox accordingly for the image
  fill="none"
  {...props}
>
  {/* Image element for the tyre icon */}
  <image href={tyreImage} width="64" height="64" />
</svg>
  

);

export const TyreLogoText: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={200} // Adjust the width as needed
      height={50} // Adjust the height as needed
      viewBox="0 0 200 20" // Adjust the viewBox accordingly
      fill="none"
      {...props}
    >
      <text
        x="0"
        y="22" // Adjust the y position of the text as needed
        fill="currentColor"
        fontFamily="Arial"
        fontSize="25" // Adjust the font size as needed
        fontWeight="bold"
      >
        S.V.Enterprise
      </text>
    </svg>
  );
};
