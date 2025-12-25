export class Pet {
  pet_id: number | null;
  customer_id: number;
  pet_name: string;
  species: string;
  breed: string;
  date_of_birth: Date;
  gender: "M" | "F" | "O";
  health_status: string;

  constructor(data: Partial<Pet>) {
    this.pet_id = data.pet_id ?? null;
    this.customer_id = data.customer_id ?? 0;
    this.pet_name = data.pet_name ?? "";
    this.species = data.species ?? "";
    this.breed = data.breed ?? "";
    this.date_of_birth = data.date_of_birth
      ? new Date(data.date_of_birth)
      : new Date();
    this.gender = data.gender ?? "O";
    this.health_status = data.health_status ?? "Healthy";
  }
}
