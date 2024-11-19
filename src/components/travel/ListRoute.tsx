import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { ViewListPage } from "@/pages/ViewListPage";
import { DETAILED_TRAVEL_LISTS } from "@/mockTravelLists";

export const ListRoute = () => {
  const { id } = useParams<{ id: string }>();

  if (!id || !DETAILED_TRAVEL_LISTS[id]) {
    return <Navigate to="/lists" replace />;
  }

  return <ViewListPage data={DETAILED_TRAVEL_LISTS[id]} />;
};
