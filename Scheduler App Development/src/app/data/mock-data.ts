export interface Student {
  id: string;
  name: string;
  age: number;
  parentName: string;
  parentPhone: string;
}

export interface Instructor {
  id: string;
  name: string;
  specialty: string;
}

export interface Session {
  id: string;
  date: string; // ISO date string
  slotsTotal: number;
  slotsFilled: number;
  instructorId: string | null; // Changed to ID reference
  startTime: string;
  endTime: string;
  costPerHour: number;
  enrolledStudents?: string[]; // array of student IDs
}

export interface Enrollment {
  id: string;
  studentId: string;
  sessionId: string;
}

// Mock instructors
export const instructorsData: Instructor[] = [
  { id: "i1", name: "Mike James", specialty: "Mathematics" },
  { id: "i2", name: "Sarah Wilson", specialty: "Science" },
  { id: "i3", name: "John Smith", specialty: "English" },
  { id: "i4", name: "Emily Davis", specialty: "History" },
  { id: "i5", name: "Alex Brown", specialty: "Art" },
  { id: "i6", name: "Lisa Martinez", specialty: "Music" },
  { id: "i7", name: "James Taylor", specialty: "Physical Education" },
];

// Mock students
export const studentsData: Student[] = [
  { id: "s1", name: "Emma Johnson", age: 8, parentName: "Jennifer Johnson", parentPhone: "(555) 123-4567" },
  { id: "s2", name: "Liam Smith", age: 9, parentName: "Michael Smith", parentPhone: "(555) 234-5678" },
  { id: "s3", name: "Olivia Brown", age: 7, parentName: "Sarah Brown", parentPhone: "(555) 345-6789" },
  { id: "s4", name: "Noah Davis", age: 10, parentName: "David Davis", parentPhone: "(555) 456-7890" },
  { id: "s5", name: "Sophia Wilson", age: 8, parentName: "Emily Wilson", parentPhone: "(555) 567-8901" },
];

// Mock sessions for February and March 2026 - ALL $25/hour
export const sessionsData: Session[] = [
  // February 2026
  { 
    id: "1", 
    date: "2026-02-05", 
    slotsTotal: 20, 
    slotsFilled: 13, 
    instructorId: "i1", // Mike James
    startTime: "16:00", 
    endTime: "19:00", 
    costPerHour: 25,
    enrolledStudents: []
  },
  { 
    id: "2", 
    date: "2026-02-12", 
    slotsTotal: 15, 
    slotsFilled: 8, 
    instructorId: "i2", // Sarah Wilson
    startTime: "14:00", 
    endTime: "17:00", 
    costPerHour: 25,
    enrolledStudents: []
  },
  { 
    id: "3", 
    date: "2026-02-18", 
    slotsTotal: 20, 
    slotsFilled: 20, 
    instructorId: "i3", // John Smith
    startTime: "10:00", 
    endTime: "13:00", 
    costPerHour: 25,
    enrolledStudents: []
  },
  { 
    id: "4", 
    date: "2026-02-25", 
    slotsTotal: 18, 
    slotsFilled: 5, 
    instructorId: "i4", // Emily Davis
    startTime: "15:00", 
    endTime: "18:00", 
    costPerHour: 25,
    enrolledStudents: []
  },
  
  // March 2026
  { 
    id: "5", 
    date: "2026-03-05", 
    slotsTotal: 20, 
    slotsFilled: 10, 
    instructorId: "i1", // Mike James
    startTime: "16:00", 
    endTime: "19:00", 
    costPerHour: 25,
    enrolledStudents: []
  },
  { 
    id: "6", 
    date: "2026-03-12", 
    slotsTotal: 22, 
    slotsFilled: 18, 
    instructorId: "i2", // Sarah Wilson
    startTime: "14:00", 
    endTime: "17:00", 
    costPerHour: 25,
    enrolledStudents: []
  },
  { 
    id: "7", 
    date: "2026-03-19", 
    slotsTotal: 15, 
    slotsFilled: 3, 
    instructorId: "i5", // Alex Brown
    startTime: "13:00", 
    endTime: "16:00", 
    costPerHour: 25,
    enrolledStudents: []
  },
  { 
    id: "8", 
    date: "2026-03-26", 
    slotsTotal: 20, 
    slotsFilled: 15, 
    instructorId: "i4", // Emily Davis
    startTime: "15:00", 
    endTime: "18:00", 
    costPerHour: 25,
    enrolledStudents: []
  },
];

export const userProfile = {
  childName: "Emma Johnson",
  childAge: 8,
  parentName: "Jennifer Johnson",
  parentPhone: "(555) 123-4567",
};
