export interface User {
  id: number;
  firstname: string;
  lastname: string;
  birthday?: string;
  age: number;
  gender: string;
  updateDate?: string;
}

export interface UserFormError {
  firstNameError: string;
  lastNameError: string;
  birthDateError: string;
  genderError: string;
}

export interface ApiResponse<T> {
  responseStatus: number;
  responseMessage: string;
  data: T;
}
