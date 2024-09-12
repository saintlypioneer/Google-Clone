import Image from 'next/image';

export default function ImageSearchResultCard(){
    return (
        <div>
            <Image src="/ss.png" alt="Google tile" width={100} height={100} />
        </div>
    );
}