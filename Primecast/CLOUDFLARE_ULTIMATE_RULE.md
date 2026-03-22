rule 1
(http.request.uri.path contains "/.env") or 
(http.request.uri.path contains "/.git") or 
(http.request.uri.path contains "/package.json") or 
(http.request.uri.path contains "/package-lock.json") or 
(http.request.uri.path contains "/netlify.toml") or 
(http.request.uri.path contains "/tsconfig.json") or 
(http.request.uri.path contains "/next.config") or 
(http.request.uri.path contains "/tailwind.config") or 
(http.request.uri.path contains "/postcss.config") or 
(http.request.uri.path contains "/components.json") or 
(http.request.uri.path contains "/site.webmanifest") or 
(http.request.uri.path contains "/middleware") or 
(http.request.uri.path contains "/.gitignore") or 
(http.request.uri.path contains "/build_log") or 
(http.request.uri.path contains "/.vscode") or 
(http.request.uri.path contains "/.idx") or 
(http.request.uri.path contains "/docs") or 
(http.request.uri.path contains "/scripts") or 
(http.request.uri.path contains "/netlify/functions") or 
(http.request.uri.path contains "/src/lib") or 
(http.request.uri.path contains "/src/app/api") or 
(http.request.uri.path contains "/src/app/actions") or 
(http.request.uri.path contains "/src/data") or 
(http.request.uri.path contains ".backup") or 
(http.request.uri.path contains ".bak") or 
(http.request.uri.path contains ".old") or 
(http.request.uri.path contains ".log") or 
(http.request.uri.path contains ".csv") or 
(http.request.uri.path contains ".sql") or 
(http.request.uri.path contains ".dump") or 
(http.request.uri.path contains ".conf") or 
(http.request.uri.path contains ".ini") or 
(http.request.uri.path contains ".yaml") or 
(http.request.uri.path contains ".yml") or 
(http.request.uri.path contains "/admin") or 
(http.request.uri.path contains "/wp-admin") or 
(http.request.uri.path contains "/phpmyadmin") or 
(http.request.uri.path contains "/cpanel") or 
(http.request.uri.path contains "/dashboard") or 
(http.request.uri.path contains "/manager") or 
(http.request.uri.path contains "/control") or 
(http.request.uri.path contains "/config") or 
(http.request.uri.path contains "/database") or 
(http.request.uri.path contains "/backup") or 
(http.request.uri.path contains "xmlrpc") or 
(http.request.uri.path contains "../") or 
(http.request.uri.query contains "union select") or 
(http.request.uri.query contains "cmd=") or 
(http.request.uri.query contains "exec=") or 
(http.request.uri.query contains "shell=") or 
(http.request.uri.path contains "/test-bot") or 
(http.request.uri.path contains ".md" and http.request.uri.path contains "SECURITY") or 
(http.request.uri.path contains ".md" and http.request.uri.path contains "PROTECTION") or 
(http.request.uri.path contains ".md" and http.request.uri.path contains "FIREWALL") or 
(http.request.uri.path contains ".md" and http.request.uri.path contains "BOT") or 
(http.request.uri.path contains ".md" and http.request.uri.path contains "STRATEGY") or 
(http.request.uri.path contains ".md" and http.request.uri.path contains "ACTION") or 
(http.request.uri.path contains ".md" and http.request.uri.path contains "EMERGENCY") or 
(http.request.uri.path contains "/src/ai") or 
(http.request.uri.path contains "/src/components/protection") or 
(http.request.uri.path contains "facebook-conversions.js") or 
(http.request.uri.path contains "/api/security") or 
(http.request.uri.path contains "genkit.ts") or 
(http.request.uri.path contains "README.txt") or 
(http.request.uri.path contains "about.txt") or 
(http.request.uri.path contains "/fixed.txt") or 
(http.request.uri.path contains ".tsbuildinfo")




rule 2
(
  (http.user_agent contains "bot" and not http.user_agent contains "googlebot" and not http.user_agent contains "bingbot") 
  or (http.user_agent contains "crawler") 
  or (http.user_agent contains "spider") 
  or (http.user_agent contains "selenium") 
  or (http.user_agent contains "puppeteer") 
  or (http.user_agent contains "headless") 
  or (http.user_agent contains "curl") 
  or (http.user_agent contains "wget") 
  or (http.user_agent contains "python") 
  or (http.user_agent eq "")
) 
or (
  (http.request.uri.path contains "/admin") 
  or (http.request.uri.path contains "/wp-admin") 
  or (http.request.uri.path contains "/.env") 
  or (http.request.uri.path contains "/.git") 
  or (http.request.uri.path contains "/backup") 
  or (http.request.uri.path contains "/config") 
  or (http.request.uri.path contains "/phpmyadmin") 
  or (http.request.uri.path contains "/src/") 
  or (http.request.uri.path contains "/docs/") 
  or (http.request.uri.path contains "/content/") 
  or (http.request.uri.path contains "/build_log") 
  or (http.request.uri.path contains "/.idx") 
  or (http.request.uri.path contains "/src/app/actions") 
  or (http.request.uri.path contains ".nix") 
  or (http.request.uri.path contains ".toml") 
  or (http.request.uri.path contains ".lock") 
  or (http.request.uri.path contains ".cache") 
  or (http.request.uri.path contains "/node_modules") 
  or (http.request.uri.path contains "/.next") 
  or (http.request.uri.path contains "/.vercel") 
  or (http.request.uri.path contains "/.genkit") 
  or (http.request.uri.path contains "/out/") 
  or (http.request.uri.path contains "/coverage") 
  or (http.request.uri.path contains "/.pnp") 
  or (http.request.uri.path contains "/.yarn") 
  or (http.request.uri.path contains "/test-") 
  or (http.request.uri.path contains "middleware-") 
  or (http.request.uri.path contains "WORKING_") 
  or (http.request.uri.path contains "DEPLOY_") 
  or (http.request.uri.path contains "FINAL_") 
  or (http.request.uri.path contains "QUICK_") 
  or (http.request.uri.path contains "FREE_") 
  or (http.request.uri.path contains "TESTING_") 
  or (http.request.uri.path contains ".copy") 
  or (http.request.uri.path contains ".orig") 
  or (http.request.uri.path contains "page.tsx.new") 
  or (http.request.uri.path contains "page.tsx.backup") 
  or (http.request.uri.path contains "/functions/") 
  or (http.request.uri.path contains "/ai/") 
  or (http.request.uri.path contains "/lib/") 
  or (http.request.uri.path contains "/types/") 
  or (http.request.uri.path contains "/hooks/")
) 
or (
  (http.request.uri.path contains "../") 
  or (http.request.uri.query contains "union select") 
  or (http.request.uri.query contains "../") 
  or (http.request.uri.query contains "eval=") 
  or (http.request.uri.query contains "system=") 
  or (http.request.uri.query contains "passthru=") 
  or (http.request.uri.query contains "base64_decode") 
  or (http.request.uri.query contains "file_get_contents") 
  or (http.request.uri.query contains "etc/passwd") 
  or (http.request.uri.query contains "boot.ini") 
  or (http.request.uri.query contains "select * from") 
  or (http.request.uri.query contains "drop table") 
  or (http.request.uri.query contains "insert into") 
  or (http.request.uri.query contains "delete from") 
  or (http.request.uri.query contains "update set") 
  or (http.request.uri.query contains "<script") 
  or (http.request.uri.query contains "javascript:") 
  or (http.request.uri.query contains "onload=") 
  or (http.request.uri.query contains "onerror=")
)