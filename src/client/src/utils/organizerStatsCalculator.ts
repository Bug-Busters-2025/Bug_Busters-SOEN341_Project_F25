import type { Event } from "@/types/event";
import type { UserSummary } from "@/types/subscription";
import {
  getMonthYear, 
  getLastMonthRef, 
  isSameMonthYear
} from "@/utils/dateTimeUtils";

export interface OrganizerEventStats {
  totalEvents: number;
  eventsThisMonth: number;
  eventsLastMonth: number;

  totalTicketsIssued: number;
  ticketsIssuedThisMonth: number;
  ticketsIssuedLastMonth: number;

  totalParticipation: number;
  participationThisMonth: number;
  participationLastMonth: number;
}

export interface OrganizerSubscriptionStats {
  totalSubscribers: number;
  prevMonthTotalSubscribers: number;
  currentMonthNewSubscribers: number;
  lastMonthNewSubscribers: number;
}

/**
 * Compute aggregate stats from a list of events.
 * `participation` = ticket_capacity - remaining_tickets
 * All month-based stats are based on event_date.
 */
export function calculateEventStats(events: Event[],now: Date = new Date()): OrganizerEventStats {
  const { month: currMonth, year: currYear } = getMonthYear(now);
  const { month: prevMonth, year: prevYear } = getLastMonthRef(now);

  let totalEvents = 0;
  let eventsThisMonth = 0;
  let eventsLastMonth = 0;

  let totalTicketsIssued = 0;
  let ticketsIssuedThisMonth = 0;
  let ticketsIssuedLastMonth = 0;

  let totalParticipation = 0;
  let participationThisMonth = 0;
  let participationLastMonth = 0;

  for (const e of events) {
    const eventDate = new Date(e.event_date);
    if (Number.isNaN(eventDate.getTime())) continue;

    totalEvents += 1;

    const ticketsIssued = e.ticket_capacity;
    const participation = e.ticket_capacity - e.remaining_tickets;

    totalTicketsIssued += ticketsIssued;
    totalParticipation += participation;

    if (isSameMonthYear(eventDate, currMonth, currYear)) {
      eventsThisMonth += 1;
      ticketsIssuedThisMonth += ticketsIssued;
      participationThisMonth += participation;
    } else if (isSameMonthYear(eventDate, prevMonth, prevYear)) {
      eventsLastMonth += 1;
      ticketsIssuedLastMonth += ticketsIssued;
      participationLastMonth += participation;
    }
  }

  return {
    totalEvents,
    eventsThisMonth,
    eventsLastMonth,
    totalTicketsIssued,
    ticketsIssuedThisMonth,
    ticketsIssuedLastMonth,
    totalParticipation,
    participationThisMonth,
    participationLastMonth,
  };
}

export function calculateSubscriptionStats(subscribers: UserSummary[], now: Date = new Date()): OrganizerSubscriptionStats {
  const { month: currMonth, year: currYear } = getMonthYear(now);
  const { month: prevMonth, year: prevYear } = getLastMonthRef(now);

  const endOfPrevMonth = new Date(prevYear, prevMonth + 1, 0, 23, 59, 59, 999);

  let totalSubscribers = subscribers.length;
  let prevMonthTotalSubscribers = 0;
  let currentMonthNewSubscribers = 0;
  let lastMonthNewSubscribers = 0;

  for (const s of subscribers) {
    const followedAt = new Date(s.followed_at);
    if (Number.isNaN(followedAt.getTime())) continue;

    if (followedAt <= endOfPrevMonth) {
      prevMonthTotalSubscribers += 1;
    }

    if (isSameMonthYear(followedAt, currMonth, currYear)) {
      currentMonthNewSubscribers += 1;
    } else if (isSameMonthYear(followedAt, prevMonth, prevYear)) {
      lastMonthNewSubscribers += 1;
    }
  }

  return {
    totalSubscribers,
    prevMonthTotalSubscribers,
    currentMonthNewSubscribers,
    lastMonthNewSubscribers,
  };
}


export interface OrganizerAnalyticsStats extends OrganizerEventStats, OrganizerSubscriptionStats {}

export function calculateOrganizerAnalyticsStats(events: Event[], subscribers: UserSummary[], now: Date = new Date()): OrganizerAnalyticsStats {
  const eventStats = calculateEventStats(events, now);
  const subscriptionStats = calculateSubscriptionStats(subscribers, now);

  return {
    ...eventStats,
    ...subscriptionStats,
  };
}

export const percentChange = (prev: number, curr: number): string => {
  if (prev === 0 && curr === 0) return "N/A";
  if (prev === 0 && curr > 0) return "+100%";
  const diff = curr - prev;
  const pct = (diff / prev) * 100;
  return `${diff >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
};