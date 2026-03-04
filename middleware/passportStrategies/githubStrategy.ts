import { Strategy as GitHubStrategy } from "passport-github2";
import { PassportStrategy } from "../../interfaces/index";
import type { Request } from "express";
import type { Profile } from "passport-github2";
import { upsertGithubUser } from "../../controllers/userController"; // ✅ 新增

type DoneFn = (error: unknown, user?: unknown, info?: unknown) => void;

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL } = process.env;

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_CALLBACK_URL) {
  throw new Error("Missing GitHub OAuth env vars. Check .env");
}

const githubStrategy: GitHubStrategy = new GitHubStrategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: GITHUB_CALLBACK_URL,
    passReqToCallback: true,
  },
  async (
    _req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: DoneFn
  ) => {
    try {
      const githubId = String(profile.id);
      const name = profile.displayName || profile.username || "GitHub User";
      const email = profile.emails?.[0]?.value;

      const user = upsertGithubUser(githubId, name, email);

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

const passportGitHubStrategy: PassportStrategy = {
  name: "github",
  strategy: githubStrategy,
};

export default passportGitHubStrategy;