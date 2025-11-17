export interface User {
  id: number;
  firstname: string;
  lastname: string;
  birddate: Date | undefined;
  age: number;
  gender: string;
  update: Date;
}

export interface UserFormError {
  firstNameError: string;
  lastNameError: string;
  birthDateError: string;
  genderError: string;
}
