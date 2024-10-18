import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { CameraIcon, TicketIcon } from "lucide-react";

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

const CreateCamera = () => {
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
    <>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outlined"
            className="w-[20vw] bg-back border-2 border-black text-lg"
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
              onClick={() => document.getElementById("file-upload").click()}
              className="mb-2 lg:md-0"
            >
              Upload Excel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateCamera