import ProfileAvatar from "@/modules/auth/components/ProfileAvatar";

function Navbar() {
  return (
    <div className="flex h-16 w-full items-center justify-end border-b px-[24px]">
      <ProfileAvatar />
    </div>
  );
}

export default Navbar;
