import Image from 'next/image';
import Link from 'next/link';

export default function ImageSearchResultCard(){
    return (
        <Link href={"/"} className='w-full'>
            <div className='w-full overflow-y-clip'>
              <Image className='w-full object-cover rounded-2xl' src="/ss.png" alt="Google tile" width={100} height={20} />
            </div>
            <div className='mt-2'>
              {/* description */}
              <div className='flex items-center gap-1'>
                {/* head */}
                <Image className='w-[18px] h-[18px] rounded-xl object-contain' src="/google-tile.svg" alt="Google tile" width={100} height={100} />
                <span className='text-[#5f6368] text-sm font-roboto font-normal'>Getty Images</span>
              </div>
              <p className='text-[#3c4043] text-sm font-sans font-medium line-clamp-2 my-2'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea eos eveniet ducimus reiciendis sequi corrupti similique placeat id animi delectus vitae totam ex ratione, in, esse alias ipsam repellat minus.</p>
            </div>
        </Link>
    );
}