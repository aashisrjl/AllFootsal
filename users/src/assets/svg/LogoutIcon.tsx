import { SVGProps } from '@eduPlatform/types';

export const LogoutIcon = ({
  color = '#718096',
  width = '20',
  height = '20',
}: SVGProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.8333 13.332L14.1667 9.9987M14.1667 9.9987L10.8333 6.66536M14.1667 9.9987L2.5 9.9987M6.66667 13.332V14.1654C6.66667 15.5461 7.78596 16.6654 9.16667 16.6654H15C16.3807 16.6654 17.5 15.5461 17.5 14.1654V5.83203C17.5 4.45132 16.3807 3.33203 15 3.33203H9.16667C7.78596 3.33203 6.66667 4.45132 6.66667 5.83203V6.66536"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
