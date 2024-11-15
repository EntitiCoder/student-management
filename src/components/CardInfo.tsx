import ArrowRightIcon from '@public/icons/ArrowRightIcon';
import Link from 'next/link';

interface CardInfoProps {
  data: string | number | undefined;
  linkTo?: string | undefined;
  title: string;
  icon: any;
}

const CardInfo = ({ data, title, icon, linkTo }: CardInfoProps) => {
  return (
    <div className="bg-white p-4 rounded-md flex items-center justify-between gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
      <div className="flex gap-4">
        {icon}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">{data}</h1>
          <span className="text-sm text-gray-400">{title}</span>
        </div>
      </div>
      {linkTo && (
        <Link href={linkTo}>
          <button className="px-1 flex items-center justify-center w-8 h-8 rounded-full bg-black">
            <ArrowRightIcon />
          </button>
        </Link>
      )}
    </div>
  );
};

export default CardInfo;
