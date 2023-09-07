import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { wait } from "@/lib/wait";
import { Suspense } from "react";
import CollectionItems from "@/components/CollectionItems";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMessageFallback />}>
        <WelcomeMessage />
      </Suspense>
      <Suspense fallback={<WelcomeMessageFallback />}>
        <CollectionItems />
      </Suspense>
    </>
  );
}

const WelcomeMessageFallback = () => {
  return <div className="mb-10">Loading...</div>;
};

const WelcomeMessage = async () => {
  const user = await currentUser();
  await wait(3000);

  if (!user) {
    return <div>No User Found</div>;
  }

  return (
    <main className="flex w-full mb-10">
      <h1 className="text-4xl font-bold">
        Welcome, <br /> {user.firstName} {user.lastName}
      </h1>
    </main>
  );
};
