import {DarkModeToggle} from "@/components/ui/darkmode";
import {UserButton} from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <DarkModeToggle />
    </div>
  );
}
