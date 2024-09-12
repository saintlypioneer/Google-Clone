interface TextButtonProps {
    text: string;
    onClick: () => void;
}

export default function TextButton(props: TextButtonProps){
    return (
        <button onClick={props.onClick} className="dark:bg-[#303134] px-5 py-2 rounded border border-[#303134] hover:border-[#5f6368]">{props.text}</button>
    );
}