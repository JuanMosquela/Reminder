"use client";

import { Collection, Task } from "@prisma/client";
import React, { useMemo, useState, useTransition } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { CaretDownIcon, CaretUpIcon, TrashIcon } from "@radix-ui/react-icons";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import PlusIcon from "./icons/PlusIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { deleteCollection } from "@/actions/collection";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import CreateTaskDialog from "./CreateTaskDialog";
import TaskCard from "./TaskCard";

interface CollectionProps {
  collection: Collection & {
    tasks: Task[];
  };
}
const tasks: string[] = ["Task 1", "Task 2", "Task 3"];

const CollectionCard = ({ collection }: CollectionProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const totalTasks = collection.tasks.length;

  const tasksDone = useMemo(() => {
    return collection.tasks.filter((task) => task.done).length;
  }, [collection.tasks]);

  const progress =
    collection.tasks.length === 0 ? 0 : (tasksDone / totalTasks) * 100;

  const removeCollection = async () => {
    try {
      await deleteCollection(collection.id);
      console.log("borrar");
      toast({
        title: "Success",
        description: "Collection deleted successfully",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something gone wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <CreateTaskDialog
        open={showModal}
        setOpen={setShowModal}
        collection={collection}
      />
      <Collapsible open={isOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn(
              "flex w-full justify-between p-6",
              CollectionColors[collection.color as CollectionColor]
            )}
          >
            <span className="text-white font-bold"> {collection.name}</span>
            {isOpen ? (
              <CaretUpIcon
                className="h-6 w-6"
                onClick={() => setIsOpen(false)}
              />
            ) : (
              <CaretDownIcon
                className="w-6 h-6"
                onClick={() => setIsOpen(true)}
              />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex rounded-b-md flex-col dark:bg-neutral-900 shadow-lg">
          {totalTasks > 0 ? (
            <>
              <Progress className="rounded-none" value={progress} />
              <div className="p-4 gap-3 flex flex-col">
                {collection.tasks.map((task, i) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </>
          ) : (
            <Button
              variant={"ghost"}
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 p-8 py-12 rounded-none"
            >
              <p>There are no tasks yet:</p>
              <span
                className={cn(
                  "text-sm bg-clip-text text-transparent",
                  CollectionColors[collection.color as CollectionColor]
                )}
              >
                Create one
              </span>
            </Button>
          )}
          <Separator />
          <footer className="h-[40px] px-4 p-[2px] text-xs text-neutral-500 flex justify-between items-center">
            <p>Created at {collection.createdAt.toLocaleDateString("en-US")}</p>
            {isLoading ? (
              <span>Deleting ...</span>
            ) : (
              <div>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  onClick={() => setShowModal(true)}
                >
                  <PlusIcon />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button size={"icon"} variant={"ghost"}>
                      <TrashIcon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    Hello
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          startTransition(removeCollection);
                        }}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </footer>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

export default CollectionCard;
