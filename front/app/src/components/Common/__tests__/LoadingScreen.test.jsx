import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoadingScreen from "../LoadingScreen";

describe("LoadingScreen", () => {
  it("表示状態のテスト", () => {
    render(<LoadingScreen isOpen={true} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(
      screen.getByText("旬のサカナの情報を読み込んでいます...")
    ).toBeInTheDocument();
  });

  it("非表示状態のテスト", () => {
    render(<LoadingScreen isOpen={false} />);

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(
      screen.queryByText("旬のサカナの情報を読み込んでいます...")
    ).not.toBeInTheDocument();
  });
});
