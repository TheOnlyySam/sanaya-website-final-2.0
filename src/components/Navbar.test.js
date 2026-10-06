import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '../i18n';
import i18n from '../i18n';
import Navbar from './Navbar';

beforeEach(async () => { localStorage.clear(); await i18n.changeLanguage('en'); });

test('authenticated links are grouped and dropdown closes with Escape and outside clicks', () => {
  localStorage.setItem('sanaya_supabase_session', JSON.stringify({ access_token: 'test', expires_at: Date.now()/1000 + 3600 }));
  render(<MemoryRouter><Navbar /></MemoryRouter>);
  expect(screen.queryByRole('button', { name: 'Products' })).not.toBeInTheDocument();
  const portal = screen.getByRole('button', { name: 'Portal' });
  fireEvent.click(portal);
  expect(screen.getByRole('button', { name: 'Products' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'SanRack Licensing' })).toBeInTheDocument();
  fireEvent.keyDown(document, { key: 'Escape' });
  expect(portal).toHaveAttribute('aria-expanded', 'false');
  expect(portal).toHaveFocus();
  fireEvent.click(portal);
  fireEvent.pointerDown(document.body);
  expect(portal).toHaveAttribute('aria-expanded', 'false');
});

test('guests do not receive private product or licensing links', () => {
  render(<MemoryRouter><Navbar /></MemoryRouter>);
  expect(screen.queryByRole('button', { name: 'SanRack Licensing' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Products' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Company' }));
  expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
});
