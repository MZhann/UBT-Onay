import GenerateTestBlock from "@/components/page-components/main-page/generate-test-block";
import PageLinks from "@/components/page-components/main-page/page-links";

const Page = () => {
  return (
    <div className="flex flex-col w-full min-h-screen pt-4">
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <PageLinks />
        <GenerateTestBlock />
      </div>
    </div>
  );
};

export default Page;
