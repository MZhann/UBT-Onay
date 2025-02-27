const TestHistory = () => {
  return (
    <div className="w-full flex flex-col items-center mt-4">
      <h2 className="font-bold text-2xl mb-6">History</h2>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 w-full text-white">
        <div className="aspect-video w-full flex flex-col items-center justify-center rounded-xl bg-[url('/assets/images/decoration/history-bg.svg')] bg-cover bg-center">
          <p className="text-xl undeline font-bold">Mathematics / Physics</p>
          <p className="">
            variant: <strong>5343</strong>
          </p>
          <p className="text-lg font-bold mt-20">result: 120/140</p>
        </div>
        <div className="aspect-video w-full rounded-xl bg-[url('/assets/images/decoration/history-bg.svg')] bg-cover bg-center">
          <div className="aspect-video w-full flex flex-col items-center justify-center rounded-xl bg-[url('/assets/images/decoration/history-bg.svg')] bg-cover bg-center">
            <p className="text-xl undeline font-bold">
              Geography / Mathematics
            </p>
            <p className="">
              variant: <strong>5456</strong>
            </p>
            <p className="text-lg font-bold mt-20">result: 103/140</p>
          </div>
        </div>
        <div className="aspect-video w-full rounded-xl bg-[url('/assets/images/decoration/history-bg.svg')] bg-cover bg-center">
          <div className="aspect-video w-full flex flex-col items-center justify-center rounded-xl bg-[url('/assets/images/decoration/history-bg.svg')] bg-cover bg-center">
            <p className="text-xl undeline font-bold">Mistake Bank</p>
            <p className="">{/* variant: <strong>5343</strong> */}</p>
            <p className="text-lg font-bold mt-20">result: 12/15</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHistory;
