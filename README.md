# Events

A React app with a paginated event grid and a virtualized timeline. 
All data is generated in a Web Worker: 90,000 archive rows and 10,000 timeline events. 
There is no backend.

## Run

npm install
npm run dev

Open `/events` for the grid and `/timeline` for the timeline.

## Data

Filtering and sorting run in the worker, so the page stays responsive with 100,000 records. 
The timeline keeps the last 10,000 generated records, plus events created in the session. 
A new event is added to both lists. 
An edit updates that same record where it already lives.

## Grid

Pagination and sorting belong to the shared table. 
Event filters sit beside it, because they describe this list's query. 
The filters, sort, and page are stored in the URL. The title filter is debounced.

## Timeline

Events are grouped by day in one virtual list, so 10,000 cards stay scrollable. 
Day groups start collapsed. 
Arrow keys move through days and events, Enter or Space toggles a day, and the current item is announced for screen readers. 
An empty day appears only when exactly one calendar day is missing.

## Create and edit

The form asks for a title and a date. 
The time is stamped when the event is saved. 
Title and date are required, the other fields have defaults.

## Stack

React and TypeScript on Vite. React Router stores the grid filters, sort, and page in the URL. 
Radix Themes provides the controls and the dialog: its components already handle focus, keyboard interaction, and labeling. 
React Hook Form and Yup validate the form and move focus to the first invalid field. 
TanStack Virtual renders only the visible part of the timeline.