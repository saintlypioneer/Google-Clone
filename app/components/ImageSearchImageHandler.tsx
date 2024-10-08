"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef, CSSProperties } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { RootState } from "../store/store";
import { updateImageUrl, fetchImageSearchResults } from "../store/searchSlice";
import debounce from "lodash/debounce";
import { motion } from "framer-motion";

interface Dot {
  x: number;
  y: number;
  delay: number;
}

export default function ImageSearchImageHandler() {
  const [searchType, setSearchType] = useState("Search");
  const [imageLoaded, setImageLoaded] = useState(false);

  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();

  const { imageFile, imageUrl, status } = useSelector(
    (state: RootState) => state.search
  );

  const [overlayCoordinates, setOverlayCoordinates] = useState([
    15, 10, 85, 90,
  ]); // left, top, right, bottom in percentage
  const dragStartRef = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCoordinatesRef = useRef(overlayCoordinates);

  useEffect(() => {
    overlayCoordinatesRef.current = overlayCoordinates;
  }, [overlayCoordinates]);

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

  const cropImage = useCallback(() => {
    if (!imageUrl || !canvasRef.current) return;

    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      const imgWidth = img.width;
      const imgHeight = img.height;

      const currentCoords = overlayCoordinatesRef.current;

      canvas.width = (imgWidth * (currentCoords[2] - currentCoords[0])) / 100;
      canvas.height = (imgHeight * (currentCoords[3] - currentCoords[1])) / 100;

      ctx.drawImage(
        img,
        (imgWidth * currentCoords[0]) / 100,
        (imgHeight * currentCoords[1]) / 100,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], "cropped_image.png", {
            type: "image/png",
          });
          dispatch(fetchImageSearchResults(croppedFile));
        }
      }, "image/png");
    };
    img.src = imageUrl;
  }, [imageUrl, dispatch]);

  const debouncedCropAndSearch = useCallback(
    debounce(() => {
      cropImage();
    }, 500),
    [cropImage]
  );

  const handleOverlayChange = useCallback(() => {
    if (imageLoaded) {
      debouncedCropAndSearch();
    }
  }, [imageLoaded, debouncedCropAndSearch]);

  const handleCornerDrag = useCallback(
    (index: number, clientX: number, clientY: number) => {
      const container = document.querySelector(".overlay-container");
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;

      setOverlayCoordinates((prev) => {
        const newCoords = [...prev];
        const minEdge = 2;
        const maxEdge = 98;

        if (index === 0) {
          newCoords[0] = Math.max(minEdge, Math.min(x, newCoords[2] - 10));
          newCoords[1] = Math.max(minEdge, Math.min(y, newCoords[3] - 10));
        } else if (index === 1) {
          newCoords[2] = Math.min(maxEdge, Math.max(x, newCoords[0] + 10));
          newCoords[1] = Math.max(minEdge, Math.min(y, newCoords[3] - 10));
        } else if (index === 2) {
          newCoords[2] = Math.min(maxEdge, Math.max(x, newCoords[0] + 10));
          newCoords[3] = Math.min(maxEdge, Math.max(y, newCoords[1] + 10));
        } else if (index === 3) {
          newCoords[0] = Math.max(minEdge, Math.min(x, newCoords[2] - 10));
          newCoords[3] = Math.min(maxEdge, Math.max(y, newCoords[1] + 10));
        }

        return newCoords;
      });

      handleOverlayChange();
    },
    [handleOverlayChange]
  );

  const handleOverlayDrag = useCallback(
    (clientX: number, clientY: number) => {
      const container = document.querySelector(".overlay-container");
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const deltaX = ((clientX - dragStartRef.current.x) / rect.width) * 100;
      const deltaY = ((clientY - dragStartRef.current.y) / rect.height) * 100;

      setOverlayCoordinates((prev) => {
        const width = prev[2] - prev[0];
        const height = prev[3] - prev[1];

        let newLeft = dragStartRef.current.left + deltaX;
        let newTop = dragStartRef.current.top + deltaY;

        // Clamp the values to keep the overlay within the image boundaries
        newLeft = Math.max(2, Math.min(newLeft, 98 - width));
        newTop = Math.max(2, Math.min(newTop, 98 - height));

        return [newLeft, newTop, newLeft + width, newTop + height];
      });

      handleOverlayChange();
    },
    [handleOverlayChange]
  );

  const handleCornerMouseDown = useCallback(
    (index: number) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const moveHandler = (moveEvent: MouseEvent) => {
        handleCornerDrag(index, moveEvent.clientX, moveEvent.clientY);
      };
      const upHandler = () => {
        document.removeEventListener("mousemove", moveHandler);
        document.removeEventListener("mouseup", upHandler);
      };
      document.addEventListener("mousemove", moveHandler);
      document.addEventListener("mouseup", upHandler);
    },
    [handleCornerDrag]
  );

  const handleOverlayMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        left: overlayCoordinates[0],
        top: overlayCoordinates[1],
      };
      const moveHandler = (moveEvent: MouseEvent) => {
        handleOverlayDrag(moveEvent.clientX, moveEvent.clientY);
      };
      const upHandler = () => {
        document.removeEventListener("mousemove", moveHandler);
        document.removeEventListener("mouseup", upHandler);
      };
      document.addEventListener("mousemove", moveHandler);
      document.addEventListener("mouseup", upHandler);
    },
    [handleOverlayDrag, overlayCoordinates]
  );

  const overlayStyle: CSSProperties = {
    position: "absolute",
    left: `${overlayCoordinates[0]}%`,
    top: `${overlayCoordinates[1]}%`,
    right: `${100 - overlayCoordinates[2]}%`,
    bottom: `${100 - overlayCoordinates[3]}%`,
    backgroundColor: "rgba(0,0,0,0.2)", // Semi-transparent blue
    cursor: "move",
    borderRadius: "6px",
    overflow: "hidden",
  };

  const handleStyle: CSSProperties = {
    position: "absolute",
    width: "20px",
    height: "20px",
    pointerEvents: "auto",
    cursor: "pointer",
  };

  // Twinkling animation
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    if (status === "loading") {
      const newDots = Array.from({ length: 20 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setDots(newDots);
    } else {
      setDots([]);
    }
  }, [status]);

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
        <div className="w-auto h-[80%] max-h-[80vh] relative flex items-center justify-center rounded-2xl overflow-clip overlay-container">
          {!imageUrl || !imageLoaded ? (
            <div
              className="w-full h-full bg-gray-200 animate-pulse rounded-2xl"
              style={{ aspectRatio: "9/16" }}
            ></div>
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
              className={` max-h-full w-auto ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              unoptimized={true}
            />
          )}
          {imageLoaded && (
            <>
              {/* dark overlay */}
              {/* create 4 div that do not overlap with bg-black/30 */}
              <div
                className="absolute bg-black/50"
                style={{
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${overlayCoordinates[0]}%`,
                }}
              ></div>
              <div
                className="absolute bg-black/50"
                style={{
                  top: 0,
                  left: `${overlayCoordinates[0]}%`,
                  width: `${overlayCoordinates[2] - overlayCoordinates[0]}%`,
                  height: `${overlayCoordinates[1]}%`,
                }}
              ></div>
              <div
                className="absolute bg-black/50"
                style={{
                  top: `${overlayCoordinates[3]}%`,
                  left: `${overlayCoordinates[0]}%`,
                  width: `${overlayCoordinates[2] - overlayCoordinates[0]}%`,
                  height: `${100 - overlayCoordinates[3]}%`,
                }}
              ></div>
              <div
                className="absolute bg-black/50"
                style={{
                  top: 0,
                  left: `${overlayCoordinates[2]}%`,
                  width: `${100 - overlayCoordinates[2]}%`,
                  height: "100%",
                }}
              ></div>
              <div style={overlayStyle} onMouseDown={handleOverlayMouseDown}>
                {dots.map((dot, index) => (
                  <motion.div
                    key={index}
                    style={{
                      position: "absolute",
                      left: `${dot.x}%`,
                      top: `${dot.y}%`,
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: dot.delay,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  ...handleStyle,
                  borderTopLeftRadius: "6px",
                  borderLeft: "3px solid white",
                  borderTop: "3px solid white",
                  left: `${overlayCoordinates[0]}%`,
                  top: `${overlayCoordinates[1]}%`,
                }}
                onMouseDown={handleCornerMouseDown(0)}
              ></div>
              <div
                style={{
                  ...handleStyle,
                  borderTopRightRadius: "6px",
                  borderTop: "3px solid white",
                  borderRight: "3px solid white",
                  right: `${100 - overlayCoordinates[2]}%`,
                  top: `${overlayCoordinates[1]}%`,
                }}
                onMouseDown={handleCornerMouseDown(1)}
              ></div>
              <div
                style={{
                  ...handleStyle,
                  borderBottomRightRadius: "6px",
                  borderBottom: "3px solid white",
                  borderRight: "3px solid white",
                  right: `${100 - overlayCoordinates[2]}%`,
                  bottom: `${100 - overlayCoordinates[3]}%`,
                }}
                onMouseDown={handleCornerMouseDown(2)}
              ></div>
              <div
                style={{
                  ...handleStyle,
                  borderBottomLeftRadius: "6px",
                  borderLeft: "3px solid white",
                  borderBottom: "3px solid white",
                  left: `${overlayCoordinates[0]}%`,
                  bottom: `${100 - overlayCoordinates[3]}%`,
                }}
                onMouseDown={handleCornerMouseDown(3)}
              ></div>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center py-4">
        <div className="text-white/80 bg-[rgba(95,99,104,0.4)] flex rounded-full text-sm">
          <button
            onClick={() => setSearchType("Search")}
            className={`${
              searchType === "Search" ? "bg-white text-[#202124]" : ""
            } rounded-full px-3 py-[5px]`}
          >
            Search
          </button>
          <button
            onClick={() => setSearchType("Text")}
            className={`${
              searchType === "Text" ? "bg-white text-[#202124]" : ""
            } rounded-full px-3 py-[5px]`}
          >
            Text
          </button>
          <button
            onClick={() => setSearchType("Translate")}
            className={`${
              searchType === "Translate" ? "bg-white text-[#202124]" : ""
            } rounded-full px-3 py-[5px]`}
          >
            Translate
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
