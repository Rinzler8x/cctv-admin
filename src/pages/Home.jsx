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
        <header className="flex items-start justify-between bg-slate-100 px-4 py-4 shadow">
          <h1 className="text-2xl font-bold w-full lg:text-left">
            SurveilMap Dashboard
          </h1>
          <CreateCamera />
        </header>

        {/* Main content with responsive layout */}
        <div className="flex flex-col md:flex-row flex-grow p-4 bg-white overflow-y-auto">
          {/* Google Maps (60% width on larger screens, full width on mobile) */}
          <div className="w-full md:w-3/5 h-[60vh] md:h-auto pr-2 ml-2"> {/* Adjusted height for mobile view */}
            <Card className="h-full hover:shadow-lg">
              <CardContent className="h-full">
                <MapsGoogle />
              </CardContent>
            </Card>
          </div>

          {/* Tickets (40% width on larger screens, full width on mobile) */}
          <div className="w-full md:w-2/5 h-auto pl-2 pt-4 lg:pt-0"> {/* Removed fixed height for tickets */}
            <Card className="h-full hover:shadow-lg">
              <CardContent className="h-full overflow-y-auto max-h-[60vh] lg:max-h-full py-4"> {/* Set max height for scrolling */}
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
