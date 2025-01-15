import { render, screen } from "@testing-library/react";
import SeasonalFishModal from "../SeasonalFishModal";
import { FavoritesProvider } from "../../../contexts/FavoritesContext";
import { AuthProvider } from "../../../contexts/AuthContext";
import { CollectionsProvider } from "../../../contexts/CollectionsContext";

// 両方のContextのモックを作成
vi.mock("../../../contexts/FavoritesContext", () => ({
  useFavorites: () => ({
    favorites: [],
    fetchFavorites: vi.fn(),
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  }),
  FavoritesProvider: ({ children }) => children,
}));

vi.mock("../../../contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: () => true,
  }),
  AuthProvider: ({ children }) => children,
}));

vi.mock("../../../contexts/CollectionsContext", () => ({
  useCollections: () => ({
    collections: [],
    isLoading: false,
    fetchCollections: vi.fn(),
    addCollection: vi.fn(),
    removeCollection: vi.fn(),
  }),
  CollectionsProvider: ({ children }) => children,
}));

describe("SeasonalFishModal", () => {
  const mockFish = [
    {
      id: 1,
      name: "サンマ",
      image_url: "/test-image.jpg",
      fish_seasons: [
        {
          start_month: 9,
          start_day: 1,
          end_month: 11,
          end_day: 30,
        },
      ],
    },
  ];

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    currentDate: "2024年1月1日",
    seasonalFish: [],
    isLoading: false,
    error: null,
  };

  // 両方のProviderでラップするヘルパー関数
  const renderWithProviders = (props) => {
    return render(
      <AuthProvider>
        <FavoritesProvider>
          <CollectionsProvider>
            <SeasonalFishModal {...props} />
          </CollectionsProvider>
        </FavoritesProvider>
      </AuthProvider>
    );
  };

  test("モーダルが開いているときに日付が表示される", () => {
    renderWithProviders(defaultProps);
    expect(screen.getByText("2024年1月1日の旬の魚")).toBeInTheDocument();
  });

  test("魚のリストが表示される", () => {
    renderWithProviders({ ...defaultProps, seasonalFish: mockFish });
    expect(screen.getByText("サンマ")).toBeInTheDocument();
  });

  test("データが空の場合適切なメッセージが表示される", () => {
    renderWithProviders({ ...defaultProps, seasonalFish: [] });
    expect(
      screen.getByText("この日付の旬の魚はありません。")
    ).toBeInTheDocument();
  });
});
