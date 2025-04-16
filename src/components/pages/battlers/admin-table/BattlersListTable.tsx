"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EllipsisVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { createBattlersAction, deleteBattlersAction, editBattlersAction } from "@/app/actions";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { FormMessage, Message } from "@/components/form-message";
import { createClient } from "@/utils/supabase/client";
import { DB_TABLES } from "@/config";
import { Battlers, TagsOption } from "@/types";
import { MultiSelect } from "@/components/multi-select";
import { Badge } from "@/components/ui/badge";

const itemsPerPage = 10;

const supabase = createClient();

const BattlersListTable = ({ searchParams }: { searchParams: Message }) => {
  const [open, setOpen] = useState(false);
  const [tagsData, setTagsData] = useState<TagsOption[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [battlersData, setBattlersData] = useState<Battlers[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const fetchBattlersList = async (page: number) => {
    try {
      const { count } = await supabase
        .from(DB_TABLES.BATTLERS)
        .select("*", { count: "exact", head: true });

      const { data, error } = await supabase
        .from(DB_TABLES.BATTLERS)
        .select(
          `
          *,
          battler_tags (
            tags (
              id,
              name
            )
          )
        `,
        )
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }
      setBattlersData(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchBattlersList(currentPage);
  }, [currentPage]);

  const fetchTagsData = async () => {
    const { data, error } = await supabase.from(DB_TABLES.TAGS).select("*");
    if (error) {
      console.log("error", error);
      return;
    }
    setTagsData(data || []);
  };

  useEffect(() => {
    fetchTagsData();
  }, []);

  const tagOptions = tagsData.map((tag) => ({
    label: tag.name,
    value: tag.id.toString(),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-2 py-4">
        <h1 className="text-3xl font-bold text-nowrap">Battlers List</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Create Battlers</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form>
              <DialogHeader>
                <DialogTitle>Create Battlers</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                <Label htmlFor="name">Name</Label>
                <Input name="name" placeholder="Enter your name" required />
                <Label htmlFor="tags">Tags</Label>
                <MultiSelect
                  name="tags"
                  options={tagOptions}
                  onValueChange={(values) => {
                    setSelectedTags(values);
                  }}
                  placeholder="Select Tags"
                  variant="inverted"
                  maxCount={3}
                  className="mb-2"
                />
                <Input type="hidden" name="tags" value={JSON.stringify(selectedTags)} />
                <Label htmlFor="location">location</Label>
                <Input name="location" placeholder="Enter your location" required />
                <Label htmlFor="bio">Bio</Label>
                <Input name="bio" placeholder="Enter bio" required />
                <Label htmlFor="avatar">Avatar</Label>
                <Input name="avatar" type="file" accept="image/*" required />
              </div>
              <DialogFooter className="flex !flex-col gap-3 items-center mt-2">
                <SubmitButton
                  className="w-full"
                  pendingText="Creating..."
                  formAction={createBattlersAction}
                >
                  Create
                </SubmitButton>
                <FormMessage message={searchParams} />
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Location</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {battlersData.length > 0 ? (
            battlersData.map((battler) => {
              const selectedTagIds = battler.battler_tags.map((tag) => tag.tags?.id.toString());
              return (
                <TableRow key={battler.id}>
                  <TableCell className="pr-0 w-[100px]">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={battler?.avatar || ""} alt={battler.name} />
                      <AvatarFallback>
                        {battler.name.slice(0, 2).toUpperCase() || "NA"}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="px-3 min-w-[200px] !w-[250px]">
                    <div className="truncate max-w-[250px]">{battler.name}</div>
                  </TableCell>
                  <TableCell className="px-3 min-w-[250px] !w-[350px]">
                    <div className="truncate max-w-[250px]">
                      {battler.battler_tags ? (
                        <div className="flex flex-wrap gap-2">
                          {battler.battler_tags
                            .filter((tag) => tag.tags?.name)
                            .map((tag, index) => (
                              <Badge key={index} variant={"secondary"} className="rounded-md">
                                {tag.tags?.name}
                              </Badge>
                            ))}
                        </div>
                      ) : (
                        <Badge variant={"secondary"} className="rounded-md">
                          -
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-3 min-w-[350px] !w-[350px]">
                    <div className="max-w-[350px]">{battler.bio}</div>
                  </TableCell>
                  <TableCell className="px-3 min-w-[300px] !w-[300px]">
                    <div className="truncate max-w-[300px]">{battler.location}</div>
                  </TableCell>

                  <TableCell className="text-right w-[100px]">
                    <Popover>
                      <PopoverTrigger>
                        <EllipsisVertical className="text-gray-500" />
                      </PopoverTrigger>
                      <PopoverContent className="w-full max-w-[190px]">
                        <div className="flex flex-col items-start gap-3 w-full">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant={"secondary"} size={"sm"} className="w-[150px]">
                                Edit Battlers
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <form>
                                <DialogHeader>
                                  <DialogTitle>Edit Battlers</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                                  <Input type="hidden" name="userId" value={battler.id} />
                                  <Label htmlFor="name">Name</Label>
                                  <Input
                                    name="name"
                                    defaultValue={battler.name}
                                    placeholder="Enter your name"
                                    required
                                  />

                                  <Label htmlFor="tags">Tags</Label>
                                  <MultiSelect
                                    name="tags"
                                    options={tagOptions}
                                    defaultValue={selectedTagIds}
                                    onValueChange={(values) => {
                                      setSelectedTags(values);
                                    }}
                                    placeholder="Select Tags"
                                    variant="inverted"
                                    className="mb-2"
                                    maxCount={3}
                                  />
                                  <Input
                                    type="hidden"
                                    name="tags"
                                    value={JSON.stringify(selectedTags)}
                                  />

                                  <Label htmlFor="location">Location</Label>
                                  <Input
                                    name="location"
                                    defaultValue={battler.location}
                                    placeholder="Enter your location"
                                    required
                                  />

                                  <Label htmlFor="bio">Bio</Label>
                                  <Input
                                    name="bio"
                                    defaultValue={battler.bio}
                                    placeholder="Enter bio"
                                    required
                                  />
                                  <Label htmlFor="avatar">Avatar</Label>
                                  <Input name="avatar" type="file" accept="image/*" />
                                  <Input
                                    type="hidden"
                                    name="currentAvatar"
                                    value={battler.avatar || ""}
                                  />
                                </div>
                                <DialogFooter className="flex !flex-col gap-3 items-center mt-2">
                                  <SubmitButton
                                    className="w-full"
                                    pendingText="Updating..."
                                    formAction={editBattlersAction}
                                  >
                                    Edit
                                  </SubmitButton>
                                  <FormMessage message={searchParams} />
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>

                          <form action={deleteBattlersAction}>
                            <Input type="hidden" name="userId" value={battler.id} />
                            <Button
                              type="submit"
                              variant={"destructive"}
                              size={"sm"}
                              className="w-[150px]"
                            >
                              Delete Battlers
                            </Button>
                          </form>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="py-5">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((page) => Math.max(1, page - 1));
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(index + 1);
                  }}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((page) => Math.min(totalPages, page + 1));
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default BattlersListTable;
