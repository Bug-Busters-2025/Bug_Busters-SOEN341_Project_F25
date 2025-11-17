import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/clerk-react";

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onEventCreated?: () => void;
  onEventUpdated?: () => void;
  eventData?: any;
  isEditMode?: boolean;
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80";

export default function CreateEventModal({
  open,
  onClose,
  onEventCreated,
  onEventUpdated,
  eventData,
  isEditMode = false,
}: CreateEventModalProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
    eventDate: "",
    location: "",
    ticket_capacity: "",
    ticket_type: "Free",
  });

  const { getToken } = useAuth();

  useEffect(() => {
    if (eventData) {
      setForm({
        title: eventData.title ?? "",
        description: eventData.description ?? "",
        category: eventData.category ?? "",
        imageUrl: eventData.imageUrl ?? "",
        // expects "YYYY-MM-DDTHH:MM"
        eventDate: (eventData.event_date || "").slice(0, 16),
        location: eventData.location ?? "",
        ticket_capacity: String(eventData.ticket_capacity ?? ""),
        ticket_type: (eventData.ticket_type ?? "free"),
      });
    }
  }, [eventData]);

  useEffect(() => {
    if (!open) {
      setMessage(null);
      if (!isEditMode) {
        setForm({
          title: "",
          description: "",
          category: "",
          imageUrl: "",
          eventDate: "",
          location: "",
          ticket_capacity: "",
          ticket_type: "Free",
        });
      }
    }
  }, [open, isEditMode]);

  if (!open) return null;

  const validateImageUrl = async (url: string): Promise<boolean> =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setMessage(null);

    // required fields
    if (
      !form.title ||
      !form.description ||
      !form.category ||
      !form.eventDate ||
      !form.location ||
      !form.ticket_capacity
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const capacity = parseInt(form.ticket_capacity, 10);
    if (isNaN(capacity) || capacity <= 0) {
      setMessage("Ticket capacity must be a valid positive number.");
      return;
    }

    // Use fallback image when empty, otherwise validate provided URL
    let imageToSend = form.imageUrl?.trim() || FALLBACK_IMG;
    if (imageToSend !== FALLBACK_IMG) {
      const ok = await validateImageUrl(imageToSend);
      if (!ok) {
        setMessage("Please provide a valid image URL that can be loaded.");
        return;
      }
    }

    // Keep datetime with 'T' (server replaces it)
    const eventDateToSend = form.eventDate; // e.g., "2025-11-17T12:12"

    try {
      const token = await getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (isEditMode && eventData?.id) {
        // capacity guard
        const newCapacity = capacity;
        const oldCapacity = Number(eventData.ticket_capacity);
        const remaining = Number(eventData.remaining_tickets);
        const sold = Math.max(0, oldCapacity - remaining);
        if (newCapacity < sold) {
          setMessage(`Capacity cannot be lower than ${sold} (tickets already sold).`);
          return;
        }

        await axios.put(
          `http://localhost:3000/api/v1/events/${eventData.id}`,
          {
            title: form.title,
            description: form.description,
            category: form.category,
            imageUrl: imageToSend,
            event_date: eventDateToSend,
            location: form.location,
            ticket_capacity: newCapacity,
            remaining_tickets: remaining + (newCapacity - oldCapacity),
            ticket_type: String(form.ticket_type).toLowerCase(),
          },
          { headers }
        );

        setMessage("Event updated successfully!");
        onEventUpdated?.();
      } else {
        // CREATE
        await axios.post(
          "http://localhost:3000/api/v1/events/create",
          {
            title: form.title,
            description: form.description,
            category: form.category,
            imageUrl: imageToSend,
            event_date: eventDateToSend,
            location: form.location,
            ticket_capacity: capacity,
            // remaining_tickets is optional; backend defaults it to ticket_capacity
            ticket_type: String(form.ticket_type).toLowerCase(),
          },
          { headers }
        );

        onEventCreated?.();
      }

      onClose();
    } catch (error: any) {
      console.error("Error creating/updating event:", error);
      const serverMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "An error occurred. Please try again.";
      setMessage(serverMsg);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-background p-6 rounded-xl shadow-lg w-[500px] border relative">
        <Button onClick={onClose} className="absolute top-3 right-3 rounded-full hover:bg-accent/50">
          <X className="h-5 w-5" />
        </Button>

        <h2 className="text-xl font-semibold mb-4 ">
          {isEditMode ? "Edit Event" : "Create Event"}
        </h2>

        <div className="flex flex-col gap-3">
          <Input name="title" placeholder="Event Title" value={form.title} onChange={handleChange} />

          <textarea
            name="description"
            placeholder="Event description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="border border-border rounded-md p-2 text-sm bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-border rounded-md bg-card text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary hover:border-primary transition-all duration-200"
          >
            <option value="">Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Music">Music</option>
            <option value="Academic">Academic</option>
            <option value="Sports">Sports</option>
            <option value="Arts">Arts</option>
            <option value="Career">Career</option>
            <option value="Environment">Environment</option>
          </select>

          <Input name="imageUrl" placeholder="Image URL (optional)" value={form.imageUrl} onChange={handleChange} />

          <div className="space-y-2">
            <label htmlFor="eventDate" className="text-sm font-medium text-foreground pl-2">
              Event Date & Time
            </label>
            <Input
              type="datetime-local"
              name="eventDate"
              value={form.eventDate}
              onChange={handleChange}
            />
          </div>

          <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} />

          <Input
            type="number"
            name="ticket_capacity"
            placeholder="Ticket capacity"
            value={form.ticket_capacity}
            onChange={handleChange}
            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />

          <select
            id="ticket_type"
            name="ticket_type"
            value={form.ticket_type}
            onChange={handleChange}
            className="w-full border border-border rounded-md bg-card text-foreground px-3 py-2 focus:ring-2 focus:ring-primary focus:ring-offset-1 hover:border-primary transition-all duration-200"
          >
            <option value="">Select a ticket type</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>

          {message && <p className="text-sm text-red-500 text-center mt-3">{message}</p>}

          <Button variant="primary" onClick={handleSubmit} className="px-4 py-2">
            {isEditMode ? "Save Changes" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
