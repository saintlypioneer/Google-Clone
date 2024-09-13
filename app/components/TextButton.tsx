import React from 'react';

interface TextButtonProps {
    text: string;
    bgColor?: string;
    onClick: () => void;
}

export default function TextButton({ text, bgColor, onClick }: TextButtonProps) {
    const buttonClassName = `px-5 py-2 rounded border hover:border-[#5f6368] ${
        bgColor 
            ? `dark:bg-[${bgColor}] border-[${bgColor}]` 
            : "dark:bg-[#303134] border-[#303134]"
    }`;

    return (
        <button onClick={onClick} className={buttonClassName}>
            {text}
        </button>
    );
}