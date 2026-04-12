"use client";

import { useEffect, useState } from "react";
import { getEvents, getMembers } from "../actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  useEffect(() => {
    async function fetchData() {
      const eventsData = await getEvents();
      const membersData = await getMembers();

      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const upcoming = eventsData.filter((event: any) => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= weekFromNow;
      });

      setEvents(upcoming);
      setMembers(membersData);
    }
    fetchData();
  }, []);

  const stats = [
    { label: "Total Members", value: members.length },
    { label: "Upcoming Events", value: events.length },
    { label: "Active Reminders", value: events.length * 4 },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {stats.map(({ label, value }) => (
          <Card key={label} className="stat-card shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold stat-number">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base font-semibold">Upcoming Events</CardTitle>
          <p className="text-xs text-muted-foreground">Next 7 days</p>
        </CardHeader>
        <CardContent className="pt-3">
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No upcoming events in the next 7 days
            </p>
          ) : (
            <div className="space-y-2">
              {events.map((event, i) => (
                <div key={i} className="event-item rounded-r-md px-3 py-2.5 space-y-0.5">
                  <h3 className="font-semibold text-base leading-tight">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    &middot;{" "}
                    {new Date(event.time).toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  {event.located_at && (
                    <p className="text-xs text-muted-foreground">{event.located_at}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
