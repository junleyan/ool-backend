"use client"

import { ColumnDef } from "@tanstack/react-table"


export type Dataset = {
  id: string
  title: string
  notes: string
  format: string[]
  organization: string
  group: string
  tags: string[]
}

export const columns: ColumnDef<Dataset>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "format",
    header: "Format",
  },
  {
    accessorKey: "organization", // top-level key
    header: "Organization Name",
    cell: ({ row }) => row.original.organization, // access nested property
  },
  {
    accessorKey: "group",
    header: "Group",
  },
  {
    accessorKey: "tags",
    header: "Tags",
  },
];