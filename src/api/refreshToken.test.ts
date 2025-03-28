import refreshTokenRequest from "./refreshToken";

describe("refreshTokenRequest", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("returns accessToken", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ accessToken: "12345" }));

    const accessToken = await refreshTokenRequest();

    expect(accessToken).toEqual("12345");
  });
});
