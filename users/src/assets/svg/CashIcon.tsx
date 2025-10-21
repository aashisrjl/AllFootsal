import { SVGProps } from '@eduPlatform/types';
export const CashIcon = ({ color = 'black' }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none">
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      d="M11.333 13.665H4.667c-2 0-3.334-1-3.334-3.333V5.665c0-2.333 1.334-3.333 3.334-3.333h6.666c2 0 3.334 1 3.334 3.333v4.667c0 2.333-1.334 3.333-3.334 3.333Z"
    />
    <path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM3.667 6.332v3.333M12.333 6.332v3.333"
    />
  </svg>
);
