"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { resolver } from "@/lib/constants";
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
    formState: { errors },
  } = useForm();
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
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 my-2"
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
        ></Alert>
      </form>
      <div>
        {events.map((event, i) => {
          return (
            <Card key={i} className="my-2">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
                <CardAction>
                  {event.date.substring(0, 10)},{" "}
                  {new Date(event.time).toLocaleString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </CardAction>
              </CardHeader>

              <div>
                <CardFooter className="flex items-center justify-between">
                  <p>{event.located_at}</p>
                  <Trash2
                    onClick={() => {
                      removeEvent(event.id);
                    }}
                    className="size-5 cursor-pointer"
                    color="red"
                  />
                </CardFooter>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
