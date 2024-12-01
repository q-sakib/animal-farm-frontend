export interface InputFieldProps {
  label: string;
  type?: string;
  className?: string;
}

export interface UploadButtonProps {
  onClick?: () => void;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface CategoryProps {
  name: string;
  isActive?: boolean;
  onClick: () => void;
  styleVariant?: "default" | "alternative"; // Add a variant to handle style changes
}

export interface AnimalCardProps {
  imageUrl: string;
  name: string;
}

export interface ActionButtonProps {
  label: string;
}