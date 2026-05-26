import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/modules/core/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/core/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import { useAuthService } from "../services/useAuthService";

function ProfileAvatar() {
  const { user } = useAuthStore();
  const { logout } = useAuthService();

  if (!user) return null;

  const generateFallback = () => {
    let str = "";
    if (user.firstName) {
      str += user.firstName[0];
    }
    if (user.lastName) {
      str += user.lastName[0];
    }
    return str;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={`${user.image}`} />
          <AvatarFallback>{generateFallback()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-0">
        <div className="flex items-center gap-3 p-3">
          <Avatar size="lg">
            <AvatarImage src={`${user.image}`} />
            <AvatarFallback>{generateFallback()}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-semibold">
              {user.firstName} {user.lastName}
            </span>
            <span className="text-muted-foreground truncate text-sm">
              {user.email}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => logout()}
          className="m-1"
        >
          <LogOut />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileAvatar;
