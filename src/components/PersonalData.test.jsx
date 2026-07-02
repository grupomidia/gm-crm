import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PersonalData from './PersonalData';

test('renders fields with initial value and calls onChange', () => {
  const value = { name: 'Alice', email: 'a@a.com', company: 'C', role: 'R', segment: 'S', cpf: '', rg: '', birth: '', phone: '', linkedin: '', address: '' };
  const onChange = vi.fn();
  render(<PersonalData value={value} onChange={onChange} />);

  // initial value is rendered
  expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();

  // change the name field and assert onChange called with expected args
  fireEvent.change(screen.getByDisplayValue('Alice'), { target: { value: 'Bob' } });
  expect(onChange).toHaveBeenCalledWith('name', 'Bob');
});
