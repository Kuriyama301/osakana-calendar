import { describe, test, expect, vi } from "vitest";
import { searchYoutubeVideos } from "../youtube";
import client from "../client";

// APIクライアントのモック
vi.mock("../client");

describe("searchYoutubeVideos", () => {
  test("動画検索APIを呼び出せる", async () => {
    const mockVideos = [{ id: "1", title: "テスト動画" }];
    client.get.mockResolvedValue({ data: { videos: mockVideos } });

    const result = await searchYoutubeVideos("マグロ");
    expect(result).toEqual(mockVideos);
  });
});
