"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UpcomingAppointment } from "./upcoming-appointments-table";
import { Calendar } from "@/components/ui/calendar";

interface EditAppointmentDialogProps {
  appointment: UpcomingAppointment;
  onSave: (updatedAppointment: {
    id: string | number;
    appointment_date: string;
  }) => void;
  children: React.ReactNode;
}

export function EditAppointmentDialog({
  appointment,
  onSave,
  children,
}: EditAppointmentDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    appointment.appointment_date
      ? new Date(appointment.appointment_date)
      : undefined,
  );

  const handleSave = () => {
    onSave({
      id: appointment.id,
      appointment_date: date!.toISOString(),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogDescription>
            Update the details of the appointment.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => d < date!}
              initialFocus
              defaultMonth={date}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
