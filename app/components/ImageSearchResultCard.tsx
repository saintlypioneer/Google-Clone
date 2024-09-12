import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchResult } from '../store/searchSlice';

export default function ImageSearchResultCard({ result }: { result: SearchResult }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        return null;
    }

    return (
        <Link href={result.link} target='_blank' className='w-full'>
            <div className='w-full overflow-y-clip relative' style={{ paddingBottom: '177.78%' }}> {/* 9:16 aspect ratio */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-2xl"></div>
                )}
                <Image 
                    className={`w-full object-cover rounded-2xl absolute top-0 left-0 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} 
                    src={result.thumbnail} 
                    alt="Search result"
                    layout="fill"
                    objectFit="cover"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    unoptimized={true}
                />
            </div>
            <div className='mt-2'>
                <div className='flex items-center gap-1'>
                    <Image 
                        className='w-[18px] h-[18px] rounded-xl object-contain' 
                        src={result.favicon} 
                        alt="Website favicon" 
                        width={18} 
                        height={18} 
                        unoptimized={true}
                    />
                    <span className='text-[#5f6368] text-sm font-roboto font-normal line-clamp-1'>{result.source}</span>
                </div>
                <p className='text-[#3c4043] text-sm font-sans font-medium line-clamp-2 my-2'>{result.title}</p>
            </div>
        </Link>
    );
}