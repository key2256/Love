import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Naver OAuth Config
  const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID || "CR9B1pyY0EeFYlegWQmL";
  const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET || "FEWvYlf24C";
  
  // Use APP_URL from environment or derive from request
  const getAppUrl = (req: express.Request) => {
    return process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  };

  app.use(express.json());

  // API Route: Get Naver Auth URL
  app.get("/api/auth/naver/url", (req, res) => {
    const redirectUri = `${getAppUrl(req)}/auth/naver/callback`;
    const state = Math.random().toString(36).substring(7);
    
    const authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    
    res.json({ url: authUrl });
  });

  // API Route: Naver Callback
  app.get("/auth/naver/callback", async (req, res) => {
    const { code, state } = req.query;
    const redirectUri = `${getAppUrl(req)}/auth/naver/callback`;

    try {
      // 1. Exchange code for access token
      const tokenResponse = await axios.get("https://nid.naver.com/oauth2.0/token", {
        params: {
          grant_type: "authorization_code",
          client_id: NAVER_CLIENT_ID,
          client_secret: NAVER_CLIENT_SECRET,
          redirect_uri: redirectUri,
          code,
          state
        }
      });

      const { access_token } = tokenResponse.data;

      // 2. Get user profile
      const profileResponse = await axios.get("https://openapi.naver.com/v1/nid/me", {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      const naverUser = profileResponse.data.response;
      // naverUser contains: id, email, name, profile_image, etc.

      // 3. Send success message to parent window and close popup
      // We pass the naver user data back to the client
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'OAUTH_AUTH_SUCCESS', 
                  provider: 'naver',
                  user: ${JSON.stringify(naverUser)}
                }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>네이버 로그인 성공. 창이 자동으로 닫힙니다.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Naver OAuth Error:", error);
      res.status(500).send("Naver Login Failed");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
