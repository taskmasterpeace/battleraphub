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
import { Check, EllipsisVertical, Loader } from "lucide-react";
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
import { supabase } from "@/utils/supabase/client";
import { DB_TABLES, ROLE, ROLES_NAME } from "@/config";
import {
  deleteUserAction,
  giveUserPermissionAction,
  markAsVerifiedAction,
  revokeUserPermissionAction,
} from "@/app/actions";
import { User } from "@/types";
import { toast } from "sonner";

const itemsPerPage = 10;

const UserListTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activePopover, setActivePopover] = useState<string | null>(null);
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const [givePermissionLoading, setGivePermissionLoading] = useState(false);
  const [revokePermissionLoading, setRevokePermissionLoading] = useState(false);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);
  const [markAsVerifiedLoading, setMarkAsVerifiedLoading] = useState(false);

  const fetchUserList = async (page: number) => {
    try {
      const { count } = await supabase
        .from(DB_TABLES.USERS)
        .select("*", { count: "exact", head: true });

      const { data, error } = await supabase
        .from(DB_TABLES.USERS)
        .select(`*, user_permissions(user_id)`)
        .or(`role_id.neq.${ROLE.ADMIN},role_id.is.null`)
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

  const onRevokePermission = async (userId: string) => {
    setRevokePermissionLoading(true);
    try {
      const response = await revokeUserPermissionAction(userId);
      if (response.success) {
        toast.success(response.message);
        setActivePopover(null);
        fetchUserList(currentPage);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(`revoke permission failed: ${error}`);
    } finally {
      setRevokePermissionLoading(false);
    }
  };

  const onGivePermission = async (userId: string) => {
    setGivePermissionLoading(true);
    try {
      const response = await giveUserPermissionAction(userId);
      if (response.success) {
        toast.success(response.message);
        setActivePopover(null);
        fetchUserList(currentPage);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(`give permission failed: ${error}`);
    } finally {
      setGivePermissionLoading(false);
    }
  };

  const markAsVerified = async (userId: string) => {
    setMarkAsVerifiedLoading(true);
    try {
      const response = await markAsVerifiedAction(userId);
      if (response.success) {
        toast.success(response.message);
        setActivePopover(null);
        fetchUserList(currentPage);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(`mark as verified failed: ${error}`);
    } finally {
      setMarkAsVerifiedLoading(false);
    }
  };

  const onDeleteUser = async (userId: string) => {
    setDeleteUserLoading(true);
    try {
      const response = await deleteUserAction(userId);
      if (response.success) {
        toast.success(response.message);
        fetchUserList(currentPage);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(`delete user failed: ${error}`);
    } finally {
      setDeleteUserLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="py-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-nowrap">User List</h1>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
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
                <TableCell className="">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user?.avatar || ""} alt={user.name} />
                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase() || "NA"}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="text-wrap px-3 min-w-[250px] !w-[250px]">
                  {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
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
                    <Image
                      src={PlatformX}
                      width={14}
                      height={14}
                      alt="platform-x"
                      className="filter brightness-0 dark:filter-none"
                    />
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={user.instagram || "#"}
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <Image
                      src={Instagram}
                      width={22}
                      height={22}
                      alt="instagram"
                      className="filter brightness-0 dark:filter-none"
                    />
                  </Link>
                </TableCell>
                <TableCell>
                  {user?.verified === true ? <Check className="w-4 h-4" /> : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Popover
                    open={activePopover === user.id}
                    onOpenChange={(isOpen) => setActivePopover(isOpen ? user.id : null)}
                  >
                    <PopoverTrigger>
                      <EllipsisVertical className="text-muted-foreground" />
                    </PopoverTrigger>
                    <PopoverContent className="w-[230px]">
                      <div className="flex flex-col items-start gap-3 w-full">
                        <div>
                          {user.verified === false && (
                            <Button
                              type="submit"
                              variant={"secondary"}
                              size={"sm"}
                              onClick={() => markAsVerified(user?.id)}
                              className="w-[190px]"
                              disabled={markAsVerifiedLoading}
                            >
                              {markAsVerifiedLoading ? (
                                <>
                                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                                  Verifying...
                                </>
                              ) : (
                                "Mark as Verified"
                              )}
                            </Button>
                          )}
                        </div>
                        <div>
                          {user.user_permissions?.find((perm) => perm.user_id === user.id) ? (
                            <Button
                              type="submit"
                              variant={"secondary"}
                              size={"sm"}
                              onClick={() => onRevokePermission(user?.id)}
                              className="w-[190px]"
                              disabled={revokePermissionLoading}
                            >
                              {revokePermissionLoading ? (
                                <>
                                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                                  Revoking permission...
                                </>
                              ) : (
                                "Revoke c.m. permission"
                              )}
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              variant={"secondary"}
                              size={"sm"}
                              onClick={() => onGivePermission(user?.id)}
                              className="w-[190px]"
                              disabled={givePermissionLoading}
                            >
                              {givePermissionLoading ? (
                                <>
                                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                                  Giving permission...
                                </>
                              ) : (
                                "Give c.m. permission"
                              )}
                            </Button>
                          )}
                        </div>

                        <Button
                          type="submit"
                          variant={"destructive"}
                          size={"sm"}
                          onClick={() => onDeleteUser(user?.id)}
                          className="w-[190px]"
                          disabled={deleteUserLoading}
                        >
                          {deleteUserLoading ? (
                            <>
                              <Loader className="w-4 h-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete user"
                          )}
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
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
