"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store"; // Adjust the import path as needed
import { updateImageUrl } from "../store/searchSlice"; // Adjust the import path as needed

export default function ImageSearchImageHandler() {
    const [searchType, setSearchType] = useState("Search");
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const dispatch = useDispatch();
    const { imageFile, imageUrl } = useSelector((state: RootState) => state.search);

    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile);
            dispatch(updateImageUrl(url));
            return () => URL.revokeObjectURL(url);
        }
    }, [imageFile, dispatch]);

    useEffect(() => {
        setImageLoaded(false);
    }, [imageUrl]);

    return (
        <div className="flex flex-col h-full py-8">
            <div className="flex justify-center items-center py-4">
                <button className="flex items-center gap-2 px-5 py-2 bg-transparent hover:bg-white/5 rounded-full border border-white/10">
                    <Image
                        src="/globe-search.svg"
                        alt="Upload icon"
                        width={24}
                        height={24}
                    />
                    <span className="text-[#f8f9fa] font-sans text-base font-medium">
                        Find image source
                    </span>
                </button>
            </div>
            <div className="flex-grow flex items-center justify-center overflow-hidden">
                <div className="w-auto h-[80%] max-h-[80vh] relative flex items-center justify-center">
                    {!imageUrl || !imageLoaded ? (
                        <div className="w-full h-full bg-gray-200 animate-pulse rounded-2xl" style={{aspectRatio: '9/16'}}></div>
                    ) : null}
                    {imageUrl && (
                        <Image 
                            src={imageUrl}
                            alt="Search image"
                            layout="intrinsic"
                            width={1000}
                            height={1000}
                            objectFit="contain"
                            onLoad={() => setImageLoaded(true)}
                            className={`rounded-2xl max-h-full w-auto ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            unoptimized={true}
                        />
                    )}
                </div>
            </div>
            <div className="flex justify-center items-center py-4">
                <div className="text-white/80 bg-[rgba(95,99,104,0.4)] flex rounded-full text-sm">
                    <button onClick={() => setSearchType('Search')} className={`${searchType === "Search" ? "bg-white text-[#202124]" : ""} rounded-full px-3 py-[5px]`}>Search</button>
                    <button onClick={() => setSearchType('Text')} className={`${searchType === "Text" ? "bg-white text-[#202124]" : ""} rounded-full px-3 py-[5px]`}>Text</button>
                    <button onClick={() => setSearchType('Translate')} className={`${searchType === "Translate" ? "bg-white text-[#202124]" : ""} rounded-full px-3 py-[5px]`}>Translate</button>
                </div>
            </div>
        </div>
    );
}