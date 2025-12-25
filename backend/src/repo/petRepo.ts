import { Pet } from "../model/pet";
import pool from "../config/db";

export const addPetRepo = async (
  customer_id: number,
  pet_name: string,
  species: string,
  breed: string,
  date_of_birth: Date,
  gender: "M" | "F" | "O",
  health_status: string
): Promise<Pet> => {
  const query = `INSERT INTO pet
        (customer_id, pet_name, species, breed, date_of_birth, gender, health_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`;
  const values = [
    customer_id,
    pet_name,
    species,
    breed,
    date_of_birth,
    gender,
    health_status,
  ];
  const res = await pool.query(query, values);
  return res.rows[0];
};

export const getPetsByCustomerIdRepo = async (
  customer_id: number
): Promise<Pet[]> => {
  const query = `SELECT * FROM pet WHERE customer_id = $1`;
  const values = [customer_id];
  const res = await pool.query(query, values);
  return res.rows;
};
