const Page = () => {
  return (
    <div className="flex flex-col w-full min-h-screen pt-4">
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-[url('/assets/images/decoration/unt-tests.svg')]  bg-cover bg-centerfull" />
          <div className="aspect-video rounded-xl bg-[url('/assets/images/decoration/mistake-bank.svg')]  bg-cover bg-centerfull" />
          <div className="aspect-video rounded-xl bg-[url('/assets/images/decoration/leaderboard.svg')]  bg-cover bg-centerfull" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min bg-[url('/assets/images/decoration/generate-bg.svg')]  bg-cover bg-centerfull" />
      </div>
    </div>
  );
};

export default Page;
