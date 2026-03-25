import { createContext, useContext, useReducer } from "react";
import { enhancedMockData } from "../data/enhancedMockData";

const AppContext = createContext();

const initialState = {
  grounds: enhancedMockData.grounds,
  matches: enhancedMockData.matches,
  tournaments: enhancedMockData.tournaments,
  teams: enhancedMockData.teams,
  organizers: enhancedMockData.organizers,
  bookings: enhancedMockData.bookings,
  verificationRequests: enhancedMockData.verificationRequests
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_MATCH":
      return { ...state, matches: [action.payload, ...state.matches] };
    case "ADD_GROUND":
      return { ...state, grounds: [action.payload, ...state.grounds] };
    case "UPDATE_GROUND":
      return {
        ...state,
        grounds: state.grounds.map((g) => (g.id === action.payload.id ? { ...g, ...action.payload } : g))
      };
    case "ADD_TOURNAMENT":
      return { ...state, tournaments: [action.payload, ...state.tournaments] };
    case "ADD_TEAM":
      return { ...state, teams: [action.payload, ...state.teams] };
    case "APPROVE_ORGANIZER":
      return {
        ...state,
        organizers: state.organizers.map((o) =>
          o.id === action.payload ? { ...o, status: "approved" } : o
        ),
        grounds: state.grounds.map((g) =>
          g.organizerId === action.payload ? { ...g, isVerified: true } : g
        )
      };
    case "REJECT_ORGANIZER":
      return {
        ...state,
        organizers: state.organizers.map((o) =>
          o.id === action.payload ? { ...o, status: "rejected" } : o
        )
      };
    case "ADD_BOOKING":
      return { ...state, bookings: [action.payload, ...state.bookings] };
    case "ADD_VERIFICATION_REQUEST":
      return { ...state, verificationRequests: [action.payload, ...state.verificationRequests] };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}
export const useAppContext = () => useContext(AppContext);