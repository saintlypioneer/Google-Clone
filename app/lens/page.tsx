import GoogleLensNavigation from "../components/GoogleLensNavigation";
import ImageSearchImageHandler from "../components/ImageSearchImageHandler";

export default function Lens(){
    return (
        <div className="h-screen flex flex-col overflow-y-clip">
            <GoogleLensNavigation />
            <div className="flex-1 grid grid-cols-2 h-full overflow-y-clip">
                <ImageSearchImageHandler />
                <div className="bg-white">RIGHT</div>
            </div>
        </div>
    );
}