'use client'
import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';

type EventCreator = {
    email: string;
    self: boolean;
  };
  
  type EventDateTime = {
    dateTime: string;
    timeZone: string;
  };


type CalendarEvent = {
    id: string;
    summary: string;
    creator: EventCreator;
    start: EventDateTime;
    end: EventDateTime;
  };


const EventItem: FC<{ event: CalendarEvent }> = ({ event }) => {
    return (
      <div className='flex justify-between border border-black p-2 m-2'>
        <div className=''>
          <div>{event.summary}</div>
          <div>{event.creator.email}</div>
        </div>
        <div>
          <div>{new Date(event.start.dateTime).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}</div>
          <div>{new Date(event.start.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    )
}


const UpcomingEvents: FC = () => {

  console.log('UpcomingEvents')

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const sortedEvents = [...events].sort((a, b) => new Date(a.start.dateTime).getTime() - new Date(b.start.dateTime).getTime()).slice(0, 5);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Assuming you've stored the userId in some state or context, or you can pass it as a prop
        const { data: response } = await axios.get(`/api/calendar`, { withCredentials: true });
        // const response = await fetch(`/api/calendar`);
        console.log("Hi from Upcoming Events")
        console.log("Inside Upcoming Events Component" + response)
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className='border border-black w-4/12'>
      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Upcoming events</div>
      <hr />
      {sortedEvents.map(event => <EventItem key={event.id} event={event} />)}
    </div>
  )
}

export default UpcomingEvents