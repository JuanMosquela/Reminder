import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import SadFace from "./icons/SadFace";
import CreateCollectionBtn from "./CreateCollectionBtn";
import CollectionCard from "./CollectionCard";

const CollectionItems = async () => {
  const user = await currentUser();
  const collections = await prisma.collection.findMany({
    include: {
      tasks: true,
    },
    where: {
      userId: user?.id,
    },
  });
  if (collections.length === 0) {
    return (
      <div className="flex flex-col mb-4 gap-5">
        <Alert>
          <SadFace />
          <AlertTitle>There are no collections yet</AlertTitle>
          <AlertDescription>
            Create a collection to get started
          </AlertDescription>
        </Alert>
        <CreateCollectionBtn />
      </div>
    );
  }

  return (
    <div>
      <CreateCollectionBtn />
      <div className="flex flex-col gap-4 mb-6">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
};

export default CollectionItems;
