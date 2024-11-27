import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import FishVideo from "../FishVideo";
import { searchYoutubeVideos } from "../../../api/youtube";

// APIのモック
vi.mock("../../../api/youtube");

describe("FishVideo", () => {
  test("動画を表示できる", async () => {
    // モックデータ
    const mockVideos = [{ id: "video1", title: "マグロのレシピ" }];
    searchYoutubeVideos.mockResolvedValue(mockVideos);

    render(<FishVideo fishName="マグロ" />);

    // 動画タイトルが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText("マグロのレシピ")).toBeInTheDocument();
    });
  });
});
