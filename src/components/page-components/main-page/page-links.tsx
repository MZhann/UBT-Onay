import Link from "next/link";

const PageLinks = () => {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <Link
        href={"/ubt-tests"}
        className="block p-6 relative z-0 bg-[#8da1ec] aspect-video rounded-xl bg-[url('/assets/images/decoration/unt-tests.svg')]  bg-cover bg-centerfull hover:-mt-1 duration-100"
      >
        <div className="absolute w-full  h-14 backdrop-blur-md top-0 left-0 rounded-xl"></div>
        <div className="absolute w-full  h-16 backdrop-blur-md bottom-0 left-0 rounded-xl"></div>

        <div className="text-white h-full flex flex-col justify-between">
          <p className="text-2xl font-bold z-20 uppercase">unt tests</p>
          <p className="z-20">
            500 UBT variants from <br />
            2020-2025
          </p>
        </div>
      </Link>
      <Link
        href={"/mistake-bank"}
        className="p-6 relative z-0 bg-[#f3ecd8] aspect-video rounded-xl bg-[url('/assets/images/decoration/mistake-bank.svg')]  bg-cover bg-centerfull hover:-mt-1 duration-100"
      >
        {/* <div className="absolute w-full  h-14 backdrop-blur-md top-0 left-0 rounded-xl"></div> */}
        <div className="absolute w-full  h-16 backdrop-blur-sm bottom-0 left-0 rounded-xl"></div>

        <div className="text-white h-full flex flex-col justify-between">
          <p className="text-2xl font-bold z-20 uppercase text-[#CB6923]">
            mistake bank
          </p>
          <p className="z-20">26 mistakes from 12 Tests</p>
        </div>
      </Link>
      <Link
        href={"/leaderboard"}
        className="p-6 relative z-0 bg-[#5b80f1] aspect-video rounded-xl bg-[url('/assets/images/decoration/leaderboard.svg')]  bg-cover bg-centerfull hover:-mt-1 duration-100"
      >
        <div className="absolute w-full  h-20 backdrop-blur-md top-0 left-0 rounded-xl"></div>
        <div className="absolute w-full  h-20 backdrop-blur-md bottom-0 left-0 rounded-xl"></div>

        <div className="text-white h-full flex flex-col justify-between">
          <p className="text-2xl font-bold z-20 uppercase">leaderboard</p>
          <div className="z-20 flex w-full justify-between">
            <p>
              Global: <br />
              3rd place
            </p>
            <p>
              Rating:
              <br />
              1863 p
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PageLinks;
