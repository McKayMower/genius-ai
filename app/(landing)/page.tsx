import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Landing = () => {
  return (
    <div>
      Landing Page! (unprotected)
      <div>
        <Link href={"/sign-in"}>
          <Button>Sign in</Button>
        </Link>
        <Link href={"/sign-up"}>
          <Button>Register</Button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
