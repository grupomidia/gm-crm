// Validação de CPF
export const validateCPF = (cpf) => {
  if (!cpf) return true; // Campo opcional
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false; // Todos os dígitos iguais
  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(clean.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(clean.substring(9, 10))) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(clean.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(clean.substring(10, 11));
};

// Validação de E-mail
export const validateEmail = (email) => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validação de Telefone
export const validatePhone = (phone) => {
  if (!phone) return true; // Campo opcional
  const clean = phone.replace(/\D/g, '');
  return clean.length >= 10 && clean.length <= 11;
};

// Validação de RG (simplificada)
export const validateRG = (rg) => {
  if (!rg) return true; // Campo opcional
  return rg.length >= 7;
};

// Validação de Data de Nascimento
export const validateBirthDate = (date) => {
  if (!date) return true;
  const birthDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age >= 18 && age <= 120;
};

// Validação de URL (LinkedIn)
export const validateURL = (url) => {
  if (!url) return true; // Campo opcional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validar formulário completo
export const validateForm = (form) => {
  const errors = {};
  
  // Validações obrigatórias
  if (!form.personal.name?.trim()) errors.name = 'Nome é obrigatório';
  if (!validateEmail(form.personal.email)) errors.email = 'E-mail inválido ou obrigatório';
  if (!form.personal.company?.trim()) errors.company = 'Empresa é obrigatória';
  if (!form.personal.role?.trim()) errors.role = 'Cargo é obrigatório';
  if (!form.personal.phone?.trim()) errors.phone = 'Telefone é obrigatório';
  if (!validatePhone(form.personal.phone)) errors.phoneFormat = 'Telefone deve ter 10-11 dígitos';
  
  // Validações opcionais com formato
  if (form.personal.cpf && !validateCPF(form.personal.cpf)) errors.cpf = 'CPF inválido';
  if (form.personal.rg && !validateRG(form.personal.rg)) errors.rg = 'RG inválido';
  if (form.personal.birth && !validateBirthDate(form.personal.birth)) errors.birth = 'Data de nascimento inválida (deve ter 18+)';
  if (form.personal.linkedin && !validateURL(form.personal.linkedin)) errors.linkedin = 'URL do LinkedIn inválida';
  
  return errors;
};
