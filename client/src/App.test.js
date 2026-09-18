import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

jest.mock('./world/PortfolioWorld', () => function MockPortfolioWorld() {
  return <div data-testid="portfolio-world">3D world</div>;
});

test('renders the portfolio shell and primary navigation', () => {
  render(<App />);

  const nav = screen.getByRole('navigation', { name: /quick navigation/i });

  expect(screen.getByRole('heading', { name: /dmitriy tyutyunik/i })).toBeInTheDocument();
  expect(screen.getByTestId('portfolio-world')).toBeInTheDocument();
  expect(screen.getByText('14+')).toBeInTheDocument();
  expect(screen.getByText('60%')).toBeInTheDocument();
  expect(screen.getByText('85%')).toBeInTheDocument();
  expect(within(nav).getByRole('button', { name: /^workshop$/i })).toBeInTheDocument();
  expect(within(nav).getByRole('button', { name: /^cinema$/i })).toBeInTheDocument();
  expect(within(nav).getByRole('button', { name: /^traveler$/i })).toBeInTheDocument();
  expect(within(nav).getByRole('button', { name: /^publisher$/i })).toBeInTheDocument();
});

test('opens destination details from quick navigation and closes them', async () => {
  render(<App />);

  const nav = screen.getByRole('navigation', { name: /quick navigation/i });
  await userEvent.click(within(nav).getByRole('button', { name: /^workshop$/i }));
  expect(screen.getByRole('heading', { name: /tinkerer workshop/i })).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: /back to overview/i }));
  expect(screen.queryByRole('heading', { name: /tinkerer workshop/i })).not.toBeInTheDocument();
});

test('career cinema is skippable act by act', async () => {
  render(<App />);
  const nav = screen.getByRole('navigation', { name: /quick navigation/i });
  await userEvent.click(within(nav).getByRole('button', { name: /^cinema$/i }));
  expect(screen.getByRole('heading', { name: /analytical foundation/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /next act/i }));
  expect(screen.getByRole('heading', { name: /becoming an engineer/i })).toBeInTheDocument();
});

test('traveler and publisher destinations expose their stories', async () => {
  render(<App />);
  const nav = screen.getByRole('navigation', { name: /quick navigation/i });
  await userEvent.click(within(nav).getByRole('button', { name: /^traveler$/i }));
  expect(screen.getByText(/experience becomes context/i)).toBeInTheDocument();
  expect(screen.getByText(/60\+ countries/i)).toBeInTheDocument();
  await userEvent.click(within(nav).getByRole('button', { name: /^publisher$/i }));
  expect(screen.getByText(/ai-assisted publishing/i)).toBeInTheDocument();
});
