import { UserButton } from "@clerk/nextjs";

const Landing = () => {
  return (
    <div>
      Landing Page! (unprotected)
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default Landing;
