import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  async function fetchTickets() {
    try {
      const response = await fetch("http://127.0.0.1:8000/tickets");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error.message);
    }
  }

  const handleCardClick = async (ticket_camera_id, ticket_id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/cameras/${ticket_camera_id}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setSelectedTicket({ ...data, id: ticket_id });
      setIsTicketDialogOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (status, ticket_id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/tickets/${ticket_id}?status=${status}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: ticket_id }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const result = await response.json();
      setAlertTitle(
        status === "Accepted" ? "Ticket Accepted" : "Ticket Rejected"
      );
      setAlertDescription(`The ticket has been ${status.toLowerCase()}.`);
      setAlertVisible(true);
      setIsTicketDialogOpen(false);
      fetchTickets();
      setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <>
      <div className="min-h-screen">
        {/* Cards grid */}
        <div className="text-xl pl-5 font-semibold">Tickets</div>
        <div className="container mx-auto px-4 pb-2 pt-4">
          <div className="flex flex-col gap-6">
            {tickets
              .filter((ticket) => ticket.status === "Pending")
              .map((ticket) => (
                <Card
                  key={ticket.id}
                  onClick={() => handleCardClick(ticket.camera_id, ticket.id)}
                  className="bg-white border-2 border-black cursor-pointer hover:shadow-md"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {ticket.description || "Untitled"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>ID:</strong> {ticket.id}
                    </p>
                    <p>
                      <strong>Camera ID:</strong> {ticket.camera_id}
                    </p>
                    <p>
                      <strong>Location:</strong> {ticket.location}
                    </p>
                    <p>
                      <strong>Status:</strong> {ticket.status}
                    </p>
                    <p>
                      <strong>Reported By:</strong> {ticket.reported_by}
                    </p>
                    <p>
                      <strong>Reported At:</strong>{" "}
                      {new Date(ticket.reported_at).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            <Dialog
              open={isTicketDialogOpen}
              onOpenChange={setIsTicketDialogOpen}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Camera Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {selectedTicket ? (
                    <div>
                      <p>
                        <strong>Location:</strong> {selectedTicket.location}
                      </p>
                      <p>
                        <strong>Private/Govt:</strong>{" "}
                        {selectedTicket.private_govt}
                      </p>
                      <p>
                        <strong>Owner Name:</strong> {selectedTicket.owner_name}
                      </p>
                      <p>
                        <strong>Contact No:</strong> {selectedTicket.contact_no}
                      </p>
                      <p>
                        <strong>Latitude:</strong> {selectedTicket.latitude}
                      </p>
                      <p>
                        <strong>Longitude:</strong> {selectedTicket.longitude}
                      </p>
                      <p>
                        <strong>Coverage:</strong> {selectedTicket.coverage}
                      </p>
                      <p>
                        <strong>Backup:</strong> {selectedTicket.backup}
                      </p>
                      <p>
                        <strong>Connected Network:</strong>{" "}
                        {selectedTicket.connected_network}
                      </p>
                      <p>
                        <strong>Status:</strong> {selectedTicket.status}
                      </p>
                    </div>
                  ) : (
                    <p>Loading details...</p>
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    className="mr-2 bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() =>
                      handleStatusChange("Accepted", selectedTicket.id)
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() =>
                      handleStatusChange("Rejected", selectedTicket.id)
                    }
                  >
                    Reject
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {alertVisible && (
          <div className="fixed top-0 right-0 m-4">
            <Alert className="bg-slate-700 text-white border-r-8">
              <AlertTitle className="text-lg">{alertTitle}</AlertTitle>
              <AlertDescription className="text-lg">
                {alertDescription}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </>
  );
};

export default Tickets;
