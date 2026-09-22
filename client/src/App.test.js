import { render, screen, within, fireEvent } from "@testing-library/react";
import App from "./App";

jest.mock(
  "./world/PortfolioWorld",
  () =>
    function MockPortfolioWorld({ paused }) {
      return (
        <div data-testid="portfolio-world" data-paused={paused}>
          3D world
        </div>
      );
    },
);

test("renders the portfolio shell and primary navigation", () => {
  render(<App />);

  const nav = screen.getByRole("navigation", { name: /quick navigation/i });

  expect(
    screen.getByRole("heading", { name: /dmitriy tyutyunik/i }),
  ).toBeInTheDocument();
  expect(screen.getByTestId("portfolio-world")).toBeInTheDocument();
  expect(screen.getByText("14+")).toBeInTheDocument();
  expect(screen.getByText("OpenAI")).toBeInTheDocument();
  expect(screen.getByText("MCP")).toBeInTheDocument();
  expect(
    within(nav).getByRole("button", { name: /^workshop$/i }),
  ).toBeInTheDocument();
  expect(
    within(nav).getByRole("button", { name: /^cinema$/i }),
  ).toBeInTheDocument();
  expect(
    within(nav).getByRole("button", { name: /^traveler$/i }),
  ).toBeInTheDocument();
  expect(
    within(nav).getByRole("button", { name: /^publisher$/i }),
  ).toBeInTheDocument();
});

test("opens destination details from quick navigation and closes them", async () => {
  render(<App />);

  const nav = screen.getByRole("navigation", { name: /quick navigation/i });
  fireEvent.click(within(nav).getByRole("button", { name: /^workshop$/i }));
  expect(
    screen.getByRole("heading", { name: /tinkerer workshop/i }),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /back to overview/i }));
  expect(
    screen.queryByRole("heading", { name: /tinkerer workshop/i }),
  ).not.toBeInTheDocument();
});

test("career cinema is skippable act by act", async () => {
  render(<App />);
  const nav = screen.getByRole("navigation", { name: /quick navigation/i });
  fireEvent.click(within(nav).getByRole("button", { name: /^cinema$/i }));
  expect(
    screen.getByRole("heading", { name: /business judgment before code/i }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /next act/i }));
  expect(
    screen.getByRole("heading", {
      name: /from training to founder partnership/i,
    }),
  ).toBeInTheDocument();
});

test("traveler and publisher destinations expose their stories", async () => {
  render(<App />);
  const nav = screen.getByRole("navigation", { name: /quick navigation/i });
  fireEvent.click(within(nav).getByRole("button", { name: /^traveler$/i }));
  expect(screen.getByText(/curiosity beyond the screen/i)).toBeInTheDocument();
  expect(screen.getAllByText(/60\+ countries/i).length).toBeGreaterThan(0);
  fireEvent.click(within(nav).getByRole("button", { name: /^publisher$/i }));
  expect(screen.getByText(/6 works/i)).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /ten days before troy/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /amazon author page/i })).toHaveAttribute(
    "href",
    "https://www.amazon.com/stores/Dmitriy-Tyutyunik/author/B0HGTL13YY",
  );
});

test("workshop projects are keyboard-accessible outside the 3D canvas", async () => {
  render(<App />);
  const nav = screen.getByRole("navigation", { name: /quick navigation/i });
  fireEvent.click(within(nav).getByRole("button", { name: /^workshop$/i }));
  const dock = screen.getByRole("region", { name: /workshop projects/i });
  fireEvent.click(within(dock).getByRole("button", { name: /reliveincolor/i }));
  expect(
    screen.getByRole("heading", { name: /reliveincolor/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /visit reliveincolor/i }),
  ).toHaveAttribute("href", "https://reliveincolor.com");
});

test("Escape returns from a destination and clears the project selection", () => {
  render(<App />);
  const nav = screen.getByRole("navigation", { name: /quick navigation/i });
  fireEvent.click(within(nav).getByRole("button", { name: /^workshop$/i }));
  fireEvent.click(
    within(
      screen.getByRole("region", { name: /workshop projects/i }),
    ).getByRole("button", { name: /reliveincolor/i }),
  );
  fireEvent.keyDown(window, { key: "Escape" });
  expect(
    screen.queryByRole("heading", { name: /reliveincolor/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("region", { name: /career highlights/i }),
  ).toBeInTheDocument();
});

test("visitors can pause and resume the animated world", () => {
  render(<App />);
  fireEvent.click(
    screen.getByRole("button", { name: /pause world animation/i }),
  );
  expect(screen.getByTestId("portfolio-world")).toHaveAttribute(
    "data-paused",
    "true",
  );
  fireEvent.click(
    screen.getByRole("button", { name: /resume world animation/i }),
  );
  expect(screen.getByTestId("portfolio-world")).toHaveAttribute(
    "data-paused",
    "false",
  );
});

test("AI highlights open project details while career acts have no project CTA", () => {
  render(<App />);
  fireEvent.click(
    screen.getByRole("button", { name: /OpenAI.*Explore classifier/i }),
  );
  expect(
    screen.getByRole("heading", { name: "OpenAI Issue Classifier" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Discuss this system" }),
  ).toHaveAttribute(
    "href",
    expect.stringContaining("mailto:dmitriy.tyutyunik@gmail.com?subject="),
  );
  fireEvent.click(screen.getByRole("button", { name: "Back to all projects" }));
  expect(
    screen.queryByRole("heading", { name: "OpenAI Issue Classifier" }),
  ).not.toBeInTheDocument();
  fireEvent.click(
    within(
      screen.getByRole("navigation", { name: /quick navigation/i }),
    ).getByRole("button", { name: /overview/i }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: /7.*Production impact/i }),
  );
  expect(
    screen.getByRole("heading", { name: "AI in the production workflow" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /next act/i }));
  expect(
    screen.getByRole("heading", { name: "Giving AI tools to act" }),
  ).toBeInTheDocument();
  expect(
    within(screen.getByRole("region", { name: "Career story" })).queryByRole("button", { name: /explore/i }),
  ).not.toBeInTheDocument();
});
