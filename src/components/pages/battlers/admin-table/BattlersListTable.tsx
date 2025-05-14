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
import { EllipsisVertical, Highlighter, Loader, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { deleteBattlersAction, highlightedBattlerAction } from "@/app/actions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { DB_TABLES } from "@/config";
import { Battlers } from "@/types";
import { Badge } from "@/components/ui/badge";
import FormBattlers from "@/components/pages/battlers/admin-table/FormBattlers";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

const itemsPerPage = 10;

const supabase = createClient();

const BattlersListTable = () => {
  const { control } = useForm();
  const [open, setOpen] = useState(false);
  const [edit, setEditOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const [toggleHighlighter, setToggleHighlighter] = useState<boolean>(false);
  const [selectedHighlightedBattlers, setSelectedHighlightedBattlers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [battlersData, setBattlersData] = useState<Battlers[]>([]);
  const [activeTagId, setActiveTagId] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const fetchHighlightedBattlers = async () => {
    try {
      const { data: highlightData, error: highlightError } = await supabase
        .from(DB_TABLES.HIGHLIGHTS)
        .select("entity_id");
      if (highlightError) {
        console.log(highlightError);
        return;
      }
      const ids = highlightData?.map((item) => item.entity_id) || [];
      setSelectedHighlightedBattlers(ids);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchHighlightedBattlers();
  }, [selectedHighlightedBattlers.length]);

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
          users!battlers_added_by_fkey (
            added_by: name
          ),
          battler_tags (
            tags (
              id,
              name
            )
          )
        `,
        )
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)
        .order("created_at", { ascending: false });

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

  const handleDeleteBattler = async (battlerId: string) => {
    setDeleteLoading(true);
    try {
      const response = await deleteBattlersAction(battlerId);
      if (response.success) {
        toast.success(response.message);
        setActivePopover(null);
        fetchBattlersList(currentPage);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(`Delete battler failed: ${error}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleHighlighterChange = async (battler: Battlers, isChecked: boolean) => {
    try {
      const response = await highlightedBattlerAction(isChecked, battler);
      if (response.success) {
        toast.success(response.message);
        fetchBattlersList(currentPage);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update highlighter status");
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-2 py-4">
        <h1 className="text-3xl font-bold text-nowrap">Battlers List</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setToggleHighlighter((prev) => !prev)}>
            <span className="flex items-center gap-2 font-medium">
              {toggleHighlighter ? (
                <>
                  <X className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  Close
                </>
              ) : (
                <>
                  <Highlighter className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  Show highlighted battlers
                </>
              )}
            </span>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="default">Create Battlers</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <FormBattlers
                createBattler={true}
                setOpenClose={() => setOpen(false)}
                fetchBattlersList={() => fetchBattlersList(currentPage)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Added By</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {battlersData.length > 0 ? (
            battlersData.map((battler) => {
              const validTags = battler.battler_tags?.filter((tag) => tag.tags?.name) || [];
              const isExpanded = activeTagId === battler.id;
              const shouldCollapse = validTags.length > 4;
              const displayTags = shouldCollapse && !isExpanded ? validTags.slice(0, 3) : validTags;

              return (
                <TableRow key={battler.id}>
                  <TableCell className="pr-0 w-[100px] flex items-center justify-between gap-1">
                    {toggleHighlighter && (
                      <Controller
                        name={`battler-${battler.id}`}
                        control={control}
                        defaultValue={selectedHighlightedBattlers.includes(battler.id)}
                        render={({ field }) => (
                          <Checkbox
                            checked={
                              field.value ?? selectedHighlightedBattlers.includes(battler.id)
                            }
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              handleHighlighterChange(battler, checked as boolean);
                            }}
                            id={`battler-${battler.id}`}
                          />
                        )}
                      />
                    )}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={battler?.avatar || ""} alt={battler.name} />
                      <AvatarFallback>
                        {battler?.name?.slice(0, 2).toUpperCase() || "NA"}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="px-3 min-w-[200px] !w-[250px]">
                    <div className="truncate max-w-[250px]">{battler.name}</div>
                  </TableCell>
                  <TableCell className="px-3 min-w-[250px] !w-[350px]">
                    <div className="truncate max-w-[250px]">
                      {validTags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {displayTags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="rounded-md">
                              {tag.tags.name}
                            </Badge>
                          ))}

                          {shouldCollapse && (
                            <Badge
                              variant="outline"
                              className="rounded-md cursor-pointer"
                              onClick={() => setActiveTagId(isExpanded ? "" : battler.id)}
                            >
                              {isExpanded ? "Show less" : `+${validTags.length - 3} more`}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <Badge variant="secondary" className="rounded-md">
                          -
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-3 min-w-[350px] !w-[350px]">
                    <div className="max-w-[350px]">
                      {battler?.bio && battler.bio.length > 125
                        ? `${battler.bio.slice(0, 125)}...`
                        : battler?.bio}
                    </div>
                  </TableCell>
                  <TableCell className="px-3 min-w-[100px] !w-[300px]">
                    <div className="truncate max-w-[250px]">{battler.location}</div>
                  </TableCell>
                  <TableCell className="px-3 min-w-[100px] !w-[300px]">
                    <div className="truncate max-w-[300px]">
                      {battler?.users?.added_by ? (
                        <Badge
                          variant="default"
                          className="rounded-md text-medium capitalize text-xs !text-white"
                        >
                          {battler.users.added_by}
                        </Badge>
                      ) : (
                        <Badge variant={"default"} className="rounded-md">
                          -
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right w-[100px]">
                    <Popover
                      open={activePopover === battler.id}
                      onOpenChange={(isOpen) => setActivePopover(isOpen ? battler.id : null)}
                    >
                      <PopoverTrigger asChild>
                        <Button variant="link">
                          <EllipsisVertical className="text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full max-w-[190px]">
                        <div className="flex flex-col items-start gap-3 w-full">
                          <Dialog
                            open={edit}
                            onOpenChange={(open) => {
                              setEditOpen(open);
                              if (!open) setActivePopover(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant={"secondary"} size={"sm"} className="w-[150px]">
                                Edit Battlers
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <FormBattlers
                                createBattler={false}
                                setPopoverOpen={() => setActivePopover(null)}
                                setOpenClose={() => setEditOpen(false)}
                                fetchBattlersList={() => fetchBattlersList(currentPage)}
                                battlerData={battler}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button
                            type="submit"
                            variant={"destructive"}
                            size={"sm"}
                            onClick={() => handleDeleteBattler(battler?.id)}
                            disabled={deleteLoading}
                            className="w-[150px]"
                          >
                            {deleteLoading ? (
                              <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Delete Battlers"
                            )}
                          </Button>
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
