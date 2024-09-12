import Image from 'next/image';
import Link from 'next/link';

import {SearchResult} from '../store/searchSlice';

export default function ImageSearchResultCard({ result }: { result: SearchResult }) {
    return (
        <Link href={result.link} target='_blank' className='w-full'>
            <div className='w-full overflow-y-clip'>
              <Image className='w-full object-cover rounded-2xl' src={result.thumbnail} alt="Google tile" width={100} height={20} unoptimized={true} />
            </div>
            <div className='mt-2'>
              {/* description */}
              <div className='flex items-center gap-1'>
                {/* head */}
                <Image className='w-[18px] h-[18px] rounded-xl object-contain' src={result.favicon} alt="Google tile" width={100} height={100} unoptimized={true} />
                <span className='text-[#5f6368] text-sm font-roboto font-normal line-clamp-1'>{result.source}</span>
              </div>
              <p className='text-[#3c4043] text-sm font-sans font-medium line-clamp-2 my-2'>{result.title}</p>
            </div>
        </Link>
    );
}