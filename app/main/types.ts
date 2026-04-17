export type ApplicantsType = {
  company: string;
  createdAt: string;
  notes: string;
  position: string;
  status: string;
  updatedAt: string;
  userId: string;
  id: string;
  fullName: string;
  email: string;
};

export type InputProps = {
  name: string;
  value: string;
  placeholder?: string;
  label?: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
