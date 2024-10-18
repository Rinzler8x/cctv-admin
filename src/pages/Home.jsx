import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import MapsGoogle from "@/components/MapsGoogle";
import { Card, CardContent } from "@/components/ui/card";
import Tickets from "./Tickets";
import CreateCamera from "../components/CreateCamera";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between bg-slate-100 px-6 py-4 shadow">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-center w-full lg:text-left">
            CCTV Dashboard
          </h1>
          <CreateCamera />
        </header>

        {/* Main content with 60:40 ratio */}
        <div className="flex flex-grow p-4 bg-white h-screen overflow-hidden">
          {" "}
          <div className="w-3/5 pr-2">
            {" "}
            {/* Ensure child takes full height */}
            <Card className="pt-4 hover:shadow-lg">
              <CardContent className="h-full">
                {" "}
                <MapsGoogle />
              </CardContent>
            </Card>
          </div>
          {/* Tickets (40% width) */}
          <div className="w-2/5 pl-2 h-full">
            {" "}
            {/* Ensure child takes full height */}
            <Card className="pt-4 hover:shadow-lg h-full">
              <CardContent className="h-full overflow-y-auto max-h-full">
                {" "}
                <Tickets />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
