import axios from "axios";
import type { 
    AnalyticsSummaryResponse,
    ParticipationPointResponse
} from "@/types/tickets";
import type { Event } from "@/types/event";

const api = axios.create({
    baseURL: "http://localhost:3000/api/v1/events",
    withCredentials: true,
});

export async function fetchEvents(): Promise<Event[]> {
    const res = await api.get<Event[]>("/events");
    return res.data;
}

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummaryResponse> {
    const res = await api.get<AnalyticsSummaryResponse>("/analytics/summary");
    return res.data;
}

export async function fetchParticipationTrend(): Promise<ParticipationPointResponse[]> {
    const res = await api.get<ParticipationPointResponse[]>("/analytics/participation");
    return res.data;
}