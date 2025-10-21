import { SVGProps } from '@eduPlatform/types';

export const Bookmarked = ({ color = '#E37125' }: SVGProps) => {
  return (
    <svg
      width="14"
      height="21"
      viewBox="0 0 14 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 19.8211C14 20.6762 12.9963 21.1368 12.348 20.5792L7.65204 16.5407C7.27713 16.2183 6.72287 16.2183 6.34796 16.5407L1.65204 20.5792C1.0037 21.1368 0 20.6762 0 19.8211V1C0 0.447716 0.447715 0 1 0H13C13.5523 0 14 0.447715 14 1V19.8211Z"
        fill={color}
      />
    </svg>
  );
};
