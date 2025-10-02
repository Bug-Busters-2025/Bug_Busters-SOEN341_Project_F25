import React from 'react';

interface EventItem {
  id: number;
  title: string;
}

interface Props {
  events: EventItem[];
}

const AttendeeExportSection: React.FC<Props> = ({ events }) => {
  const handleExport = async (eventId: number) => {
    try {
      const res = await fetch(`/api/events/${eventId}/export`);
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendees_event_${eventId}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Could not export attendee list.');
    }
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Download Attendee Lists
      </h2>

      {events.length === 0 ? (
        <p className="text-gray-500 italic">No events available.</p>
      ) : (
        <ul className="space-y-4">
          {events.map(ev => (
            <li
              key={ev.id}
              className="flex items-center justify-between p-4 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors duration-200"
            >
              <span className="font-medium text-gray-700">{ev.title}</span>
              <button
                onClick={() => handleExport(ev.id)}
                className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 shadow-sm transition-all duration-150"
              >
                Export CSV
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AttendeeExportSection;
