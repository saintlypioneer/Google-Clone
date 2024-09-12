import SimpleFooter from "./components/SimpleFooter";
import SimpleHeader from "./components/SimpleHeader";
import SimpleSearchSection from "./components/SimpleSearchSection";
export default function Home() {
  return (
    <div className="dark dark:bg-[#202124] dark:text-[#e8e8e8] text-sm font-[550]  min-h-screen w-screen flex flex-col">
        <SimpleHeader />
        <main className="flex-1 flex flex-col mt-10 justify-center">
          <SimpleSearchSection />
        </main>
        <SimpleFooter />
    </div>
  );
}
