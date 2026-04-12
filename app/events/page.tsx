"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { eventResolver } from "@/lib/constants";
import { addEvent, getEvents, removeEvent } from "../actions";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import supabase from "@/utils/supabase/client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";

export default function Events() {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: eventResolver,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const onSubmit = async (data: any) => {
    setLoading(true);
    let d = new Date();
    d.setHours(parseInt(data.time.split(":")[0]));
    d.setMinutes(parseInt(data.time.split(":")[1]));
    d.setSeconds(parseInt(data.time.split(":")[2]));
    try {
      await addEvent({ ...data, time: d, date: date });
      reset();
      setDate(new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const a = async () => {
      const res = await getEvents();
      setEvents(res);

      const channel = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "events" },
          (payload) => {
            console.log("Change received!", payload);
            if (payload.eventType === "INSERT" && payload.new) {
              setEvents((prev) => [...prev, payload.new]);
            } else if (payload.eventType === "UPDATE" && payload.new) {
              setEvents((prev) =>
                prev.map((member) =>
                  member.id === payload.new.id ? payload.new : member
                )
              );
            } else if (payload.eventType === "DELETE" && payload.old) {
              setEvents((prev) =>
                prev.filter((member) => member.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanupPromise = a();
    return () => {
      cleanupPromise.then((cleanup) => {
        if (typeof cleanup === "function") cleanup();
      });
    };
  }, []);

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base font-semibold">Add Event</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <Input {...register("title")} placeholder="Event Name" />
        <div className="flex gap-2 lg:gap-4 ">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            captionLayout="dropdown"
            className="rounded-md border w-1/2 max-h-80 overflow-y-auto"
          />
          <div className="w-1/2 space-y-2">
            <Input
              {...register("time")}
              type="time"
              id="time-picker"
              step="1"
              defaultValue="00:00:00"
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
            <Input {...register("located_at")} placeholder="Event Location" />
            <Textarea
              {...register("description")}
              placeholder="Event Description"
              className="h-3/4"
            />
          </div>
        </div>
        <Button className="my-1" disabled={loading}>
          Add Event
        </Button>
        <Alert
          className={` ${
            Object.keys(errors).length != 0 ? "flex flex-col" : "hidden"
          }`}
          variant="destructive"
        >
          <AlertDescription>
            {Object.values(errors).map((e: any) => e.message).join(' · ')}
          </AlertDescription>
        </Alert>
      </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {events.map((event, i) => {
          return (
            <Card key={i} className="shadow-sm stat-card">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{event.title}</CardTitle>
                    {event.description && (
                      <CardDescription className="mt-0.5">{event.description}</CardDescription>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">
                    {event.date.substring(0, 10)},{" "}
                    {new Date(event.time).toLocaleString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardFooter className="pt-0 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{event.located_at}</p>
                <Trash2
                  onClick={() => removeEvent(event.id)}
                  className="size-4 cursor-pointer text-red-400 hover:text-red-600 transition-colors"
                />
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
