export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  date: Date;
  type: "vaccine" | "checkup" | "treatment";
  description: string;
  nextAppointment?: Date;
  medications?: Medication[];
}

export interface VaccineRecord {
  id: string;
  petId: string;
  type: string;
  lastDate: Date;
  nextDate: Date;
}

export type MedicalRecordType = "vaccine" | "checkup" | "treatment";
