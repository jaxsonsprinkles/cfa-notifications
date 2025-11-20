"use client";

import { useEffect, useState } from "react";
import { getEvents, getMembers } from "../actions";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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

      // Filter upcoming events (next 7 days)
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
  return (
    <div>
      <div className="grid grid-cols-3 space-x-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <CardTitle>Total Members</CardTitle>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{members.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <CardTitle>Upcoming Events</CardTitle>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{events.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <CardTitle>Active Reminders</CardTitle>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{events.length * 3}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
