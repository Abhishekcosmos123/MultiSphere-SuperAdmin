"use client"

import {
  Bell,
  Search,
  Menu,
  LogOut,
  Settings,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/router"
import { logoutRequest } from "@/store/slices/authSlice"
import { showSuccessToast } from "@/lib/utils/toast"
import { StorageKeys, storage } from "@/lib/utils/storage"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import type { User } from "@/types/auth"


interface NavbarProps {
  toggleSidebar: () => void
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const router = useRouter()
  const reduxUser = useSelector((state: RootState) =>state.auth.user);
  const dispatch = useDispatch();

  const [localUser, setLocalUser] = useState(reduxUser)

  useEffect(() => {
    if (!reduxUser) {
      const storedUser = storage.getJson(StorageKeys.USER) as User | null;
      if (storedUser) {
        setLocalUser(storedUser)
      }
    } else {
      setLocalUser(reduxUser)
    }
  }, [reduxUser])

  const handleLogout = () => {
    const token = storage.get(StorageKeys.TOKEN);
      dispatch(logoutRequest({ refreshToken: token ? String(token) : undefined }));
    storage.remove(StorageKeys.TOKEN);
    storage.remove(StorageKeys.USER);
    router.push("/");
    showSuccessToast("Logged out Successfully");
  };

  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button variant="ghost" size="icon" className="mr-2 lg:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 md:ml-auto md:gap-4 lg:ml-0">
          <form className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-64 rounded-md pl-8 md:w-80" />
          </form>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <UserIcon className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {localUser?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {localUser?.email || localUser?.phone}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
