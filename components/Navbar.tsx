import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex items-center p-4">
      <Button variant={"ghost"} size="icon" className="md:hidden">
        <Menu className="h-4 w-4" />
      </Button>
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
