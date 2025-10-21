import { SVGProps } from '@eduPlatform/types';

export const PlayCircleOutlined = ({ color = '#FEFEFE' }: SVGProps) => {
  return (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.97493 18.8337C14.5773 18.8337 18.3083 15.1027 18.3083 10.5003C18.3083 5.89795 14.5773 2.16699 9.97493 2.16699C5.37256 2.16699 1.6416 5.89795 1.6416 10.5003C1.6416 15.1027 5.37256 18.8337 9.97493 18.8337Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.2832 10.6912V9.29953C7.2832 7.5662 8.5082 6.85787 10.0082 7.72453L11.2165 8.42453L12.4249 9.12453C13.9249 9.9912 13.9249 11.4079 12.4249 12.2745L11.2165 12.9745L10.0082 13.6745C8.5082 14.5412 7.2832 13.8329 7.2832 12.0995V10.6912Z"
        stroke={color}
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
