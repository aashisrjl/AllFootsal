import { SVGProps } from '@eduPlatform/types';
export const SubtractIcon = ({ color = 'black' }: SVGProps) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.5 11H5.5V13H19.5V11Z" fill={color} />
    </svg>
  );
};
