import Image from "next/image";
import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { AppDispatch } from "../store/store";
import { setImageFile, setImageUrl, setQueryType, fetchImageSearchResults } from "../store/searchSlice";
import { useRouter } from 'next/navigation';

interface GoogleLensSearchPopupProps {
  setSearchState: (
    state: "IDLE" | "TEXT_SEARCHING" | "SPEAKING" | "CAMERA"
  ) => void;
}

export default function GoogleLensSearchPopup(
  props: GoogleLensSearchPopupProps
) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [isDragOver, setIsDragOver] = useState(false);
  const [imageLink, setImageLink] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleImageSearch(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleImageSearch(file);
    }
  };

  const handleImageSearch = (file: File) => {
    dispatch(setImageFile(file));
    dispatch(setQueryType('image'));
    dispatch(fetchImageSearchResults(file));
    router.push("/lens");
  };

  const handleImageLinkSearch = () => {
    if (imageLink.trim()) {
      dispatch(setImageUrl(imageLink.trim()));
      dispatch(setQueryType('imageUrl'));
      dispatch(fetchImageSearchResults(imageLink.trim()));
      router.push("/lens");
    } else {
      // You might want to show an error message to the user
      console.log("Please enter a valid image URL");
    }
  };

  return (
    <div className="w-full p-6 absolute -top-4 dark:bg-[#303134] rounded-3xl">
      <div className="flex items-center w-full">
        {/* heading */}
        <span className="font-sans text-base flex-1 text-center text-[#f1f3f4] font-semibold">
          Search any image with Google Lens
        </span>
        <button onClick={() => props.setSearchState("IDLE")}>
          <Image
            src="/cross.svg"
            alt="Close or cross icon"
            width={20}
            height={20}
          />
        </button>
      </div>
      <div
        className={`relative mt-4 p-6 rounded-lg overflow-clip border border-dashed border-[#3c4043] flex flex-col items-center bg-[#202124]`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* main content */}
        <div className="flex items-center gap-5 py-10">
          <Image
            src="/imageSelector.svg"
            alt="Camera icon"
            width={60}
            height={60}
          />
          <div className="font-sans dark:text-[#93969b] text-base font-medium">
            <span>Drag an image here or&nbsp;</span>
            <label className="text-[#8ab4f8] hover:underline cursor-pointer">
              upload a file
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-center w-full gap-4 my-4">
            {/* divider */}
            <div className="flex-1 h-[1px] bg-[#3c4043]"></div>
            <span className="text-[#9aa0a6]">OR</span>
            <div className="flex-1 h-[1px] bg-[#3c4043]"></div>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              className="flex-1 dark:bg-[#303134] border dark:border-[#3c4043] dark:text-[#f1f3f4] placeholder:text-[#757575] px-6 py-[10px] rounded-full focus:outline-none focus:border-[#8ab4f8] hover:border-[#5f6368]"
              placeholder="Paste image link"
              value={imageLink}
              onChange={(e) => setImageLink(e.target.value)}
            />
            <button
              className="dark:bg-[#303134] px-6 py-[10px] dark:text-[#8ab4f8] border dark:border-[#3c4043] rounded-full hover:border-[#3c4043] hover:text-[#d2e3fc] hover:bg-[rgba(136,170,187,0.04)]"
              onClick={handleImageLinkSearch}
            >
              Search
            </button>
          </div>
        </div>
        {isDragOver && (
          <div className="bg-[#343c4d] absolute left-0 right-0 top-0 bottom-0 flex flex-col justify-center items-center rounded-lg border border-dashed border-[#667ca7]">
            {/* to handle file drag and drop */}
            <span className="text-[#93969b] font-sans text-base font-medium">Drop an image here</span>
          </div>
        )}
      </div>
    </div>
  );
}