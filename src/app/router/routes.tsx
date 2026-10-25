import { lazy, type ReactNode } from 'react';
import { Navigate } from 'react-router';

const EventsPage = lazy(() => import('../../pages/events-page'));
const TimelinePage = lazy(() => import('../../pages/timeline-page'));

export const routes: { path: string; element: ReactNode; name: string }[] = [
  { path: '/', element: <Navigate to="/events" replace />, name: 'Home' },
  { path: '/events', element: <EventsPage />, name: 'Events' },
  { path: '/timeline', element: <TimelinePage />, name: 'Timeline' },
];
