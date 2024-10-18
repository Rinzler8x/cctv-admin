import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CameraIcon, MenuIcon, TicketIcon, ArrowLeftIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router-dom";
import MapsGoogle from "@/components/MapsGoogle";
import { Card, CardContent } from "@/components/ui/card";
import Tickets from "./Tickets";

async function handleCreateCamera({
  cameraLocation,
  cameraPrivateGovt,
  cameraOwner,
  cameraContactNo,
  cameraLatitude,
  cameraLongitude,
  cameraCoverage,
  cameraBackup,
  cameraConnected,
  cameraStatus,
  setIsCreateDialogOpen,
}) {
  const jsonData = {
    location: cameraLocation,
    private_govt: cameraPrivateGovt,
    owner_name: cameraOwner,
    contact_no: cameraContactNo,
    latitude: cameraLatitude,
    longitude: cameraLongitude,
    coverage: cameraCoverage,
    backup: cameraBackup,
    connected_network: cameraConnected,
    status: cameraStatus,
  };
  console.log(jsonData);
  try {
    const response = await fetch("http://127.0.0.1:8000/cameras", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });
    const createdCamera = await response.json();
    console.log(createdCamera);
    setIsCreateDialogOpen(false);
    if (!response.ok) throw new Error("Failed to create camera");
  } catch (error) {
    console.error("Failed to create camera:", error);
  }
}

function UserInputField({ label, value, setFunction }) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="name" className="text-right">
        {label}
      </Label>
      <Input
        id="name"
        value={value}
        onChange={(e) => setFunction(e.target.value)}
        className="col-span-3"
      />
    </div>
  );
}

function UserInputRadioButton({ label, option1, option2, value, setFunction }) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="name" className="text-right">
        {label}
      </Label>
      <RadioGroup value={value} onValueChange={setFunction}>
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={option1} id="option-one" />
            <Label htmlFor="option-one">{option1}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={option2} id="option-two" />
            <Label htmlFor="option-two">{option2}</Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}

async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://127.0.0.1:8000/upload_camera_data", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("File uploaded successfully");
    } else {
      console.error("File upload failed");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

const Home = () => {
  const [cameraLocation, setCameraLocation] = useState("");
  const [cameraPrivateGovt, setCameraPrivateGovt] = useState("");
  const [cameraOwner, setCameraOwner] = useState("");
  const [cameraContactNo, setCameraContactNo] = useState("");
  const [cameraLatitude, setCameraLatitude] = useState("");
  const [cameraLongitude, setCameraLongitude] = useState("");
  const [cameraCoverage, setCameraCoverage] = useState("");
  const [cameraBackup, setCameraBackup] = useState("");
  const [cameraConnected, setCameraConnected] = useState("");
  const [cameraStatus, setCameraStatus] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility

  function handleClear() {
    setCameraLocation("");
    setCameraPrivateGovt("");
    setCameraOwner("");
    setCameraContactNo("");
    setCameraLatitude("");
    setCameraLongitude("");
    setCameraCoverage("");
    setCameraBackup("");
    setCameraConnected("");
    setCameraStatus("");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "fixed inset-0 z-40" : "hidden md:block md:relative"
        } md:w-64 bg-slate-200 overflow-y-auto text-black`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center md:justify-start md:px-4">
            {/* Back button for mobile */}
            {isSidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </Button>
            )}
            <span className="text-2xl font-bold text-black ml-2 lg:mx-auto">
              SurveilMap
            </span>
          </div>
          <nav className="flex-1 px-2 py-4">
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outlined"
                  className="w-full bg-back border-2 border-black text-lg"
                >
                  <CameraIcon className="mr-2 h-4 w-4" /> Create Camera
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Camera</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <UserInputField
                    label={"Location"}
                    value={cameraLocation}
                    setFunction={setCameraLocation}
                  />
                  <UserInputField
                    label={"Private/Govt"}
                    value={cameraPrivateGovt}
                    setFunction={setCameraPrivateGovt}
                  />
                  <UserInputField
                    label={"Owner Name"}
                    value={cameraOwner}
                    setFunction={setCameraOwner}
                  />
                  <UserInputField
                    label={"Contact No"}
                    value={cameraContactNo}
                    setFunction={setCameraContactNo}
                  />
                  <UserInputField
                    label={"Latitude"}
                    value={cameraLatitude}
                    setFunction={setCameraLatitude}
                  />
                  <UserInputField
                    label={"Longitude"}
                    value={cameraLongitude}
                    setFunction={setCameraLongitude}
                  />
                  <UserInputField
                    label={"Backup"}
                    value={cameraBackup}
                    setFunction={setCameraBackup}
                  />
                  <UserInputField
                    label={"Coverage"}
                    value={cameraCoverage}
                    setFunction={setCameraCoverage}
                  />
                  <UserInputRadioButton
                    label={"Connected Network"}
                    option1={"Yes"}
                    option2={"No"}
                    value={cameraConnected}
                    setFunction={setCameraConnected}
                  />
                  <UserInputRadioButton
                    label={"Status"}
                    option1={"Working"}
                    option2={"Not Working"}
                    value={cameraStatus}
                    setFunction={setCameraStatus}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => {
                      handleCreateCamera({
                        cameraLocation,
                        cameraPrivateGovt,
                        cameraOwner,
                        cameraContactNo,
                        cameraLatitude,
                        cameraLongitude,
                        cameraCoverage,
                        cameraBackup,
                        cameraConnected,
                        cameraStatus,
                        setIsCreateDialogOpen,
                      });
                      handleClear();
                    }}
                  >
                    Save changes
                  </Button>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    id="file-upload"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                    className="mb-2 lg:md-0"
                  >
                    Upload Excel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Link to={"/tickets"}>
              <Button
                variant="outlined"
                className="w-full bg-back border-2 border-black mt-2 text-lg"
              >
                <TicketIcon className="mr-2 h-4 w-4" /> Tickets
              </Button>
            </Link>
          </nav>
        </div>
      </aside>

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
          <h1 className="text-xl font-bold text-center w-full lg:text-left">
            Dashboard
          </h1>
        </header>

        {/* Main content with 60:40 ratio */}
        <div className="flex flex-grow p-4 bg-white h-screen overflow-hidden">
          {" "}
          {/* Parent container height and overflow control */}
          {/* Google Maps Integration (60% width) */}
          <div className="w-3/5 pr-2">
            {" "}
            {/* Ensure child takes full height */}
            <Card className="pt-4 hover:shadow-lg">
              <CardContent className="h-full">
                {" "}
                {/* Ensure the map content takes full height */}
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
                {/* Ensure tickets content is scrollable */}
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
