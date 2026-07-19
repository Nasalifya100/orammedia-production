$base = "https://orammedia-staging.nasalifya007.workers.dev"
$routes = @(
  "/",
  "/projects",
  "/projects/inkondo",
  "/projects/zuba",
  "/projects/graft",
  "/projects/strictly-by-invitation",
  "/projects/this-slug-does-not-exist-xyz",
  "/about",
  "/services",
  "/blog",
  "/journal",
  "/contact",
  "/robots.txt",
  "/sitemap.xml",
  "/admin/login",
  "/admin",
  "/preview/test",
  "/admin/website",
  "/admin/media",
  "/admin/filmography",
  "/admin/verification"
)

foreach ($r in $routes) {
  $out = curl.exe -s -o NUL -w "%{http_code} %{redirect_url}" "$base$r" 2>&1
  Write-Output "$out $r"
}

Write-Output "--- HEAD / ---"
curl.exe -sI "$base/" 2>&1 | Select-String -Pattern "HTTP/|location:|x-robots|content-security|cf-ray"

Write-Output "--- robots.txt ---"
curl.exe -s "$base/robots.txt" 2>&1 | Select-Object -First 5

Write-Output "--- sitemap canonical check ---"
curl.exe -s "$base/sitemap.xml" 2>&1 | Select-String -Pattern "nasalifya007|orammedia.com" | Select-Object -First 5

Write-Output "--- homepage canonical ---"
curl.exe -s "$base/" 2>&1 | Select-String -Pattern "canonical|nasalifya007|orammedia.com|noindex" | Select-Object -First 8
