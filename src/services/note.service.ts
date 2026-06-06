import api from "@/lib/axios";
import type { Note } from "@/types";

export const noteService = {
  createNote: async (data: {
    leadId: string;
    note: string;
  }): Promise<Note> => {
    const response = await api.post("/notes", data);
    return response.data.data;
  },

  getLeadNotes: async (leadId: string): Promise<Note[]> => {
    const response = await api.get(`/notes/lead/${leadId}`);
    return response.data.data;
  },
};
