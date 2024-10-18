import MapsGoogle from "@/components/MapsGoogle";
import { Card, CardContent } from "@/components/ui/card";
import Tickets from "./Tickets";
import CreateCamera from "../components/CreateCamera";

const Home = () => {

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-start justify-evenly bg-slate-100 px-4 py-4 shadow">
          <h1 className="text-2xl font-bold w-full lg:text-left">
            SurveilMap Dashboard
          </h1>
          <CreateCamera />
        </header>

        {/* Main content with responsive layout */}
        <div className="flex flex-col md:flex-row flex-grow p-4 bg-white overflow-hidden">
          {/* Google Maps (60% width on larger screens, full width on mobile) */}
          <div className="w-full md:w-3/5 h-80 md:h-auto pr-2"> {/* Height for mobile view */}
            <Card className="pt-4 hover:shadow-lg h-full">
              <CardContent className="h-full">
                <MapsGoogle />
              </CardContent>
            </Card>
          </div>

          {/* Tickets (40% width on larger screens, full width on mobile) */}
          <div className="w-full md:w-2/5 h-64 md:h-auto pl-2">
            <Card className="pt-4 hover:shadow-lg h-full">
              <CardContent className="h-full overflow-y-auto">
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
