import { mockConnection, render } from "test-utils/testutils";

import { ConnectionSettingsPageInner } from "./ConnectionSettingsPage";

let mockIsAdvancedMode = false;
const setMockIsAdvancedMode = (newSetting: boolean) => {
  mockIsAdvancedMode = newSetting;
};
jest.mock("hooks/services/useAdvancedModeSetting", () => ({
  useAdvancedModeSetting() {
    return [mockIsAdvancedMode, setMockIsAdvancedMode];
  },
}));

jest.mock("hooks/services/useConnectionHook", () => ({
  useDeleteConnection: () => ({ mutateAsync: () => null }),
  useGetConnectionState: () => ({ state: null, globalState: null, streamState: null }),
}));

jest.mock("hooks/services/Analytics/useAnalyticsService", () => {
  const analyticsService = jest.requireActual("hooks/services/Analytics/useAnalyticsService");
  analyticsService.useTrackPage = () => null;
  return analyticsService;
});

jest.mock("hooks/services/ConnectionEdit/ConnectionEditService", () => ({
  useConnectionEditService: () => ({ connection: mockConnection }),
}));

jest.mock("components/common/DeleteBlock", () => ({
  DeleteBlock: () => {
    const MockDeleteBlock = () => <div>Does not actually delete anything</div>;
    return <MockDeleteBlock />;
  },
}));

describe("<ConnectionSettingsPage />", () => {
  it("only renders connection state when advanced mode is enabled", async () => {
    let container: HTMLElement;

    setMockIsAdvancedMode(false);
    ({ container } = await render(<ConnectionSettingsPageInner />));
    expect(container.textContent).not.toContain("Connection State");

    setMockIsAdvancedMode(true);
    ({ container } = await render(<ConnectionSettingsPageInner />));
    expect(container.textContent).toContain("Connection State");
  });
});
