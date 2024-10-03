export const metadata = {
  title: 'Chat',
};

export default async function IndexPage() {
  return (
    <div className="flex justify-center items-center w-full h-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <p className="text-green-600 bold text-right uppercase">Select a user to chat with</p>
    </div>
  );
}
