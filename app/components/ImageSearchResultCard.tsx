import React, { useState } from 'react';
import Link from 'next/link';
import { SearchResult } from '../store/searchSlice';

export default function ImageSearchResultCard({ result }: { result: SearchResult }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageError(true);
        console.error(`Failed to load image: ${result.thumbnail}`);
    };

    if (imageError) {
        return (null);
    }

    return (
        <Link href={result.link} target='_blank' className='block w-full mb-4'>
            <div className='w-full relative'>
                {!imageLoaded && (
                    <div className="w-full pb-[56.25%] bg-gray-200 animate-pulse rounded-2xl"></div>
                )}
                <img 
                    className={`w-full rounded-2xl ${imageLoaded ? 'block' : 'hidden'}`} 
                    src={result.thumbnail} 
                    alt={result.title || "Search result"}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
            </div>
            <div className='mt-2'>
                <div className='flex items-center gap-1'>
                    {result.favicon && (
                        <img 
                            className='w-[18px] h-[18px] rounded-xl object-contain' 
                            src={result.favicon} 
                            alt="Website favicon" 
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    )}
                    <span className='text-[#5f6368] text-sm font-roboto font-normal line-clamp-1'>{result.source}</span>
                </div>
                <p className='text-[#3c4043] text-sm font-sans font-medium line-clamp-2 my-2'>{result.title}</p>
            </div>
        </Link>
    );
}