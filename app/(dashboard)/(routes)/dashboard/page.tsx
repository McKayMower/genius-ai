import { UserButton } from "@clerk/nextjs";

const DashboardPage = () => {
  return (
    <div>
      dashboard (protected)
      <UserButton afterSignOutUrl="/"/>
    </div>
  );
  
};

export default DashboardPage;
