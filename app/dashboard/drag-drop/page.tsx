"use client";

import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types for drag-and-drop items
type Person = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

type Column = {
  id: string;
  title: string;
  items: Person[];
};

type BoardState = {
  people: Person[];
  columns: {
    [key: string]: Column;
  };
};

// Initial data
const initialPeople: Person[] = [
  {
    id: "person-1",
    name: "Alex Johnson",
    role: "Frontend Developer",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "person-2",
    name: "Sarah Williams",
    role: "UI/UX Designer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "person-3",
    name: "Michael Chen",
    role: "Backend Engineer",
    avatar: "https://randomuser.me/api/portraits/men/59.jpg",
  },
  {
    id: "person-4",
    name: "Priya Patel",
    role: "Data Scientist",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg",
  },
  {
    id: "person-5",
    name: "Emily Davis",
    role: "Product Manager",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "person-6",
    name: "John Smith",
    role: "DevOps Engineer",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: "person-7",
    name: "Sophia Brown",
    role: "QA Engineer",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
  },
  {
    id: "person-8",
    name: "David Wilson",
    role: "Mobile Developer",
    avatar: "https://randomuser.me/api/portraits/men/28.jpg",
  },
];

const initialColumns: { [key: string]: Column } = {
  "project-1": {
    id: "project-1",
    title: "Project 1",
    items: [],
  },
  "project-2": {
    id: "project-2",
    title: "Project 2",
    items: [],
  },
  "project-3": {
    id: "project-3",
    title: "Project 3",
    items: [],
  },
};

// Drag-and-Drop Types
const ItemType = {
  PERSON: "person",
};

// Draggable Card Component
function DraggableCard({ person }: { person: Person }) {
  const [, drag] = useDrag(() => ({
    type: ItemType.PERSON,
    item: person,
  }));

  return (
    <div ref={drag} className="cursor-grab">
      <Card className="w-64">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
              <AvatarFallback>
                {person.name
                  .split(" ")
                  .map((n) => n[0] || "")
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{person.name}</h3>
              <p className="text-sm text-muted-foreground">{person.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Droppable Column Component
function DroppableColumn({
  column,
  onDrop,
}: {
  column: Column;
  onDrop: (person: Person, columnId?: string) => void;
}) {
  const [, drop] = useDrop(() => ({
    accept: ItemType.PERSON,
    drop: (item: Person) => onDrop(item, column.id),
  }));

  return (
    <div ref={drop} className="bg-muted p-4 rounded-lg min-h-[300px]">
      <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
      {column.items.map((item) => (
        <DraggableCard key={item.id} person={item} />
      ))}
    </div>
  );
}

// Add a droppable area for the "Team Members" row
function TeamMembersRow({
  people,
  onDrop,
}: {
  people: Person[];
  onDrop: (person: Person, columnId?: string) => void;
}) {
  const [, drop] = useDrop(() => ({
    accept: ItemType.PERSON,
    drop: (item: Person) => onDrop(item),
  }));

  return (
    <div ref={drop} className="flex flex-wrap gap-4">
      {people.map((person) => (
        <DraggableCard key={person.id} person={person} />
      ))}
    </div>
  );
}

export default function DragDropPage() {
  const [board, setBoard] = useState<BoardState>({
    people: initialPeople,
    columns: initialColumns,
  });

  const handleDrop = (person: Person, columnId?: string) => {
    const newColumns = { ...board.columns };

    // If columnId is undefined, move the person back to the "Team Members" row
    if (!columnId) {
      // Remove the person from any column they are currently in
      Object.values(newColumns).forEach((column) => {
        column.items = column.items.filter((item) => item.id !== person.id);
      });

      // Add the person back to the "people" array
      const newPeople = board.people.some((p) => p.id === person.id)
        ? board.people
        : [...board.people, person];

      setBoard({
        people: newPeople,
        columns: newColumns,
      });
      return;
    }

    // Remove the person from the "people" array
    const newPeople = board.people.filter((p) => p.id !== person.id);

    // Remove the person from any column they are currently in
    Object.values(newColumns).forEach((column) => {
      column.items = column.items.filter((item) => item.id !== person.id);
    });

    // Add the person to the target column
    newColumns[columnId].items.push(person);

    setBoard({
      people: newPeople,
      columns: newColumns,
    });
  };

  // Filter out people already assigned to a project
  const unassignedPeople = board.people.filter((person) => {
    return !Object.values(board.columns).some((column) =>
      column.items.some((item) => item.id === person.id)
    );
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Drag and Drop Board</h1>
        <p className="text-muted-foreground">Drag people cards to assign them to different projects</p>

        {/* People Row */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Team Members</h2>
          <TeamMembersRow people={unassignedPeople} onDrop={handleDrop} />
        </div>

        {/* Projects Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(board.columns).map((column) => (
            <DroppableColumn key={column.id} column={column} onDrop={handleDrop} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
