"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
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
import Link from "next/link";
import { Check, EllipsisVertical } from "lucide-react";
import PlatformX from "../../../../public/image/twitter-x.svg";
import Youtube from "../../../../public/image/youtube.svg";
import Instagram from "../../../../public/image/instagram.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { createClient } from "@/utils/supabase/client";
import { DB_TABLES, ROLES_NAME } from "@/config";
import {
  deleteUserAction,
  giveUserPermissionAction,
  revokeUserPermissionAction,
} from "@/app/actions";
import { Input } from "@/components/ui/input";
import { User } from "@/types";

const itemsPerPage = 10;

const supabase = createClient();

const UserListTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const fetchUserList = async (page: number) => {
    try {
      const { count } = await supabase
        .from(DB_TABLES.USERS)
        .select("*", { count: "exact", head: true });

      const { data, error } = await supabase
        .from(DB_TABLES.USERS)
        .select(`*, user_permissions(user_id)`)
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      setUserData(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserList(currentPage);
  }, [currentPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-2xl font-bold py-3 text-nowrap">User List</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Avatar</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Youtube</TableHead>
            <TableHead>Platform X</TableHead>
            <TableHead>Instagram</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData.length > 0 ? (
            userData.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-nowrap px-3 min-w-[300px] !w-[500px]">
                  {user.name}
                </TableCell>
                <TableCell className="pr-0">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user?.avatar || ""} alt={user.name} />
                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase() || "NA"}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="text-nowrap px-3">
                  {user.role_id ? (
                    <Badge variant="outline" className="rounded-sm px-2 py-1">
                      {ROLES_NAME[user.role_id]}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <Link
                    href={user.youtube || "#"}
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <Image src={Youtube} width={22} height={22} alt="youtube" />
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={user.twitter || "#"}
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <Image src={PlatformX} width={14} height={14} alt="platform-x" />
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={user.instagram || "#"}
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <Image src={Instagram} width={22} height={22} alt="instagram" />
                  </Link>
                </TableCell>
                <TableCell>
                  {user?.verified === true ? <Check className="w-4 h-4" /> : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger>
                      <EllipsisVertical className="text-gray-500" />
                    </PopoverTrigger>
                    <PopoverContent className="w-full max-w-[190px]">
                      <div className="flex flex-col items-start gap-3 w-full">
                        {user.user_permissions?.find((perm) => perm.user_id === user.id) ? (
                          <form action={revokeUserPermissionAction}>
                            <Input type="hidden" name="userId" value={user.id} />
                            <Button
                              type="submit"
                              variant={"secondary"}
                              size={"sm"}
                              className="w-[150px]"
                            >
                              Revoke permission
                            </Button>
                          </form>
                        ) : (
                          <form action={giveUserPermissionAction}>
                            <Input type="hidden" name="userId" value={user.id} />
                            <Button
                              type="submit"
                              variant={"secondary"}
                              size={"sm"}
                              className="w-[150px]"
                            >
                              Give permission
                            </Button>
                          </form>
                        )}
                        <form action={deleteUserAction}>
                          <Input type="hidden" name="userId" value={user.id} />
                          <Button
                            type="submit"
                            variant={"destructive"}
                            size={"sm"}
                            className="w-[150px]"
                          >
                            Delete user
                          </Button>
                        </form>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
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

export default UserListTable;
