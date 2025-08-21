import generator from 'generate-password-ts';

export const generateRandomPassword = () => {
  return generator.generate({
    length: 8,
    numbers: true,
    strict: true,
  });
};
