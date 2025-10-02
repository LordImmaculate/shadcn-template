import { $ } from "bun";
import { describe, it } from "bun:test";

async function testWrongRedirect() {
  try {
    const result =
      await $`grep -r -i "redirect(\"/auth/signin\")" ./app`.nothrow();
    return result.exitCode === 0;
  } catch {
    return false;
  }
}

describe("Check for wrong redirects", () => {
  it("should not have any wrong redirects (auth/signin)", async () => {
    const result = await testWrongRedirect();
    if (result) throw new Error("Found wrong redirects");
  });
});
